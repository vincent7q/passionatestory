/**
 * THE TEN-SECOND WINDOW.
 *
 * Everything else in this codebase is scaffolding for this file.
 *
 * A defeated opponent sits down dazed, stars orbiting their head. After ten
 * seconds they get up on their own, dust themselves off, and walk off screen
 * permanently. During that window, pressing E beside them helps them up — and
 * they switch sides for the rest of the run.
 *
 * The stars VISIBLY SLOW as the timer runs out. That deceleration is the
 * countdown, and it is the only signal the player ever gets: nothing on screen
 * says what E does, or why you would want to press it, or that any of this is
 * being scored.
 *
 * The tension is deliberate. Breaking off an active fight to help someone up is
 * risky, costs time you believe you do not have, and is always correct.
 */

import { State } from './entities/entity.js';
import { addToRoster, convertToAlly } from './entities/ally.js';
import { STEP_MS, clamp01 } from './utils.js';

// Duration lives in shared/ so a future server-side replay agrees with the
// client. main.js passes it in — game modules never import shared/ directly.
// See SPEC.md §2.3.
export const DEFAULT_WINDOW_MS = 10_000;

/** Orbit speed in radians per step, at the start and at the very end. */
export const STAR_SPEED_START = 0.22;
export const STAR_SPEED_END = 0.03;
export const STAR_COUNT = 3;

/** How close the player must be to help someone up. */
export const HELP_RANGE_X = 22;
export const HELP_RANGE_Y = 12;

export const msToSteps = (ms) => Math.round(ms / STEP_MS);

/** Begin the window. Called the moment an opponent's power reaches zero. */
export function beginDaze(e) {
  e.state = State.DAZED;
  e.dazeSteps = 0;
  e.attacking = false;
  e.vx = 0;
  e.vy = 0;
  e.starAngle = 0;
  return e;
}

/** 0 at the moment of defeat, 1 when the window has closed. */
export function dazeProgress(e, windowMs = DEFAULT_WINDOW_MS) {
  return clamp01((e.dazeSteps ?? 0) / msToSteps(windowMs));
}

/**
 * Orbit speed for the current progress.
 *
 * This is the countdown. It must decelerate monotonically — a constant orbit
 * would tell the player nothing, and an accelerating one would read as urgency
 * rather than as time running out.
 */
export function starSpeed(progress) {
  return STAR_SPEED_START + (STAR_SPEED_END - STAR_SPEED_START) * clamp01(progress);
}

/** True while the opponent can still be helped up. */
export function windowOpen(e, windowMs = DEFAULT_WINDOW_MS) {
  return e.state === State.DAZED && (e.dazeSteps ?? 0) < msToSteps(windowMs);
}

/**
 * Advance one step. Returns 'open' | 'expired'.
 * 'expired' means they stood up on their own and should now walk off.
 */
export function advanceDaze(e, windowMs = DEFAULT_WINDOW_MS) {
  if (e.state !== State.DAZED) return 'open';
  e.dazeSteps = (e.dazeSteps ?? 0) + 1;
  e.starAngle = (e.starAngle ?? 0) + starSpeed(dazeProgress(e, windowMs));
  return windowOpen(e, windowMs) ? 'open' : 'expired';
}

export function inHelpRange(player, target) {
  return Math.abs(target.x - player.x) <= HELP_RANGE_X
    && Math.abs(target.y - player.y) <= HELP_RANGE_Y;
}

/**
 * The nearest opponent the player could help up right now, or null.
 * This is what surfaces the E prompt — and the prompt never explains itself.
 */
export function promptTarget(player, entities, windowMs = DEFAULT_WINDOW_MS) {
  let best = null;
  let bestDist = Infinity;
  for (const e of entities) {
    if (e === player || !e.alive) continue;
    if (!windowOpen(e, windowMs)) continue;
    if (!inHelpRange(player, e)) continue;
    const d = Math.hypot(e.x - player.x, e.y - player.y);
    if (d < bestDist) {
      bestDist = d;
      best = e;
    }
  }
  return best;
}

// ── The decision ─────────────────────────────────────────────────────────────
//
// Two outcomes, and the game scores both. Neither is ever explained on screen.

/**
 * Help a defeated opponent up. Succeeds only inside the window.
 *
 * Awards +3 into the hidden column and puts them on the roster permanently.
 * The award pops as a bare gold `+3` with a seal icon and NO LABEL — its
 * meaning is not revealed until the evaluation form.
 *
 * @returns {boolean} whether they were actually helped up
 */
export function helpUp(player, target, roster, run, windowMs = DEFAULT_WINDOW_MS) {
  if (!target || !windowOpen(target, windowMs)) return false;
  if (!inHelpRange(player, target)) return false;

  const added = addToRoster(roster, target);
  if (!added) return false;   // already helped — must never count twice

  convertToAlly(target);
  if (run) run.judgment.helpUps += 1;
  return true;
}

/**
 * Record a strike against someone already down — the single heaviest penalty
 * in the game.
 *
 * Takes the result object from combat.applyDamage rather than inspecting the
 * entity, because by the time the caller looks again the state has changed.
 * A strike that was ignored (invincibility frames) is not a choice and is not
 * charged.
 *
 * @returns {boolean} whether a penalty was charged
 */
export function recordStrike(run, damageResult) {
  if (!run || !damageResult) return false;
  if (!damageResult.struckWhileDown) return false;
  if (damageResult.ignored) return false;

  run.judgment.strikesOnDowned += 1;
  run.judgment.neverStruckDowned = false;
  return true;
}

/** Star positions for rendering. Presentation only. */
export function starPositions(e, radius = 9) {
  const out = [];
  for (let i = 0; i < STAR_COUNT; i += 1) {
    const a = (e.starAngle ?? 0) + (i * Math.PI * 2) / STAR_COUNT;
    out.push({ dx: Math.cos(a) * radius, dy: Math.sin(a) * radius * 0.35 });
  }
  return out;
}
