/**
 * The ONLY file that does collision math. No bare AABB checks anywhere else.
 * See SPEC.md §2.2 and §3.3.
 *
 * Three axes, and mixing them up is the classic bug in this genre:
 *
 *   x  world horizontal — the camera scrolls along this
 *   y  DEPTH — how far into the screen. Larger y is NEARER the viewer.
 *   z  height above the ground. Non-zero only while airborne.
 *
 * Screen position is (x - camera.x, y - z). Entities draw sorted by y ascending.
 * GRAVITY ACTS ON z, NEVER ON y.
 *
 * Every constant here is per fixed 1/60s step. Nothing is scaled by a variable
 * dt — see SPEC.md §3.2.
 */

import { clamp } from './utils.js';

export const GRAVITY = -0.9;      // per step
export const GROUND_Z = 0;
export const DEFAULT_REACH = 14;  // how far in front an attack box extends

/**
 * Ground friction, applied to horizontal velocity every step.
 *
 * THIS EXISTS BECAUSE THE GAME WAS UNCOMPLETABLE WITHOUT IT.
 *
 * `applyDamage` adds knockback straight onto `vx`, and integrate used to move
 * by `vx` forever with nothing to slow it. Enemies masked the problem — their
 * AI re-authors `vx` from `steer()` every single frame, so knockback was
 * overwritten before it could accumulate. The player masks it the same way.
 *
 * 水果店老闆娘 has no update function at all, so nothing ever re-authored hers.
 * One hit knocked her back at 1.5px/step and she slid — IDLE, facing the
 * player, at a constant 1.5 — clean off the end of the world. Observed in a
 * browser at x=13601 on a 3200-wide stage, ten thousand pixels past a gate the
 * player is clamped to. The stage 1 boss simply could not be reached.
 *
 * Friction is the general fix rather than a special case for her: any entity
 * that does not author its own velocity now comes to rest instead of leaving.
 * It is safe for the ones that do, because they overwrite `vx` before the next
 * integrate anyway, and nothing in this game relies on carried momentum —
 * there are no projectiles.
 */
export const GROUND_FRICTION = 0.85;   // per step
export const REST_SPEED = 0.05;        // below this, stop dead rather than crawl

/** The (x, y) footprint — what the entity occupies on the ground plane. */
export function footprint(e) {
  const hw = e.w / 2;
  const hd = e.depth / 2;
  return { x0: e.x - hw, x1: e.x + hw, y0: e.y - hd, y1: e.y + hd };
}

export function boxesOverlap(a, b) {
  return a.x0 < b.x1 && a.x1 > b.x0 && a.y0 < b.y1 && a.y1 > b.y0;
}

/** Vertical extent, feet to head. */
export function zRange(e) {
  return { z0: e.z, z1: e.z + e.h };
}

export function zRangesOverlap(a, b) {
  return a.z0 < b.z1 && a.z1 > b.z0;
}

/** The footprint of an attack, offset in front of the attacker by its reach. */
export function attackBox(e, reach = DEFAULT_REACH) {
  const f = footprint(e);
  return e.facing >= 0
    ? { x0: f.x1, x1: f.x1 + reach, y0: f.y0, y1: f.y1 }
    : { x0: f.x0 - reach, x1: f.x0, y0: f.y0, y1: f.y1 };
}

/**
 * Two entities connect only when their footprints overlap AND their z ranges
 * overlap. That conjunction is what makes an attack miss someone standing on a
 * different depth line, or sail under someone mid-jump.
 */
export function canHit(attacker, target, reach = DEFAULT_REACH) {
  if (attacker === target) return false;
  if (!attacker.attacking) return false;
  return boxesOverlap(attackBox(attacker, reach), footprint(target))
    && zRangesOverlap(zRange(attacker), zRange(target));
}

/**
 * Advance one fixed step. `strip` is the walkable depth band for the section.
 * Mutates in place — entities live in a pooled flat array.
 */
export function integrate(e, strip) {
  e.x += e.vx;

  // y is depth: velocity moves it, gravity never does, and it is clamped to
  // the walkable strip.
  e.y = clamp(e.y + e.vy, strip.yMin, strip.yMax);

  e.z += e.vz;
  if (e.z > GROUND_Z) {
    e.vz += GRAVITY;
    e.airborne = true;
  } else {
    e.z = GROUND_Z;
    e.vz = 0;
    e.airborne = false;
  }

  // Knockback bleeds off, but only against the ground — a launched opponent
  // keeps travelling or they stop dead in mid-air. This runs AFTER the block
  // above because that is where `airborne` is decided for this step.
  //
  // It only matters for entities that do not re-author `vx` themselves; for
  // everyone else it is overwritten before it is next read. See
  // GROUND_FRICTION — without this the stage 1 boss slid off the map.
  if (!e.airborne) {
    e.vx *= GROUND_FRICTION;
    if (Math.abs(e.vx) < REST_SPEED) e.vx = 0;
  }
  return e;
}
