import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, mkdtempSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

/**
 * T88/T89 — the deployment, and C3.
 *
 * These files are the only part of the project whose mistakes are invisible
 * until production, and one of them is catastrophic and silent: a database
 * written inside the image is destroyed by every redeploy, and nobody finds out
 * until the leaderboard is empty. So the invariants are asserted here rather
 * than trusted to a comment.
 *
 * This cannot run `docker compose` — Docker is not installed on every machine
 * that runs the suite, and shelling out to it would make the suite fail for the
 * wrong reason. What it checks is that the files SAY the right thing. The
 * `down && up` proof is manual and belongs in progress.md.
 */

const DOCKERFILE = readFileSync('Dockerfile', 'utf8');
const COMPOSE = readFileSync('docker-compose.yml', 'utf8');

/** Strip comments so prose about a mistake is not read as the mistake. */
const code = (src) => src.split('\n').filter((l) => !/^\s*#/.test(l)).join('\n');

const DOCKERFILE_CODE = code(DOCKERFILE);
const COMPOSE_CODE = code(COMPOSE);

test('both deployment files exist', () => {
  assert.ok(existsSync('Dockerfile'));
  assert.ok(existsSync('docker-compose.yml'));
});

// ── The mistake that actually hurts ──────────────────────────────────────────

/**
 * C3 begins here. DB_PATH must resolve INSIDE the mounted volume. Anywhere else
 * is inside the container filesystem, which does not survive a redeploy.
 */
test('DB_PATH points inside the mounted volume, not into the image', () => {
  const mount = COMPOSE_CODE.match(/-\s*records:(\S+)/)?.[1];
  assert.ok(mount, 'the compose file declares no volume mount at all');

  for (const [file, src] of [['Dockerfile', DOCKERFILE_CODE], ['compose', COMPOSE_CODE]]) {
    const path = src.match(/DB_PATH[:=]\s*"?([^"\s]+)"?/)?.[1];
    assert.ok(path, `${file} does not set DB_PATH`);
    assert.ok(path.startsWith(`${mount}/`),
      `${file} puts the database at ${path}, outside the ${mount} mount — every redeploy wipes it`);
  }
});

test('the compose file declares a named volume that outlives the container', () => {
  assert.match(COMPOSE_CODE, /^volumes:/m, 'no top-level volumes block');
  assert.match(COMPOSE_CODE, /records:/, 'the records volume is not declared');
});

test('the image declares the mount point, so a bare docker run still persists', () => {
  assert.match(DOCKERFILE_CODE, /VOLUME\s*\[?\s*"?\/data/);
});

// ── One container, forever ───────────────────────────────────────────────────

/**
 * SQLite takes one writer. Two containers would either open separate copies or
 * corrupt a shared file. There is nothing to tune here, so `replicas` must not
 * appear at all — not even set to 1, which reads as an invitation.
 */
test('nothing in the compose file invites replication', () => {
  assert.ok(!/replicas/.test(COMPOSE_CODE),
    'replicas appears in the compose file; SQLite accepts exactly one writer');
});

test('exactly one service is defined', () => {
  // Only the services block — a two-space key under `volumes:` is not a service.
  const block = COMPOSE_CODE.split(/^services:\s*$/m)[1]?.split(/^\S/m)[0] ?? '';
  const services = [...block.matchAll(/^ {2}(\w[\w-]*):/gm)].map((m) => m[1]);
  assert.equal(services.length, 1, `expected one service, found: ${services.join(', ')}`);
  assert.equal(services[0], 'game');
});

// ── No build step ────────────────────────────────────────────────────────────

/** SPEC.md C7. The browser loads ES modules straight off the server. */
test('the image runs no bundler — C7 is a property of the deployment too', () => {
  assert.ok(!/npm run build|webpack|vite|rollup|esbuild|tsc/.test(DOCKERFILE_CODE),
    'a build step crept into the image; C7 says the browser loads modules directly');
});

test('production dependencies only, and the lockfile is respected', () => {
  assert.match(DOCKERFILE_CODE, /npm ci/, 'npm install would ignore the lockfile');
  assert.match(DOCKERFILE_CODE, /--omit=dev/);
});

test('the source the server actually needs is copied in', () => {
  for (const dir of ['server', 'shared', 'game', 'dashboard']) {
    assert.match(DOCKERFILE_CODE, new RegExp(`COPY ${dir}\\b`), `${dir} is not in the image`);
  }
});

/**
 * shared/ is loaded by the browser over HTTP as well as imported by the server.
 * Leaving it out of the image is the kind of thing every server-side test would
 * survive while the game 404s on boot.
 */
test('shared/ is in the image, or the game 404s while the server looks fine', () => {
  assert.match(DOCKERFILE_CODE, /COPY shared/);
});

test('the container does not run as root', () => {
  assert.match(DOCKERFILE_CODE, /^USER\s+node/m);
});

test('the process gets signals directly, so the container stops cleanly', () => {
  // Exec form. The shell form wraps node in /bin/sh, which swallows SIGTERM.
  assert.match(DOCKERFILE_CODE, /CMD\s*\[\s*"node"/);
});

test('better-sqlite3 stays inside 11.x — 12.x has no prebuild and no compiler here', () => {
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  assert.match(pkg.dependencies['better-sqlite3'], /^\^?11\./,
    'bumping to 12.x needs a build toolchain the slim image does not have');
});

// ── C3, minus Docker ─────────────────────────────────────────────────────────

/**
 * The substance of C3 without the container: a record written by one process
 * survives that process exiting entirely, when DB_PATH is a real file.
 *
 * A separate process rather than reopening in-process, because that is what a
 * recycle actually does — and it catches anything that only looks durable
 * because a handle stayed open.
 */
test('C3 substance: a record outlives the process that wrote it', () => {
  const dir = mkdtempSync(join(tmpdir(), 'ps-c3-'));
  const dbPath = join(dir, 'records.db');
  const root = process.cwd().replaceAll('\\', '/');

  const run = (script) => execFileSync(process.execPath, ['--input-type=module', '-e', script], {
    env: { ...process.env, DB_PATH: dbPath },
    encoding: 'utf8',
  }).trim();

  try {
    const written = run(`
      const { openDatabase, insertRun } = await import('file:///${root}/server/db.js');
      const db = openDatabase(process.env.DB_PATH);
      const id = insertRun(db, {
        name: 'C3X', candidate: 'felix', difficulty: 'normal',
        power: 1, money: 1, judgment: 1, grade: 3, leaderboard_value: 3,
        duration_ms: 900000, completed: 1, stage_reached: 3,
        run_json: '{}', created_at: '2026-08-08 12:00:00',
      });
      db.close();
      console.log(String(id));
    `);
    assert.ok(Number(written) > 0, 'the row was never written');

    // A completely new process, as a recycled container would be.
    const found = run(`
      const { openDatabase, leaderboard } = await import('file:///${root}/server/db.js');
      const db = openDatabase(process.env.DB_PATH);
      const rows = leaderboard(db, { limit: 100 }).filter((r) => r.name === 'C3X');
      const seeds = leaderboard(db, { limit: 100 }).filter((r) => r.name === 'LIN').length;
      db.close();
      console.log(JSON.stringify({ found: rows.length, seeds }));
    `);

    const result = JSON.parse(found);
    assert.equal(result.found, 1, 'the record did not survive the process exiting');
    // The migration and seed run again on open; the seed must not double.
    assert.equal(result.seeds, 1, 'reopening duplicated the seeded 71');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
