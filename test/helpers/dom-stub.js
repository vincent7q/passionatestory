/**
 * Just enough browser to boot game/js/main.js under Node.
 *
 * WHY THIS EXISTS: main.js is the only module in the project no test could
 * reach, because it touches `document` at import time. It is also the only file
 * that has ever shipped a runtime bug here — twice (a missing STEP_MS import in
 * Phase 5, a deleted BOUNDS constant in Phase 6). Both were valid syntax, both
 * passed `node --check`, and both would only have surfaced in a browser.
 *
 * undefined-refs.test.js closes that by static analysis. This closes it by
 * actually running the thing.
 *
 * It is a STUB, not a browser. Nothing here draws anything, and nothing asserts
 * about pixels — SPEC.md §12 is clear that rendering is verified by eye. What
 * it proves is narrower and worth a lot: main.js loads, its module graph
 * resolves, every name it references exists, and the loop steps without
 * throwing.
 */

/** A 2D context that accepts every call and records none of them. */
function stubContext(canvas) {
  const ctx = {
    canvas,
    measureText: (text) => ({ width: String(text).length * 6 }),
    createLinearGradient: () => ({ addColorStop() {} }),
    createPattern: () => null,
    getImageData: () => ({ data: new Uint8ClampedArray(4) }),
  };
  // Any other context method is a no-op; any property is a plain value. A Proxy
  // rather than a list so a new drawing call never fails the boot test for a
  // reason that has nothing to do with the boot.
  return new Proxy(ctx, {
    get(target, key) {
      if (key in target) return target[key];
      target[key] = () => {};
      return target[key];
    },
    set(target, key, value) {
      target[key] = value;
      return true;
    },
  });
}

function stubCanvas(width = 480, height = 270) {
  const canvas = {
    width, height,
    style: {},
    getContext: () => canvas._ctx,
    getBoundingClientRect: () => ({ left: 0, top: 0, width, height }),
    addEventListener() {},
  };
  canvas._ctx = stubContext(canvas);
  return canvas;
}

/**
 * Install the globals main.js needs. Returns a handle for driving the loop.
 *
 * requestAnimationFrame deliberately does NOT run the callback — it stores it,
 * so a test can step the loop one frame at a time instead of recursing forever.
 */
export function installDom({ now = 0 } = {}) {
  const canvas = stubCanvas();
  const listeners = new Map();
  const handle = {
    canvas,
    frames: 0,
    now,
    pending: null,
    /** Fire the keyboard handlers main.js bound via bindKeyboard. */
    key(type, code) {
      for (const fn of listeners.get(type) ?? []) fn({ code, preventDefault() {} });
    },
  };

  globalThis.document = {
    getElementById: () => canvas,
    createElement: (tag) => (tag === 'canvas' ? stubCanvas() : { style: {} }),
    addEventListener(type, fn) {
      listeners.set(type, [...(listeners.get(type) ?? []), fn]);
    },
    body: { appendChild() {} },
  };

  globalThis.window = {
    innerWidth: 1920,
    innerHeight: 1080,
    devicePixelRatio: 1,
    addEventListener(type, fn) {
      listeners.set(type, [...(listeners.get(type) ?? []), fn]);
    },
    removeEventListener() {},
  };

  globalThis.performance = { now: () => handle.now };
  globalThis.requestAnimationFrame = (fn) => { handle.pending = fn; return ++handle.frames; };
  globalThis.cancelAnimationFrame = () => {};

  // The leaderboard must fail soft: a run has to finish even with the API down.
  // Returning a rejection here also proves that path is not load-bearing.
  globalThis.fetch = () => Promise.reject(new Error('offline in tests'));

  return handle;
}

/** Advance the real requestAnimationFrame loop by `frames` at ~60fps. */
export function stepFrames(handle, frames, msPerFrame = 1000 / 60) {
  for (let i = 0; i < frames; i += 1) {
    const fn = handle.pending;
    if (!fn) throw new Error('the loop stopped asking for frames');
    handle.pending = null;
    handle.now += msPerFrame;
    fn(handle.now);
  }
}

export function uninstallDom() {
  for (const k of ['document', 'window', 'performance', 'requestAnimationFrame',
    'cancelAnimationFrame', 'fetch']) {
    delete globalThis[k];
  }
}
