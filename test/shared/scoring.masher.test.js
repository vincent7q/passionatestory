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
