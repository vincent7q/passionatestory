import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  Beat, BEAT_ORDER, DWELL, UNSKIPPABLE, PHONE_LINE,
  createReveal, currentBeat, reached, advanceReveal, beatProgress,
} from '../../game/js/ui/reveal.js';
import {
  Beat as FormBeat, BEAT_ORDER as FORM_ORDER, DWELL as FORM_DWELL,
} from '../../game/js/ui/evaluation.js';

/**
 * PRD §8. The reveal is the twenty minutes paying off, and the ONLY thing that
 * can break it is pacing — a beat that lands before the previous one has
 * registered reads as noise.
 */

const GRADE = { power: 38, money: 19, judgment: 12, total: 69 };

const reveal = (opts = {}) => createReveal(GRADE, { tier: 'on_time', ...opts });

/** Run the machine until `beat`, or blow up. Returns steps taken. */
function runTo(s, beat, { skipPressed = false, limit = 60_000 } = {}) {
  let steps = 0;
  while (currentBeat(s) !== beat) {
    advanceReveal(s, { skipPressed });
    steps += 1;
    assert.ok(steps < limit, `never reached ${beat}, stuck at ${currentBeat(s)}`);
  }
  return steps;
}

// ── The order ────────────────────────────────────────────────────────────────

test('the sequence opens on the win and closes on the post-credits card', () => {
  assert.equal(BEAT_ORDER[0], Beat.WIN);
  assert.equal(BEAT_ORDER.at(-1), Beat.DONE);
  assert.equal(BEAT_ORDER.at(-2), Beat.POST_CREDITS);
});

test('every beat has a dwell, and every dwell names a real beat', () => {
  for (const b of BEAT_ORDER) {
    assert.ok(DWELL[b] !== undefined, `${b} has no dwell — it would flash past`);
  }
  for (const b of Object.keys(DWELL)) {
    assert.ok(BEAT_ORDER.includes(b), `DWELL names ${b}, which is not in the order`);
  }
});

test('the beats run in the order the PRD tells the story in', () => {
  const i = (b) => BEAT_ORDER.indexOf(b);
  // He wins, then she speaks, then they bow, then the aunt sits down.
  assert.ok(i(Beat.WIN) < i(Beat.PHONE));
  assert.ok(i(Beat.PHONE) < i(Beat.LINEUP));
  assert.ok(i(Beat.LINEUP) < i(Beat.AUNT));
  // Only then is the form slid across, and only then read.
  assert.ok(i(Beat.AUNT) < i(Beat.FORM_SLIDE));
  assert.ok(i(Beat.FORM_SLIDE) < i(Beat.FORM));
  // The file is turned to AFTER the form has landed — it is the answer to it.
  assert.ok(i(Beat.FORM) < i(Beat.FILE));
  // The stinger is the last gag, and the ending is genuinely last.
  assert.ok(i(Beat.FILE) < i(Beat.STINGER));
  assert.ok(i(Beat.STINGER) < i(Beat.ENDING));
});

test('DONE is terminal — advancing past the end does not wrap or throw', () => {
  const s = reveal();
  runTo(s, Beat.DONE, { skipPressed: true });
  for (let i = 0; i < 600; i += 1) advanceReveal(s, { skipPressed: true });
  assert.equal(currentBeat(s), Beat.DONE);
});

// ── Beat 1: he wins, and nothing happens ─────────────────────────────────────

/**
 * The single most important pause in the game. He is standing in the wreckage
 * braced for what comes next, and what comes next is a family having dinner.
 * A player who can mash through it never feels the silence.
 */
test('the win holds — nobody runs, nobody calls for help', () => {
  const s = reveal();
  assert.equal(currentBeat(s), Beat.WIN);

  for (let i = 0; i < DWELL[Beat.WIN] - 1; i += 1) {
    advanceReveal(s, { skipPressed: true });
    assert.equal(currentBeat(s), Beat.WIN, 'the silence must not be skippable');
  }
  advanceReveal(s, { skipPressed: true });
  assert.equal(currentBeat(s), Beat.PHONE);
});

/**
 * "Hold on this." Three full seconds of a man braced for consequences that are
 * not coming. The stinger is longer, but the stinger has a fight in it — this
 * is the longest beat in which nothing whatsoever happens.
 */
test('the win holds for at least three seconds', () => {
  assert.ok(DWELL[Beat.WIN] >= 180, `${DWELL[Beat.WIN]} steps is not a held silence`);
});

test('the win outlasts every beat between it and the form', () => {
  const between = BEAT_ORDER
    .slice(BEAT_ORDER.indexOf(Beat.WIN) + 1, BEAT_ORDER.indexOf(Beat.FORM))
    .map((b) => DWELL[b]);
  assert.ok(DWELL[Beat.WIN] > Math.max(...between),
    'if the bowing outlasts the silence, the silence is not the point any more');
});

// ── Beat 2: 小雨 ──────────────────────────────────────────────────────────────

test('her line is the first thing anyone says, and it is about the wait', () => {
  assert.equal(PHONE_LINE.who, '小雨');
  assert.equal(PHONE_LINE.zh, '你來得好慢。');
});

// ── Skipping ─────────────────────────────────────────────────────────────────

test('unskippable beats are exactly the ones that carry the joke', () => {
  for (const b of UNSKIPPABLE) {
    assert.ok(BEAT_ORDER.includes(b), `${b} is unskippable but not in the order`);
  }
  assert.ok(UNSKIPPABLE.has(Beat.WIN), 'the silence is the whole gag');
  assert.ok(UNSKIPPABLE.has(Beat.STINGER), 'four seconds, and he does not move');
});

test('a skippable beat advances early on the button, an unskippable one does not', () => {
  const skipped = reveal();
  const patient = reveal();
  runTo(skipped, Beat.PHONE, { skipPressed: true });
  runTo(patient, Beat.PHONE);

  // Both are now on a skippable beat. One presses, one waits.
  advanceReveal(skipped, { skipPressed: true });
  assert.notEqual(currentBeat(skipped), Beat.PHONE);

  for (let i = 0; i < DWELL[Beat.PHONE] - 1; i += 1) advanceReveal(patient, {});
  assert.equal(currentBeat(patient), Beat.PHONE);
});

test('mashing cannot reach the ending faster than the unskippable beats allow', () => {
  const s = reveal();
  const floor = [...UNSKIPPABLE].reduce((n, b) => n + DWELL[b], 0);
  const steps = runTo(s, Beat.ENDING, { skipPressed: true });
  assert.ok(steps >= floor,
    `mashed to the ending in ${steps} steps; the unskippable beats alone are ${floor}`);
});

// ── Progress ─────────────────────────────────────────────────────────────────

test('beat progress runs 0..1 and never exceeds it', () => {
  const s = reveal();
  assert.equal(beatProgress(s), 0);
  for (let i = 0; i < DWELL[Beat.WIN] - 1; i += 1) advanceReveal(s, {});
  const p = beatProgress(s);
  assert.ok(p > 0 && p <= 1, `progress was ${p}`);
});

test('reached() keeps earlier beats on screen and hides later ones', () => {
  const s = reveal();
  runTo(s, Beat.LINEUP, { skipPressed: true });
  assert.ok(reached(s, Beat.WIN));
  assert.ok(reached(s, Beat.PHONE));
  assert.ok(reached(s, Beat.LINEUP));
  assert.ok(!reached(s, Beat.FILE));
});

// ── The form hand-off ────────────────────────────────────────────────────────

test('the form beat carries a real evaluation, built from the grade', () => {
  const s = reveal({ candidateName: '希爾曼' });
  assert.equal(s.evaluation.grade.total, 69);
  assert.equal(s.evaluation.candidateName, '希爾曼');
  assert.equal(s.evaluation.beatIndex, 0, 'the form must not have started early');
});

test('the form beat waits for the evaluation rather than a dwell', () => {
  const s = reveal();
  runTo(s, Beat.FORM, { skipPressed: true });

  // Far longer than any dwell in the table. The form is still up, because the
  // form ends when the form says so.
  for (let i = 0; i < 400; i += 1) advanceReveal(s, {});
  assert.equal(currentBeat(s), Beat.FORM);
  assert.notEqual(s.evaluation.beatIndex, 0, 'the embedded form should be running');
});

test('the reveal leaves the form only once it reaches its own DONE', () => {
  const s = reveal();
  runTo(s, Beat.FORM, { skipPressed: true });
  runTo(s, Beat.FILE, { skipPressed: true });
  assert.equal(s.evaluation.beatIndex, Object.keys(FormBeat).length - 1);
});

/**
 * The pleased pause is load-bearing and confirmed by eye (progress.md,
 * 2026-08-07). Mashing through the reveal must not fast-forward it.
 */
test('mashing the reveal cannot skip the pause before the third line', () => {
  const s = reveal();
  runTo(s, Beat.FORM, { skipPressed: true });

  const judgment = FORM_ORDER.indexOf(FormBeat.JUDGMENT);
  const floor = FORM_ORDER.slice(0, judgment).reduce((n, b) => n + FORM_DWELL[b], 0);

  let steps = 0;
  while (s.evaluation.beatIndex < judgment && steps < 10_000) {
    advanceReveal(s, { skipPressed: true });
    steps += 1;
  }
  assert.ok(steps >= floor,
    `reached the third line in ${steps} steps; the pleased pause alone requires ${floor}`);
});
