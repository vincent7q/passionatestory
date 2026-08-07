import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  createFpsTracker, pushFrameTime, averageFps, worstFrameMs,
} from '../../game/js/debug.js';

test('an empty tracker reports zero rather than NaN', () => {
  const t = createFpsTracker();
  assert.equal(averageFps(t), 0);
  assert.equal(worstFrameMs(t), 0);
});

test('16.67ms frames average to 60fps', () => {
  const t = createFpsTracker();
  for (let i = 0; i < 60; i += 1) pushFrameTime(t, 1000 / 60);
  assert.ok(Math.abs(averageFps(t) - 60) < 0.01);
});

test('the sample window slides and forgets old frames', () => {
  const t = createFpsTracker(10);
  for (let i = 0; i < 10; i += 1) pushFrameTime(t, 100);   // 10fps
  for (let i = 0; i < 10; i += 1) pushFrameTime(t, 1000 / 60);
  assert.equal(t.samples.length, 10);
  assert.ok(Math.abs(averageFps(t) - 60) < 0.01, 'old slow frames must age out');
});

// An average hides a single 200ms hitch that a player absolutely notices.
test('worst frame surfaces a stutter the average would hide', () => {
  const t = createFpsTracker();
  for (let i = 0; i < 59; i += 1) pushFrameTime(t, 1000 / 60);
  pushFrameTime(t, 200);
  assert.equal(worstFrameMs(t), 200);
  assert.ok(averageFps(t) > 30, 'the average alone still looks healthy');
});
