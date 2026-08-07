/**
 * Fixed timestep. Every physics constant in this project is expressed per
 * step, so gameplay values are NEVER scaled by a variable dt. Determinism
 * keeps server-side replay validation possible later.
 */
export const STEP_MS = 1000 / 60;

/**
 * Longest real-time slice the loop will simulate in one frame.
 *
 * A backgrounded tab hands back a huge elapsed time on resume. Without this
 * clamp the loop tries to catch up all at once, overruns the frame, and the
 * backlog grows without bound.
 */
export const MAX_FRAME_MS = 250;

/**
 * Split elapsed real time into whole simulation steps plus a carried remainder.
 * @returns {{steps: number, remainder: number}}
 */
export function stepCount(carry, elapsedMs) {
  const budget = Math.max(0, carry) + clamp(elapsedMs, 0, MAX_FRAME_MS);
  const steps = Math.floor(budget / STEP_MS);
  return { steps, remainder: budget - steps * STEP_MS };
}

export const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
export const clamp01 = (v) => clamp(v, 0, 1);
export const lerp = (a, b, t) => a + (b - a) * t;
export const approach = (v, target, by) =>
  v < target ? Math.min(target, v + by) : Math.max(target, v - by);
