import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  Kind, State, Team, MAX_ENTITIES,
  createWorld, createEntity, spawn, despawn,
  activeEntities, activeCount, findById, resetIds,
} from '../../game/js/entities/entity.js';

test('the state machine has the branch the game is built on', () => {
  // DAZED → ALLIED is helping a defeated opponent up. See SPEC.md §4.1.
  assert.ok(State.DAZED);
  assert.ok(State.ALLIED);
  assert.ok(State.DESPAWN);
});

test('a new entity starts alive, idle and at full power', () => {
  resetIds();
  const e = createEntity(Kind.ENEMY, { power: 40, powerMax: 40 });
  assert.equal(e.alive, true);
  assert.equal(e.state, State.IDLE);
  assert.equal(e.power, e.powerMax);
  assert.equal(e.team, Team.HOUSE);
});

test('entity ids are unique', () => {
  resetIds();
  const ids = new Set([createEntity(Kind.ENEMY).id, createEntity(Kind.ENEMY).id,
                       createEntity(Kind.ITEM).id]);
  assert.equal(ids.size, 3);
});

test('spawn adds to the world and is findable by id', () => {
  const w = createWorld();
  const e = spawn(w, Kind.ENEMY, { x: 100 });
  assert.equal(activeCount(w), 1);
  assert.equal(findById(w, e.id), e);
});

test('despawn marks the entity dead and drops it from the active list', () => {
  const w = createWorld();
  const e = spawn(w, Kind.ENEMY);
  assert.equal(despawn(w, e), true);
  assert.equal(e.alive, false);
  assert.equal(e.state, State.DESPAWN);
  assert.equal(activeCount(w), 0);
  assert.equal(findById(w, e.id), undefined);
});

test('despawning something not in the world is a no-op, not a throw', () => {
  const w = createWorld();
  assert.equal(despawn(w, createEntity(Kind.ENEMY)), false);
});

/**
 * The pool exists so a long fight does not allocate per spawn. Without slot
 * reuse the array grows to the high-water mark of everything ever spawned and
 * every iteration pays for it — the usual cause of the stutter C6 forbids.
 */
test('a freed slot is reused rather than growing the array', () => {
  const w = createWorld();
  const first = spawn(w, Kind.ENEMY);
  despawn(w, first);
  const second = spawn(w, Kind.ENEMY);

  assert.equal(w.entities.length, 1, 'the backing array must not grow');
  assert.notEqual(second.id, first.id, 'but it is a genuinely new entity');
  assert.equal(activeCount(w), 1);
});

test('churning many entities keeps the array at its high-water mark', () => {
  const w = createWorld();
  for (let i = 0; i < 200; i += 1) despawn(w, spawn(w, Kind.ENEMY));
  assert.equal(w.entities.length, 1);
  assert.equal(activeCount(w), 0);
});

test('spawning stops at the cap instead of growing without bound', () => {
  const w = createWorld();
  for (let i = 0; i < MAX_ENTITIES; i += 1) assert.ok(spawn(w, Kind.ENEMY));
  assert.equal(spawn(w, Kind.ENEMY), undefined, 'over the cap must return undefined');
  assert.equal(activeCount(w), MAX_ENTITIES);
});

test('freeing under the cap allows spawning again', () => {
  const w = createWorld();
  const all = [];
  for (let i = 0; i < MAX_ENTITIES; i += 1) all.push(spawn(w, Kind.ENEMY));
  despawn(w, all[0]);
  assert.ok(spawn(w, Kind.ENEMY), 'a freed slot must become available');
});

// Despawning mid-iteration is normal — an opponent's daze window expires while
// the update loop is walking the array.
test('despawn during iteration does not disturb the walk', () => {
  const w = createWorld();
  const spawned = [];
  for (let i = 0; i < 5; i += 1) spawned.push(spawn(w, Kind.ENEMY, { x: i }));

  const seen = [];
  for (const e of w.entities) {
    if (!e.alive) continue;
    seen.push(e.x);
    if (e.x === 2) despawn(w, e);
  }
  assert.deepEqual(seen, [0, 1, 2, 3, 4], 'every entity is still visited exactly once');
  assert.equal(activeCount(w), 4);
});

test('activeEntities excludes the dead', () => {
  const w = createWorld();
  const a = spawn(w, Kind.ENEMY);
  spawn(w, Kind.ENEMY);
  despawn(w, a);
  assert.equal(activeEntities(w).length, 1);
  assert.ok(activeEntities(w).every((e) => e.alive));
});
