import { WIDTH, HEIGHT, fitCanvas, getContext, clear, drawSorted } from './renderer.js';
import { stepCount } from './utils.js';
import { createFpsTracker, pushFrameTime, drawOverlay } from './debug.js';
import { createInput, bindKeyboard, endFrame, isDown, axis, Action } from './input.js';
import { integrate, GROUND_Z } from './physics.js';
import { createCamera, nextCamera } from './camera.js';
import { buildCharacter, getFrame, FRAME_W, FRAME_H } from './assets.js';
import { CHARACTERS, CANDIDATES } from '/shared/characters.js';

/**
 * Top-level state machine. See SPEC.md §4.2.
 *
 *   TITLE → CHARACTER_SELECT → CUTSCENE → PLAYING ⇄ PAUSED → STAGE_CLEAR
 *                                            ↓
 *                              NAME_ENTRY → LEADERBOARD  |  GAME_OVER
 *
 * Each state supplies update() and render(). No state reaches into another's
 * internals.
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

for (const id of CANDIDATES) buildCharacter(id, CHARACTERS[id].palette);

// Walkable depth strip. Real values arrive per section in Phase 6.
const STRIP = { yMin: 170, yMax: 250 };
const BOUNDS = { xMin: 0, xMax: 1600 };

const input = bindKeyboard(createInput(), window);

const player = {
  id: 'player', charId: 'felix',
  x: 60, y: 210, z: 0, vx: 0, vy: 0, vz: 0,
  w: 16, depth: 8, h: FRAME_H, facing: 1,
  anim: 'idle', animFrame: 0, animTimer: 0, attacking: false,
};

const game = {
  state: States.PLAYING,
  frame: 0,
  steps: 0,
  entities: [player],
  camera: createCamera(),
  debug: { visible: false, tracker: createFpsTracker(), stepsThisFrame: 0 },
};

window.addEventListener('keydown', (e) => {
  if (e.key === '`') game.debug.visible = !game.debug.visible;
});

const SPEED_X = 1.6;
const SPEED_Y = 1.1;
const JUMP_VZ = 11;

function update() {
  const dx = axis(input, Action.LEFT, Action.RIGHT);
  const dy = axis(input, Action.UP, Action.DOWN);

  player.vx = dx * SPEED_X;
  player.vy = dy * SPEED_Y;
  if (dx !== 0) player.facing = dx;

  if (isDown(input, Action.JUMP) && player.z <= GROUND_Z) player.vz = JUMP_VZ;
  player.attacking = isDown(input, Action.LIGHT);

  integrate(player, STRIP);
  player.x = Math.min(Math.max(player.x, BOUNDS.xMin), BOUNDS.xMax);

  // Animation selection is deliberately dumb until Phase 3 owns entity state.
  const next = player.attacking ? 'light'
    : player.z > GROUND_Z ? 'jump'
    : dx !== 0 || dy !== 0 ? 'walk'
    : 'idle';
  if (next !== player.anim) {
    player.anim = next;
    player.animFrame = 0;
    player.animTimer = 0;
  }
  player.animTimer += 1;
  if (player.animTimer >= 8) {
    player.animTimer = 0;
    player.animFrame += 1;
  }

  game.camera = nextCamera(game.camera, player, BOUNDS);
  game.steps += 1;
  endFrame(input);
}

function drawEntity(c, e, sx, sy) {
  const frame = getFrame(e.charId, e.anim, e.animFrame);
  if (!frame) return;
  c.save();
  if (e.facing < 0) {
    c.translate(sx + FRAME_W / 2, 0);
    c.scale(-1, 1);
    c.drawImage(frame, -FRAME_W / 2, sy - FRAME_H);
  } else {
    c.drawImage(frame, sx - FRAME_W / 2, sy - FRAME_H);
  }
  c.restore();
}

function render() {
  clear(ctx, '#181824');

  // Placeholder ground so depth movement is legible. Stages arrive in Phase 6.
  ctx.fillStyle = '#23233A';
  ctx.fillRect(0, STRIP.yMin - 20, WIDTH, HEIGHT);
  ctx.fillStyle = '#2E2E4A';
  for (let gx = -Math.floor(game.camera.x % 64); gx < WIDTH; gx += 64) {
    ctx.fillRect(gx, STRIP.yMin - 20, 2, HEIGHT);
  }

  drawSorted(ctx, game.entities, game.camera, drawEntity);

  ctx.fillStyle = '#E8E8F0';
  ctx.font = '8px monospace';
  ctx.fillText('熱血物語：見家長', 8, 14);
  ctx.fillText('arrows move · space jump · Z attack · ` debug', 8, 26);
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

export { game };
