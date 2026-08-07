import { test } from 'node:test';
import assert from 'node:assert/strict';
import { State, Team } from '../../game/js/entities/entity.js';
import { createPlayer, updatePlayer, moveSpeed, playerAnim, MOVE }
  from '../../game/js/entities/player.js';
import { ATTACKS } from '../../game/js/combat.js';
import { CHARACTERS } from '../../shared/characters.js';

const felix = () => createPlayer(CHARACTERS.felix, { x: 0, y: 100 });
const idle = { dx: 0, dy: 0, jump: false, light: false, heavy: false, guard: false };
const intent = (over = {}) => ({ ...idle, ...over });

test('a player is created from a character definition', () => {
  const p = felix();
  assert.equal(p.charId, 'felix');
  assert.equal(p.team, Team.PLAYER);
  assert.equal(p.power, CHARACTERS.felix.power);
  assert.equal(p.spiritMax, CHARACTERS.felix.spirit);
  assert.equal(p.spirit, 0, 'spirit is earned, not given');
});

test('an unknown definition yields null rather than a broken player', () => {
  assert.equal(createPlayer(undefined), null);
  assert.equal(createPlayer({}), null);
});

test('the three candidates differ in power', () => {
  assert.ok(createPlayer(CHARACTERS.hilman).power > createPlayer(CHARACTERS.felix).power);
  assert.ok(createPlayer(CHARACTERS.felix).power > createPlayer(CHARACTERS.lucian).power);
});

// ── movement ─────────────────────────────────────────────────────────────────

test('movement responds on both axes', () => {
  const p = felix();
  updatePlayer(p, intent({ dx: 1, dy: -1 }));
  assert.ok(p.vx > 0);
  assert.ok(p.vy < 0);
});

test('depth movement is slower than horizontal', () => {
  assert.ok(MOVE.SPEED_Y < MOVE.SPEED_X, 'moving into the screen should read as slower');
});

test('facing follows horizontal input only', () => {
  const p = felix();
  updatePlayer(p, intent({ dx: -1 }));
  assert.equal(p.facing, -1);
  updatePlayer(p, intent({ dy: 1 }));
  assert.equal(p.facing, -1, 'depth movement alone must not flip him');
});

test('jumping only works from the ground', () => {
  const p = felix();
  updatePlayer(p, intent({ jump: true }));
  assert.equal(p.vz, MOVE.JUMP_VZ);

  p.z = 20;
  p.vz = 0;
  updatePlayer(p, intent({ jump: true }));
  assert.equal(p.vz, 0, 'no double jump');
});

test('guarding slows him down', () => {
  const p = felix();
  assert.ok(moveSpeed({ ...p, guarding: true }, 10) < moveSpeed(p, 10));
});

/**
 * 二叔 BAN's tea. Each cup accepted makes the candidate heavier and slower;
 * three leave him at his most sluggish, and then the way past is to bow.
 */
test('heaviness from tea slows him, with a floor', () => {
  const p = felix();
  const base = moveSpeed(p, 10);
  assert.ok(moveSpeed({ ...p, heaviness: 3 }, 10) < base);
  assert.ok(moveSpeed({ ...p, heaviness: 99 }, 10) >= 10 * 0.25, 'never slows to a standstill');
});

// ── attacking ────────────────────────────────────────────────────────────────

test('a light press starts an attack', () => {
  const p = felix();
  updatePlayer(p, intent({ light: true }));
  assert.equal(p.state, State.ATTACK);
  assert.equal(p.attackType, 'light');
});

test('attacking roots him in place', () => {
  const p = felix();
  updatePlayer(p, intent({ light: true }));
  updatePlayer(p, intent({ dx: 1 }));
  assert.equal(p.vx, 0, 'commitment during attack frames is what makes guarding worthwhile');
});

test('light chains into heavy inside the window', () => {
  const p = felix();
  updatePlayer(p, intent({ light: true }));
  const steps = ATTACKS.light.startup + ATTACKS.light.active;
  for (let i = 0; i < steps; i += 1) updatePlayer(p, intent());
  updatePlayer(p, intent({ heavy: true }));
  assert.equal(p.attackType, 'heavy');
  assert.ok(p.combo >= 2);
});

test('an attack finishes and returns control', () => {
  const p = felix();
  updatePlayer(p, intent({ light: true }));
  const total = ATTACKS.light.startup + ATTACKS.light.active + ATTACKS.light.recovery;
  for (let i = 0; i <= total; i += 1) updatePlayer(p, intent());
  assert.equal(p.state, State.IDLE);
  updatePlayer(p, intent({ dx: 1 }));
  assert.ok(p.vx > 0, 'he can move again');
});

test('releasing guard actually clears it', () => {
  const p = felix();
  updatePlayer(p, intent({ guard: true }));
  assert.equal(p.guarding, true);
  updatePlayer(p, intent({ guard: false }));
  assert.equal(p.guarding, false);
});

// Reaching zero 力 is not death — he wakes somewhere safe, having been carried
// there, and is told he can try again.
test('a dazed player ignores input entirely', () => {
  const p = felix();
  p.state = State.DAZED;
  updatePlayer(p, intent({ dx: 1, light: true }));
  assert.equal(p.vx, 0);
  assert.equal(p.state, State.DAZED);
});

// ── animation ────────────────────────────────────────────────────────────────

test('animation reflects state', () => {
  const p = felix();
  assert.equal(playerAnim(p), 'idle');

  p.vx = 1;
  assert.equal(playerAnim(p), 'walk');

  p.z = 10;
  assert.equal(playerAnim(p), 'jump');

  p.state = State.ATTACK;
  p.attackType = 'heavy';
  assert.equal(playerAnim(p), 'heavy');

  p.state = State.DAZED;
  assert.equal(playerAnim(p), 'dazed');
});
