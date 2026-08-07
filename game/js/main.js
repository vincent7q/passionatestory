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
import { createRoster, callAlly, canCallAlly, getActive, resetFight } from './entities/ally.js';
import { drawHud, drawAward, drawAllyPrompt, drawDamageNumber, msBeforeDinner }
  from './ui/hud.js';
import {
  createStageState, updateStage, gateBounds, sectionAt, layerOffsets,
  applyRain, createProp, damageProp, settleStallAward, clearStage, bossReady,
} from './stages/stage.js';
import { STAGES, stageNumber, nextStage } from './stages/index.js';
import { applyPond } from './stages/forest.js';
import { applyRange } from './stages/castle.js';
import {
  createFruitShopOwner, resolveFruitShopFight,
  createSecondUncle, refillIfDowned, acceptCup, bowToUncle, uncleBlocksPath, TeaBeat,
  createLinJianguo, advanceBoss, tickSummon, bowAtBoss, forceFeed, Phase, currentMove,
} from './entities/boss.js';
import { resolveSummon } from './entities/ally.js';
import { isAttackable, strikeToddler } from './daze.js';
import {
  startRun, recordDamage, recordMoney, recordCombo, recordPower, tickRun, finalizeRun,
} from './run.js';
import {
  createEvaluation, advanceEvaluation, drawEvaluation, currentBeat, Beat,
} from './ui/evaluation.js';
import {
  createNameEntry, updateNameEntry, drawNameEntry, nameOf,
} from './ui/nameEntry.js';
import { startRunToken, submitRun } from './net.js';

// main.js is the ONLY module that may import shared/, and only absolutely.
// See SPEC.md §2.3.
import { CHARACTERS, CANDIDATES } from '/shared/characters.js';
import { emptyRun, DAZE_WINDOW_MS, computeGrade } from '/shared/scoring.js';

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

const input = bindKeyboard(createInput(), window);
const world = createWorld();

const player = addEntity(world, createPlayer(CHARACTERS.felix, { x: 60, y: 210 }));

function randDepth(strip) {
  return strip.yMin + Math.random() * (strip.yMax - strip.yMin);
}

function spawnEnemy(stage, type, x) {
  const def = stage.enemies[type];
  if (!def) return undefined;
  return spawn(world, Kind.ENEMY, {
    enemyType: type, charId: 'enemy', team: Team.HOUSE,
    x, y: randDepth(stage.strip), z: 0, w: 16, depth: 8, h: FRAME_H,
    power: def.hp, powerMax: def.hp, facing: -1,
    speed: def.speed, money: stage.moneyDrop[type] ?? 0,
  });
}

/**
 * Breakable props. In stage 1 these are market stalls — there are a lot of
 * them and NOTHING tells the player to spare them.
 */
function buildProps(stage) {
  const out = [];
  for (const section of stage.sections) {
    for (let i = 0; i < (section.props ?? 0); i += 1) {
      const from = section.from * stage.length;
      const span = (section.to - section.from) * stage.length;
      out.push(createProp(`${section.id}_${i}`, {
        x: from + 80 + (span - 160) * (i / Math.max(1, section.props - 1)),
        y: stage.strip.yMin - 6,
      }));
    }
  }
  return out;
}

const game = {
  state: States.PLAYING,
  frame: 0,
  steps: 0,
  world,
  camera: createCamera(),
  stage: STAGES[0],
  stageState: createStageState(STAGES[0]),
  props: buildProps(STAGES[0]),
  boss: null,
  roster: createRoster(),
  run: startRun(emptyRun(), { candidate: 'felix', difficulty: 'normal' }),
  evaluation: null,
  nameEntry: null,
  runToken: null,
  submission: null,
  prompt: null,           // the entity the E prompt is currently offering
  awards: [],             // floating gold +3 pops, deliberately unlabelled
  damageNumbers: [],
  gasp: 0,                // frames left of the room's reaction to hitting 小表妹
  lastSummon: null,
  elapsedMs: 0,           // drives the clock, which is never labelled
  level: 1,
  exp: 0,
  debug: { visible: false, tracker: createFpsTracker(), stepsThisFrame: 0 },
};

window.addEventListener('keydown', (e) => {
  if (e.key === '`') game.debug.visible = !game.debug.visible;
});

// Requested at the START of the run. The token carries a server timestamp, and
// the wall clock between issue and submission is what makes a fabricated
// duration impossible. Requesting it at the end would defeat the whole check.
startRunToken().then((token) => { game.runToken = token; });

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

      // 小表妹 cannot be attacked. The swing is refused outright, and the only
      // feedback is an audible gasp from the whole room — the one time the
      // family reacts to anything all evening. Nothing explains it.
      if (!isAttackable(target)) {
        if (attacker.team === Team.PLAYER) {
          strikeToddler(game.run);
          game.gasp = 90;
        }
        attacker.hitThisSwing ??= new Set();
        attacker.hitThisSwing.add(target.id);
        continue;
      }

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
        if (attacker.team === Team.PLAYER) {
          recordDamage(game.run, result.damage);
          recordCombo(game.run, attacker.combo);
        }
      }

      // Zero 力 sits them down. Nobody dies; nobody stays down.
      if (result.dazed && !wasDazed) {
        beginDaze(target);
        // Every coin dropped off a man on the Lin payroll. It was always their
        // money, and it counts in his favour.
        if (target.money) recordMoney(game.run, target.money);
      }

      // One connection per swing, or a three-frame active window would deal
      // damage three times.
      attacker.hitThisSwing ??= new Set();
      attacker.hitThisSwing.add(target.id);
    }
  }
}

function liveOpponents() {
  return activeEntities(world).filter(
    (e) => e.team === Team.HOUSE && e.state !== State.DAZED && e.kind !== Kind.ITEM).length;
}

/** Spawn the current wave once, ahead of the player. */
function spawnCurrentWave() {
  const stage = game.stage;
  const state = game.stageState;
  if (state.spawnedThisWave.length > 0) return;

  const section = stage.sections[state.sectionIndex];
  const spawns = stage.spawnsFor(section, state.waveIndex);
  if (spawns.length === 0) return;

  spawns.forEach((s, i) => {
    const e = spawnEnemy(stage, s.type, player.x + 180 + i * 46);
    if (e) state.spawnedThisWave.push(e.id);
  });
}

/** Create the boss this stage ends on. The three are nothing alike. */
function spawnBossFor(stage) {
  const at = { x: stage.length - 90, y: (stage.strip.yMin + stage.strip.yMax) / 2 };
  if (stage.boss === 'second_uncle') return spawn(world, Kind.BOSS, createSecondUncle(at));
  if (stage.boss === 'lin_jianguo') return spawn(world, Kind.BOSS, createLinJianguo(at));
  return spawn(world, Kind.BOSS, createFruitShopOwner(at));
}

/**
 * 林建國. He fights the whole first phase seated and does not put down his
 * chopsticks. At 40% he stands up from the table for the first time, and the
 * way through from there is to bow.
 *
 * @returns {boolean} whether the fight is over
 */
function updateFinalBoss(boss) {
  const wasActive = boss.attacking;
  advanceBoss(boss);

  // His moves resolve here rather than through the generic hit pass, because
  // several of them are not ordinary attacks at all.
  const move = currentMove(boss);
  if (move && boss.attacking && !wasActive && player.invulnerable <= 0) {
    const inReach = Math.abs(player.x - boss.x) < (move.reach ?? 40);

    if (move.grab && inReach) {
      // 「吃飽了嗎?」 — unblockable. He reads it as a heal. It is not.
      forceFeed(boss, player, game.run);
      game.damageNumbers.push({
        x: player.x, y: player.y, amount: move.restores, life: 40, kind: 'heal',
      });
    } else if (move.screenWide || inReach) {
      const result = applyDamage(player, move.damage, {
        fromFacing: boss.facing,
        // 一句話 must be parried, not blocked; guard-breakers ignore a guard.
        ignoreGuard: move.guardBreaking || move.mustParry,
      });
      if (result.damage > 0) {
        game.damageNumbers.push({
          x: player.x, y: player.y, amount: result.damage, life: 40, kind: 'hit',
        });
      }
    }
  }

  // 召集. Every twenty seconds he calls two relatives — and anyone the
  // candidate helped up refuses to come. This is the payoff for every
  // ten-second decision made across the entire run.
  const available = activeEntities(world).filter(
    (e) => e.team === Team.HOUSE && e.kind === Kind.ENEMY);
  const summon = tickSummon(boss, game.roster, available, resolveSummon);
  if (summon) {
    for (const relative of summon.refused) despawn(world, relative);
    game.lastSummon = summon;
  }

  // E bows. In phase 2 it staggers him for three seconds — the only reliable
  // opening — and it is quietly worth +6.
  if (justPressed(input, Action.CONTEXT) && boss.phase === Phase.STANDING
      && Math.abs(player.x - boss.x) < 60) {
    if (bowAtBoss(boss, game.run).staggered) {
      game.awards.push({ x: boss.x, y: boss.y, life: 60 });
    }
  }

  return boss.phase === Phase.DONE;
}

/**
 * 二叔 BAN cannot be beaten by fighting. Zero him and he pours another cup and
 * stands back up, fully restored. The way past is to bow.
 *
 * E is the only button involved, and it never explains itself: it accepts a
 * cup, and then later it bows.
 */
function updateTeaCeremony(uncle) {
  refillIfDowned(uncle);

  const pressedE = justPressed(input, Action.CONTEXT);
  const nearEnough = Math.abs(player.x - uncle.x) < 46;
  if (!pressedE || !nearEnough) return false;

  if (uncle.tea.beat === TeaBeat.OFFERING) {
    acceptCup(uncle, player, game.run);
    return true;
  }
  if (uncle.tea.beat === TeaBeat.BOW_WINDOW) {
    const r = bowToUncle(uncle);
    if (r.passed) game.awards.push({ x: uncle.x, y: uncle.y, life: 60 });
    return r.passed;
  }
  return false;
}

/**
 * Attacks that land on a market stall. Nothing warns the player, nothing pops
 * when one breaks, and the intact row is quietly worth +6 at the boss.
 */
function resolvePropHits() {
  if (!player.attacking) return;
  const data = ATTACKS[player.attackType] ?? ATTACKS.light;
  for (const prop of game.props) {
    if (prop.broken) continue;
    if (player.hitThisSwing?.has(prop.id)) continue;
    if (!canHit(player, prop)) continue;

    damageProp(prop, data.damage, game.stageState, game.run);
    player.hitThisSwing ??= new Set();
    player.hitThisSwing.add(prop.id);
  }
}

/**
 * Move to the next stage, or — once the last one is cleared — to the form.
 * Stage 3 and 林建國 join this in Phase 10.
 */
function advanceStage() {
  const next = nextStage(game.stage);

  if (next) {
    game.stage = next;
    game.stageState = createStageState(next);
    game.props = buildProps(next);
    game.boss = null;
    resetFight(game.roster);
    player.x = 60;
    player.y = (next.strip.yMin + next.strip.yMax) / 2;
    game.camera = createCamera();
    for (const e of activeEntities(world)) if (e !== player) despawn(world, e);
    return;
  }

  game.evaluation = createEvaluation(computeGrade(game.run), {
    candidateName: CHARACTERS[game.run.candidate].name.zh,
  });
  game.state = States.STAGE_CLEAR;
}

function update() {
  const stage = game.stage;
  const section = sectionAt(stage, player.x);
  const state = game.stageState;

  updatePlayer(player, readIntent());
  if (!player.attacking) player.hitThisSwing = null;

  // Rain. Outside cover 力 bleeds; an awning or a 手帕 stops it, and nothing
  // on screen says so. The koi pond costs a lot, all at once.
  applyRain(section, player, section.covers ?? []);
  applyPond(section, player);
  applyRange(section, player);

  if (game.gasp > 0) game.gasp -= 1;

  for (const e of activeEntities(world)) {
    if (e.kind === Kind.ENEMY) {
      updateEnemy(e, player);
      if (!e.attacking) e.hitThisSwing = null;
    }
    integrate(e, stage.strip);
  }

  resolveHits();
  resolvePropHits();

  spawnCurrentWave();
  updateStage(stage, state, liveOpponents());

  // The camera is pinned to the same gate as the player, so it cannot scroll
  // ahead of a fight the player is not allowed to leave.
  game.bounds = gateBounds(stage, state, game.camera);
  player.x = Math.min(Math.max(player.x, game.bounds.xMin), game.bounds.xMax);

  // The boss arena. She was not told, and she has never met him.
  if (bossReady(stage, state, player.x) && !game.boss) {
    settleStallAward(state, game.run);
    game.boss = spawnBossFor(stage);
  }

  // Two bosses, nothing alike. She fights. He pours tea and cannot be beaten.
  let bossDone = false;
  if (game.boss && !state.bossDefeated) {
    if (game.boss.bossId === 'second_uncle') {
      updateTeaCeremony(game.boss);
      bossDone = !uncleBlocksPath(game.boss);
    } else if (game.boss.bossId === 'lin_jianguo') {
      bossDone = updateFinalBoss(game.boss);
    } else if (game.boss.power <= 0) {
      resolveFruitShopFight(game.boss, game.run);
      bossDone = true;
    }
  }

  if (bossDone) {
    clearStage(stage, state, game.run, stageNumber(stage));
    advanceStage();
  }

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
  tickRun(game.run, msBeforeDinner(game.elapsedMs));
  recordPower(game.run, player.power, player.powerMax);

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

  game.camera = nextCamera(game.camera, player, game.bounds);
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

/**
 * Parallax background, driven entirely by the stage's layer data so all three
 * stages share one code path. layer.x = -camera.x * factor.
 */
function drawLayer(layer, offsetX, strip) {
  if (layer.ground) {
    ctx.fillStyle = layer.colour;
    ctx.fillRect(0, strip.yMin - 26, WIDTH, HEIGHT);
    if (layer.accent) {
      ctx.fillStyle = layer.accent.colour;
      const gap = layer.accent.gap;
      for (let gx = -Math.floor(game.camera.x % gap); gx < WIDTH; gx += gap) {
        ctx.fillRect(gx, strip.yMin - 26, layer.accent.w, HEIGHT);
      }
    }
    return;
  }

  const b = layer.band;
  if (!b) return;

  const tiles = Math.ceil(WIDTH / b.gap) + 2;
  ctx.fillStyle = layer.colour;
  for (let i = -1; i < tiles; i += 1) {
    const x = Math.round((offsetX % b.gap) + i * b.gap);
    ctx.fillRect(x, b.y + (layer.stagger ? (i % 3) * layer.stagger : 0), b.w, b.h);
  }

  if (layer.accent) {
    ctx.fillStyle = layer.accent.colour;
    for (let i = -1; i < tiles; i += 1) {
      const x = Math.round((offsetX % b.gap) + i * b.gap);
      ctx.fillRect(x + layer.accent.dx, b.y + layer.accent.dy, layer.accent.w, layer.accent.h);
    }
  }
}

function renderBackground() {
  const stage = game.stage;
  clear(ctx, stage.palette.sky);

  const offsets = layerOffsets(stage, game.camera.x);
  stage.layers.forEach((layer, i) => {
    if (layer.foreground) return;   // drawn after the entities
    drawLayer(layer, offsets[i].x, stage.strip);
  });
}

function renderProps() {
  for (const prop of game.props) {
    const sx = Math.round(prop.x - game.camera.x);
    if (sx < -40 || sx > WIDTH + 40) continue;
    const sy = Math.round(prop.y);
    if (prop.broken) {
      ctx.fillStyle = '#3A3244';
      ctx.fillRect(sx - 9, sy - 4, 18, 4);
    } else {
      ctx.fillStyle = '#6B4A3A';
      ctx.fillRect(sx - 9, sy - 18, 18, 18);
      ctx.fillStyle = '#C8794A';
      ctx.fillRect(sx - 9, sy - 20, 18, 3);
    }
  }
}

function render() {
  renderBackground();
  renderProps();

  drawSorted(ctx, activeEntities(world), game.camera, drawEntity);

  // Foreground layers above 1.0× — awnings, ferns. They outrun the world and
  // are what actually sell the depth, so they draw over the entities.
  const offsets = layerOffsets(game.stage, game.camera.x);
  game.stage.layers.forEach((layer, i) => {
    if (layer.foreground) drawLayer(layer, offsets[i].x, game.stage.strip);
  });

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

/** The evaluation form. Pacing matters more than layout — see ui/evaluation.js. */
function updateEvaluation() {
  advanceEvaluation(game.evaluation, { skipPressed: justPressed(input, Action.CONTEXT) });

  if (currentBeat(game.evaluation) === Beat.DONE) {
    game.nameEntry = createNameEntry(game.run.name);
    game.state = States.NAME_ENTRY;
  }
  endFrame(input);
}

function updateNameEntryState() {
  updateNameEntry(game.nameEntry, {
    up: justPressed(input, Action.UP),
    down: justPressed(input, Action.DOWN),
    left: justPressed(input, Action.LEFT),
    right: justPressed(input, Action.RIGHT),
    accept: justPressed(input, Action.CONTEXT),
  });

  if (game.nameEntry.confirmed && !game.submission) {
    finalizeRun(game.run, nameOf(game.nameEntry));
    game.submission = { pending: true };
    // Fails soft: a leaderboard that is down must never stop someone
    // finishing a run.
    submitRun(game.runToken, game.run).then((result) => { game.submission = result; });
    game.state = States.LEADERBOARD;
  }
  endFrame(input);
}

function step() {
  switch (game.state) {
    case States.STAGE_CLEAR: return updateEvaluation();
    case States.NAME_ENTRY: return updateNameEntryState();
    case States.LEADERBOARD: return endFrame(input);
    default: return update();
  }
}

let carry = 0;
let last = performance.now();

function frame(now) {
  const elapsed = now - last;
  const { steps, remainder } = stepCount(carry, elapsed);
  carry = remainder;
  last = now;

  for (let i = 0; i < steps; i += 1) step();

  pushFrameTime(game.debug.tracker, elapsed);
  game.debug.stepsThisFrame = steps;
  game.frame += 1;

  if (game.state === States.STAGE_CLEAR) drawEvaluation(ctx, game.evaluation);
  else if (game.state === States.NAME_ENTRY) drawNameEntry(ctx, game.nameEntry, game.frame);
  else if (game.state === States.LEADERBOARD) drawNameEntry(ctx, game.nameEntry, game.frame);
  else render();

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
