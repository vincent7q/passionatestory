import { WIDTH, HEIGHT, fitCanvas, getContext, clear, drawSorted } from './renderer.js';
import { stepCount, STEP_MS } from './utils.js';
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
import {
  beginDaze, advanceDaze, promptTarget, helpUp, recordStrike, starPositions,
} from './daze.js';
import { createRoster, callAlly, canCallAlly, getActive } from './entities/ally.js';
import { drawHud, drawAward, drawAllyPrompt, drawDamageNumber, msBeforeDinner }
  from './ui/hud.js';

// main.js is the ONLY module that may import shared/, and only absolutely.
// See SPEC.md §2.3.
import { CHARACTERS, CANDIDATES } from '/shared/characters.js';
import { emptyRun, DAZE_WINDOW_MS } from '/shared/scoring.js';

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
  roster: createRoster(),
  run: emptyRun(),
  prompt: null,           // the entity the E prompt is currently offering
  awards: [],             // floating gold +3 pops, deliberately unlabelled
  damageNumbers: [],
  elapsedMs: 0,           // drives the clock, which is never labelled
  level: 1,
  exp: 0,
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

      const wasDazed = target.state === State.DAZED;

      const result = applyDamage(target, data.damage, {
        fromFacing: attacker.facing,
        knockback: data.knockback,
        knockdown: data.knockdown,
        attacker,
      });

      // The heaviest penalty in the game, charged once per connection —
      // never per frame of contact.
      if (attacker.team === Team.PLAYER) recordStrike(game.run, result);

      if (result.damage > 0) {
        game.damageNumbers.push({
          x: target.x, y: target.y, amount: result.damage, life: 40,
          kind: attacker.combo >= 4 ? 'critical' : 'hit',
        });
        if (attacker.team === Team.PLAYER) game.run.power.damageDealt += result.damage;
      }

      // Zero 力 sits them down. Nobody dies; nobody stays down.
      if (result.dazed && !wasDazed) beginDaze(target);

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

  // THE TEN-SECOND WINDOW. Stars orbit and visibly slow; that deceleration is
  // the only countdown the player gets. On expiry they stand, dust themselves
  // off, and leave — which is also what keeps the entity array bounded.
  for (const e of activeEntities(world)) {
    if (e.state !== State.DAZED) continue;
    if (advanceDaze(e, DAZE_WINDOW_MS) === 'expired') despawn(world, e);
  }

  // The prompt appears and never explains itself.
  game.prompt = promptTarget(player, activeEntities(world), DAZE_WINDOW_MS);

  if (justPressed(input, Action.CONTEXT) && game.prompt) {
    const target = game.prompt;
    if (helpUp(player, target, game.roster, game.run, DAZE_WINDOW_MS)) {
      // A bare gold +3 with a seal icon and NO LABEL. Its meaning is not
      // revealed until the evaluation form. See SPEC.md §8.
      game.awards.push({ x: target.x, y: target.y, life: 60 });
    }
  }

  if (justPressed(input, Action.ALLY) && canCallAlly(game.roster)) callAlly(game.roster);

  for (const a of game.awards) a.life -= 1;
  game.awards = game.awards.filter((a) => a.life > 0);
  for (const d of game.damageNumbers) d.life -= 1;
  game.damageNumbers = game.damageNumbers.filter((d) => d.life > 0);

  // The clock. Every player reads it as a rescue timer. It is when dinner is
  // served, and punctuality quietly feeds the column he cannot see.
  game.elapsedMs += STEP_MS;
  game.run.durationMs = game.elapsedMs;
  game.run.judgment.arrivalMsBefore1800 = msBeforeDinner(game.elapsedMs);
  game.run.power.longestCombo = Math.max(game.run.power.longestCombo, player.combo ?? 0);
  game.run.power.powerRemaining = player.power;
  game.run.power.powerMax = player.powerMax;

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

  // Stars over a dazed opponent, orbiting from daze.js so they slow as the
  // window closes. That deceleration is the countdown, and it is the ONLY
  // signal the player ever gets.
  if (e.state === State.DAZED) {
    c.fillStyle = '#FFE066';
    for (const { dx, dy } of starPositions(e)) {
      c.fillRect(Math.round(sx + dx) - 1, Math.round(sy - FRAME_H - 2 + dy) - 1, 2, 2);
    }
  }

  // The context prompt. A bare key cap — it never says what it does, or why
  // you would want to press it.
  if (e === game.prompt) {
    const py = sy - FRAME_H - 12;
    c.fillStyle = '#101018';
    c.fillRect(sx - 5, py - 7, 10, 9);
    c.fillStyle = '#F4F4FA';
    c.font = '8px monospace';
    c.fillText('E', sx - 2, py);
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

  for (const d of game.damageNumbers) {
    drawDamageNumber(ctx, Math.round(d.x - game.camera.x),
      Math.round(d.y - 52 - (40 - d.life) * 0.4), d.amount, d.kind);
  }

  // Restraint awards: a bare gold +3 with a seal dot and NO LABEL. Players will
  // assume it is a minor bonus. It is the entire test. The hidden column's
  // character must not appear on screen before the evaluation form. See
  // SPEC.md §8 — and note that test/game/spoiler.test.js bans that character
  // from every file under game/, comments included, so it cannot leak by a
  // copy-paste into a fillText.
  for (const a of game.awards) {
    drawAward(ctx, Math.round(a.x - game.camera.x),
      Math.round(a.y - 56 - (60 - a.life) * 0.35));
  }

  drawHud(ctx, {
    power: player.power, powerMax: player.powerMax,
    spirit: player.spirit, spiritMax: player.spiritMax,
    money: game.run.money.collected,
    elapsedMs: game.elapsedMs,
    level: game.level, exp: game.exp,
  });

  if (canCallAlly(game.roster)) drawAllyPrompt(ctx, getActive(game.roster), HEIGHT - 4);
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
