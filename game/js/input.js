/**
 * Keyboard and touch state, with edge detection.
 *
 * The edge detection is the part that matters. Browsers fire keydown
 * repeatedly while a key is held; if that produced a fresh press each time,
 * holding E beside a dazed opponent would help them up over and over and
 * double-count the hidden column. Presses are therefore edges, not levels.
 *
 * See SPEC.md §5.
 */

export const Action = {
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  UP: 'UP',
  DOWN: 'DOWN',
  JUMP: 'JUMP',
  LIGHT: 'LIGHT',
  HEAVY: 'HEAVY',
  SPECIAL: 'SPECIAL',
  GUARD: 'GUARD',
  CONTEXT: 'CONTEXT',   // E — help up, accept, bow, pick up
  ALLY: 'ALLY',
  PAUSE: 'PAUSE',
};

export const KEY_MAP = {
  ArrowLeft: Action.LEFT,
  ArrowRight: Action.RIGHT,
  ArrowUp: Action.UP,
  ArrowDown: Action.DOWN,
  ' ': Action.JUMP,
  z: Action.LIGHT,
  x: Action.HEAVY,
  c: Action.SPECIAL,
  Shift: Action.GUARD,
  e: Action.CONTEXT,
  q: Action.ALLY,
  Enter: Action.PAUSE,
};

/** Single-character keys are matched case-insensitively; named keys are not. */
function toAction(key) {
  if (KEY_MAP[key] !== undefined) return KEY_MAP[key];
  if (typeof key === 'string' && key.length === 1) return KEY_MAP[key.toLowerCase()];
  return undefined;
}

export function createInput() {
  return { down: new Set(), pressed: new Set(), released: new Set() };
}

/**
 * Press an action directly. THE ONLY PLACE A PRESS IS RECORDED.
 *
 * Both the keyboard and the touch pad come through here, so the edge detection
 * that keeps E from firing twice exists once rather than once per input device.
 * A touchscreen fires its own repeats — a finger resting on a button, a
 * pointerdown re-sent after a scroll gesture is cancelled — and a second
 * implementation would have to rediscover that, badly.
 */
export function actionDown(input, action) {
  if (action === undefined) return;
  // Only a transition from up to down is a press. Auto-repeat is not.
  if (!input.down.has(action)) input.pressed.add(action);
  input.down.add(action);
}

export function actionUp(input, action) {
  if (action === undefined) return;
  if (input.down.has(action)) input.released.add(action);
  input.down.delete(action);
}

export function keyDown(input, key) {
  actionDown(input, toAction(key));
}

export function keyUp(input, key) {
  actionUp(input, toAction(key));
}

/** Clear the edges. Call once per frame, after everything has read them. */
export function endFrame(input) {
  input.pressed.clear();
  input.released.clear();
}

export const isDown = (input, action) => input.down.has(action);
export const justPressed = (input, action) => input.pressed.has(action);
export const justReleased = (input, action) => input.released.has(action);

/** -1 / 0 / +1, with opposing keys cancelling rather than one winning. */
export function axis(input, negative, positive) {
  return (isDown(input, positive) ? 1 : 0) - (isDown(input, negative) ? 1 : 0);
}

/** Drop every held action. Used on blur, and when the touch pad is torn down. */
export function releaseAll(input) {
  input.down.clear();
  input.pressed.clear();
  input.released.clear();
  return input;
}

/** Attach to the DOM. Browser-only; everything above is pure and testable. */
export function bindKeyboard(input, target = globalThis) {
  target.addEventListener('keydown', (e) => {
    if (toAction(e.key) !== undefined) e.preventDefault();
    keyDown(input, e.key);
  });
  target.addEventListener('keyup', (e) => keyUp(input, e.key));
  // A lost focus must not leave a key stuck down forever.
  target.addEventListener('blur', () => releaseAll(input));
  return input;
}
