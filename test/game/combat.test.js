import { test } from 'node:test';
import assert from 'node:assert/strict';
import { State, Team, createEntity, Kind } from '../../game/js/entities/entity.js';
import {
  ATTACKS, COMBO_WINDOW, PARRY_WINDOW, GUARD_REDUCTION, KNOCKDOWN_INVULN,
  beginAttack, advanceAttack, canChain, chainInto,
  beginGuard, advanceGuard, applyDamage,
  canGrab, beginGrab, throwGrabbed,
} from '../../game/js/combat.js';

const fighter = (over = {}) => createEntity(Kind.ENEMY, {
  power: 100, powerMax: 100, x: 0, y: 100, facing: 1, ...over,
});

// ── T24: attack chains ───────────────────────────────────────────────────────

test('light and heavy have distinct frame data', () => {
  assert.ok(ATTACKS.light.damage < ATTACKS.heavy.damage);
  assert.ok(ATTACKS.light.recovery < ATTACKS.heavy.recovery);
  assert.equal(ATTACKS.light.knockdown, false);
  assert.equal(ATTACKS.heavy.knockdown, true, 'heavy finishers knock down');
});

test('an attack runs startup, then active, then recovery', () => {
  const e = fighter();
  beginAttack(e, 'light');
  const { startup, active } = ATTACKS.light;

  for (let i = 0; i < startup; i += 1) {
    assert.equal(e.attacking, false, `startup frame ${i} must not connect`);
    advanceAttack(e);
  }
  assert.equal(e.attacking, true, 'active frames connect');

  for (let i = 0; i < active; i += 1) advanceAttack(e);
  assert.equal(e.attacking, false, 'recovery does not connect');
});

test('an attack returns to idle when it finishes', () => {
  const e = fighter();
  beginAttack(e, 'heavy');
  const total = ATTACKS.heavy.startup + ATTACKS.heavy.active + ATTACKS.heavy.recovery;
  for (let i = 0; i <= total; i += 1) advanceAttack(e);
  assert.equal(e.state, State.IDLE);
  assert.equal(e.attacking, false);
});

test('light chains into heavy inside the window', () => {
  const e = fighter();
  beginAttack(e, 'light');
  for (let i = 0; i < ATTACKS.light.startup + ATTACKS.light.active; i += 1) advanceAttack(e);
  assert.ok(canChain(e), 'the window opens after the active frames');
  assert.equal(chainInto(e, 'heavy'), true);
  assert.equal(e.attackType, 'heavy');
});

test('the combo counter climbs across a chain', () => {
  const e = fighter();
  beginAttack(e, 'light');
  assert.equal(e.combo, 1);
  for (let i = 0; i < ATTACKS.light.startup + ATTACKS.light.active; i += 1) advanceAttack(e);
  chainInto(e, 'light');
  assert.equal(e.combo, 2);
});

test('a chain attempted after the window fails and resets the combo', () => {
  const e = fighter();
  beginAttack(e, 'light');
  for (let i = 0; i < 200; i += 1) advanceAttack(e);
  assert.equal(canChain(e), false);
  assert.equal(chainInto(e, 'heavy'), false);
  assert.equal(e.combo, 0);
});

test('the combo window is a whole number of frames', () => {
  assert.ok(Number.isInteger(COMBO_WINDOW) && COMBO_WINDOW > 0);
});

// ── T26: damage, knockback, knockdown ────────────────────────────────────────

test('damage reduces power and reports what landed', () => {
  const t = fighter();
  const r = applyDamage(t, 20, { fromFacing: 1 });
  assert.equal(t.power, 80);
  assert.equal(r.damage, 20);
  assert.equal(r.blocked, false);
  assert.equal(r.knockedDown, false);
});

test('knockback pushes away from the attacker', () => {
  const right = fighter();
  applyDamage(right, 10, { fromFacing: 1, knockback: 4 });
  assert.ok(right.vx > 0, 'struck from the left, pushed right');

  const left = fighter();
  applyDamage(left, 10, { fromFacing: -1, knockback: 4 });
  assert.ok(left.vx < 0);
});

test('a knockdown launches the target and grants invincibility on rising', () => {
  const t = fighter();
  const r = applyDamage(t, 10, { fromFacing: 1, knockdown: true });
  assert.equal(r.knockedDown, true);
  assert.equal(t.state, State.STUN);
  assert.ok(t.vz > 0, 'knockdown lifts the target off the ground');
  assert.equal(t.invulnerable, KNOCKDOWN_INVULN);
});

test('power never falls below zero', () => {
  const t = fighter({ power: 5 });
  applyDamage(t, 999);
  assert.equal(t.power, 0);
});

// Reaching zero is not death — nobody is hurt, nobody stays down. They sit
// down, see stars, and can be helped up. Content rule 6.
test('reaching zero power enters DAZED, not death', () => {
  const t = fighter({ power: 10 });
  const r = applyDamage(t, 10);
  assert.equal(t.state, State.DAZED);
  assert.equal(t.alive, true, 'nobody dies in this game');
  assert.equal(r.dazed, true);
});

test('an invincible target takes nothing', () => {
  const t = fighter({ invulnerable: 30 });
  const r = applyDamage(t, 50);
  assert.equal(t.power, 100);
  assert.equal(r.damage, 0);
  assert.equal(r.ignored, true);
});

/**
 * The hook Phase 4 needs. Striking someone already down is the single heaviest
 * penalty in the game, so the resolver has to report it — the caller cannot
 * infer it after the fact, because by then the state has changed.
 */
test('striking a downed opponent is reported to the caller', () => {
  for (const state of [State.DAZED, State.STUN]) {
    const t = fighter({ state, invulnerable: 0 });
    assert.equal(applyDamage(t, 5).struckWhileDown, true, `${state} must be reported`);
  }
  assert.equal(applyDamage(fighter(), 5).struckWhileDown, false);
});

// ── T27: guard and parry ─────────────────────────────────────────────────────

test('guarding halves damage', () => {
  const t = fighter();
  beginGuard(t);
  for (let i = 0; i < PARRY_WINDOW + 1; i += 1) advanceGuard(t);   // past the parry frames
  const r = applyDamage(t, 20, { fromFacing: -1 });
  assert.equal(r.blocked, true);
  assert.equal(r.damage, 20 * GUARD_REDUCTION);
});

test('a parry on the impact frame negates damage and staggers the attacker', () => {
  const t = fighter();
  const attacker = fighter({ x: 30 });
  beginGuard(t);
  const r = applyDamage(t, 20, { fromFacing: -1, attacker });

  assert.equal(r.parried, true);
  assert.equal(r.damage, 0);
  assert.equal(t.power, 100);
  assert.equal(attacker.state, State.STUN, 'the attacker is punished for being read');
});

test('the parry window is short enough to require timing', () => {
  assert.ok(PARRY_WINDOW > 0 && PARRY_WINDOW <= 8, `${PARRY_WINDOW} frames is not a parry`);
});

test('guarding from behind does not protect', () => {
  const t = fighter({ facing: 1 });
  beginGuard(t);
  const r = applyDamage(t, 20, { fromFacing: 1 });   // hit from the side he faces away from
  assert.equal(r.blocked, false, 'a guard only covers the front');
  assert.equal(r.damage, 20);
});

// ── T28: grabs and throws ────────────────────────────────────────────────────

test('only a stunned or dazed opponent can be grabbed', () => {
  const p = fighter({ team: Team.PLAYER });
  assert.equal(canGrab(p, fighter({ state: State.IDLE })), false);
  assert.equal(canGrab(p, fighter({ state: State.STUN })), true);
  assert.equal(canGrab(p, fighter({ state: State.DAZED })), true);
});

test('a grab links the two entities', () => {
  const p = fighter({ team: Team.PLAYER });
  const t = fighter({ state: State.STUN });
  beginGrab(p, t);
  assert.equal(p.grabbing, t);
  assert.equal(t.grabbedBy, p);
});

test('a throw launches the victim forward and releases the grab', () => {
  const p = fighter({ team: Team.PLAYER, facing: 1 });
  const t = fighter({ state: State.STUN });
  beginGrab(p, t);
  throwGrabbed(p);

  assert.equal(p.grabbing, null);
  assert.equal(t.grabbedBy, null);
  assert.ok(t.vx > 0, 'thrown in the direction the thrower faces');
  assert.ok(t.vz > 0, 'and up off the ground');
});

test('throwing with nobody grabbed is a no-op', () => {
  const p = fighter({ team: Team.PLAYER });
  p.grabbing = null;
  assert.doesNotThrow(() => throwGrabbed(p));
});

test('a grabbed opponent cannot be grabbed again by someone else', () => {
  const a = fighter({ team: Team.PLAYER });
  const b = fighter({ team: Team.PLAYER });
  const t = fighter({ state: State.STUN });
  beginGrab(a, t);
  assert.equal(canGrab(b, t), false);
});
