import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  Beat, BEAT_ORDER, DWELL, FATHER_NAME, FATHER_YEAR, CLOSING_LINE, MONEY_NOTE,
  createEvaluation, currentBeat, reached, advanceEvaluation, beatProgress, displayedValue,
} from '../../game/js/ui/evaluation.js';
import {
  startRun, recordDamage, recordMoney, recordCombo, recordPower, tickRun,
  finalizeRun, summarise,
} from '../../game/js/run.js';
import {
  ALPHABET, SLOTS, createNameEntry, nameOf, cycle, moveSlot, updateNameEntry,
} from '../../game/js/ui/nameEntry.js';
import { emptyRun, computeGrade, FATHER_SCORE } from '../../shared/scoring.js';
import { NAME_RE } from '../../shared/validation.js';
import { STEP_MS } from '../../game/js/utils.js';

// ── T51: the run accumulator ─────────────────────────────────────────────────

test('a run starts with the chosen candidate and difficulty', () => {
  const run = startRun(emptyRun(), { candidate: 'hilman', difficulty: 'hard' });
  assert.equal(run.candidate, 'hilman');
  assert.equal(run.difficulty, 'hard');
  assert.equal(run.durationMs, 0);
});

test('damage and money accumulate', () => {
  const run = startRun(emptyRun());
  recordDamage(run, 40);
  recordDamage(run, 60);
  recordMoney(run, 100);
  recordMoney(run, 120);
  assert.equal(run.power.damageDealt, 100);
  assert.equal(run.money.collected, 220);
});

test('negative or zero records are ignored rather than subtracting', () => {
  const run = startRun(emptyRun());
  recordDamage(run, -50);
  recordMoney(run, -100);
  assert.equal(run.power.damageDealt, 0);
  assert.equal(run.money.collected, 0);
});

test('longest combo keeps the maximum, not the latest', () => {
  const run = startRun(emptyRun());
  recordCombo(run, 7);
  recordCombo(run, 3);
  assert.equal(run.power.longestCombo, 7);
});

test('power remaining never records negative', () => {
  const run = startRun(emptyRun());
  recordPower(run, -10, 150);
  assert.equal(run.power.powerRemaining, 0);
  assert.equal(run.power.powerMax, 150);
});

test('ticking advances the clock by exactly one fixed step', () => {
  const run = startRun(emptyRun());
  tickRun(run, 60_000);
  assert.equal(run.durationMs, STEP_MS);
  assert.equal(run.judgment.arrivalMsBefore1800, 60_000);
});

test('finalize forces a valid three-character name', () => {
  assert.equal(finalizeRun(emptyRun(), 'vin').name, 'VIN');
  assert.equal(finalizeRun(emptyRun(), 'A').name, 'A__');
  assert.equal(finalizeRun(emptyRun(), 'TOOLONG').name, 'TOO');
  assert.equal(finalizeRun(emptyRun(), undefined).name, '___');
  for (const raw of ['vin', 'A', 'TOOLONG', undefined]) {
    assert.match(finalizeRun(emptyRun(), raw).name, NAME_RE);
  }
});

test('summarise reports the recomputed grade, never a stored one', () => {
  const run = startRun(emptyRun(), { candidate: 'felix' });
  run.money = { collected: 50, totalAvailable: 100 };
  const s = summarise(run, computeGrade);
  assert.equal(s.money, 10);
  assert.equal(s.total, s.power + s.money + s.judgment);
});

// ── T52/T53: the form and its pacing ─────────────────────────────────────────

const grade = { power: 38, money: 19, judgment: 12, total: 69 };
const evaluation = () => createEvaluation(grade);
const run = (s, n) => { for (let i = 0; i < n; i += 1) advanceEvaluation(s); return s; };

test('the beats run in the order the PRD specifies', () => {
  assert.deepEqual(BEAT_ORDER, [
    Beat.HEADER, Beat.POWER, Beat.MONEY, Beat.PLEASED,
    Beat.JUDGMENT, Beat.TOTAL, Beat.FATHER, Beat.QUOTE, Beat.DONE,
  ]);
});

/**
 * The two visible criteria come FIRST and land as a victory. Only then does the
 * third line write itself in. Reversing this would give the twist away before
 * the player has had a moment to feel good about 力 and 錢.
 */
test('力 and 錢 are revealed before 禮', () => {
  assert.ok(BEAT_ORDER.indexOf(Beat.POWER) < BEAT_ORDER.indexOf(Beat.JUDGMENT));
  assert.ok(BEAT_ORDER.indexOf(Beat.MONEY) < BEAT_ORDER.indexOf(Beat.JUDGMENT));
});

/**
 * THE LOAD-BEARING PAUSE. He should have a second to feel pleased about a good
 * 力 and 錢 before the floor goes out. Cutting this is the easiest way to ruin
 * twenty minutes of setup.
 */
test('there is a real pause between the good news and the third line', () => {
  assert.ok(DWELL[Beat.PLEASED] >= 60, 'at least a second of being quite pleased');
  assert.ok(BEAT_ORDER.indexOf(Beat.PLEASED) < BEAT_ORDER.indexOf(Beat.JUDGMENT));
});

test('the hidden column dwells longest of the score lines', () => {
  for (const beat of [Beat.POWER, Beat.MONEY, Beat.TOTAL]) {
    assert.ok(DWELL[Beat.JUDGMENT] > DWELL[beat], `禮 must outdwell ${beat}`);
  }
});

test('nothing is shown before its beat is reached', () => {
  const s = evaluation();
  assert.equal(displayedValue(s, Beat.POWER, 38), null);
  assert.equal(displayedValue(s, Beat.JUDGMENT, 12), null);
});

test('a line counts up while it animates and settles on its value', () => {
  const s = run(evaluation(), DWELL[Beat.HEADER] + 1);
  assert.equal(currentBeat(s), Beat.POWER);

  const partway = displayedValue(s, Beat.POWER, 38);
  assert.ok(partway !== null && partway <= 38);

  run(s, DWELL[Beat.POWER]);
  assert.equal(displayedValue(s, Beat.POWER, 38), 38);
});

test('earlier lines stay on screen as later ones arrive', () => {
  const s = evaluation();
  const total = BEAT_ORDER.slice(0, BEAT_ORDER.indexOf(Beat.FATHER))
    .reduce((n, b) => n + DWELL[b], 0);
  run(s, total + 1);
  assert.equal(reached(s, Beat.POWER), true);
  assert.equal(reached(s, Beat.MONEY), true);
  assert.equal(reached(s, Beat.JUDGMENT), true);
  assert.equal(displayedValue(s, Beat.POWER, 38), 38);
});

test('the sequence reaches DONE and stays there', () => {
  const s = evaluation();
  const all = BEAT_ORDER.reduce((n, b) => n + (Number.isFinite(DWELL[b]) ? DWELL[b] : 0), 0);
  run(s, all + 10);
  assert.equal(currentBeat(s), Beat.DONE);
  advanceEvaluation(s);
  assert.equal(currentBeat(s), Beat.DONE);
});

/**
 * Deliberately unskippable before the third line. A player who mashes through
 * the pleased pause would meet 禮 cold, and the entire run pays off in that one
 * transition.
 */
test('the reveal cannot be skipped before the hidden column lands', () => {
  const s = evaluation();
  for (let i = 0; i < 5; i += 1) advanceEvaluation(s, { skipPressed: true });
  assert.equal(currentBeat(s), Beat.HEADER, 'mashing must not fast-forward the setup');
  assert.equal(s.skipped, false);
});

test('it can be skipped once the hidden column has landed', () => {
  const s = evaluation();
  const upto = BEAT_ORDER.slice(0, BEAT_ORDER.indexOf(Beat.JUDGMENT))
    .reduce((n, b) => n + DWELL[b], 0);
  run(s, upto + 1);
  assert.equal(reached(s, Beat.JUDGMENT), true);

  advanceEvaluation(s, { skipPressed: true });
  assert.equal(s.skipped, true);
});

test('beat progress runs 0 to 1 and never exceeds it', () => {
  const s = evaluation();
  assert.ok(beatProgress(s) >= 0);
  run(s, DWELL[Beat.HEADER] * 3);
  assert.ok(beatProgress(s) <= 1);
});

test("the father's line carries his name, his year and his score", () => {
  assert.equal(FATHER_NAME, '林建國');
  assert.equal(FATHER_YEAR, 1994);
  assert.equal(evaluation().fatherScore, FATHER_SCORE);
});

test('the closing line and the money note are both present', () => {
  assert.ok(CLOSING_LINE.zh.includes('力氣跟錢'));
  assert.ok(MONEY_NOTE.zh.includes('我們的錢'));
});

// ── T54: name entry ──────────────────────────────────────────────────────────

test('the alphabet is A-Z plus underscore', () => {
  assert.equal(ALPHABET.length, 27);
  assert.equal(ALPHABET[0], 'A');
  assert.equal(ALPHABET.at(-1), '_');
  assert.equal(SLOTS, 3);
});

test('a new entry is three blanks', () => {
  assert.equal(nameOf(createNameEntry()), '___');
  assert.match(nameOf(createNameEntry()), NAME_RE);
});

test('any reachable name matches the server-side pattern', () => {
  const s = createNameEntry();
  for (let i = 0; i < 200; i += 1) {
    cycle(s, 1);
    moveSlot(s, i % 3 === 0 ? 1 : -1);
    assert.match(nameOf(s), NAME_RE, `unreachable name produced: ${nameOf(s)}`);
  }
});

test('cycling wraps in both directions', () => {
  const s = createNameEntry('A__');
  cycle(s, -1);
  assert.equal(nameOf(s)[0], '_', 'A wraps back to underscore');
  cycle(s, 1);
  assert.equal(nameOf(s)[0], 'A');
});

test('slot movement clamps rather than wrapping', () => {
  const s = createNameEntry();
  moveSlot(s, -5);
  assert.equal(s.slot, 0);
  moveSlot(s, 99);
  assert.equal(s.slot, SLOTS - 1);
});

test('input drives the entry and confirming freezes it', () => {
  const s = createNameEntry();
  updateNameEntry(s, { up: true });
  assert.equal(nameOf(s)[0], 'A');

  updateNameEntry(s, { right: true, up: true });
  assert.equal(s.slot, 1);

  updateNameEntry(s, { accept: true });
  assert.equal(s.confirmed, true);

  const before = nameOf(s);
  updateNameEntry(s, { up: true, right: true });
  assert.equal(nameOf(s), before, 'a confirmed name is locked');
});

test('an existing name can be loaded for editing', () => {
  assert.equal(nameOf(createNameEntry('VIN')), 'VIN');
  assert.equal(nameOf(createNameEntry('vin')), 'VIN');
});
