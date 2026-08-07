import { WIDTH, HEIGHT, fitCanvas, getContext, clear } from './renderer.js';
import { stepCount, STEP_MS } from './utils.js';
import { createFpsTracker, pushFrameTime, drawOverlay } from './debug.js';

/**
 * Top-level state machine. See SPEC.md §4.2.
 *
 *   TITLE → CHARACTER_SELECT → CUTSCENE → PLAYING ⇄ PAUSED → STAGE_CLEAR
 *                                            ↓
 *                              NAME_ENTRY → LEADERBOARD  |  GAME_OVER
 *
 * Each state supplies update(step) and render(ctx). No state reaches into
 * another's internals.
 */
export const States = {
  TITLE: 'TITLE',
  CHARACTER_SELECT: 'CHARACTER_SELECT',
  CUTSCENE: 'CUTSCENE',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  STAGE_CLEAR: 'STAGE_CLEAR',
  NAME_ENTRY: 'NAME_ENTRY',
  LEADERBOARD: 'LEADERBOARD',
  GAME_OVER: 'GAME_OVER',
};

const canvas = document.getElementById('screen');
const ctx = getContext(canvas);

fitCanvas(canvas);
window.addEventListener('resize', () => fitCanvas(canvas));

const game = {
  state: States.TITLE,
  frame: 0,
  steps: 0,
  entities: [],
  debug: { visible: false, tracker: createFpsTracker(), stepsThisFrame: 0 },
};

// Backtick toggles the overlay. Never shown by default.
window.addEventListener('keydown', (e) => {
  if (e.key === '`') game.debug.visible = !game.debug.visible;
});

// T5 replaces this with the real overlay; T22+ replace the placeholder render.
function update() {
  game.steps += 1;
}

function render() {
  clear(ctx, '#101018');
  ctx.fillStyle = '#e8e8f0';
  ctx.font = '8px monospace';
  ctx.fillText('熱血物語：見家長', 8, 16);
  ctx.fillText(`state ${game.state}`, 8, 28);
  ctx.fillText(`steps ${game.steps}`, 8, 40);
}

let carry = 0;
let last = performance.now();

function frame(now) {
  const elapsed = now - last;
  const { steps, remainder } = stepCount(carry, elapsed);
  carry = remainder;
  last = now;

  for (let i = 0; i < steps; i += 1) update();

  pushFrameTime(game.debug.tracker, elapsed);
  game.debug.stepsThisFrame = steps;
  game.frame += 1;
  render();

  if (game.debug.visible) {
    drawOverlay(ctx, {
      tracker: game.debug.tracker,
      steps: game.debug.stepsThisFrame,
      entityCount: game.entities.length,
      state: game.state,
    });
  }

  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);

export { game, STEP_MS, WIDTH, HEIGHT };
