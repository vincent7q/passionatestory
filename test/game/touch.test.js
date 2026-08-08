import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  PAD, MIN_TOUCH_PX, UNMAPPED, nearestFacing, bindTouch, wantsTouch,
} from '../../game/js/touch.js';
import {
  Action, createInput, isDown, justPressed, actionDown, actionUp, releaseAll,
} from '../../game/js/input.js';

/**
 * T85. docs/PRD.md §16 asks for "touch controls playable on a phone", and the
 * part of that no test can check is whether it feels good. What CAN be checked
 * is the part that silently rots: a button drifting under the size floor, an
 * action losing its button in a layout edit, two buttons landing in the same
 * grid cell, or a released finger leaving the player walking forever.
 */

// ── The layout, as data ──────────────────────────────────────────────────────

test('every button clears the 60px floor', () => {
  for (const b of PAD) {
    assert.ok(b.size >= MIN_TOUCH_PX,
      `${b.id} is ${b.size}px — under the ${MIN_TOUCH_PX}px floor a thumb misses it`);
  }
});

test('every action a player needs has a button', () => {
  const mapped = new Set(PAD.map((b) => b.action));
  for (const action of Object.values(Action)) {
    if (UNMAPPED.includes(action)) continue;
    assert.ok(mapped.has(action), `${action} has no touch button — unplayable on a phone`);
  }
});

test('nothing is claimed as unmapped and then mapped anyway', () => {
  const mapped = new Set(PAD.map((b) => b.action));
  for (const action of UNMAPPED) {
    assert.ok(!mapped.has(action), `${action} is listed UNMAPPED but has a button`);
  }
  for (const action of UNMAPPED) {
    assert.ok(Object.values(Action).includes(action), `${action} is not a real action`);
  }
});

test('no two buttons occupy the same cell in the same cluster', () => {
  const seen = new Set();
  for (const b of PAD) {
    const key = `${b.area}:${b.cell.join(',')}`;
    assert.ok(!seen.has(key), `${b.id} overlaps another button at ${key}`);
    seen.add(key);
  }
});

test('button ids and actions are each unique', () => {
  assert.equal(new Set(PAD.map((b) => b.id)).size, PAD.length, 'duplicate id');
  assert.equal(new Set(PAD.map((b) => b.action)).size, PAD.length, 'two buttons, one action');
});

test('all four depth directions are present — this is a 2.5D game', () => {
  const dpad = PAD.filter((b) => b.area === 'dpad').map((b) => b.action);
  for (const a of [Action.UP, Action.DOWN, Action.LEFT, Action.RIGHT]) {
    assert.ok(dpad.includes(a), `${a} missing from the d-pad; depth is half the movement`);
  }
});

/**
 * The button that helps someone up is the mechanic the whole game is built
 * around, and it is pressed under time pressure beside a body. If it is ever
 * merely the same size as attack, someone has lost the plot.
 */
test('the help-up button is the largest on the pad', () => {
  const context = PAD.find((b) => b.action === Action.CONTEXT);
  const others = PAD.filter((b) => b.action !== Action.CONTEXT);
  assert.ok(context, 'there is no help-up button at all');
  for (const b of others) {
    assert.ok(context.size > b.size,
      `${b.id} (${b.size}px) is not smaller than help-up (${context.size}px)`);
  }
});

// ── Auto-facing ──────────────────────────────────────────────────────────────

const hero = (over = {}) => ({ x: 100, y: 200, facing: 1, team: 'PLAYER', ...over });
const foe = (over = {}) => ({ x: 140, y: 200, team: 'HOUSE', ...over });

test('he turns toward the nearest opponent', () => {
  const p = hero();
  assert.equal(nearestFacing(p, [foe({ x: 60 })]), -1);
  assert.equal(nearestFacing(p, [foe({ x: 160 })]), 1);
});

test('the nearest one wins, not the first in the array', () => {
  const p = hero();
  assert.equal(nearestFacing(p, [foe({ x: 180 }), foe({ x: 90 })]), -1);
});

test('depth counts, so he does not turn to face an unreachable line', () => {
  const p = hero({ x: 100, y: 200 });
  // Slightly further in x, but on his own depth line — and therefore closer.
  const near = foe({ x: 130, y: 200 });
  const far = foe({ x: 80, y: 120 });
  assert.equal(nearestFacing(p, [far, near]), 1);
});

test('allies are never turned toward — they are not targets', () => {
  const p = hero();
  assert.equal(nearestFacing(p, [{ x: 20, y: 200, team: 'PLAYER' }]), 1,
    'he turned to face his own ally');
});

test('nobody in range leaves his facing exactly as it was', () => {
  assert.equal(nearestFacing(hero({ facing: -1 }), []), -1);
  assert.equal(nearestFacing(hero({ facing: 1 }), []), 1);
  // Out of range is the same as absent.
  assert.equal(nearestFacing(hero({ facing: -1 }), [foe({ x: 9999 })]), -1);
});

test('someone standing exactly on him is not a direction', () => {
  const p = hero({ facing: -1 });
  assert.equal(nearestFacing(p, [foe({ x: 100, y: 200 })]), -1);
});

test('the dead and the missing are skipped rather than thrown on', () => {
  const p = hero();
  assert.doesNotThrow(() => nearestFacing(p, [null, undefined, foe({ x: 60, dead: true })]));
  assert.equal(nearestFacing(p, [null, foe({ x: 60, dead: true })]), 1, 'faced a corpse');
});

test('auto-facing never moves him and never attacks', () => {
  const p = hero();
  const before = { ...p };
  nearestFacing(p, [foe({ x: 60 })]);
  assert.deepEqual({ ...p }, before, 'aim assist is not an autopilot');
});

// ── Binding ──────────────────────────────────────────────────────────────────

/** A DOM stub that records listeners, so the wiring can be driven in Node. */
function fakeDoc() {
  const make = (tag) => {
    const el = {
      tag,
      children: [],
      style: {},
      classList: {
        set: new Set(),
        add(c) { this.set.add(c); },
        remove(c) { this.set.delete(c); },
        contains(c) { return this.set.has(c); },
      },
      listeners: new Map(),
      addEventListener(t, fn) { this.listeners.set(t, [...(this.listeners.get(t) ?? []), fn]); },
      appendChild(c) { this.children.push(c); return c; },
      setAttribute() {},
      remove() {},
      querySelector: () => null,
      fire(t, e = {}) { for (const fn of this.listeners.get(t) ?? []) fn(e); },
    };
    return el;
  };
  const doc = {
    hidden: false,
    created: [],
    listeners: new Map(),
    createElement(tag) { const el = make(tag); doc.created.push(el); return el; },
    addEventListener(t, fn) { doc.listeners.set(t, [...(doc.listeners.get(t) ?? []), fn]); },
    fire(t) { for (const fn of doc.listeners.get(t) ?? []) fn({}); },
  };
  return { doc, make };
}

function pad() {
  const { doc, make } = fakeDoc();
  const input = createInput();
  const root = make('div');
  const handle = bindTouch(input, root, { document: doc });
  const byAction = (a) => handle.buttons.find((b) => b.spec.action === a).el;
  return { input, handle, doc, byAction };
}

test('a button is built for every entry in the pad table', () => {
  const { handle } = pad();
  assert.equal(handle.buttons.length, PAD.length);
});

test('pressing a button presses its action exactly once', () => {
  const { input, byAction } = pad();
  const el = byAction(Action.LIGHT);
  el.fire('pointerdown', {});
  assert.ok(justPressed(input, Action.LIGHT));
  assert.ok(isDown(input, Action.LIGHT));
});

/**
 * The shared-edge-detection payoff. A finger resting on the help-up button, or
 * a pointerdown re-sent by the browser, must not help the same opponent up
 * twice and inflate the hidden column.
 */
test('a repeated pointerdown is not a second press', () => {
  const { input, byAction } = pad();
  const el = byAction(Action.CONTEXT);

  el.fire('pointerdown', {});
  assert.ok(justPressed(input, Action.CONTEXT), 'the first press should land');

  input.pressed.clear();               // exactly what endFrame does each frame
  el.fire('pointerdown', {});          // the finger has not lifted
  assert.ok(!justPressed(input, Action.CONTEXT), 'a held finger fired a second help-up');

  // Lifting and pressing again is a real second press and must still work.
  el.fire('pointerup', {});
  el.fire('pointerdown', {});
  assert.ok(justPressed(input, Action.CONTEXT), 'a genuine second press was swallowed');
});

test('releasing clears the action', () => {
  const { input, byAction } = pad();
  const el = byAction(Action.RIGHT);
  el.fire('pointerdown', {});
  el.fire('pointerup', {});
  assert.ok(!isDown(input, Action.RIGHT));
});

/**
 * A thumb sliding off a button fires pointercancel, not pointerup. Without
 * this the player walks right forever and it looks like the game has hung.
 */
test('a cancelled gesture releases, so nobody walks off forever', () => {
  const { input, byAction } = pad();
  const el = byAction(Action.RIGHT);
  el.fire('pointerdown', {});
  el.fire('pointercancel', {});
  assert.ok(!isDown(input, Action.RIGHT), 'a slid-off thumb left him walking');
});

test('backgrounding the tab drops everything held', () => {
  const { input, doc, byAction } = pad();
  byAction(Action.GUARD).fire('pointerdown', {});
  byAction(Action.LEFT).fire('pointerdown', {});
  doc.hidden = true;
  doc.fire('visibilitychange');
  assert.equal(input.down.size, 0, 'a call mid-fight left buttons stuck down');
});

test('a press marks the button, a release unmarks it', () => {
  const { byAction } = pad();
  const el = byAction(Action.HEAVY);
  el.fire('pointerdown', {});
  assert.ok(el.classList.contains('is-down'));
  el.fire('pointerup', {});
  assert.ok(!el.classList.contains('is-down'));
});

test('the browser default is suppressed, or a long press pops a magnifier', () => {
  const { byAction } = pad();
  let prevented = 0;
  byAction(Action.LIGHT).fire('pointerdown', { preventDefault: () => { prevented += 1; } });
  assert.equal(prevented, 1);
});

test('binding without a root is a no-op rather than a crash', () => {
  const input = createInput();
  assert.doesNotThrow(() => bindTouch(input, null, { document: null }));
});

test('destroy releases everything it was holding', () => {
  const { input, handle, byAction } = pad();
  byAction(Action.LEFT).fire('pointerdown', {});
  handle.destroy();
  assert.equal(input.down.size, 0);
});

test('a coarse primary pointer gets the pad; a fine one does not', () => {
  assert.equal(wantsTouch({ matchMedia: () => ({ matches: true }) }), true);
  assert.equal(wantsTouch({ matchMedia: () => ({ matches: false }), navigator: {} }), false);
});

/**
 * The case that was nearly shipped wrong. A laptop with a touchscreen reports
 * ten touch points while its primary pointer is a trackpad — ORing the two
 * signals together, which is the obvious way to write this, hands it a gamepad
 * over two corners of a display its owner drives with a mouse.
 */
test('a touchscreen laptop does not get a pad', () => {
  const laptop = { matchMedia: () => ({ matches: false }), navigator: { maxTouchPoints: 10 } };
  assert.equal(wantsTouch(laptop), false, 'a trackpad user lost two corners of the screen');
});

test('a browser too old to answer falls back to the touch-point count', () => {
  assert.equal(wantsTouch({ navigator: { maxTouchPoints: 5 } }), true);
  assert.equal(wantsTouch({ navigator: { maxTouchPoints: 0 } }), false);
});

// ── The shared edge path ─────────────────────────────────────────────────────

test('keyboard and touch write to one input, so E cannot double-fire', () => {
  const input = createInput();
  actionDown(input, Action.CONTEXT);           // a thumb
  input.pressed.clear();                       // endFrame
  actionDown(input, Action.CONTEXT);           // the keyboard, still held
  assert.ok(!justPressed(input, Action.CONTEXT));
  actionUp(input, Action.CONTEXT);
  actionDown(input, Action.CONTEXT);
  assert.ok(justPressed(input, Action.CONTEXT), 'a genuine second press was swallowed');
});
