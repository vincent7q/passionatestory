import { WIDTH, HEIGHT, fitCanvas, getContext, clear, drawSorted } from './renderer.js';
import { stepCount } from './utils.js';
import { createFpsTracker, pushFrameTime, drawOverlay } from './debug.js';
import {
  createInput, bindKeyboard, endFrame, isDown, justPressed, axis, Action,
} from './input.js';
import { integrate, canHit } from './physics.js';
import { createCamera, nextCamera } from './camera.js';
import { buildCharacter, getFrame, FRAME_W, FRAME_H } from './assets.js';
import {
  Kind, State, Team, createWorld, spawn, addEntity, despawn, activeEntities, activeCount,
} from './entities/entity.js';
import { createPlayer, updatePlayer, playerAnim } from './entities/player.js';
import { updateEnemy } from './entities/enemy.js';
import { applyDamage, ATTACKS } from './combat.js';

// main.js is the ONLY module that may import shared/, and only absolutely.
// See SPEC.md §2.3.
import { CHARACTERS, CANDIDATES } from '/shared/characters.js';

/**
 * Top-level state machine. See SPEC.md §4.2.
 *
 *   TITLE → CHARACTER_SELECT → CUTSCENE → PLAYING ⇄ PAUSED → STAGE_CLEAR
 *                                            ↓
 *                              NAME_ENTRY → LEADERBOARD  |  GAME_OVER
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
buildCharacter('enemy', { hair: '#2B2B33', skin: '#E8B48E', shirt: '#4A5A6B', accent: '#C9CED6' });

// Real per-section values arrive with the stages in Phase 6.
const STRIP = { yMin: 172, yMax: 250 };
const BOUNDS = { xMin: 0, xMax: 1600 };

const input = bindKeyboard(createInput(), window);
const world = createWorld();

const player = addEntity(world, createPlayer(CHARACTERS.felix, { x: 60, y: 210 }));

function spawnEnemy(x, y) {
  return spawn(world, Kind.ENEMY, {
    charId: 'enemy', team: Team.HOUSE,
    x, y, z: 0, w: 16, depth: 8, h: FRAME_H,
    power: 30, powerMax: 30, facing: -1,
  });
}
for (const [x, y] of [[260, 190], [340, 230], [430, 205]]) spawnEnemy(x, y);

const game = {
  state: States.PLAYING,
  frame: 0,
  steps: 0,
  world,
  camera: createCamera(),
  debug: { visible: false, tracker: createFpsTracker(), stepsThisFrame: 0 },
};

window.addEventListener('keydown', (e) => {
  if (e.key === '`') game.debug.visible = !game.debug.visible;
});

function readIntent() {
  return {
    dx: axis(input, Action.LEFT, Action.RIGHT),
    dy: axis(input, Action.UP, Action.DOWN),
    jump: justPressed(input, Action.JUMP),
    light: justPressed(input, Action.LIGHT),
    heavy: justPressed(input, Action.HEAVY),
    guard: isDown(input, Action.GUARD),
  };
}

/** One resolution pass: whoever is in active frames checks everyone else. */
function resolveHits() {
  const all = activeEntities(world);
  for (const attacker of all) {
    if (!attacker.attacking) continue;
    const data = ATTACKS[attacker.attackType] ?? ATTACKS.light;
    for (const target of all) {
      if (target.team === attacker.team) continue;
      if (attacker.hitThisSwing?.has(target.id)) continue;
      if (!canHit(attacker, target)) continue;

      applyDamage(target, data.damage, {
        fromFacing: attacker.facing,
        knockback: data.knockback,
        knockdown: data.knockdown,
        attacker,
      });
      // One connection per swing, or a three-frame active window would deal
      // damage three times.
      attacker.hitThisSwing ??= new Set();
      attacker.hitThisSwing.add(target.id);
    }
  }
}

function update() {
  updatePlayer(player, readIntent());
  if (!player.attacking) player.hitThisSwing = null;

  for (const e of activeEntities(world)) {
    if (e.kind === Kind.ENEMY) {
      updateEnemy(e, player);
      if (!e.attacking) e.hitThisSwing = null;
    }
    integrate(e, STRIP);
    e.x = Math.min(Math.max(e.x, BOUNDS.xMin), BOUNDS.xMax);
  }

  resolveHits();

  // Placeholder despawn. Phase 4 replaces this with the ten-second window:
  // stars orbit, visibly slow, and pressing E flips DAZED → ALLIED.
  for (const e of activeEntities(world)) {
    if (e.state === State.DAZED) {
      e.dazeTimer = (e.dazeTimer ?? 0) + 1;
      if (e.dazeTimer > 600) despawn(world, e);
    }
  }

  for (const e of activeEntities(world)) {
    const next = e.kind === Kind.PLAYER ? playerAnim(e)
      : e.state === State.DAZED ? 'dazed'
      : e.state === State.STUN ? 'knockdown'
      : e.state === State.ATTACK ? 'light'
      : e.vx !== 0 || e.vy !== 0 ? 'walk'
      : 'idle';
    if (next !== e.anim) {
      e.anim = next;
      e.animFrame = 0;
      e.animTimer = 0;
    }
    e.animTimer += 1;
    if (e.animTimer >= 8) {
      e.animTimer = 0;
      e.animFrame += 1;
    }
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
    c.translate(sx, 0);
    c.scale(-1, 1);
    c.drawImage(frame, -FRAME_W / 2, sy - FRAME_H);
  } else {
    c.drawImage(frame, sx - FRAME_W / 2, sy - FRAME_H);
  }
  c.restore();

  // Stars over a dazed opponent. Phase 4 makes them slow across the window —
  // that deceleration is the only countdown the player ever gets.
  if (e.state === State.DAZED) {
    c.fillStyle = '#FFE066';
    for (let i = 0; i < 3; i += 1) {
      const a = game.frame * 0.06 + (i * Math.PI * 2) / 3;
      c.fillRect(Math.round(sx + Math.cos(a) * 9) - 1,
                 Math.round(sy - FRAME_H - 2 + Math.sin(a) * 3) - 1, 2, 2);
    }
  }
}

function render() {
  clear(ctx, '#181824');

  ctx.fillStyle = '#23233A';
  ctx.fillRect(0, STRIP.yMin - 24, WIDTH, HEIGHT);
  ctx.fillStyle = '#2E2E4A';
  for (let gx = -Math.floor(game.camera.x % 64); gx < WIDTH; gx += 64) {
    ctx.fillRect(gx, STRIP.yMin - 24, 2, HEIGHT);
  }

  drawSorted(ctx, activeEntities(world), game.camera, drawEntity);

  ctx.fillStyle = '#E8E8F0';
  ctx.font = '8px monospace';
  ctx.fillText(`力 ${player.power}/${player.powerMax}`, 8, 14);
  ctx.fillText('arrows · space jump · Z light · X heavy · shift guard · ` debug', 8, HEIGHT - 8);
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
      entityCount: activeCount(world),
      state: game.state,
    });
  }

  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);

export { game };
