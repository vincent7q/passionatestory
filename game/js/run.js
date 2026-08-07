/**
 * The run accumulator.
 *
 * Collects the inputs to scoring during play — never a score. The server
 * recomputes the grade from this payload using the same shared/scoring.js the
 * client uses, so a client-sent total is worth nothing. See SPEC.md §7.2.
 *
 * Pulled out of main.js so it is testable: main.js touches `document` and
 * cannot be imported in Node, and both runtime bugs found so far have lived
 * there. Accumulation logic does not belong in the blind spot.
 */

import { STEP_MS } from './utils.js';

/**
 * @param {object} base an emptyRun() from shared/scoring.js — passed in
 *   because game modules never import shared/ directly (SPEC.md §2.3).
 */
export function startRun(base, { candidate, difficulty = 'normal' } = {}) {
  const run = base;
  if (candidate) run.candidate = candidate;
  run.difficulty = difficulty;
  run.durationMs = 0;
  return run;
}

export function recordDamage(run, amount) {
  if (!(amount > 0)) return run;
  run.power.damageDealt += amount;
  return run;
}

/**
 * Every coin dropped off a man on the Lin payroll. It was always their money,
 * he gathers it diligently all night, and it counts in his favour.
 */
export function recordMoney(run, amount) {
  if (!(amount > 0)) return run;
  run.money.collected += amount;
  return run;
}

export function recordCombo(run, combo) {
  run.power.longestCombo = Math.max(run.power.longestCombo, combo ?? 0);
  return run;
}

export function recordPower(run, current, max) {
  run.power.powerRemaining = Math.max(0, current);
  run.power.powerMax = max;
  return run;
}

export function recordSectionTime(run, ms) {
  run.power.sectionTimesMs.push(ms);
  return run;
}

export function recordBossTime(run, ms) {
  run.power.bossTimesMs.push(ms);
  return run;
}

/**
 * Advance the clock one fixed step.
 *
 * `msBefore1800` comes from the HUD clock, which the player reads as a rescue
 * timer. It is when dinner is served, and punctuality feeds the hidden column.
 */
export function tickRun(run, msBefore1800) {
  run.durationMs += STEP_MS;
  run.judgment.arrivalMsBefore1800 = msBefore1800;
  return run;
}

/** Stamp the arcade initials. Validation happens server-side too. */
export function finalizeRun(run, name) {
  run.name = (name ?? '___').toUpperCase().slice(0, 3).padEnd(3, '_');
  return run;
}

/**
 * A compact summary for the evaluation form. Takes computeGrade so this module
 * stays free of a shared/ import.
 */
export function summarise(run, computeGrade) {
  const grade = computeGrade(run);
  return {
    candidate: run.candidate,
    difficulty: run.difficulty,
    name: run.name,
    power: grade.power,
    money: grade.money,
    judgment: grade.judgment,
    total: grade.total,
    durationMs: run.durationMs,
    completed: run.completed,
    stageReached: run.stageReached,
  };
}
