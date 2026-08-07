import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stepCount, STEP_MS, MAX_FRAME_MS, clamp, clamp01, lerp } from '../../game/js/utils.js';

test('the step is 1/60s', () => {
  assert.equal(STEP_MS, 1000 / 60);
});

test('accumulates whole steps and returns the remainder', () => {
  const r = stepCount(0, STEP_MS * 3);
  assert.equal(r.steps, 3);
  assert.ok(Math.abs(r.remainder) < 1e-9);
});

test('holds a partial step in the remainder', () => {
  const r = stepCount(0, STEP_MS * 1.5);
  assert.equal(r.steps, 1);
  assert.ok(Math.abs(r.remainder - STEP_MS * 0.5) < 1e-9);
});

test('carries the remainder into the next frame', () => {
  const a = stepCount(0, STEP_MS * 0.6);
  assert.equal(a.steps, 0);
  const b = stepCount(a.remainder, STEP_MS * 0.6);
  assert.equal(b.steps, 1, 'two 0.6-step frames must produce exactly one step');
});

// Without the clamp, a backgrounded tab returns a huge elapsed time, the loop
// tries to simulate all of it at once, takes longer than a frame, and the
// backlog grows forever.
test('clamps a long stall so the loop cannot death-spiral', () => {
  const r = stepCount(0, 10_000);
  assert.equal(r.steps, Math.floor(MAX_FRAME_MS / STEP_MS));
});

test('never produces negative steps from a clock that went backwards', () => {
  const r = stepCount(0, -500);
  assert.equal(r.steps, 0);
  assert.ok(r.remainder >= 0);
});

test('clamp helpers', () => {
  assert.equal(clamp(5, 0, 3), 3);
  assert.equal(clamp(-5, 0, 3), 0);
  assert.equal(clamp01(2), 1);
  assert.equal(clamp01(-2), 0);
  assert.equal(lerp(0, 10, 0.5), 5);
});
