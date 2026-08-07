import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  CLOCK_START_MIN, DINNER_MIN, CLOCK_SCALE, LOW_POWER, LEVEL_CAP,
  clockMinutes, formatClock, msBeforeDinner,
  barSegments, barIsLow, formatMoney, damageStyle, expFraction,
} from '../../game/js/ui/hud.js';
import { computeJudgment, emptyRun, JUDGMENT } from '../../shared/scoring.js';

/**
 * The pixels are not testable without a canvas and faking that would prove
 * nothing (SPEC.md §12). The formatting and layout MATHS is pure, and it is
 * where the mistakes that matter live — a clock that reads 25:73, a bar that
 * rounds a surviving sliver of health to empty.
 */

// ── T38: the clock ───────────────────────────────────────────────────────────

test('the chase starts at 17:20 and dinner is at 18:00', () => {
  assert.equal(CLOCK_START_MIN, 17 * 60 + 20);
  assert.equal(DINNER_MIN, 18 * 60);
  assert.equal(formatClock(0), '17:20');
});

test('the clock advances with play', () => {
  assert.equal(formatClock(60_000), '17:22');            // 1 real min × 2
  assert.equal(formatClock(10 * 60_000), '17:40');
});

test('it rolls the hour correctly rather than showing 17:65', () => {
  assert.equal(formatClock(20 * 60_000), '18:00');
  assert.equal(formatClock(25 * 60_000), '18:10');
});

test('the clock is always zero-padded HH:MM', () => {
  for (const ms of [0, 1234, 60_000, 999_999, 5_000_000]) {
    assert.match(formatClock(ms), /^\d{2}:\d{2}$/, `bad clock at ${ms}ms`);
  }
});

test('minutes never exceed 59', () => {
  for (let ms = 0; ms < 60 * 60_000; ms += 37_000) {
    const [, m] = formatClock(ms).split(':').map(Number);
    assert.ok(m >= 0 && m <= 59, `minute ${m} out of range`);
  }
});

test('a nominal twenty-minute run arrives exactly at dinner', () => {
  assert.equal(clockMinutes(20 * 60_000), DINNER_MIN);
  assert.equal(CLOCK_SCALE, 2, '40 in-game minutes across ~20 real ones');
});

/**
 * The clock is the most prominent thing on screen and every player reads it as
 * a rescue timer. It is when dinner is served, and it feeds the hidden column.
 */
test('margin before dinner is positive when early, negative when late', () => {
  assert.ok(msBeforeDinner(0) > 0);
  assert.equal(Math.round(msBeforeDinner(20 * 60_000)), 0);
  assert.ok(msBeforeDinner(25 * 60_000) < 0);
});

test('arriving early scores punctuality; arriving late scores none', () => {
  const early = emptyRun();
  early.judgment.arrivalMsBefore1800 = msBeforeDinner(14 * 60_000);
  assert.ok(computeJudgment(early) > 0);

  const late = emptyRun();
  late.judgment.arrivalMsBefore1800 = msBeforeDinner(30 * 60_000);
  assert.equal(computeJudgment(late), 0, 'late earns nothing, and is not punished twice');
});

test('a very early arrival caps the punctuality award', () => {
  const run = emptyRun();
  run.judgment.arrivalMsBefore1800 = msBeforeDinner(0);
  assert.equal(computeJudgment(run), JUDGMENT.PUNCTUAL_MAX);
});

// ── T37: bars ────────────────────────────────────────────────────────────────

test('bar fill tracks the fraction', () => {
  assert.equal(barSegments(0, 100, 10), 0);
  assert.equal(barSegments(50, 100, 10), 5);
  assert.equal(barSegments(100, 100, 10), 10);
});

/**
 * A player on 1 力 is alive and must look alive. Rounding that to an empty bar
 * would say he is already finished.
 */
test('a sliver of health never rounds away to empty', () => {
  assert.equal(barSegments(1, 150, 10), 1);
  assert.equal(barSegments(0.4, 100, 10), 1);
});

test('an overfull or negative bar is clamped', () => {
  assert.equal(barSegments(200, 100, 10), 10);
  assert.equal(barSegments(-5, 100, 10), 0);
});

test('a zero maximum does not divide by zero', () => {
  assert.equal(barSegments(10, 0, 10), 0);
});

test('the bar warns when power runs low', () => {
  assert.equal(barIsLow(100, 100), false);
  assert.equal(barIsLow(LOW_POWER * 100, 100), true);
  assert.equal(barIsLow(0, 0), false, 'no max means no warning, not a crash');
});

// ── T39: money ───────────────────────────────────────────────────────────────

test('money is thousands-separated like the reference screenshots', () => {
  assert.equal(formatMoney(0), '0');
  assert.equal(formatMoney(999), '999');
  assert.equal(formatMoney(1000), '1,000');
  assert.equal(formatMoney(9_757_510), '9,757,510');
});

test('money never renders negative or fractional', () => {
  assert.equal(formatMoney(-50), '0');
  assert.equal(formatMoney(1234.9), '1,234');
});

// ── T40: damage numbers ──────────────────────────────────────────────────────

test('white on hit, yellow and larger on critical, green with + on heal', () => {
  assert.equal(damageStyle('hit').colour, '#FFFFFF');
  assert.equal(damageStyle('heal').prefix, '+');
  assert.ok(damageStyle('critical').size > damageStyle('hit').size);
  assert.notEqual(damageStyle('critical').colour, damageStyle('hit').colour);
});

test('an unknown kind falls back to an ordinary hit', () => {
  assert.deepEqual(damageStyle('nonsense'), damageStyle('hit'));
});

// ── EXP ──────────────────────────────────────────────────────────────────────

test('exp fraction runs 0 to 1 within a level', () => {
  assert.equal(expFraction(0, 0), 0);
  assert.equal(expFraction(50, 0), 0.5);
  assert.equal(expFraction(100, 0), 1);
});

test('the level cap pins the bar full rather than overflowing', () => {
  assert.equal(LEVEL_CAP, 20);
  assert.equal(expFraction(99_999, LEVEL_CAP), 1);
});
