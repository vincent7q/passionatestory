/**
 * Horizontal follow camera with lookahead, lerped and clamped to the section.
 *
 * Pure: nextCamera takes a camera and returns a new one, so it is testable
 * without a canvas. Per fixed step — nothing scales by a variable dt.
 */

import { clamp, lerp } from './utils.js';
import { WIDTH } from './renderer.js';

/** How far ahead of the player the view leads, in the direction they face. */
export const LOOKAHEAD = 40;

/** Lerp factor per step. Lower is heavier. */
export const FOLLOW = 0.08;

export function createCamera(x = 0) {
  return { x };
}

export function nextCamera(cam, target, bounds) {
  const desired = target.x - WIDTH / 2 + LOOKAHEAD * (target.facing >= 0 ? 1 : -1);

  // A section can be narrower than the screen — a boss arena, for instance —
  // so the clamp range would invert. Pin to the left edge instead.
  const maxX = Math.max(bounds.xMin, bounds.xMax - WIDTH);

  return { x: clamp(lerp(cam.x, desired, FOLLOW), bounds.xMin, maxX) };
}
