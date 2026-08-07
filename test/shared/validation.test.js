import { test } from 'node:test';
import assert from 'node:assert/strict';
import { emptyRun } from '../../shared/scoring.js';
import {
  NAME_RE, MIN_RUN_MS, CANDIDATES, DIFFICULTIES, validateRun,
} from '../../shared/validation.js';

/** A run that should pass cleanly, which each test then breaks one way. */
function validRun() {
  const r = emptyRun();
  r.name = 'VIN';
  r.candidate = 'felix';
  r.difficulty = 'normal';
  r.completed = true;
  r.stageReached = 3;
  r.durationMs = 16 * 60 * 1000;
  r.power = { damageDealt: 5000, longestCombo: 10, powerRemaining: 60, powerMax: 150,
              sectionTimesMs: [], bossTimesMs: [] };
  r.money = { collected: 80, totalAvailable: 100 };
  Object.assign(r.judgment, { helpUps: 4, strikesOnDowned: 1, arrivalMsBefore1800: 60_000 });
  return r;
}

const fails = (mutate, needle) => {
  const r = validRun();
  mutate(r);
  const res = validateRun(r);
  assert.equal(res.ok, false, 'expected rejection');
  assert.ok(res.errors.some((e) => e.includes(needle)),
    `expected an error mentioning "${needle}", got: ${res.errors.join(' | ')}`);
};

test('a well-formed run passes with no errors', () => {
  const res = validateRun(validRun());
  assert.equal(res.ok, true, res.errors.join(' | '));
  assert.deepEqual(res.errors, []);
});

// ── name ─────────────────────────────────────────────────────────────────────

test('name is exactly three uppercase letters or underscores', () => {
  assert.ok(NAME_RE.test('ABC'));
  assert.ok(NAME_RE.test('___'));
  assert.ok(!NAME_RE.test('abc'));
  assert.ok(!NAME_RE.test('AB'));
  assert.ok(!NAME_RE.test('ABCD'));
  assert.ok(!NAME_RE.test('A1C'));
  assert.ok(!NAME_RE.test(''));
});

test('rejects a badly formed name', () => {
  fails((r) => { r.name = 'abc'; }, 'name');
  fails((r) => { r.name = 'ABCD'; }, 'name');
  fails((r) => { r.name = undefined; }, 'name');
});

// ── candidate and difficulty ─────────────────────────────────────────────────

test('candidate must be one of the three', () => {
  assert.deepEqual(CANDIDATES, ['felix', 'lucian', 'hilman']);
  fails((r) => { r.candidate = 'nobody'; }, 'candidate');
});

// vincent is the final boss, not a playable candidate.
test('rejects vincent as a candidate', () => {
  fails((r) => { r.candidate = 'vincent'; }, 'candidate');
});

test('difficulty must be one of the three', () => {
  assert.deepEqual(DIFFICULTIES, ['easy', 'normal', 'hard']);
  fails((r) => { r.difficulty = 'nightmare'; }, 'difficulty');
});

// ── stage / completion coherence ─────────────────────────────────────────────

test('a completed run must have reached stage 3', () => {
  fails((r) => { r.completed = true; r.stageReached = 1; }, 'stage');
});

test('stageReached must be 1, 2 or 3', () => {
  fails((r) => { r.completed = false; r.stageReached = 0; }, 'stage');
  fails((r) => { r.completed = false; r.stageReached = 4; }, 'stage');
});

test('an incomplete run at stage 2 is fine', () => {
  const r = validRun();
  r.completed = false;
  r.stageReached = 2;
  r.durationMs = MIN_RUN_MS[2] + 1000;
  assert.equal(validateRun(r).ok, true);
});

// ── duration floors ──────────────────────────────────────────────────────────

test('duration floors rise with the stage claimed', () => {
  assert.ok(MIN_RUN_MS[1] < MIN_RUN_MS[2]);
  assert.ok(MIN_RUN_MS[2] < MIN_RUN_MS[3]);
});

test('rejects a duration below the floor for the stage claimed', () => {
  fails((r) => { r.durationMs = MIN_RUN_MS[3] - 1; }, 'duration');
  fails((r) => { r.durationMs = 0; }, 'duration');
  fails((r) => { r.durationMs = -1; }, 'duration');
});

// The check with real teeth: the run token's wall-clock floor. A run claiming
// fifteen minutes that started thirty seconds ago is impossible, and unlike a
// signature that cannot be backdated. See SPEC.md §11.3.
test('rejects a run longer than the wall clock since its token was issued', () => {
  const r = validRun();
  const res = validateRun(r, { elapsedSinceTokenMs: 30_000 });
  assert.equal(res.ok, false);
  assert.ok(res.errors.some((e) => e.includes('wall clock')), res.errors.join(' | '));
});

test('accepts a run that fits inside the elapsed wall clock', () => {
  const r = validRun();
  assert.equal(validateRun(r, { elapsedSinceTokenMs: 17 * 60 * 1000 }).ok, true);
});

// ── bounds ───────────────────────────────────────────────────────────────────

test('rejects counters above their theoretical maximum', () => {
  fails((r) => { r.money.collected = r.money.totalAvailable + 1; }, 'money');
  fails((r) => { r.power.powerRemaining = r.power.powerMax + 1; }, 'power');
});

test('rejects negative counters', () => {
  fails((r) => { r.judgment.helpUps = -1; }, 'helpUps');
  fails((r) => { r.judgment.strikesOnDowned = -1; }, 'strikesOnDowned');
  fails((r) => { r.power.damageDealt = -1; }, 'damageDealt');
});

test('rejects a non-object run without throwing', () => {
  for (const bad of [null, undefined, 42, 'run', []]) {
    const res = validateRun(bad);
    assert.equal(res.ok, false);
    assert.ok(res.errors.length > 0);
  }
});

test('collects every problem rather than stopping at the first', () => {
  const r = validRun();
  r.name = 'x';
  r.candidate = 'vincent';
  r.difficulty = 'nightmare';
  const res = validateRun(r);
  assert.ok(res.errors.length >= 3, `expected several errors, got ${res.errors.length}`);
});

test('shared/ stays portable', async () => {
  const fs = await import('node:fs');
  const src = fs.readFileSync(new URL('../../shared/validation.js', import.meta.url), 'utf8');
  for (const banned of ['require(', 'process.', "from 'node:", 'from "node:']) {
    assert.ok(!src.includes(banned), `found ${banned}`);
  }
});
