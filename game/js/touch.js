/**
 * Touch controls.
 *
 * The pad is DOM, not canvas, and that is deliberate. The canvas is 480×270
 * upscaled by an integer factor, so a button drawn on it would be 2-4× larger
 * or smaller depending on the window — and "at least 60px" is a promise about
 * the player's actual thumb, not about game pixels. DOM elements sized in CSS
 * pixels keep that promise on every screen.
 *
 * Nothing downstream learns that touch exists. Every button feeds `actionDown`
 * / `actionUp` on the same input object the keyboard writes to, so the edge
 * detection that stops E from firing twice is shared rather than reimplemented
 * — which matters more here than for a keyboard, because a touchscreen invents
 * repeats of its own.
 *
 * SPEC.md §5, docs/PRD.md §16 "touch controls playable on a phone".
 */

import { Action, actionDown, actionUp, releaseAll } from './input.js';

/**
 * Apple's HIG says 44pt and Android's says 48dp; this game asks for 60 because
 * it is played with both thumbs on a moving target and a missed guard costs
 * real 力. Nothing may be smaller.
 */
export const MIN_TOUCH_PX = 60;

/**
 * The pad, as data.
 *
 * `area` is which cluster it belongs to; `cell` is a grid position inside that
 * cluster. Layout lives here rather than in CSS so it can be asserted — a
 * button that drifts under 60px, or an action that loses its button entirely,
 * is a test failure rather than something discovered on a phone.
 */
export const PAD = [
  // The d-pad. Depth (UP/DOWN) matters as much as LEFT/RIGHT in a 2.5D
  // beat-'em-up, so all four get equal weight rather than a left/right rocker.
  { id: 'up', action: Action.UP, label: '▲', area: 'dpad', cell: [2, 1], size: 62 },
  { id: 'left', action: Action.LEFT, label: '◀', area: 'dpad', cell: [1, 2], size: 62 },
  { id: 'right', action: Action.RIGHT, label: '▶', area: 'dpad', cell: [3, 2], size: 62 },
  { id: 'down', action: Action.DOWN, label: '▼', area: 'dpad', cell: [2, 3], size: 62 },

  // THE BIGGEST BUTTON ON THE SCREEN is the one that helps someone up. It is
  // the mechanic the whole game is built around and it is pressed under time
  // pressure, beside a body, while the player is deciding whether to bother.
  { id: 'context', action: Action.CONTEXT, label: 'E', area: 'actions', cell: [1, 2], size: 86 },

  { id: 'light', action: Action.LIGHT, label: 'A', area: 'actions', cell: [2, 2], size: 66 },
  { id: 'heavy', action: Action.HEAVY, label: 'B', area: 'actions', cell: [3, 2], size: 66 },
  { id: 'jump', action: Action.JUMP, label: 'C', area: 'actions', cell: [3, 1], size: 66 },

  { id: 'guard', action: Action.GUARD, label: '盾', area: 'actions', cell: [2, 1], size: 60 },
  { id: 'ally', action: Action.ALLY, label: 'Q', area: 'actions', cell: [1, 1], size: 60 },

  { id: 'pause', action: Action.PAUSE, label: '❚❚', area: 'corner', cell: [1, 1], size: 60 },
];

/** Actions with no button. SPECIAL is keyboard-only and nothing requires it. */
export const UNMAPPED = [Action.SPECIAL];

// ── Auto-facing ──────────────────────────────────────────────────────────────

/**
 * Which way to turn before a touch attack.
 *
 * On a keyboard you hold a direction and swing. On glass your left thumb is
 * busy walking and your right thumb is on A, so an attack that fires in the
 * last-held direction misses constantly and reads as the game being broken.
 *
 * Facing the nearest opponent is an aim assist, not an autopilot: it never
 * moves the player, never picks a target to attack, and never fires anything.
 * Pure, and takes plain objects so it can be tested without a world.
 *
 * @returns -1 / +1, or the player's current facing when there is nobody to face.
 */
export function nearestFacing(player, entities = [], { maxRange = 120 } = {}) {
  let best = null;
  let bestDistance = Infinity;

  for (const e of entities) {
    if (e === player || !e || e.dead) continue;
    if (e.team !== undefined && e.team === player.team) continue;
    const dx = e.x - player.x;
    // Depth counts, or he turns to face someone on a line he cannot reach.
    const dy = (e.y ?? 0) - (player.y ?? 0);
    const d = Math.hypot(dx, dy);
    if (d < bestDistance && d <= maxRange) {
      bestDistance = d;
      best = e;
    }
  }

  if (!best) return player.facing ?? 1;
  // Directly on top of him is not a direction; keep what he had.
  if (Math.abs(best.x - player.x) < 1) return player.facing ?? 1;
  return best.x < player.x ? -1 : 1;
}

// ── Binding ──────────────────────────────────────────────────────────────────

/**
 * Whether this device should get a pad.
 *
 * `(pointer: coarse)` asks whether the PRIMARY pointer is a finger, and that is
 * the question — not "does this hardware have a touchscreen at all". A laptop
 * with a touchscreen reports `maxTouchPoints: 10` while its primary pointer is
 * a trackpad, and it must not lose two corners of the display to a gamepad its
 * owner will never use.
 *
 * So matchMedia is authoritative when it exists, and the touch-point count is
 * only a fallback for browsers too old to answer. ORing them together — which
 * is the obvious way to write this — gets the laptop case exactly wrong.
 *
 * This is also the single gate: CSS does no media query of its own, or the two
 * could disagree about a device and the pad would be bound but invisible.
 */
export function wantsTouch(win = globalThis) {
  const mm = win.matchMedia?.('(pointer: coarse)');
  if (mm && typeof mm.matches === 'boolean') return mm.matches;
  return !!(win.navigator?.maxTouchPoints > 0 || 'ontouchstart' in win);
}

/**
 * Build the pad into `root` and wire it to `input`.
 *
 * Uses pointer events so one path covers touch, pen and mouse. The cases that
 * matter and are easy to miss:
 *
 *   - `pointerup` OUTSIDE the button still has to release it, or a thumb that
 *     slides off leaves the player walking left forever. Hence
 *     setPointerCapture, so the button keeps receiving the release.
 *   - `pointercancel` fires when the browser takes the gesture (a scroll, a
 *     system edge swipe). It must release too, for the same reason.
 *   - visibilitychange drops everything: a call arriving mid-fight must not
 *     leave GUARD held down when the player comes back.
 */
export function bindTouch(input, root, { document: doc = globalThis.document } = {}) {
  if (!root || !doc) return { buttons: [], destroy() {} };

  const buttons = [];

  for (const spec of PAD) {
    const el = doc.createElement('button');
    el.className = `pad-btn pad-${spec.area} pad-${spec.id}`;
    el.id = `pad-${spec.id}`;
    el.type = 'button';
    el.textContent = spec.label;
    el.style.gridColumn = String(spec.cell[0]);
    el.style.gridRow = String(spec.cell[1]);
    el.style.width = `${spec.size}px`;
    el.style.height = `${spec.size}px`;
    // Announced to a screen reader as what it does, not as its glyph.
    el.setAttribute('aria-label', spec.action);

    const press = (e) => {
      e.preventDefault?.();
      el.setPointerCapture?.(e.pointerId);
      el.classList.add('is-down');
      actionDown(input, spec.action);
    };
    const release = (e) => {
      e.preventDefault?.();
      el.classList.remove('is-down');
      actionUp(input, spec.action);
    };

    el.addEventListener('pointerdown', press);
    el.addEventListener('pointerup', release);
    el.addEventListener('pointercancel', release);
    // The browser's own click/contextmenu handling would select text and pop
    // a magnifier on a long press. Neither belongs on a gamepad.
    el.addEventListener('contextmenu', (e) => e.preventDefault?.());

    (root.querySelector?.(`.pad-area-${spec.area}`) ?? root).appendChild(el);
    buttons.push({ spec, el });
  }

  const dropAll = () => {
    for (const b of buttons) b.el.classList.remove('is-down');
    releaseAll(input);
  };
  doc.addEventListener?.('visibilitychange', () => { if (doc.hidden) dropAll(); });

  return {
    buttons,
    destroy() {
      dropAll();
      for (const b of buttons) b.el.remove?.();
    },
  };
}
