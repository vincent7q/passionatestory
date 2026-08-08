import { test } from 'node:test';
import assert from 'node:assert/strict';
import { emptyRun, computeGrade, FATHER_SCORE, JUDGMENT, arrivalTier }
  from '../../shared/scoring.js';
import { validateRun } from '../../shared/validation.js';
import { CHARACTERS } from '../../shared/characters.js';
import {
  startRun, recordDamage, recordMoney, recordCombo, recordPower, tickRun, finalizeRun,
} from '../../game/js/run.js';
import { createStageState, clearStage, createProp, damageProp, settleStallAward }
  from '../../game/js/stages/stage.js';
import { CITY, MONEY_DROP } from '../../game/js/stages/city.js';
import { createFruitShopOwner, hitMelon, resolveFruitShopFight }
  from '../../game/js/entities/boss.js';
import { createRoster } from '../../game/js/entities/ally.js';
import { helpUp, beginDaze } from '../../game/js/daze.js';
import { Kind, Team, createEntity, resetIds } from '../../game/js/entities/entity.js';
import { createEvaluation, advanceEvaluation, currentBeat, Beat, BEAT_ORDER, DWELL }
  from '../../game/js/ui/evaluation.js';
import { createReveal, advanceReveal, currentBeat as revealBeat, Beat as RevealBeat }
  from '../../game/js/ui/reveal.js';
import { createNameEntry, updateNameEntry, nameOf } from '../../game/js/ui/nameEntry.js';
import { msBeforeDinner } from '../../game/js/ui/hud.js';
import { STEP_MS } from '../../game/js/utils.js';

/**
 * T55 — the vertical slice.
 *
 * docs/PRD.md §17 wants the hidden system proved END TO END on a small surface
 * before scaling to three stages. This drives a whole stage-1 run through the
 * real modules and asserts the payoff is coherent: the run validates, the grade
 * recomputes, and the form paces correctly.
 */

const hero = () => createEntity(Kind.PLAYER, { x: 0, y: 200, team: Team.PLAYER,
  power: 100, powerMax: 100 });

function playRun({ merciful, minutes = 14 }) {
  resetIds();
  const run = startRun(emptyRun(), { candidate: 'felix', difficulty: 'normal' });
  const state = createStageState(CITY);
  const roster = createRoster();
  const player = hero();

  for (let i = 0; i < (minutes * 60_000) / STEP_MS; i += 1) {
    tickRun(run, msBeforeDinner(run.durationMs));
  }

  // Fight through the stage.
  for (let i = 0; i < 12; i += 1) {
    recordDamage(run, 180);
    recordMoney(run, MONEY_DROP.office_worker);
    recordCombo(run, 5);

    if (merciful) {
      const foe = createEntity(Kind.ENEMY, { x: 5, y: 200, power: 0, enemyType: 'office_worker' });
      beginDaze(foe);
      helpUp(player, foe, roster, run);
    } else {
      // A masher does not stop when someone falls. That is what mashing IS,
      // and it is what zeroes the hidden column.
      run.judgment.strikesOnDowned += 2;
      run.judgment.neverStruckDowned = false;
    }
  }

  // The market row.
  const stalls = Array.from({ length: 9 }, (_, i) => createProp(`s${i}`, { x: i * 50, y: 200 }));
  if (!merciful) for (const s of stalls) damageProp(s, 99, state, run);
  settleStallAward(state, run);

  // The boss and her melon.
  const boss = createFruitShopOwner({ x: 3000, y: 210 });
  if (!merciful) hitMelon(boss, player, 99, run);
  const outcome = resolveFruitShopFight(boss, run);

  recordPower(run, merciful ? 70 : 40, 100);
  clearStage(CITY, state, run, 1);
  finalizeRun(run, 'VIN');

  return { run, roster, outcome, state };
}

test('a full stage-1 run produces a valid, submittable payload', () => {
  const { run } = playRun({ merciful: true });
  const res = validateRun(run);
  assert.equal(res.ok, true, res.errors.join(' | '));
  assert.equal(run.stageReached, 1);
  assert.equal(run.completed, false, 'one stage is not the whole evening');
});

test('the merciful run scores every stage-1 restraint award', () => {
  const { run, outcome } = playRun({ merciful: true });
  assert.equal(run.judgment.spareFruitStall, true);
  assert.equal(run.judgment.marketStallsIntact, true);
  assert.equal(run.judgment.helpUps, 12);
  assert.equal(outcome.outcome, 'points_up_the_road');
});

test('the violent run scores none of them', () => {
  const { run, outcome } = playRun({ merciful: false });
  assert.equal(run.judgment.spareFruitStall, false);
  assert.equal(run.judgment.marketStallsIntact, false);
  assert.equal(run.judgment.helpUps, 0);
  assert.ok(run.judgment.strikesOnDowned > 0);
  assert.equal(outcome.outcome, 'sits_down_in_the_wreckage');
});

/**
 * The whole point, proved on one stage: the two visible criteria are close
 * between the two players, and the hidden one is what separates them.
 */
test('mercy and violence diverge almost entirely on the hidden column', () => {
  const merciful = computeGrade(playRun({ merciful: true }).run);
  const violent = computeGrade(playRun({ merciful: false }).run);

  assert.equal(merciful.money, violent.money, '錢 does not distinguish them');
  assert.ok(Math.abs(merciful.power - violent.power) <= 6, '力 barely distinguishes them');
  assert.ok(merciful.judgment - violent.judgment >= 20, 'the hidden column is the difference');
  assert.ok(merciful.total > violent.total);
});

test('the violent stage-1 run cannot approach 71', () => {
  const { total, judgment } = computeGrade(playRun({ merciful: false }).run);
  assert.equal(judgment, 0, 'striking the downed wipes out even the punctuality he earned');
  assert.ok(total < FATHER_SCORE);
});

test('helping people up builds a roster that survives the run', () => {
  const { roster } = playRun({ merciful: true });
  assert.equal(roster.members.length, 12);
  assert.ok(roster.activeId !== null, 'the first person helped becomes the active ally');
});

// ── The form, driven for real ────────────────────────────────────────────────

test('the form runs from header to done and reveals in the right order', () => {
  const { run } = playRun({ merciful: true });
  const s = createEvaluation(computeGrade(run), {
    candidateName: CHARACTERS.felix.name.zh,
  });

  const seen = [];
  const total = BEAT_ORDER.reduce((n, b) => n + (Number.isFinite(DWELL[b]) ? DWELL[b] : 0), 0);
  for (let i = 0; i <= total + 5; i += 1) {
    const beat = currentBeat(s);
    if (seen.at(-1) !== beat) seen.push(beat);
    advanceEvaluation(s);
  }

  assert.deepEqual(seen, BEAT_ORDER);
  assert.ok(seen.indexOf(Beat.PLEASED) < seen.indexOf(Beat.JUDGMENT),
    'he is pleased before the floor goes out');
});

test('the form shows the recomputed grade, never a stored one', () => {
  const { run } = playRun({ merciful: true });
  run.grade = 100;                                  // a tampered client value
  const s = createEvaluation(computeGrade(run));
  assert.notEqual(s.grade.total, 100);
  assert.equal(s.grade.total, s.grade.power + s.grade.money + s.grade.judgment);
});

// ── Name entry into a submittable run ────────────────────────────────────────

test('name entry produces a name the server will accept', () => {
  const { run } = playRun({ merciful: true });
  const entry = createNameEntry();
  updateNameEntry(entry, { up: true });                       // A
  updateNameEntry(entry, { right: true });
  updateNameEntry(entry, { up: true });
  updateNameEntry(entry, { accept: true });

  finalizeRun(run, nameOf(entry));
  assert.equal(validateRun(run).ok, true);
});

test('a run left with default initials still validates', () => {
  const { run } = playRun({ merciful: true });
  finalizeRun(run, nameOf(createNameEntry()));
  assert.equal(run.name, '___');
  assert.equal(validateRun(run).ok, true);
});

test('an award is worth what the scoring module says it is', () => {
  const { run } = playRun({ merciful: true });
  const withStall = computeGrade(run).judgment;

  run.judgment.marketStallsIntact = false;
  const withoutStall = computeGrade(run).judgment;

  // Clamped at 40, so the delta only shows when there is headroom.
  if (withStall < 40) {
    assert.equal(withStall - withoutStall, JUDGMENT.MARKET_STALLS_INTACT);
  } else {
    assert.ok(withStall >= withoutStall);
  }
});

// ── Phase 11: the run all the way into the reveal ────────────────────────────

/**
 * main.js cannot be imported in Node — it touches `document` — and both runtime
 * bugs found in this project so far have lived there. This mirrors exactly what
 * advanceStage() constructs when 林建國 goes down, so the arguments the blind
 * spot passes are at least proved to produce a coherent sequence.
 *
 * If this drifts from main.js it stops being worth anything, so keep the two
 * side by side.
 */
function revealAsMainDoes(run, roster) {
  return createReveal(computeGrade(run), {
    candidateName: CHARACTERS[run.candidate].name.zh,
    fatherScore: FATHER_SCORE,
    tier: arrivalTier(run.judgment.arrivalMsBefore1800),
    spareFruitStall: run.judgment.spareFruitStall,
    roster,
  });
}

test('a finished run drives the whole reveal through to DONE', () => {
  const { run, roster } = playRun({ merciful: true });
  const s = revealAsMainDoes(run, roster);

  let steps = 0;
  while (revealBeat(s) !== RevealBeat.DONE && steps < 100_000) {
    advanceReveal(s, {});
    steps += 1;
  }
  assert.equal(revealBeat(s), RevealBeat.DONE, `stuck on ${revealBeat(s)} after ${steps} steps`);
});

test('the reveal shows the recomputed grade, never a client-sent one', () => {
  const { run, roster } = playRun({ merciful: true });
  run.grade = 100;                                   // a tampered client value
  const s = revealAsMainDoes(run, roster);
  assert.notEqual(s.evaluation.grade.total, 100);
  assert.equal(s.grade.total, s.grade.power + s.grade.money + s.grade.judgment);
});

test("the form quotes the father's score from shared/, not a copy", () => {
  const { run, roster } = playRun({ merciful: true });
  assert.equal(revealAsMainDoes(run, roster).evaluation.fatherScore, FATHER_SCORE);
});

/**
 * C1 restated where the player actually meets it. A masher sees his own total
 * on the same sheet of paper as 71, and it is lower.
 */
test('a masher reads his own number next to 71 and it is smaller', () => {
  const { run, roster } = playRun({ merciful: false });
  const s = revealAsMainDoes(run, roster);
  assert.ok(s.grade.total < s.evaluation.fatherScore,
    `masher scored ${s.grade.total} against ${s.evaluation.fatherScore}`);
});

test('a merciful run bows to more people than it beat into the ground', () => {
  const { run, roster } = playRun({ merciful: true });
  const s = revealAsMainDoes(run, roster);
  assert.ok(s.lineup.total >= 4, 'the van crew and 二叔 are always in the room');
});

test('the melon decides both her line and what is on the plate', () => {
  const merciful = playRun({ merciful: true });
  const masher = playRun({ merciful: false });

  assert.equal(revealAsMainDoes(merciful.run, merciful.roster).fruit.isTheMelon, true);
  assert.equal(revealAsMainDoes(masher.run, masher.roster).fruit.isTheMelon, false);
});
