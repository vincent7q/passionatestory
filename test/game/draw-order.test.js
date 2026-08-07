import { test } from 'node:test';
import assert from 'node:assert/strict';
import { drawSorted } from '../../game/js/renderer.js';

/**
 * y is DEPTH. Larger y is nearer the viewer, so drawing in ascending y order
 * means characters further back are painted first and overlapped by those in
 * front. Get this backwards and the game still runs, still hits correctly, and
 * simply looks wrong in a way that is hard to attribute.
 */

const ent = (id, over = {}) => ({ id, x: 0, y: 0, z: 0, ...over });

/** Collect what would be drawn, in order, without a canvas. */
function record(entities, camera = { x: 0 }) {
  const calls = [];
  drawSorted(null, entities, camera, (_ctx, e, sx, sy) => calls.push({ id: e.id, sx, sy }));
  return calls;
}

test('entities are drawn back to front', () => {
  const calls = record([ent('front', { y: 200 }), ent('back', { y: 50 }), ent('mid', { y: 120 })]);
  assert.deepEqual(calls.map((c) => c.id), ['back', 'mid', 'front']);
});

test('screen position is (x - camera.x, y - z)', () => {
  const [call] = record([ent('a', { x: 300, y: 150, z: 40 })], { x: 100 });
  assert.equal(call.sx, 200);
  assert.equal(call.sy, 110);
});

// A jumping character must not be re-sorted to the front just because it left
// the ground — height is z, depth is y, and only y orders the draw.
test('jumping does not change draw order', () => {
  const calls = record([
    ent('jumper', { y: 50, z: 100 }),
    ent('grounded', { y: 200, z: 0 }),
  ]);
  assert.deepEqual(calls.map((c) => c.id), ['jumper', 'grounded'],
    'the jumper is further back and stays behind, however high it is');
});

test('screen coordinates are rounded to whole pixels', () => {
  const [call] = record([ent('a', { x: 10.4, y: 20.6, z: 0.3 })], { x: 0.2 });
  assert.equal(call.sx, Math.round(10.4 - 0.2));
  assert.equal(call.sy, Math.round(20.6 - 0.3));
  assert.equal(call.sx, Math.trunc(call.sx), 'subpixel positions would shimmer');
});

test('sorting does not mutate the caller\'s entity array', () => {
  const list = [ent('c', { y: 300 }), ent('a', { y: 100 })];
  record(list);
  assert.deepEqual(list.map((e) => e.id), ['c', 'a'], 'the live entity array must keep its order');
});

test('an empty scene draws nothing without throwing', () => {
  assert.deepEqual(record([]), []);
});
