import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  POWER_MAX, MONEY_MAX, JUDGMENT_MAX, GRADE_MAX, FATHER_SCORE,
  JUDGMENT, DIFFICULTY_MULTIPLIER,
  computeMoney, computeJudgment, computePower, computeGrade,
  leaderboardValue, punctualityPoints, emptyRun,
} from '../../shared/scoring.js';

// ── T7: constants ────────────────────────────────────────────────────────────

test('the three criteria sum to the grade', () => {
  assert.equal(POWER_MAX + MONEY_MAX + JUDGMENT_MAX, GRADE_MAX);
  assert.equal(POWER_MAX, 40);
  assert.equal(MONEY_MAX, 20);
  assert.equal(JUDGMENT_MAX, 40);
});

// 力 and 錢 are worth 60 between them and a determined player maxes both.
// They are deliberately the criteria that DON'T decide it.
test('the two visible criteria cannot alone reach the father score', () => {
  assert.equal(FATHER_SCORE, 71);
  assert.ok(POWER_MAX + MONEY_MAX < FATHER_SCORE);
});

test('shared/ stays portable', async () => {
  const fs = await import('node:fs');
  const src = fs.readFileSync(new URL('../../shared/scoring.js', import.meta.url), 'utf8');
  for (const banned of ['require(', 'process.', "from 'node:", 'from "node:']) {
    assert.ok(!src.includes(banned), `found ${banned}`);
  }
});

// ── T8: computeMoney ─────────────────────────────────────────────────────────

const money = (collected, totalAvailable) => computeMoney({ money: { collected, totalAvailable } });

test('money scales linearly with the fraction collected', () => {
  assert.equal(money(0, 100), 0);
  assert.equal(money(50, 100), 10);
  assert.equal(money(100, 100), MONEY_MAX);
});

test('money clamps and never divides by zero', () => {
  assert.equal(money(200, 100), MONEY_MAX);
  assert.equal(money(10, 0), 0);
  assert.equal(money(-5, 100), 0);
});

// ── T9: computeJudgment — the hidden column ──────────────────────────────────

function judgmentRun(overrides = {}) {
  const r = emptyRun();
  Object.assign(r.judgment, overrides);
  return r;
}

test('an untouched run scores zero judgment', () => {
  assert.equal(computeJudgment(emptyRun()), 0);
});

// The masher must floor at zero, not go negative — otherwise a violent run
// could drag the total below what the formula intends and hide the real band.
test('judgment floors at zero however violent the run', () => {
  assert.equal(computeJudgment(judgmentRun({ strikesOnDowned: 999 })), 0);
});

test('judgment clamps at 40 however saintly the run', () => {
  const saint = judgmentRun({
    helpUps: 50, spareFruitStall: true, acceptedAllCups: true, bowedOnBeat: true,
    neverStruckDowned: true, neverStruckToddler: true, marketStallsIntact: true,
    arrivalMsBefore1800: 10 * 60 * 1000,
  });
  assert.equal(computeJudgment(saint), JUDGMENT_MAX);
});

// Awards deliberately over-supply the cap so different play styles each reach
// 40 by their own route. If the total available ever drops to exactly 40, one
// bad break would make a full score impossible.
test('awards over-supply the 40 cap', () => {
  const available = JUDGMENT.SPARE_FRUIT_STALL + JUDGMENT.ACCEPT_ALL_CUPS
    + JUDGMENT.BOW_ON_CORRECT_BEAT + JUDGMENT.NEVER_STRIKE_DOWNED
    + JUDGMENT.NEVER_STRIKE_TODDLER + JUDGMENT.MARKET_STALLS_INTACT
    + JUDGMENT.PUNCTUAL_MAX;
  assert.ok(available > JUDGMENT_MAX, `set-pieces alone give ${available}`);
});

test('three different routes each reach a full 40', () => {
  const mercy = judgmentRun({ helpUps: 14, neverStruckDowned: true });
  const setPieces = judgmentRun({
    spareFruitStall: true, acceptedAllCups: true, bowedOnBeat: true,
    neverStruckDowned: true, neverStruckToddler: true, marketStallsIntact: true,
    arrivalMsBefore1800: 5 * 60 * 1000,
  });
  const mixed = judgmentRun({
    helpUps: 5, spareFruitStall: true, marketStallsIntact: true,
    neverStruckDowned: true, arrivalMsBefore1800: 4 * 60 * 1000,
  });
  for (const [label, run] of [['mercy', mercy], ['set-pieces', setPieces], ['mixed', mixed]]) {
    assert.equal(computeJudgment(run), JUDGMENT_MAX, `${label} should reach the cap`);
  }
});

test('each helped opponent is worth exactly +3', () => {
  assert.equal(computeJudgment(judgmentRun({ helpUps: 1 })), JUDGMENT.HELP_UP);
  assert.equal(computeJudgment(judgmentRun({ helpUps: 3 })), JUDGMENT.HELP_UP * 3);
});

test('striking a downed opponent costs more than helping one up earns', () => {
  assert.ok(Math.abs(JUDGMENT.STRIKE_DOWNED) > JUDGMENT.HELP_UP,
    'the heaviest penalty in the game must outweigh the commonest reward');
  assert.equal(computeJudgment(judgmentRun({ helpUps: 4, strikesOnDowned: 3 })), 0);
});

// Punctuality lives inside 禮 because being on time IS a courtesy — and it means
// the clock, the most prominent thing on screen, quietly feeds the hidden column.
test('punctuality scales with margin and never goes negative when late', () => {
  assert.equal(punctualityPoints(-60_000), 0, 'late earns nothing, but costs nothing here');
  assert.equal(punctualityPoints(0), 0);
  assert.ok(punctualityPoints(60_000) > 0);
  assert.ok(punctualityPoints(600_000) > punctualityPoints(60_000));
  assert.equal(punctualityPoints(99_999_999), JUDGMENT.PUNCTUAL_MAX, 'caps out');
});

// ── T10: computePower ────────────────────────────────────────────────────────

test('a null run scores zero power', () => {
  assert.equal(computePower(emptyRun()), 0);
});

test('a maximal run scores full power', () => {
  const r = emptyRun();
  r.durationMs = 1;
  r.power = { damageDealt: 1e9, longestCombo: 999, powerRemaining: 150, powerMax: 150,
              sectionTimesMs: [], bossTimesMs: [] };
  assert.equal(computePower(r), POWER_MAX);
});

test('power components contribute independently', () => {
  const base = emptyRun();
  base.durationMs = 60 * 60 * 1000;          // slow, so the speed term is ~0
  base.power.powerMax = 150;

  const damageOnly = structuredClone(base);
  damageOnly.power.damageDealt = 1e9;
  const survivalOnly = structuredClone(base);
  survivalOnly.power.powerRemaining = 150;

  assert.ok(computePower(damageOnly) > 0);
  assert.ok(computePower(survivalOnly) > 0);
  assert.ok(computePower(base) < computePower(damageOnly));
});

test('powerMax of zero does not divide by zero', () => {
  const r = emptyRun();
  r.power.powerMax = 0;
  r.power.powerRemaining = 0;
  assert.ok(Number.isFinite(computePower(r)));
});

// ── T11: computeGrade and leaderboardValue ───────────────────────────────────

test('grade is the sum of the three and never exceeds 100', () => {
  const r = emptyRun();
  r.durationMs = 1;
  r.power = { damageDealt: 1e9, longestCombo: 999, powerRemaining: 150, powerMax: 150,
              sectionTimesMs: [], bossTimesMs: [] };
  r.money = { collected: 100, totalAvailable: 100 };
  Object.assign(r.judgment, {
    helpUps: 50, spareFruitStall: true, acceptedAllCups: true, bowedOnBeat: true,
    neverStruckDowned: true, neverStruckToddler: true, marketStallsIntact: true,
    arrivalMsBefore1800: 600_000,
  });
  const g = computeGrade(r);
  assert.equal(g.total, g.power + g.money + g.judgment);
  assert.equal(g.total, GRADE_MAX);
});

test('difficulty multipliers match the PRD', () => {
  assert.equal(DIFFICULTY_MULTIPLIER.easy, 0.75);
  assert.equal(DIFFICULTY_MULTIPLIER.normal, 1.0);
  assert.equal(DIFFICULTY_MULTIPLIER.hard, 1.35);
});

test('a flawless hard run is worth 135 on the board', () => {
  assert.equal(leaderboardValue(100, 'hard'), 135);
});

test('an unknown difficulty falls back to 1.0 rather than NaN', () => {
  assert.equal(leaderboardValue(80, 'nightmare'), 80);
  assert.equal(leaderboardValue(80, undefined), 80);
});
