/**
 * Enemy AI: IDLE → CHASE → ATTACK → RECOVER → STUN → DAZED
 *
 * Written as a pure reducer — `nextState` takes a snapshot and returns the
 * transition, with no reads of time, input, or canvas. That keeps the whole
 * behaviour testable, and it keeps AI decisions out of the render path.
 *
 * Durations are in fixed 1/60s steps.
 *
 * Content rule 4: every enemy has a reason to like you. They fight you anyway,
 * they apologise while doing it, and they go down carefully.
 */

import { State } from './entity.js';
import { ATTACKS } from '../combat.js';

export const AI = {
  SIGHT_RANGE: 140,      // starts moving toward you
  ATTACK_RANGE: 22,      // close enough to swing
  DEPTH_TOLERANCE: 6,    // must line up in DEPTH before attacking
  RECOVER_STEPS: 20,
  STUN_STEPS: 30,
  APPROACH_SPEED: 0.7,
};

/**
 * Decide the next state. Pure: same inputs, same output, no mutation.
 *
 * @param {object} e      the enemy
 * @param {object} target the player (or null)
 * @returns {string} a State
 */
export function nextState(e, target) {
  // Terminal and externally-driven states are never overridden by the AI.
  if (e.state === State.DAZED || e.state === State.ALLIED || e.state === State.DESPAWN) {
    return e.state;
  }
  if (e.power <= 0) return State.DAZED;

  if (e.state === State.STUN) {
    return e.stateTimer > 0 ? State.STUN : State.IDLE;
  }
  if (e.state === State.RECOVER) {
    return e.stateTimer > 0 ? State.RECOVER : State.IDLE;
  }
  if (e.state === State.ATTACK) {
    const data = ATTACKS[e.attackType] ?? ATTACKS.light;
    const done = e.attackFrame >= data.startup + data.active + data.recovery;
    return done ? State.RECOVER : State.ATTACK;
  }

  if (!target || !target.alive) return State.IDLE;

  const dx = Math.abs(target.x - e.x);
  const dy = Math.abs(target.y - e.y);

  // Lining up in depth before swinging is what makes a beat-'em-up readable —
  // an enemy that attacks from a different depth line looks broken.
  if (dx <= AI.ATTACK_RANGE && dy <= AI.DEPTH_TOLERANCE) return State.ATTACK;
  if (dx <= AI.SIGHT_RANGE) return State.CHASE;
  return State.IDLE;
}

/** Movement intent for the current state. Pure — returns velocities. */
export function steer(e, target) {
  if (e.state !== State.CHASE || !target) return { vx: 0, vy: 0 };

  const dx = target.x - e.x;
  const dy = target.y - e.y;
  const s = AI.APPROACH_SPEED;

  // Close the depth gap first, then the horizontal one; otherwise enemies
  // bunch on one depth line and the fight loses its second dimension.
  return {
    vx: Math.abs(dx) > AI.ATTACK_RANGE ? Math.sign(dx) * s : 0,
    vy: Math.abs(dy) > AI.DEPTH_TOLERANCE ? Math.sign(dy) * s : 0,
  };
}

/** Apply one step of AI. Mutates, and is the only place that does. */
export function updateEnemy(e, target) {
  if (e.stateTimer > 0) e.stateTimer -= 1;
  if (e.invulnerable > 0) e.invulnerable -= 1;

  const wanted = nextState(e, target);

  if (wanted !== e.state) {
    e.state = wanted;
    if (wanted === State.RECOVER) e.stateTimer = AI.RECOVER_STEPS;
    if (wanted === State.STUN) e.stateTimer = AI.STUN_STEPS;
  }

  const { vx, vy } = steer(e, target);
  e.vx = vx;
  e.vy = vy;
  if (target && e.state === State.CHASE) e.facing = Math.sign(target.x - e.x) || e.facing;

  return e;
}
