import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { openDatabase, insertRun, leaderboard, stats, SEED_RUN } from '../../server/db.js';
import { signRun as nodeSign, CLIENT_KEY } from '../../server/integrity.js';
import { signRun as browserSign } from '../../game/js/net.js';
import { emptyRun } from '../../shared/scoring.js';

function tempDb() {
  const dir = mkdtempSync(join(tmpdir(), 'passionate-'));
  return { dir, path: join(dir, 'records.db') };
}

const row = (over = {}) => ({
  name: 'VIN', candidate: 'felix', difficulty: 'normal',
  power: 30, money: 15, judgment: 20, grade: 65, leaderboard_value: 65,
  duration_ms: 900_000, completed: 1, stage_reached: 3,
  run_json: '{}', created_at: null, ...over,
});

/**
 * HARD SUCCESS CRITERION C3 — records survive a restart.
 *
 * The real check is `docker compose down && up` (T89), which needs the volume
 * mount. This proves the half that is testable here: closing and reopening the
 * same file keeps the data. If THIS fails, the Docker version certainly will.
 */
test('C3: records survive closing and reopening the database file', () => {
  const { dir, path } = tempDb();
  try {
    const first = openDatabase(path);
    insertRun(first, row({ name: 'AAA' }));
    first.close();

    const second = openDatabase(path);
    const names = leaderboard(second, {}).map((e) => e.name);
    assert.ok(names.includes('AAA'), 'the run must still be there after a restart');
    second.close();
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('the database file is actually created on disk', () => {
  const { dir, path } = tempDb();
  try {
    const db = openDatabase(path);
    db.close();
    assert.ok(existsSync(path), 'a file-backed database must exist on disk');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('WAL mode is enabled so the dashboard can read during a write', () => {
  const { dir, path } = tempDb();
  try {
    const db = openDatabase(path);
    assert.equal(db.pragma('journal_mode', { simple: true }), 'wal');
    db.close();
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('migrations are idempotent across reopens', () => {
  const { dir, path } = tempDb();
  try {
    for (let i = 0; i < 3; i += 1) openDatabase(path).close();
    const db = openDatabase(path);
    assert.doesNotThrow(() => insertRun(db, row()));
    db.close();
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

/** 林建國's 71 must appear exactly once however many times we restart. */
test('the seed is inserted once and never duplicated', () => {
  const { dir, path } = tempDb();
  try {
    for (let i = 0; i < 4; i += 1) openDatabase(path).close();
    const db = openDatabase(path);
    const lins = leaderboard(db, {}).filter((e) => e.name === SEED_RUN.name);
    assert.equal(lins.length, 1);
    assert.equal(lins[0].grade, 71);
    db.close();
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('stats on an empty board do not divide by zero', () => {
  const db = openDatabase(':memory:');
  db.exec('DELETE FROM runs');
  const s = stats(db);
  assert.equal(s.total, 0);
  assert.equal(s.completionRate, 0);
  assert.equal(s.medianGrade, 0);
  db.close();
});

test('the median grade is a real median, not an average', () => {
  const db = openDatabase(':memory:');
  db.exec('DELETE FROM runs');
  for (const g of [10, 20, 90]) insertRun(db, row({ grade: g, leaderboard_value: g }));
  assert.equal(stats(db).medianGrade, 20);
  db.close();
});

/**
 * The client signs in the browser with WebCrypto and the server verifies with
 * node:crypto. Two implementations of the same HMAC — if they ever disagree,
 * every honest submission is rejected as a forgery.
 */
test('the browser and server signing agree byte for byte', async () => {
  const run = emptyRun();
  run.name = 'VIN';
  run.candidate = 'hilman';
  assert.equal(await browserSign(run, CLIENT_KEY), nodeSign(run, CLIENT_KEY));
});
