import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { register } from 'node:module';
import { buildServer } from '../../server/index.js';

// The dashboard imports `/shared/...` absolutely, which is the only form that
// resolves in a browser (SPEC.md §2.3) and resolves to nothing on disk. Same
// hook main-boot.test.js uses, playing the part the static server plays.
register('../helpers/shared-loader.js', import.meta.url);

const { formatDuration, formatDate, progressLabel } = await import('../../dashboard/dashboard.js');

/**
 * T87. The dashboard is a leaderboard, and the interesting things about it are
 * that it actually serves, that it reads the API's real column names, and that
 * it does not leak the twist. The spoiler side is guarded in
 * test/game/spoiler.test.js (C2); this covers the rest.
 */

test('the dashboard and its assets serve', async () => {
  const app = await buildServer();
  for (const url of ['/dashboard/', '/dashboard/dashboard.js', '/dashboard/style.css']) {
    const res = await app.inject({ method: 'GET', url });
    assert.equal(res.statusCode, 200, `${url} should serve`);
  }
  await app.close();
});

test('the page loads its script as a module, or the imports fail', async () => {
  const app = await buildServer();
  const res = await app.inject({ method: 'GET', url: '/dashboard/' });
  assert.match(res.body, /type="module"/);
  await app.close();
});

/**
 * The dashboard imports shared/ over HTTP exactly as the game does, so the
 * route has to exist for it too — the same asymmetry SPEC.md §2.3 describes.
 */
test('the dashboard imports shared/ absolutely, and that path serves', async () => {
  const src = readFileSync('dashboard/dashboard.js', 'utf8');
  const specs = [...src.matchAll(/from\s+['"]([^'"]+)['"]/g)].map((m) => m[1]);
  assert.ok(specs.length > 0, 'the dashboard is expected to use shared/');
  for (const s of specs) {
    assert.ok(s.startsWith('/shared/'), `"${s}" must be absolute to resolve in a browser`);
  }

  const app = await buildServer();
  for (const s of specs) {
    const res = await app.inject({ method: 'GET', url: s });
    assert.equal(res.statusCode, 200, `${s} 404s — the dashboard would not boot`);
  }
  await app.close();
});

/**
 * The board renders rows straight off the API. These are snake_case SQLite
 * column names, and a rename on the server would leave the board rendering
 * blank cells rather than failing — so the two are pinned together here.
 */
test('the columns the board reads are the columns the API returns', async () => {
  const app = await buildServer();
  const res = await app.inject({ method: 'GET', url: '/api/leaderboard?limit=1' });
  assert.equal(res.statusCode, 200);

  const entry = res.json().entries[0];
  assert.ok(entry, 'the board is seeded, so there should always be at least one row');
  for (const column of ['name', 'grade', 'difficulty', 'duration_ms', 'stage_reached',
    'completed', 'created_at']) {
    assert.ok(column in entry, `the board renders ${column} and the API stopped sending it`);
  }
  await app.close();
});

test("林建國's 71 is on the board, because it is the bar", async () => {
  const app = await buildServer();
  const res = await app.inject({ method: 'GET', url: '/api/leaderboard?limit=100' });
  const father = res.json().entries.find((e) => e.name === 'LIN');
  assert.ok(father, 'the seeded 71 is missing; there is nothing to beat');
  assert.equal(father.grade, 71);
  await app.close();
});

// ── The pure helpers ─────────────────────────────────────────────────────────

test('durations read as minutes and seconds', () => {
  assert.equal(formatDuration(0), '—');
  assert.equal(formatDuration(undefined), '—');
  assert.equal(formatDuration(65_000), '1:05');
  assert.equal(formatDuration(20 * 60_000), '20:00');
});

test('a date shows the day, not the year — the year is noise on a board', () => {
  assert.equal(formatDate('2026-08-08 19:04:11'), '08-08');
  assert.equal(formatDate(undefined), '');
  assert.equal(formatDate('nope'), '');
});

/**
 * Reaching stage 3 is not finishing it. A board that called an abandoned run
 * "完走" would be lying about the only thing it is for.
 */
test('progress distinguishes finishing from getting far', () => {
  assert.equal(progressLabel({ completed: true, stage_reached: 3 }), '完走');
  assert.equal(progressLabel({ completed: false, stage_reached: 3 }), '第3關');
  assert.equal(progressLabel({ completed: false }), '第1關');
});
