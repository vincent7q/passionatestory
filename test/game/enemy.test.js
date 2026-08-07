import { test } from 'node:test';
import assert from 'node:assert/strict';
import { State, Kind, createEntity } from '../../game/js/entities/entity.js';
import { AI, nextState, steer, updateEnemy } from '../../game/js/entities/enemy.js';

const enemy = (over = {}) => createEntity(Kind.ENEMY, {
  x: 0, y: 100, power: 30, powerMax: 30, state: State.IDLE, ...over,
});
const player = (over = {}) => createEntity(Kind.PLAYER, {
  x: 0, y: 100, alive: true, ...over,
});

test('idles when the player is out of sight', () => {
  assert.equal(nextState(enemy(), player({ x: AI.SIGHT_RANGE + 50 })), State.IDLE);
});

test('idles when there is no player at all', () => {
  assert.equal(nextState(enemy(), null), State.IDLE);
});

test('chases once the player is in sight but out of reach', () => {
  assert.equal(nextState(enemy(), player({ x: AI.SIGHT_RANGE - 10 })), State.CHASE);
});

test('attacks when close in both x and depth', () => {
  assert.equal(nextState(enemy(), player({ x: AI.ATTACK_RANGE - 2, y: 100 })), State.ATTACK);
});

/**
 * The rule that makes a beat-'em-up read correctly. An enemy that swings from a
 * different depth line looks broken — the attack visibly passes through the
 * player and misses, because physics.canHit requires footprint overlap.
 */
test('will not attack from a different depth line — it closes instead', () => {
  const s = nextState(enemy(), player({ x: AI.ATTACK_RANGE - 2, y: 100 + AI.DEPTH_TOLERANCE + 10 }));
  assert.equal(s, State.CHASE, 'must line up in depth before swinging');
});

test('chasing steers on both axes', () => {
  const e = enemy({ state: State.CHASE });
  const v = steer(e, player({ x: 100, y: 140 }));
  assert.ok(v.vx > 0, 'moves toward the player horizontally');
  assert.ok(v.vy > 0, 'and closes the depth gap');
});

test('stops closing an axis once it is aligned', () => {
  const e = enemy({ state: State.CHASE });
  const v = steer(e, player({ x: 0, y: 100 }));
  assert.equal(v.vx, 0);
  assert.equal(v.vy, 0);
});

test('a non-chasing enemy does not drift', () => {
  assert.deepEqual(steer(enemy({ state: State.IDLE }), player({ x: 100 })), { vx: 0, vy: 0 });
});

test('stun holds until its timer runs out', () => {
  assert.equal(nextState(enemy({ state: State.STUN, stateTimer: 5 }), player()), State.STUN);
  assert.equal(nextState(enemy({ state: State.STUN, stateTimer: 0 }), player({ x: 500 })),
    State.IDLE);
});

test('recover holds until its timer runs out', () => {
  assert.equal(nextState(enemy({ state: State.RECOVER, stateTimer: 3 }), player()), State.RECOVER);
});

test('zero power becomes DAZED regardless of what else is happening', () => {
  assert.equal(nextState(enemy({ power: 0, state: State.CHASE }), player()), State.DAZED);
});

/**
 * Once someone is dazed, the AI must stop touching them. The ten-second window
 * belongs to the player's decision, and an AI that dragged an opponent back to
 * CHASE would silently destroy the mechanic the game is built on.
 */
test('DAZED is terminal as far as the AI is concerned', () => {
  assert.equal(nextState(enemy({ state: State.DAZED, power: 0 }), player()), State.DAZED);
});

test('an ALLIED opponent is never pulled back into fighting you', () => {
  const ally = enemy({ state: State.ALLIED, power: 30 });
  assert.equal(nextState(ally, player({ x: 5 })), State.ALLIED);
});

test('updateEnemy ticks down timers', () => {
  const e = enemy({ state: State.STUN, stateTimer: 3, invulnerable: 2 });
  updateEnemy(e, player());
  assert.equal(e.stateTimer, 2);
  assert.equal(e.invulnerable, 1);
});

test('updateEnemy sets a fresh timer when entering RECOVER', () => {
  const e = enemy({ state: State.ATTACK, attackType: 'light', attackFrame: 999 });
  updateEnemy(e, player());
  assert.equal(e.state, State.RECOVER);
  assert.equal(e.stateTimer, AI.RECOVER_STEPS);
});

test('a chasing enemy turns to face the player', () => {
  const e = enemy({ x: 100, facing: 1 });
  updateEnemy(e, player({ x: 0 }));
  assert.equal(e.state, State.CHASE);
  assert.equal(e.facing, -1);
});

test('nextState does not mutate the entity it inspects', () => {
  const e = enemy({ state: State.IDLE, x: 0 });
  const snapshot = JSON.stringify(e);
  nextState(e, player({ x: 10 }));
  assert.equal(JSON.stringify(e), snapshot);
});
