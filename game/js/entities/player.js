/**
 * The candidate. He is genuinely afraid, genuinely in love, and does not stop
 * for twenty minutes.
 *
 * Movement and intent are resolved here as pure functions over an input
 * snapshot, so the whole control scheme is testable without a browser.
 */

import { Kind, State, createEntity, Team } from './entity.js';
import { FRAME_H } from '../assets.js';
import { beginAttack, advanceAttack, canChain, chainInto, beginGuard, endGuard, advanceGuard }
  from '../combat.js';

/**
 * NOTE: this module does NOT import shared/. It cannot — the disk layout and
 * the served URL layout disagree. On disk this file is game/js/entities/, so
 * `../../shared/` resolves to game/shared/; in the browser it is served at
 * /js/entities/, where the same specifier resolves to /shared/. One of the two
 * always breaks.
 *
 * So shared/ is imported ONLY by main.js (browser-only, absolute /shared/…),
 * and character data is passed down. See SPEC.md §2.3.
 */

export const MOVE = {
  SPEED_X: 1.6,
  SPEED_Y: 1.1,     // depth movement is slower — it reads as "further away"
  JUMP_VZ: 11,
  GUARD_SLOW: 0.35,
  HEAVINESS_SLOW: 0.12,   // per cup of 二叔's tea
};

/** @param {object} def a CHARACTERS entry, passed in rather than looked up. */
export function createPlayer(def, at = {}) {
  if (!def || !def.id) return null;
  return createEntity(Kind.PLAYER, {
    charId: def.id,
    team: Team.PLAYER,
    x: at.x ?? 0, y: at.y ?? 0, z: 0,
    w: 16, depth: 8, h: FRAME_H,
    power: def.power, powerMax: def.power,
    spirit: 0, spiritMax: def.spirit,
    facing: 1,
    heaviness: 0,
    weapon: null,
    combo: 0,
  });
}

/**
 * Movement speed after guard and heaviness.
 *
 * Heaviness comes from 二叔 BAN's tea: each cup accepted makes the candidate
 * slower. Three cups leave him at his most sluggish — and then the way past is
 * to bow, not to fight.
 */
export function moveSpeed(e, base) {
  let s = base;
  if (e.guarding) s *= MOVE.GUARD_SLOW;
  s *= Math.max(0.25, 1 - (e.heaviness ?? 0) * MOVE.HEAVINESS_SLOW);
  return s;
}

/**
 * Resolve one step of intent. `intent` is a plain snapshot of the input layer
 * — {dx, dy, jump, light, heavy, guard} — which keeps this pure and testable.
 */
export function updatePlayer(e, intent, onAction = () => {}) {
  if (e.state === State.DAZED) return e;

  if (e.invulnerable > 0) e.invulnerable -= 1;

  // Guard is a held state; releasing it must actually clear it.
  if (intent.guard && !e.guarding) beginGuard(e);
  else if (!intent.guard && e.guarding) endGuard(e);
  else if (e.guarding) advanceGuard(e);

  const attacking = e.state === State.ATTACK;

  if (attacking) {
    advanceAttack(e);
    // A chain only continues on a FRESH press; holding the button must not
    // sustain a combo by itself.
    if (canChain(e)) {
      if (intent.heavy) chainInto(e, 'heavy');
      else if (intent.light) chainInto(e, 'light');
    }
  } else if (intent.heavy) {
    beginAttack(e, 'heavy');
    onAction('heavy');
  } else if (intent.light) {
    beginAttack(e, 'light');
    onAction('light');
  }

  // Committed attack frames pin him in place — that commitment is what makes
  // mashing punishable and guarding worthwhile.
  const rooted = e.state === State.ATTACK;
  e.vx = rooted ? 0 : intent.dx * moveSpeed(e, MOVE.SPEED_X);
  e.vy = rooted ? 0 : intent.dy * moveSpeed(e, MOVE.SPEED_Y);

  if (!rooted && intent.dx !== 0) e.facing = Math.sign(intent.dx);

  if (intent.jump && e.z <= 0 && !rooted) e.vz = MOVE.JUMP_VZ;

  return e;
}

/** Pick the animation for the current state. Presentation only. */
export function playerAnim(e) {
  if (e.state === State.DAZED) return 'dazed';
  if (e.state === State.STUN) return 'knockdown';
  if (e.state === State.ATTACK) return e.attackType === 'heavy' ? 'heavy' : 'light';
  if (e.z > 0) return 'jump';
  if (e.vx !== 0 || e.vy !== 0) return 'walk';
  return 'idle';
}
