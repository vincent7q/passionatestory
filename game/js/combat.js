/**
 * Damage resolution, attack chains, guard/parry, and grabs.
 *
 * Follows the Kunio-kun / River City line: light strings into heavy, heavy
 * finishers knock down, guard halves damage and a parry on the impact frame
 * staggers the attacker.
 *
 * Everything here is a pure-ish reducer over entity state — no canvas, no
 * input, no timers — so combat rules are testable in Node. Collision math
 * stays in physics.js; this file decides what a connection MEANS.
 *
 * All durations are in fixed 1/60s steps. Nothing scales by a variable dt.
 */

import { State } from './entities/entity.js';

/** Frame data, in steps. Playtest-tunable; keep it here, never inline. */
export const ATTACKS = {
  light: { damage: 6, startup: 3, active: 3, recovery: 6, knockback: 1.5, knockdown: false },
  heavy: { damage: 14, startup: 7, active: 4, recovery: 14, knockback: 4, knockdown: true },
};

/** Steps after the active frames during which the next input continues a chain. */
export const COMBO_WINDOW = 14;

/** Steps from pressing guard during which an incoming hit is parried, not blocked. */
export const PARRY_WINDOW = 6;

export const GUARD_REDUCTION = 0.5;

/** ~1s of invincibility while getting back up. */
export const KNOCKDOWN_INVULN = 60;

export const THROW_VX = 5;
export const THROW_VZ = 6;
export const PARRY_STAGGER = 24;

// ── Attacks and chains ───────────────────────────────────────────────────────

export function beginAttack(e, type) {
  const data = ATTACKS[type];
  if (!data) return false;
  e.state = State.ATTACK;
  e.attackType = type;
  e.attackFrame = 0;
  e.attacking = false;
  e.combo = (e.combo ?? 0) + 1;
  e.chainOpen = false;
  return true;
}

/** Advance one step. Sets `attacking` only during the active frames. */
export function advanceAttack(e) {
  if (e.state !== State.ATTACK) return e;
  const data = ATTACKS[e.attackType];
  if (!data) return e;

  e.attackFrame += 1;
  const { startup, active, recovery } = data;

  // Frames [startup, startup+active) connect. Frame `startup` is the first
  // active frame, not the last startup one.
  e.attacking = e.attackFrame >= startup && e.attackFrame < startup + active;

  // The chain window opens the moment the active frames end and closes partway
  // through recovery — long enough to feel responsive, short enough that
  // mashing alone does not sustain a combo forever.
  const afterActive = e.attackFrame - (startup + active);
  e.chainOpen = afterActive >= 0 && afterActive <= Math.min(COMBO_WINDOW, recovery);

  if (e.attackFrame >= startup + active + recovery) {
    e.state = State.IDLE;
    e.attacking = false;
    e.chainOpen = false;
    e.combo = 0;
  }
  return e;
}

export function canChain(e) {
  return e.state === State.ATTACK && e.chainOpen === true;
}

export function chainInto(e, type) {
  if (!canChain(e)) {
    e.combo = 0;
    return false;
  }
  const combo = e.combo ?? 0;
  beginAttack(e, type);
  e.combo = combo + 1;
  return true;
}

// ── Guard and parry ──────────────────────────────────────────────────────────

export function beginGuard(e) {
  e.guarding = true;
  e.guardFrame = 0;
  return e;
}

export function advanceGuard(e) {
  if (e.guarding) e.guardFrame = (e.guardFrame ?? 0) + 1;
  return e;
}

export function endGuard(e) {
  e.guarding = false;
  e.guardFrame = 0;
  return e;
}

/** A guard only covers the side the defender faces. */
function guardCovers(target, fromFacing) {
  if (!target.guarding) return false;
  // fromFacing is the attacker's facing; the blow travels that way, so it
  // arrives on the side opposite to it.
  return target.facing === -fromFacing;
}

// ── Damage ───────────────────────────────────────────────────────────────────

/**
 * Resolve a connection.
 *
 * @returns {{damage:number, blocked:boolean, parried:boolean, knockedDown:boolean,
 *            dazed:boolean, ignored:boolean, struckWhileDown:boolean}}
 *
 * `struckWhileDown` is reported rather than inferred: by the time the caller
 * looks again the state has already changed, and this is the flag Phase 4 uses
 * to charge the heaviest penalty in the game.
 */
export function applyDamage(target, amount, opts = {}) {
  const result = {
    damage: 0, blocked: false, parried: false, knockedDown: false,
    dazed: false, ignored: false,
    struckWhileDown: target.state === State.DAZED || target.state === State.STUN,
  };

  if (target.invulnerable > 0) {
    result.ignored = true;
    return result;
  }

  const fromFacing = opts.fromFacing ?? 1;

  if (guardCovers(target, fromFacing)) {
    if ((target.guardFrame ?? 0) <= PARRY_WINDOW) {
      result.parried = true;
      if (opts.attacker) {
        opts.attacker.state = State.STUN;
        opts.attacker.stateTimer = PARRY_STAGGER;
        opts.attacker.attacking = false;
      }
      return result;
    }
    result.blocked = true;
    amount *= GUARD_REDUCTION;
  }

  result.damage = amount;
  target.power = Math.max(0, target.power - amount);

  const knockback = opts.knockback ?? 0;
  if (knockback) target.vx += knockback * fromFacing;

  if (opts.knockdown) {
    result.knockedDown = true;
    target.state = State.STUN;
    target.stateTimer = KNOCKDOWN_INVULN;
    target.vz = 4;
    target.invulnerable = KNOCKDOWN_INVULN;
  }

  // Zero power is not death. Nobody bleeds, nobody is hurt, nobody stays down —
  // they sit down, see stars, and can be helped up. Content rule 6.
  if (target.power === 0) {
    target.state = State.DAZED;
    target.attacking = false;
    result.dazed = true;
  }

  return result;
}

// ── Grabs and throws ─────────────────────────────────────────────────────────

export function canGrab(grabber, target) {
  if (!target || target === grabber) return false;
  if (target.grabbedBy) return false;
  return target.state === State.STUN || target.state === State.DAZED;
}

export function beginGrab(grabber, target) {
  if (!canGrab(grabber, target)) return false;
  grabber.grabbing = target;
  target.grabbedBy = grabber;
  return true;
}

export function releaseGrab(grabber) {
  const target = grabber.grabbing;
  if (target) target.grabbedBy = null;
  grabber.grabbing = null;
  return target;
}

/** Launch the grabbed entity forward — into another opponent, ideally. */
export function throwGrabbed(grabber) {
  const target = grabber.grabbing;
  if (!target) return null;
  releaseGrab(grabber);
  target.vx = THROW_VX * grabber.facing;
  target.vz = THROW_VZ;
  target.state = State.STUN;
  target.stateTimer = KNOCKDOWN_INVULN;
  return target;
}
