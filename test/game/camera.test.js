import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createCamera, nextCamera, LOOKAHEAD, FOLLOW } from '../../game/js/camera.js';
import { WIDTH } from '../../game/js/renderer.js';

const BOUNDS = { xMin: 0, xMax: 2000 };
const player = (x, facing = 1) => ({ x, facing });

test('a new camera starts at the left edge', () => {
  assert.equal(createCamera().x, 0);
});

test('the camera converges on its target rather than snapping', () => {
  const cam = createCamera();
  const target = player(1000);
  const after = nextCamera(cam, target, BOUNDS);
  assert.ok(after.x > 0, 'it moved');
  assert.ok(after.x < 1000 - WIDTH / 2, 'but did not teleport');
});

test('repeated steps settle on the target', () => {
  let cam = createCamera();
  for (let i = 0; i < 400; i += 1) cam = nextCamera(cam, player(1000), BOUNDS);
  // Facing right, the player sits left of centre by the lookahead amount.
  assert.ok(Math.abs(cam.x - (1000 - WIDTH / 2 + LOOKAHEAD)) < 1);
});

// The player should see more of what they are running toward. In a chase this
// is most of the game's readability.
test('lookahead leads in the direction the player faces', () => {
  let right = createCamera();
  let left = createCamera();
  for (let i = 0; i < 400; i += 1) {
    right = nextCamera(right, player(1000, 1), BOUNDS);
    left = nextCamera(left, player(1000, -1), BOUNDS);
  }
  assert.ok(right.x > left.x, 'facing right shows more of the road ahead');
  assert.ok(Math.abs((right.x - left.x) - LOOKAHEAD * 2) < 1);
});

test('the camera never scrolls past the left edge of the section', () => {
  let cam = createCamera();
  for (let i = 0; i < 200; i += 1) cam = nextCamera(cam, player(0, -1), BOUNDS);
  assert.equal(cam.x, BOUNDS.xMin);
});

test('the camera never scrolls past the right edge of the section', () => {
  let cam = createCamera();
  for (let i = 0; i < 800; i += 1) cam = nextCamera(cam, player(2000, 1), BOUNDS);
  assert.equal(cam.x, BOUNDS.xMax - WIDTH);
});

// A boss arena can be exactly one screen wide; the clamp must not invert.
test('a section narrower than the screen pins the camera at the left', () => {
  const narrow = { xMin: 0, xMax: WIDTH - 100 };
  let cam = createCamera();
  for (let i = 0; i < 200; i += 1) cam = nextCamera(cam, player(200, 1), narrow);
  assert.equal(cam.x, 0, 'must not produce a negative clamp range');
});

test('nextCamera does not mutate the camera it is given', () => {
  const cam = createCamera();
  const before = cam.x;
  nextCamera(cam, player(1000), BOUNDS);
  assert.equal(cam.x, before);
});

test('the follow factor is a sane lerp', () => {
  assert.ok(FOLLOW > 0 && FOLLOW < 1);
});
