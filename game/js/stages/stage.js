/**
 * Stage structure shared by all three stages: auto-advancing sections,
 * scripted spawn waves, mid-section hazards, a boss arena.
 *
 * Everything here is pure — sections, gating and parallax are computed from a
 * snapshot and returned, never drawn. Stage DATA lives in city.js / forest.js /
 * castle.js; this file is the machinery.
 *
 * No drawing in this file or any stage file. assets.js owns that seam
 * (SPEC.md §2.2), and test/game/assets.test.js fails the build if a stage draws.
 */

import { clamp01 } from '../utils.js';

/** Where the player is along the stage, 0..1. */
export function progress(stage, x) {
  return clamp01(x / stage.length);
}

/** The section containing a world x, or the last one if past the end. */
export function sectionAt(stage, x) {
  const p = progress(stage, x);
  for (const s of stage.sections) {
    if (p >= s.from && p < s.to) return s;
  }
  return stage.sections[stage.sections.length - 1];
}

/** Parallax offset. layer.x = -camera.x * factor. */
export function parallaxX(layer, cameraX) {
  return -cameraX * layer.factor;
}

/**
 * A layer with factor 1.0 tracks the world exactly; below that it drifts
 * behind (distance), above it races ahead (foreground). Awnings at 1.2× are
 * what sell the depth.
 */
export function layerOffsets(stage, cameraX) {
  return stage.layers.map((l) => ({ id: l.id, factor: l.factor, x: parallaxX(l, cameraX) }));
}

// ── Wave gating ──────────────────────────────────────────────────────────────

export function createStageState(stage) {
  return {
    stageId: stage.id,
    sectionIndex: 0,
    waveIndex: 0,
    spawnedThisWave: [],
    gateOpen: false,
    bossDefeated: false,
    cleared: false,
    propsBroken: 0,
  };
}

/** The wave the player is currently expected to clear, or null. */
export function currentWave(stage, state) {
  return stage.sections[state.sectionIndex]?.waves?.[state.waveIndex] ?? null;
}

/**
 * The camera is pinned until the wave is cleared. Without this the player can
 * outrun every fight, which would make the whole run trivial and the restraint
 * decisions never arise.
 */
export function gateBounds(stage, state, camera) {
  const section = stage.sections[state.sectionIndex];
  if (!section) return { xMin: 0, xMax: stage.length };

  const xMin = Math.max(0, section.from * stage.length);
  const xMax = state.gateOpen
    ? section.to * stage.length
    : Math.min(section.to * stage.length, camera.x + stage.gateWidth);

  return { xMin, xMax: Math.max(xMin + 1, xMax) };
}

/** Advance the wave/section machine one step. Returns the mutated state. */
export function updateStage(stage, state, liveEnemyCount) {
  const wave = currentWave(stage, state);

  if (wave && liveEnemyCount > 0) {
    state.gateOpen = false;
    return state;
  }

  state.gateOpen = true;

  if (wave && liveEnemyCount === 0 && state.spawnedThisWave.length > 0) {
    state.waveIndex += 1;
    state.spawnedThisWave = [];
  }

  const section = stage.sections[state.sectionIndex];
  if (section && state.waveIndex >= (section.waves?.length ?? 0)
      && state.sectionIndex < stage.sections.length - 1) {
    state.sectionIndex += 1;
    state.waveIndex = 0;
  }

  return state;
}

export function isBossSection(stage, state) {
  return stage.sections[state.sectionIndex]?.boss === true;
}

// ── Hazards ──────────────────────────────────────────────────────────────────

/**
 * Rain. Outside cover, 力 bleeds. A 手帕 pickup or an awning stops it.
 *
 * Expressed per fixed step so nothing scales by a variable dt: 1 力 per second
 * is 1/60 per step.
 */
export const RAIN_BLEED_PER_STEP = 1 / 60;

export function underCover(section, entity, covers = []) {
  if (!section?.rain) return true;
  if (entity.rainProtected) return true;   // 手帕
  return covers.some((c) => entity.x >= c.x0 && entity.x <= c.x1);
}

export function applyRain(section, entity, covers = []) {
  if (underCover(section, entity, covers)) return 0;
  const before = entity.power;
  entity.power = Math.max(0, entity.power - RAIN_BLEED_PER_STEP);
  return before - entity.power;
}

// ── Breakable props ──────────────────────────────────────────────────────────

export function createProp(id, at, hp = 10) {
  return { id, x: at.x, y: at.y, w: at.w ?? 18, depth: at.depth ?? 10, h: at.h ?? 20,
           hp, maxHp: hp, broken: false, breakable: true };
}

/**
 * Break a market stall.
 *
 * NOTHING TELLS THE PLAYER NOT TO SMASH THESE. Reaching the boss with the row
 * intact is worth +6 into the column he cannot see; there is no warning, no
 * prompt, and no penalty message when he wrecks one.
 */
export function damageProp(prop, amount, state, run) {
  if (!prop.breakable || prop.broken) return false;
  prop.hp -= amount;
  if (prop.hp > 0) return false;

  prop.broken = true;
  if (state) state.propsBroken += 1;
  if (run) run.judgment.marketStallsIntact = false;
  return true;
}

/** Called on reaching the boss: award the intact row if nothing was smashed. */
export function settleStallAward(state, run) {
  if (!run) return false;
  const intact = state.propsBroken === 0;
  run.judgment.marketStallsIntact = intact;
  return intact;
}

// ── Stage clear ──────────────────────────────────────────────────────────────

/**
 * Close out a stage. Records how far he got and totals the money available so
 * far, so the money criterion is a fraction of what was actually on offer.
 */
export function clearStage(stage, state, run, stageNumber) {
  state.bossDefeated = true;
  state.cleared = true;

  if (run) {
    run.stageReached = Math.max(run.stageReached, stageNumber);
    run.completed = stageNumber >= 3;
    run.money.totalAvailable += stage.moneyAvailable ?? 0;
  }
  return state;
}

/** Is the player standing in the boss arena with the waves behind them? */
export function bossReady(stage, state, x) {
  return isBossSection(stage, state)
    && progress(stage, x) >= stage.sections[stage.sections.length - 1].from
    && !state.bossDefeated;
}
