import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  Phase, MOVES, PHASE_MOVES, MOVE_GAP_STEPS, BOW_STAGGER_STEPS,
  createLinJianguo, chooseMove, tickMove, currentMove, advanceBoss, updatePhase, bowAtBoss,
} from '../../game/js/entities/boss.js';
import { emptyRun } from '../../shared/scoring.js';

/** Deterministic "random" so move selection is testable. */
const always = (n) => () => n;

function standing() {
  const b = createLinJianguo();
  b.power = 1;
  updatePhase(b);
  return b;
}

test('each phase draws from its own moveset', () => {
  assert.deepEqual(PHASE_MOVES[Phase.INTERVIEW],
    ['serving_chopsticks', 'chopsticks', 'how_old', 'own_a_house', 'eaten_enough']);
  assert.deepEqual(PHASE_MOVES[Phase.STANDING],
    ['sweep', 'the_serving', 'lazy_susan', 'one_word']);
});

test('a chosen move always exists in the table', () => {
  for (const phase of [Phase.INTERVIEW, Phase.STANDING]) {
    const b = createLinJianguo();
    b.phase = phase;
    for (const r of [0, 0.25, 0.5, 0.75, 0.999]) {
      assert.ok(MOVES[chooseMove(b, always(r))], `${phase} @ ${r} chose an unknown move`);
    }
  }
});

test('a finished boss chooses nothing', () => {
  const b = createLinJianguo();
  b.phase = Phase.DONE;
  assert.equal(chooseMove(b), null);
});

test('he waits between moves rather than attacking every frame', () => {
  const b = createLinJianguo();
  for (let i = 0; i < MOVE_GAP_STEPS - 1; i += 1) {
    assert.equal(tickMove(b, always(0)), 'idle');
  }
  assert.equal(b.attacking, false, 'the gap is a real opening for the player');
});

test('a move runs startup, then active, then recovery, then clears', () => {
  const b = createLinJianguo();
  const seen = new Set();
  for (let i = 0; i < 400; i += 1) seen.add(tickMove(b, always(0)));
  assert.ok(seen.has('startup'));
  assert.ok(seen.has('active'));
  assert.ok(seen.has('recovery'));
});

test('he only connects during active frames', () => {
  const b = createLinJianguo();
  for (let i = 0; i < 600; i += 1) {
    const window = tickMove(b, always(0));
    assert.equal(b.attacking, window === 'active',
      `attacking must be true only in active frames, saw ${window}`);
  }
});

/**
 * The bow is the only reliable opening in phase 2. If a staggered boss kept
 * attacking, it would not be an opening at all.
 */
test('a staggered boss does nothing whatsoever', () => {
  const b = standing();
  bowAtBoss(b, emptyRun());

  for (let i = 0; i < BOW_STAGGER_STEPS - 1; i += 1) {
    assert.equal(tickMove(b, always(0)), 'idle', `still staggered at step ${i}`);
    assert.equal(b.attacking, false);
    b.staggerSteps -= 1;
  }
});

test('the stagger cancels a move already in flight', () => {
  const b = standing();
  for (let i = 0; i < MOVE_GAP_STEPS + 30; i += 1) tickMove(b, always(0));
  assert.ok(b.moveId, 'a move is under way');

  bowAtBoss(b, emptyRun());
  tickMove(b, always(0));
  assert.equal(b.moveId, null, 'the bow interrupts him mid-move');
  assert.equal(b.attacking, false);
});

test('he resumes attacking once the stagger expires', () => {
  const b = standing();
  bowAtBoss(b, emptyRun());
  for (let i = 0; i < BOW_STAGGER_STEPS + 400; i += 1) advanceBoss(b, always(0));
  assert.equal(b.staggerSteps, 0);
});

test('standing up switches him to the phase 2 moveset', () => {
  // moveId is null between moves, so sample everything he does rather than
  // whatever happens to be in flight on the last step.
  const collect = (boss, steps) => {
    const seen = new Set();
    for (let i = 0; i < steps; i += 1) {
      advanceBoss(boss, always(0));
      if (boss.moveId) seen.add(boss.moveId);
    }
    return [...seen];
  };

  const b = createLinJianguo();
  const interview = collect(b, 600);
  assert.ok(interview.length > 0, 'he attacks during the interview');
  assert.ok(interview.every((m) => PHASE_MOVES[Phase.INTERVIEW].includes(m)),
    `seated moves leaked: ${interview}`);

  b.power = 1;
  const standingMoves = collect(b, 600);
  assert.ok(standingMoves.length > 0);
  assert.ok(standingMoves.every((m) => PHASE_MOVES[Phase.STANDING].includes(m)),
    `after standing he must draw only from the standing set, saw: ${standingMoves}`);
});

test('a defeated boss stops attacking immediately', () => {
  const b = createLinJianguo();
  for (let i = 0; i < 200; i += 1) advanceBoss(b, always(0));
  b.power = 0;
  advanceBoss(b, always(0));
  assert.equal(b.phase, Phase.DONE);
  assert.equal(b.attacking, false);
});

test('currentMove reflects what he is actually doing', () => {
  const b = createLinJianguo();
  assert.equal(currentMove(b), null);
  for (let i = 0; i < MOVE_GAP_STEPS + 5; i += 1) tickMove(b, always(0));
  assert.equal(currentMove(b), MOVES[b.moveId]);
});

test('「吃飽了嗎?」 is an unblockable grab and 一句話 must be parried', () => {
  assert.equal(MOVES.eaten_enough.unblockable, true);
  assert.equal(MOVES.eaten_enough.grab, true);
  assert.equal(MOVES.one_word.mustParry, true);
  assert.equal(MOVES.own_a_house.guardBreaking, true);
});
