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
  return e;
}
