import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  createInput, keyDown, keyUp, endFrame, isDown, justPressed, justReleased,
  Action, KEY_MAP, axis,
} from '../../game/js/input.js';

test('every documented key maps to an action', () => {
  // SPEC.md §5. E is the most important button in the game.
  assert.equal(KEY_MAP.ArrowLeft, Action.LEFT);
  assert.equal(KEY_MAP.ArrowRight, Action.RIGHT);
  assert.equal(KEY_MAP.ArrowUp, Action.UP);
  assert.equal(KEY_MAP.ArrowDown, Action.DOWN);
  assert.equal(KEY_MAP[' '], Action.JUMP);
  assert.equal(KEY_MAP.z, Action.LIGHT);
  assert.equal(KEY_MAP.x, Action.HEAVY);
  assert.equal(KEY_MAP.c, Action.SPECIAL);
  assert.equal(KEY_MAP.Shift, Action.GUARD);
  assert.equal(KEY_MAP.e, Action.CONTEXT);
  assert.equal(KEY_MAP.q, Action.ALLY);
  assert.equal(KEY_MAP.Enter, Action.PAUSE);
});

test('key case does not matter — E and e are the same button', () => {
  const i = createInput();
  keyDown(i, 'E');
  assert.ok(isDown(i, Action.CONTEXT));
  assert.ok(justPressed(i, Action.CONTEXT));
});

test('a held key is down but only just-pressed on the first frame', () => {
  const i = createInput();
  keyDown(i, 'e');
  assert.ok(isDown(i, Action.CONTEXT));
  assert.ok(justPressed(i, Action.CONTEXT));

  endFrame(i);
  assert.ok(isDown(i, Action.CONTEXT), 'still held');
  assert.ok(!justPressed(i, Action.CONTEXT), 'but no longer a fresh press');
});

/**
 * THE test in this file. Browsers fire keydown repeatedly while a key is held.
 * If that produced a fresh press each time, holding E beside a dazed opponent
 * would help them up over and over and double-count 禮 — silently inflating the
 * one column the player is not allowed to see.
 */
test('key repeat while held never produces a second press', () => {
  const i = createInput();
  keyDown(i, 'e');
  assert.ok(justPressed(i, Action.CONTEXT));
  endFrame(i);

  let presses = 0;
  for (let frame = 0; frame < 60; frame += 1) {
    keyDown(i, 'e');                       // the browser's auto-repeat
    if (justPressed(i, Action.CONTEXT)) presses += 1;
    endFrame(i);
  }
  assert.equal(presses, 0, 'holding a key must not re-fire the press edge');
});

test('releasing and pressing again produces a second press', () => {
  const i = createInput();
  keyDown(i, 'e');
  endFrame(i);
  keyUp(i, 'e');
  assert.ok(justReleased(i, Action.CONTEXT));
  assert.ok(!isDown(i, Action.CONTEXT));
  endFrame(i);

  keyDown(i, 'e');
  assert.ok(justPressed(i, Action.CONTEXT), 'a genuine second press must register');
});

test('unmapped keys are ignored without throwing', () => {
  const i = createInput();
  keyDown(i, 'F13');
  keyUp(i, 'F13');
  assert.equal(i.down.size, 0);
});

test('axis returns -1, 0 or 1 and cancels opposing keys', () => {
  const i = createInput();
  assert.equal(axis(i, Action.LEFT, Action.RIGHT), 0);

  keyDown(i, 'ArrowRight');
  assert.equal(axis(i, Action.LEFT, Action.RIGHT), 1);

  keyDown(i, 'ArrowLeft');
  assert.equal(axis(i, Action.LEFT, Action.RIGHT), 0, 'both held cancels');

  keyUp(i, 'ArrowRight');
  assert.equal(axis(i, Action.LEFT, Action.RIGHT), -1);
});

test('endFrame clears both edges but never the held state', () => {
  const i = createInput();
  keyDown(i, 'z');
  endFrame(i);
  assert.equal(i.pressed.size, 0);
  assert.equal(i.released.size, 0);
  assert.ok(isDown(i, Action.LIGHT));
});
