/**
 * Entity storage: one flat array with an object pool.
 *
 * Entities are recycled rather than allocated per spawn, because a stage
 * spawns hundreds over a run and per-frame garbage is the usual cause of the
 * stutter that criterion C6 forbids.
 *
 * The ~50 cap is real, and the ten-second despawn window is load-bearing for
 * it: defeated opponents leave on their own, which is what keeps the array
 * bounded during a long fight. See SPEC.md §4.
 */

import { FRAME_H } from '../assets.js';

export const Kind = {
  PLAYER: 'player',
  ENEMY: 'enemy',
  BOSS: 'boss',
  ALLY: 'ally',
  ITEM: 'item',
  PROJECTILE: 'projectile',
  PROP: 'prop',
};

/**
 * Entity state machine. See SPEC.md §4.1.
 *
 *   IDLE → CHASE → ATTACK → RECOVER → STUN → DAZED → DESPAWN
 *                                               ↓
 *                                             ALLIED
 *
 * DAZED → ALLIED is the branch the whole game is built on.
 */
export const State = {
  IDLE: 'IDLE',
  CHASE: 'CHASE',
  ATTACK: 'ATTACK',
  RECOVER: 'RECOVER',
  STUN: 'STUN',
  DAZED: 'DAZED',
  ALLIED: 'ALLIED',
  DESPAWN: 'DESPAWN',
};

export const Team = { PLAYER: 'player', HOUSE: 'house' };

export const MAX_ENTITIES = 50;

let nextId = 1;

export function resetIds() {
  nextId = 1;
}

export function createEntity(kind, opts = {}) {
  return {
    id: nextId++,
    kind,
    alive: true,

    x: 0, y: 0, z: 0,
    vx: 0, vy: 0, vz: 0,
    facing: 1,
    airborne: false,

    w: 16, depth: 8, h: FRAME_H,

    power: 30, powerMax: 30,
    spirit: 0, spiritMax: 0,

    state: State.IDLE,
    stateTimer: 0,
    invulnerable: 0,

    anim: 'idle', animFrame: 0, animTimer: 0,
    attacking: false,

    team: Team.HOUSE,
    charId: 'felix',

    ...opts,
  };
}

export function createWorld() {
  return { entities: [], free: [] };
}

/**
 * Add an entity, reusing a freed slot when one exists.
 * Returns undefined at the cap rather than growing without bound.
 */
export function spawn(world, kind, opts = {}) {
  const e = createEntity(kind, opts);

  const slot = world.free.pop();
  if (slot !== undefined) {
    world.entities[slot] = e;
    return e;
  }

  if (world.entities.length >= MAX_ENTITIES) return undefined;
  world.entities.push(e);
  return e;
}

/**
 * Insert an already-constructed entity — one built by a factory such as
 * createPlayer, which returns a finished entity rather than an options bag.
 * Returns undefined at the cap.
 */
export function addEntity(world, entity) {
  if (!entity) return undefined;

  const slot = world.free.pop();
  if (slot !== undefined) {
    world.entities[slot] = entity;
    return entity;
  }

  if (world.entities.length >= MAX_ENTITIES) return undefined;
  world.entities.push(entity);
  return entity;
}

/**
 * Mark an entity dead and release its slot. The array keeps its length so
 * indices stay stable for anything iterating this frame.
 */
export function despawn(world, entity) {
  const i = world.entities.indexOf(entity);
  if (i === -1) return false;
  entity.alive = false;
  entity.state = State.DESPAWN;
  world.free.push(i);
  return true;
}

export function activeEntities(world) {
  return world.entities.filter((e) => e && e.alive);
}

export function activeCount(world) {
  let n = 0;
  for (const e of world.entities) if (e && e.alive) n += 1;
  return n;
}

export function findById(world, id) {
  return world.entities.find((e) => e && e.alive && e.id === id);
}
