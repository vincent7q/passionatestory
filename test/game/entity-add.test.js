import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  createWorld, addEntity, despawn, spawn, activeCount, MAX_ENTITIES, Kind,
} from '../../game/js/entities/entity.js';
import { createPlayer } from '../../game/js/entities/player.js';
import { CHARACTERS } from '../../shared/characters.js';

/**
 * Factories such as createPlayer return a FINISHED entity, not an options bag.
 * Feeding one to spawn() would run it through createEntity a second time and
 * mint a second id for the same object.
 */
test('addEntity inserts a pre-built entity without re-creating it', () => {
  const w = createWorld();
  const p = createPlayer(CHARACTERS.felix, { x: 60, y: 210 });
  const added = addEntity(w, p);

  assert.equal(added, p, 'the very same object goes in');
  assert.equal(added.id, p.id, 'and keeps its identity');
  assert.equal(activeCount(w), 1);
});

test('addEntity reuses freed slots like spawn does', () => {
  const w = createWorld();
  const first = addEntity(w, createPlayer(CHARACTERS.felix));
  despawn(w, first);
  addEntity(w, createPlayer(CHARACTERS.lucian));
  assert.equal(w.entities.length, 1);
  assert.equal(activeCount(w), 1);
});

test('addEntity respects the cap', () => {
  const w = createWorld();
  for (let i = 0; i < MAX_ENTITIES; i += 1) spawn(w, Kind.ENEMY);
  assert.equal(addEntity(w, createPlayer(CHARACTERS.felix)), undefined);
});

test('addEntity of nothing is a no-op rather than a throw', () => {
  const w = createWorld();
  assert.equal(addEntity(w, null), undefined);
  assert.equal(addEntity(w, undefined), undefined);
  assert.equal(activeCount(w), 0);
});
