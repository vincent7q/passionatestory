import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeScale, WIDTH, HEIGHT } from '../../game/js/renderer.js';

test('internal resolution is 480x270 and nothing may change it', () => {
  assert.equal(WIDTH, 480);
  assert.equal(HEIGHT, 270);
});

test('picks the largest integer multiple that fits', () => {
  assert.equal(computeScale(960, 540), 2);
  assert.equal(computeScale(1920, 1080), 4);
  assert.equal(computeScale(1440, 810), 3);
});

// Integer-only scaling is what keeps pixels square. A viewport that is
// "nearly 3x" must letterbox at 2x, never stretch to 2.9x.
test('never returns a fractional scale', () => {
  for (const [w, h] of [[1439, 809], [1000, 600], [1919, 1079], [733, 412]]) {
    const s = computeScale(w, h);
    assert.equal(s, Math.floor(s), `scale ${s} for ${w}x${h} is fractional`);
  }
});

test('constrains on the tighter axis', () => {
  // Very wide but short: height is the limit.
  assert.equal(computeScale(4000, 540), 2);
  // Very tall but narrow: width is the limit.
  assert.equal(computeScale(960, 4000), 2);
});

test('never drops below 1x on a tiny viewport', () => {
  assert.equal(computeScale(100, 100), 1);
  assert.equal(computeScale(1, 1), 1);
  assert.equal(computeScale(0, 0), 1);
});
