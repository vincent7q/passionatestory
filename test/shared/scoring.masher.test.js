import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeGrade, FATHER_SCORE, emptyRun } from '../../shared/scoring.js';

/**
 * HARD SUCCESS CRITERION C1 — "a mashing player cannot beat 71."
 *
 * 力 and 錢 are worth 60 between them and a determined player maxes both.
 * They are deliberately the criteria that DON'T decide it. The column he never
 * sees is worth 40, and it is the one that separates him from 71 — the score
 * 小雨's father 林建國 got when he sat the same test in 1994.
 *
 * IF THIS FAILS, TUNE POWER_TUNING IN shared/scoring.js. NEVER THE TEST.
 * If the design cannot satisfy it, the design has failed and that is the
 * finding — do not weaken the assertion to make the suite green.
 */

/** Maximal violence, zero restraint. Every fight won by mashing. */
function masherRun() {
  const r = emptyRun();
  r.candidate = 'felix';
  r.difficulty = 'normal';
  r.completed = true;
  r.stageReached = 3;
  r.durationMs = 16 * 60 * 1000;          // fast, because he never stopped for anyone

  r.power = {
    damageDealt: 99_999,                  // he hit everything, a lot
    longestCombo: 40,
    sectionTimesMs: [], bossTimesMs: [],
    powerRemaining: 90, powerMax: 150,    // took hits, never guarded
  };
  r.money = { collected: 100, totalAvailable: 100 };   // picked up every coin

  Object.assign(r.judgment, {
    helpUps: 0,                           // never once pressed E
    strikesOnDowned: 25,                  // kept hitting men who were already down
    spareFruitStall: false,               // wrecked the melon
    acceptedAllCups: false,               // refused 二叔
    bowedOnBeat: false,                   // never bowed
    neverStruckDowned: false,
    neverStruckToddler: false,
    marketStallsIntact: false,            // flattened the market
    arrivalMsBefore1800: -60_000,         // late, because he stopped to fight
  });
  return r;
}

test('C1: a mashing player cannot beat 71', () => {
  const g = computeGrade(masherRun());
  assert.equal(g.judgment, 0,
    'the restraint column must floor at zero, never go negative');
  assert.ok(g.total < FATHER_SCORE,
    `masher scored ${g.total}, which beats ${FATHER_SCORE}. THE DESIGN HAS FAILED.`);
});

test('C1: a masher lands in the intended 56-60 band', () => {
  const { total } = computeGrade(masherRun());
  assert.ok(total >= 50 && total <= 62,
    `expected the masher band (50-62), got ${total}. Retune POWER_TUNING.`);
});

// The other half of the criterion: restraint must be a REAL route to the top,
// not merely a way to lose more slowly.
test('C1: a restraint player can beat 71', () => {
  const r = masherRun();
  r.power.damageDealt = 3000;             // fought only what he had to
  r.power.longestCombo = 6;
  r.durationMs = 19 * 60 * 1000;          // slower — he kept stopping to help
  Object.assign(r.judgment, {
    helpUps: 8, strikesOnDowned: 0,
    spareFruitStall: true, acceptedAllCups: true, bowedOnBeat: true,
    neverStruckDowned: true, neverStruckToddler: true, marketStallsIntact: true,
    arrivalMsBefore1800: 120_000,
  });
  const g = computeGrade(r);
  assert.ok(g.total > FATHER_SCORE,
    `restraint run scored ${g.total}; it must be able to clear ${FATHER_SCORE}`);
});

/**
 * THE BOUNDARY, pinned with numbers.
 *
 * A masher does not stop when someone falls — that is what mashing IS — so the
 * strike penalty wipes the column out even at maximum 力, maximum 錢 and full
 * punctuality. 60 is the ceiling for that player, eleven short of 71.
 *
 * The fourth case below scores 77 and DOES clear 71 without ever helping anyone
 * up. That is a live design question, recorded in progress.md — it is not a
 * masher (he deliberately stops attacking when someone falls, which is the
 * behaviour being measured), but he also wrecks the stall, refuses every cup
 * and never bows. Change the design if that is wrong; do not change this test
 * to hide it.
 */
test('C1 boundary: the ceiling for a player who strikes the downed is 60', () => {
  const r = masherRun();
  r.judgment.arrivalMsBefore1800 = 300_000;     // punctual as well as violent
  r.power = { damageDealt: 1e9, longestCombo: 99, powerRemaining: 150, powerMax: 150,
              sectionTimesMs: [], bossTimesMs: [] };
  r.durationMs = 14 * 60 * 1000;

  const g = computeGrade(r);
  assert.equal(g.power, 40);
  assert.equal(g.money, 20);
  assert.equal(g.judgment, 0, 'the strikes wipe out the punctuality he earned');
  assert.equal(g.total, 60);
  assert.ok(g.total < FATHER_SCORE);
});

/**
 * This case used to clear 71 at 77 and was recorded as an open design question.
 * Removing the punctuality award closed it: the same player now scores 69.
 *
 * He wrecks the fruit stall, flattens the market row, refuses all three of
 * 二叔 BAN's cups and never bows. He simply stops attacking when someone falls.
 * That is worth something — 9 — and it is not worth 71.
 */
test('C1 boundary: restraint without generosity no longer clears 71', () => {
  const r = masherRun();
  r.durationMs = 14 * 60 * 1000;
  r.power = { damageDealt: 1e9, longestCombo: 99, powerRemaining: 150, powerMax: 150,
              sectionTimesMs: [], bossTimesMs: [] };
  Object.assign(r.judgment, {
    strikesOnDowned: 0, neverStruckDowned: true, neverStruckToddler: true,
    arrivalMsBefore1800: 300_000,
    // still wrecks the stall, refuses the cups, never bows, never helps anyone
  });

  const g = computeGrade(r);
  assert.equal(g.judgment, 9);
  assert.equal(g.total, 69);
  assert.ok(g.total < FATHER_SCORE, 'never helping anyone up must not reach 71');
});

/**
 * The property that closed it, stated directly: the set-piece awards no longer
 * total 40 on their own. A full hidden column REQUIRES at least one act of
 * kindness, which is the entire thesis of the game.
 */
test('C1: a full 40 is unreachable without helping at least one person up', () => {
  const r = masherRun();
  r.durationMs = 14 * 60 * 1000;
  r.power = { damageDealt: 1e9, longestCombo: 99, powerRemaining: 150, powerMax: 150,
              sectionTimesMs: [], bossTimesMs: [] };
  Object.assign(r.judgment, {
    helpUps: 0, strikesOnDowned: 0,
    spareFruitStall: true, acceptedAllCups: true, bowedOnBeat: true,
    neverStruckDowned: true, neverStruckToddler: true, marketStallsIntact: true,
    arrivalMsBefore1800: 600_000,
  });

  const g = computeGrade(r);
  assert.equal(g.judgment, 37, 'every set-piece, perfectly, and still short of the cap');
  assert.ok(g.judgment < 40);
  assert.ok(g.total > FATHER_SCORE, 'a perfect set-piece run still beats 71 — as intended');
});

// A player who maxes both visible criteria and nothing else should still fall
// short — that is the entire premise of the reveal.
test('C1: maxing both VISIBLE criteria is not enough', () => {
  const r = emptyRun();
  r.durationMs = 1;
  r.power = { damageDealt: 1e9, longestCombo: 999, powerRemaining: 150, powerMax: 150,
              sectionTimesMs: [], bossTimesMs: [] };
  r.money = { collected: 100, totalAvailable: 100 };
  const g = computeGrade(r);
  assert.equal(g.power, 40);
  assert.equal(g.money, 20);
  assert.equal(g.judgment, 0);
  assert.ok(g.total < FATHER_SCORE,
    'a perfect 力 + 錢 run must still lose to 71 — otherwise the twist has no teeth');
});
