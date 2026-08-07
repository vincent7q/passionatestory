/**
 * Bounds checking for a submitted run.
 *
 * The server calls this before recomputing a grade. It is deliberately NOT a
 * security boundary on its own — the client has to sign its own submission, so
 * the HMAC key ships in the client bundle and a determined person can forge a
 * signature. See SPEC.md §11.3. The check with real teeth is
 * `elapsedSinceTokenMs`: a run claiming fifteen minutes that started thirty
 * seconds ago is impossible, and unlike a signature that cannot be backdated.
 *
 * PORTABILITY: imported by the browser over HTTP and by Node. Plain portable JS.
 */

import { CANDIDATES } from './characters.js';
import { POWER_MAX, MONEY_MAX, JUDGMENT_MAX, GRADE_MAX } from './scoring.js';

export { CANDIDATES };
export const DIFFICULTIES = ['easy', 'normal', 'hard'];

/** Three arcade initials. No accounts, no personal data. */
export const NAME_RE = /^[A-Z_]{3}$/;

/**
 * Fastest a run reaching each stage could plausibly be, in ms. Anything under
 * these is not a speedrun, it is a fabricated payload.
 */
export const MIN_RUN_MS = {
  1: 90_000,    // 1m30 — stage 1 alone
  2: 210_000,   // 3m30 — through the mountain road
  3: 300_000,   // 5m00 — a full three-stage completion
};

const isNum = (v) => typeof v === 'number' && Number.isFinite(v);

export function validateRun(run, opts = {}) {
  const errors = [];
  const add = (msg) => errors.push(msg);

  if (typeof run !== 'object' || run === null || Array.isArray(run)) {
    return { ok: false, errors: ['run must be an object'] };
  }

  // ── identity ───────────────────────────────────────────────────────────────
  if (typeof run.name !== 'string' || !NAME_RE.test(run.name)) {
    add('name must be three uppercase letters or underscores');
  }
  if (!CANDIDATES.includes(run.candidate)) {
    add(`candidate must be one of ${CANDIDATES.join(', ')}`);
  }
  if (!DIFFICULTIES.includes(run.difficulty)) {
    add(`difficulty must be one of ${DIFFICULTIES.join(', ')}`);
  }

  // ── stage / completion coherence ───────────────────────────────────────────
  const stage = run.stageReached;
  if (![1, 2, 3].includes(stage)) {
    add('stageReached must be 1, 2 or 3');
  } else if (run.completed === true && stage !== 3) {
    add('a completed run must have reached stage 3');
  }

  // ── duration ───────────────────────────────────────────────────────────────
  const floor = MIN_RUN_MS[stage];
  if (!isNum(run.durationMs) || run.durationMs <= 0) {
    add('duration must be a positive number');
  } else if (floor !== undefined && run.durationMs < floor) {
    add(`duration ${run.durationMs}ms is below the ${floor}ms floor for stage ${stage}`);
  }

  // The one an attacker cannot backdate.
  if (isNum(opts.elapsedSinceTokenMs) && isNum(run.durationMs)
      && run.durationMs > opts.elapsedSinceTokenMs) {
    add(`duration ${run.durationMs}ms exceeds the wall clock since the token was issued `
      + `(${opts.elapsedSinceTokenMs}ms)`);
  }

  // ── bounds ─────────────────────────────────────────────────────────────────
  const p = run.power ?? {};
  const m = run.money ?? {};
  const j = run.judgment ?? {};

  for (const [label, v] of [['damageDealt', p.damageDealt], ['longestCombo', p.longestCombo],
                            ['powerRemaining', p.powerRemaining], ['powerMax', p.powerMax]]) {
    if (!isNum(v) || v < 0) add(`power.${label} must be a non-negative number`);
  }
  if (isNum(p.powerRemaining) && isNum(p.powerMax) && p.powerRemaining > p.powerMax) {
    add('power.powerRemaining exceeds powerMax');
  }

  for (const [label, v] of [['collected', m.collected], ['totalAvailable', m.totalAvailable]]) {
    if (!isNum(v) || v < 0) add(`money.${label} must be a non-negative number`);
  }
  if (isNum(m.collected) && isNum(m.totalAvailable) && m.collected > m.totalAvailable) {
    add('money.collected exceeds totalAvailable');
  }

  for (const [label, v] of [['helpUps', j.helpUps], ['strikesOnDowned', j.strikesOnDowned]]) {
    if (!isNum(v) || v < 0) add(`judgment.${label} must be a non-negative number`);
  }

  // A client-sent grade is never trusted (the server recomputes), but one that
  // is out of range at all signals a tampered payload worth rejecting outright.
  if (run.grade !== undefined && (!isNum(run.grade) || run.grade < 0 || run.grade > GRADE_MAX)) {
    add(`grade, if present, must be within 0..${GRADE_MAX}`);
  }

  return { ok: errors.length === 0, errors };
}

export const THEORETICAL_MAX = { power: POWER_MAX, money: MONEY_MAX, judgment: JUDGMENT_MAX };
