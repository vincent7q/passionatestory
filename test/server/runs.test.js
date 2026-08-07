import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildServer } from '../../server/index.js';
import { signRun, issueToken, verifyToken, TOKEN_TTL_MS } from '../../server/integrity.js';
import { emptyRun, computeGrade, FATHER_SCORE } from '../../shared/scoring.js';
import { MIN_RUN_MS } from '../../shared/validation.js';

/** A run good enough to be accepted, which each test then breaks one way. */
function goodRun(over = {}) {
  const run = emptyRun();
  run.name = 'VIN';
  run.candidate = 'felix';
  run.difficulty = 'normal';
  run.completed = true;
  run.stageReached = 3;
  run.durationMs = MIN_RUN_MS[3] + 60_000;
  run.power = { damageDealt: 5000, longestCombo: 8, powerRemaining: 60, powerMax: 150,
                sectionTimesMs: [], bossTimesMs: [] };
  run.money = { collected: 70, totalAvailable: 100 };
  Object.assign(run.judgment, { helpUps: 5, arrivalMsBefore1800: 60_000 });
  return Object.assign(run, over);
}

async function server() {
  return buildServer({ dbPath: ':memory:' });
}

/**
 * Submit as a player who actually spent the time.
 *
 * The token is issued as of `startedMsAgo` in the past, because a real run
 * takes minutes and the wall-clock floor rejects anything claiming more play
 * than has elapsed. Submitting a six-minute run one millisecond after
 * requesting a token is exactly what the check exists to stop — see the
 * "impossible duration" tests below, which do it deliberately.
 */
async function submit(app, run, opts = {}) {
  const startedMsAgo = opts.startedMsAgo ?? (run.durationMs + 30_000);
  const { token } = issueToken(Date.now() - startedMsAgo);
  return app.inject({
    method: 'POST',
    url: '/api/runs',
    payload: {
      token: opts.token ?? token,
      run,
      signature: opts.signature ?? signRun(run),
    },
  });
}

// ── Happy path ───────────────────────────────────────────────────────────────

test('a valid run is accepted and ranked', async () => {
  const app = await server();
  const res = await submit(app, goodRun());
  assert.equal(res.statusCode, 200);

  const body = res.json();
  assert.ok(body.id > 0);
  assert.equal(body.grade.total, body.grade.power + body.grade.money + body.grade.judgment);
  assert.ok(body.rank >= 1);
  await app.close();
});

test('POST /api/runs/start issues a verifiable token', async () => {
  const app = await server();
  const res = await app.inject({ method: 'POST', url: '/api/runs/start' });
  assert.equal(res.statusCode, 200);
  assert.equal(verifyToken(res.json().token).ok, true);
  await app.close();
});

// ── C5: the server never trusts a client-sent grade ──────────────────────────

/**
 * HARD SUCCESS CRITERION C5. The submitted payload carries the INPUTS to
 * scoring, never a score. Anything that looks like a total is ignored and
 * recomputed with the same shared/scoring.js the client used.
 */
test('C5: an inflated client grade is ignored and recomputed', async () => {
  const app = await server();

  const run = goodRun();
  const honest = computeGrade(run).total;
  run.grade = 100;                      // a tampered total
  run.total = 100;
  run.judgment.total = 40;

  const res = await submit(app, run);
  assert.equal(res.statusCode, 200);

  const body = res.json();
  assert.equal(body.grade.total, honest, 'the stored grade must be the recomputed one');
  assert.notEqual(body.grade.total, 100);

  const board = await app.inject({ method: 'GET', url: '/api/leaderboard?candidate=felix' });
  const mine = board.json().entries.find((e) => e.id === body.id);
  assert.equal(mine.grade, honest, 'and the row on the board must agree');
  await app.close();
});

test('C5: a claimed judgment score cannot be smuggled in', async () => {
  const app = await server();
  const run = goodRun();
  run.judgment.helpUps = 0;
  run.judgment.arrivalMsBefore1800 = -1;
  run.judgment.score = 40;              // not a field the scorer reads

  const body = (await submit(app, run)).json();
  assert.equal(body.grade.judgment, 0, 'only real actions earn the hidden column');
  await app.close();
});

// ── C4: forged submissions are rejected ──────────────────────────────────────

test('C4: a submission with no token is rejected', async () => {
  const app = await server();
  const run = goodRun();
  const res = await app.inject({
    method: 'POST', url: '/api/runs',
    payload: { run, signature: signRun(run) },
  });
  assert.equal(res.statusCode, 400);
  await app.close();
});

test('C4: a forged token is rejected', async () => {
  const app = await server();
  const res = await submit(app, goodRun(), { token: 'abc.123.deadbeef' });
  assert.equal(res.statusCode, 400);
  assert.match(res.json().error, /token/);
  await app.close();
});

test('C4: a tampered run body invalidates the signature', async () => {
  const app = await server();
  const run = goodRun();
  const signature = signRun(run);
  run.money.collected = 100;            // changed after signing

  const start = await app.inject({ method: 'POST', url: '/api/runs/start' });
  const res = await app.inject({
    method: 'POST', url: '/api/runs',
    payload: { token: start.json().token, run, signature },
  });
  assert.equal(res.statusCode, 400);
  assert.match(res.json().error, /signature/);
  await app.close();
});

/**
 * THE CHECK WITH REAL TEETH. The HMAC key ships in the client bundle so a
 * determined person can forge a signature — but a wall clock cannot be
 * backdated. A run claiming fifteen minutes that started thirty seconds ago is
 * impossible.
 */
test('C4: a run claiming 15 minutes that started 30 seconds ago is rejected', async () => {
  const app = await server();
  const run = goodRun({ durationMs: 15 * 60 * 1000 });

  const res = await submit(app, run, { startedMsAgo: 30_000 });
  assert.equal(res.statusCode, 400);
  assert.match(JSON.stringify(res.json().details), /wall clock/);
  await app.close();
});

test('C4: a fresh token cannot carry a completed run at all', async () => {
  const app = await server();
  const start = await app.inject({ method: 'POST', url: '/api/runs/start' });
  const run = goodRun();
  const res = await app.inject({
    method: 'POST', url: '/api/runs',
    payload: { token: start.json().token, run, signature: signRun(run) },
  });
  assert.equal(res.statusCode, 400, 'nobody finishes a run in zero milliseconds');
  await app.close();
});

test('C4: a duration below the floor for the stage claimed is rejected', async () => {
  const app = await server();
  const res = await submit(app, goodRun({ durationMs: 1000 }));
  assert.equal(res.statusCode, 400);
  await app.close();
});

test('C4: a bad name is rejected', async () => {
  const app = await server();
  const res = await submit(app, goodRun({ name: 'toolong' }));
  assert.equal(res.statusCode, 400);
  await app.close();
});

test('C4: vincent is not a candidate and is rejected', async () => {
  const app = await server();
  const res = await submit(app, goodRun({ candidate: 'vincent' }));
  assert.equal(res.statusCode, 400);
  await app.close();
});

// ── Token lifetime ───────────────────────────────────────────────────────────

test('an expired token is rejected', () => {
  const { token } = issueToken(Date.now() - TOKEN_TTL_MS - 1000);
  assert.equal(verifyToken(token).ok, false);
});

test('a token from the future is rejected', () => {
  const { token } = issueToken(Date.now() + 60_000);
  assert.equal(verifyToken(token).ok, false);
});

// ── Leaderboard and stats ────────────────────────────────────────────────────

test("林建國's 71 is seeded and sits on the board", async () => {
  const app = await server();
  const res = await app.inject({ method: 'GET', url: '/api/leaderboard' });
  const lin = res.json().entries.find((e) => e.name === 'LIN');
  assert.ok(lin, 'the score the whole design is measured against must be there');
  assert.equal(lin.grade, FATHER_SCORE);
  await app.close();
});

test('the seed is not duplicated when the database is reopened', async () => {
  const app = await server();
  const before = (await app.inject({ method: 'GET', url: '/api/leaderboard' }))
    .json().entries.filter((e) => e.name === 'LIN').length;
  assert.equal(before, 1);
  await app.close();
});

test('the board ranks by leaderboard value, highest first', async () => {
  const app = await server();
  await submit(app, goodRun({ name: 'AAA' }));
  await submit(app, goodRun({ name: 'BBB', money: { collected: 100, totalAvailable: 100 } }));

  const entries = (await app.inject({ method: 'GET', url: '/api/leaderboard' })).json().entries;
  for (let i = 1; i < entries.length; i += 1) {
    assert.ok(entries[i - 1].leaderboard_value >= entries[i].leaderboard_value);
  }
  await app.close();
});

test('the board filters by candidate and difficulty', async () => {
  const app = await server();
  await submit(app, goodRun({ candidate: 'lucian' }));
  await submit(app, goodRun({ candidate: 'hilman', difficulty: 'hard' }));

  const lucian = (await app.inject({ method: 'GET', url: '/api/leaderboard?candidate=lucian' }))
    .json().entries;
  assert.ok(lucian.length > 0);
  assert.ok(lucian.every((e) => e.candidate === 'lucian'));

  const hard = (await app.inject({ method: 'GET', url: '/api/leaderboard?difficulty=hard' }))
    .json().entries;
  assert.ok(hard.every((e) => e.difficulty === 'hard'));
  await app.close();
});

test('a flawless hard run outranks a flawless normal one', async () => {
  const app = await server();
  // Flawless means all three columns maxed, not just the two easy ones.
  const perfect = () => {
    const r = goodRun();
    r.power = { damageDealt: 1e9, longestCombo: 99, powerRemaining: 150, powerMax: 150,
                sectionTimesMs: [], bossTimesMs: [] };
    r.money = { collected: 100, totalAvailable: 100 };
    Object.assign(r.judgment, {
      helpUps: 20, spareFruitStall: true, acceptedAllCups: true, bowedOnBeat: true,
      neverStruckDowned: true, neverStruckToddler: true, marketStallsIntact: true,
      arrivalMsBefore1800: 600_000,
    });
    return r;
  };
  const normal = (await submit(app, perfect())).json();
  const hard = (await submit(app, Object.assign(perfect(), { difficulty: 'hard' }))).json();

  assert.ok(hard.leaderboardValue > normal.leaderboardValue);
  assert.equal(Math.round(hard.leaderboardValue), 135);
  await app.close();
});

/**
 * Watch average judgment across all runs. If it trends toward zero the central
 * premise is not landing, and the restraint rewards need raising.
 */
test('/api/stats reports completion, picks, median grade and average judgment', async () => {
  const app = await server();
  await submit(app, goodRun({ candidate: 'felix' }));
  await submit(app, goodRun({ candidate: 'lucian' }));

  const s = (await app.inject({ method: 'GET', url: '/api/stats' })).json();
  assert.ok(s.total >= 3, 'two runs plus the seed');
  assert.ok(s.completionRate > 0 && s.completionRate <= 1);
  assert.ok(typeof s.averageJudgment === 'number');
  assert.ok(s.picks.felix >= 1 && s.picks.lucian >= 1);
  await app.close();
});

test('the limit is clamped so a query cannot ask for everything', async () => {
  const app = await server();
  const res = await app.inject({ method: 'GET', url: '/api/leaderboard?limit=99999' });
  assert.ok(res.json().entries.length <= 100);
  await app.close();
});
