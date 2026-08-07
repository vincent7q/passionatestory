import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  progress, sectionAt, parallaxX, layerOffsets,
  createStageState, currentWave, gateBounds, updateStage, isBossSection,
  RAIN_BLEED_PER_STEP, underCover, applyRain,
  createProp, damageProp, settleStallAward,
} from '../../game/js/stages/stage.js';
import { CITY, ENEMIES, MONEY_DROP, waveSpawns, enemyDef } from '../../game/js/stages/city.js';
import { emptyRun, computeJudgment, JUDGMENT } from '../../shared/scoring.js';
import { Kind, createEntity } from '../../game/js/entities/entity.js';

const hero = (over = {}) => createEntity(Kind.PLAYER, { x: 0, y: 200, power: 100,
  powerMax: 100, ...over });

// ── T42: sections ────────────────────────────────────────────────────────────

test('the four sections match the PRD, in order', () => {
  assert.deepEqual(CITY.sections.map((s) => s.id),
    ['market_row', 'covered_arcade', 'loading_bay', 'fruit_stall']);
});

test('section boundaries are 30 / 60 / 85 percent', () => {
  const [a, b, c, d] = CITY.sections;
  assert.deepEqual([a.from, a.to], [0, 0.3]);
  assert.deepEqual([b.from, b.to], [0.3, 0.6]);
  assert.deepEqual([c.from, c.to], [0.6, 0.85]);
  assert.deepEqual([d.from, d.to], [0.85, 1.0]);
});

test('sections tile the stage with no gaps or overlaps', () => {
  for (let i = 1; i < CITY.sections.length; i += 1) {
    assert.equal(CITY.sections[i].from, CITY.sections[i - 1].to,
      `gap or overlap before ${CITY.sections[i].id}`);
  }
});

test('progress runs 0 to 1 and clamps past the end', () => {
  assert.equal(progress(CITY, 0), 0);
  assert.equal(progress(CITY, CITY.length / 2), 0.5);
  assert.equal(progress(CITY, CITY.length * 3), 1);
});

test('sectionAt resolves each region', () => {
  assert.equal(sectionAt(CITY, 0).id, 'market_row');
  assert.equal(sectionAt(CITY, CITY.length * 0.45).id, 'covered_arcade');
  assert.equal(sectionAt(CITY, CITY.length * 0.7).id, 'loading_bay');
  assert.equal(sectionAt(CITY, CITY.length * 0.95).id, 'fruit_stall');
});

test('a boundary belongs to the section it opens', () => {
  assert.equal(sectionAt(CITY, CITY.length * 0.3).id, 'covered_arcade');
});

test('past the end resolves to the boss section rather than undefined', () => {
  assert.equal(sectionAt(CITY, CITY.length * 99).id, 'fruit_stall');
  assert.equal(sectionAt(CITY, CITY.length * 99).boss, true);
});

// ── T43: parallax ────────────────────────────────────────────────────────────

test('parallax is -camera.x * factor', () => {
  assert.equal(parallaxX({ factor: 0.5 }, 100), -50);
  assert.equal(parallaxX({ factor: 1.0 }, 100), -100);
});

test('the four layers match the PRD, distant to foreground', () => {
  assert.deepEqual(CITY.layers.map((l) => l.factor), [0.2, 0.5, 1.0, 1.2]);
});

/** A foreground layer above 1.0 is what sells the depth. */
test('distant layers drift behind and foreground races ahead', () => {
  const offsets = layerOffsets(CITY, 1000);
  const towers = offsets.find((l) => l.id === 'towers');
  const pavement = offsets.find((l) => l.id === 'pavement');
  const awnings = offsets.find((l) => l.id === 'awnings');

  assert.ok(Math.abs(towers.x) < Math.abs(pavement.x), 'towers lag the world');
  assert.ok(Math.abs(awnings.x) > Math.abs(pavement.x), 'awnings outrun it');
});

// ── T42: wave gating ─────────────────────────────────────────────────────────

/**
 * The camera is pinned until a wave is cleared. Without this the player can
 * outrun every fight — and then the restraint decisions the whole game is built
 * on never arise at all.
 */
test('the gate holds while enemies are alive', () => {
  const state = createStageState(CITY);
  updateStage(CITY, state, 3);
  assert.equal(state.gateOpen, false);

  const bounds = gateBounds(CITY, state, { x: 0 });
  assert.ok(bounds.xMax <= CITY.gateWidth, 'the player cannot run past the fight');
});

test('the gate opens once a wave is cleared', () => {
  const state = createStageState(CITY);
  updateStage(CITY, state, 0);
  assert.equal(state.gateOpen, true);
});

test('clearing a wave advances to the next', () => {
  const state = createStageState(CITY);
  state.spawnedThisWave = [{}, {}];
  updateStage(CITY, state, 0);
  assert.equal(state.waveIndex, 1);
});

test('clearing every wave advances the section', () => {
  const state = createStageState(CITY);
  const waves = CITY.sections[0].waves.length;
  for (let i = 0; i < waves; i += 1) {
    state.spawnedThisWave = [{}];
    updateStage(CITY, state, 0);
  }
  updateStage(CITY, state, 0);
  assert.equal(state.sectionIndex, 1);
  assert.equal(state.waveIndex, 0);
});

test('the machine stops at the boss section rather than running off the end', () => {
  const state = createStageState(CITY);
  state.sectionIndex = CITY.sections.length - 1;
  for (let i = 0; i < 20; i += 1) updateStage(CITY, state, 0);
  assert.equal(state.sectionIndex, CITY.sections.length - 1);
  assert.equal(isBossSection(CITY, state), true);
});

test('gate bounds never invert', () => {
  const state = createStageState(CITY);
  for (const camX of [0, 500, 5000, -100]) {
    const b = gateBounds(CITY, state, { x: camX });
    assert.ok(b.xMax > b.xMin, `inverted at camera ${camX}`);
  }
});

test('currentWave is null once a section is exhausted', () => {
  const state = createStageState(CITY);
  state.waveIndex = 99;
  assert.equal(currentWave(CITY, state), null);
});

// ── T45: enemies ─────────────────────────────────────────────────────────────

test('enemy HP matches the PRD', () => {
  assert.equal(ENEMIES.office_worker.hp, 30);
  assert.equal(ENEMIES.scalper.hp, 35);
  assert.equal(ENEMIES.delivery_rider.hp, 40);
});

test('every enemy has both names and drops money', () => {
  for (const [id, def] of Object.entries(ENEMIES)) {
    assert.ok(def.name.en && def.name.zh, `${id} needs both names`);
    assert.ok(MONEY_DROP[id] > 0, `${id} must drop 錢`);
  }
});

/** Content rule 1: no character is ever rude. They apologise while swinging. */
test('every enemy has polite barks', () => {
  for (const [id, def] of Object.entries(ENEMIES)) {
    assert.ok(def.barks.length > 0, `${id} needs something to say`);
  }
  assert.ok(ENEMIES.office_worker.barks.includes('不好意思'));
});

test('the delivery rider is the fastest and the office worker the slowest', () => {
  assert.ok(ENEMIES.delivery_rider.speed > ENEMIES.scalper.speed);
  assert.ok(ENEMIES.scalper.speed > ENEMIES.office_worker.speed);
});

test('waveSpawns expands counts into concrete spawns', () => {
  const spawns = waveSpawns(CITY.sections[0], 1);
  assert.equal(spawns.length, 3);
  assert.equal(spawns.filter((s) => s.type === 'office_worker').length, 2);
});

test('an out-of-range wave yields nothing rather than throwing', () => {
  assert.deepEqual(waveSpawns(CITY.sections[0], 99), []);
  assert.equal(enemyDef('nobody'), undefined);
});

// ── T46: rain ────────────────────────────────────────────────────────────────

test('rain bleeds one power per second, expressed per fixed step', () => {
  assert.ok(Math.abs(RAIN_BLEED_PER_STEP * 60 - 1) < 1e-9);
});

test('no bleed in a dry section', () => {
  const dry = CITY.sections[0];
  assert.equal(applyRain(dry, hero()), 0);
});

test('bleed in the rain when out of cover', () => {
  const wet = CITY.sections[1];
  const p = hero({ x: 500 });
  assert.ok(applyRain(wet, p, wet.covers) > 0);
  assert.ok(p.power < 100);
});

test('an awning stops the bleed, and nothing says so', () => {
  const wet = CITY.sections[1];
  const p = hero({ x: wet.covers[0].x0 + 10 });
  assert.equal(applyRain(wet, p, wet.covers), 0);
  assert.equal(underCover(wet, p, wet.covers), true);
});

test('a 手帕 stops the bleed anywhere', () => {
  const wet = CITY.sections[1];
  const p = hero({ x: 500, rainProtected: true });
  assert.equal(applyRain(wet, p, wet.covers), 0);
});

test('rain never drives power below zero', () => {
  const wet = CITY.sections[1];
  const p = hero({ x: 500, power: 0.001 });
  for (let i = 0; i < 100; i += 1) applyRain(wet, p, wet.covers);
  assert.equal(p.power, 0);
});

// ── T47: breakable stalls ────────────────────────────────────────────────────

test('a stall breaks when its health runs out', () => {
  const prop = createProp('stall', { x: 100, y: 200 }, 10);
  const state = createStageState(CITY);
  const run = emptyRun();

  assert.equal(damageProp(prop, 4, state, run), false, 'a glancing hit does not destroy it');
  assert.equal(prop.broken, false);
  assert.equal(damageProp(prop, 6, state, run), true);
  assert.equal(prop.broken, true);
  assert.equal(state.propsBroken, 1);
});

test('breaking a stall silently forfeits the intact-row award', () => {
  const run = emptyRun();
  run.judgment.marketStallsIntact = true;
  damageProp(createProp('stall', { x: 0, y: 0 }, 1), 99, createStageState(CITY), run);
  assert.equal(run.judgment.marketStallsIntact, false);
});

test('an already-broken stall cannot be broken twice', () => {
  const prop = createProp('stall', { x: 0, y: 0 }, 5);
  const state = createStageState(CITY);
  damageProp(prop, 99, state);
  damageProp(prop, 99, state);
  assert.equal(state.propsBroken, 1, 'the count must not double');
});

/**
 * The environmental restraint test. There are a lot of stalls and NOTHING tells
 * the player not to smash them — no prompt, no warning, no penalty message.
 */
test('reaching the boss with the row intact is worth +6', () => {
  const run = emptyRun();
  const state = createStageState(CITY);
  assert.equal(settleStallAward(state, run), true);
  assert.equal(computeJudgment(run), JUDGMENT.MARKET_STALLS_INTACT);
});

test('reaching the boss having smashed the row is worth nothing', () => {
  const run = emptyRun();
  const state = createStageState(CITY);
  damageProp(createProp('stall', { x: 0, y: 0 }, 1), 99, state, run);
  assert.equal(settleStallAward(state, run), false);
  assert.equal(computeJudgment(run), 0);
});

test('there are plenty of stalls to be careless with', () => {
  const total = CITY.sections.reduce((n, s) => n + (s.props ?? 0), 0);
  assert.ok(total >= 10, `only ${total} props — the temptation has to be real`);
});
