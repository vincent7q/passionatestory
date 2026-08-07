import { test } from 'node:test';
import assert from 'node:assert/strict';
import { STAGES, stageNumber, nextStage, stageById, totalMoneyAvailable }
  from '../../game/js/stages/index.js';
import { CITY } from '../../game/js/stages/city.js';
import { FOREST } from '../../game/js/stages/forest.js';
import { createStageState, sectionAt, layerOffsets } from '../../game/js/stages/stage.js';

/**
 * main.js drives every stage through ONE code path. These assert the shape that
 * makes that possible — if stage 3 forgets any of it, the game breaks only when
 * you actually reach the castle, twenty minutes into a playthrough.
 */

test('the stages are in narrative order', () => {
  assert.equal(STAGES[0], CITY);
  assert.equal(STAGES[1], FOREST);
  assert.equal(stageNumber(CITY), 1);
  assert.equal(stageNumber(FOREST), 2);
});

test('stages chain and the last one ends the run', () => {
  assert.equal(nextStage(CITY), FOREST);
  assert.equal(nextStage(STAGES.at(-1)), null, 'the last stage leads to the form');
});

test('stages are findable by id', () => {
  assert.equal(stageById('city'), CITY);
  assert.equal(stageById('nowhere'), null);
});

test('every stage carries the fields main.js reads', () => {
  for (const stage of STAGES) {
    assert.ok(stage.id, 'id');
    assert.ok(stage.name.en && stage.name.zh, `${stage.id}: both names`);
    assert.ok(stage.length > 0, `${stage.id}: length`);
    assert.ok(stage.gateWidth > 0, `${stage.id}: gateWidth`);
    assert.ok(stage.strip.yMax > stage.strip.yMin, `${stage.id}: walkable strip`);
    assert.ok(stage.palette.sky, `${stage.id}: a sky colour`);
    assert.ok(stage.boss, `${stage.id}: a boss`);
    assert.ok(stage.moneyAvailable > 0, `${stage.id}: money on offer`);
    assert.equal(typeof stage.spawnsFor, 'function', `${stage.id}: spawnsFor`);
    assert.ok(stage.enemies && Object.keys(stage.enemies).length, `${stage.id}: enemies`);
    assert.ok(stage.moneyDrop, `${stage.id}: money drops`);
  }
});

test('every enemy in a stage roster has a money drop entry', () => {
  for (const stage of STAGES) {
    for (const id of Object.keys(stage.enemies)) {
      assert.notEqual(stage.moneyDrop[id], undefined,
        `${stage.id}/${id} has no money drop — undefined would poison the counter`);
    }
  }
});

test('every stage has exactly one boss section, and it is last', () => {
  for (const stage of STAGES) {
    const bosses = stage.sections.filter((s) => s.boss);
    assert.equal(bosses.length, 1, `${stage.id}: exactly one boss section`);
    assert.equal(stage.sections.at(-1).boss, true, `${stage.id}: the boss is last`);
  }
});

test('every stage tiles 0 to 1 with no gaps', () => {
  for (const stage of STAGES) {
    assert.equal(stage.sections[0].from, 0, `${stage.id}: starts at 0`);
    assert.equal(stage.sections.at(-1).to, 1, `${stage.id}: ends at 1`);
    for (let i = 1; i < stage.sections.length; i += 1) {
      assert.equal(stage.sections[i].from, stage.sections[i - 1].to,
        `${stage.id}: gap before ${stage.sections[i].id}`);
    }
  }
});

/**
 * The renderer is generic across stages, so every layer must carry its own draw
 * data. A layer missing `band` simply does not draw — silently.
 */
test('every layer carries the draw data the renderer needs', () => {
  for (const stage of STAGES) {
    for (const layer of stage.layers) {
      assert.ok(layer.id, `${stage.id}: layer needs an id`);
      assert.ok(layer.factor > 0, `${stage.id}/${layer.id}: factor`);
      assert.match(layer.colour, /^#[0-9A-Fa-f]{6}$/, `${stage.id}/${layer.id}: colour`);
      if (!layer.ground) {
        assert.ok(layer.band, `${stage.id}/${layer.id}: needs a band or it draws nothing`);
      }
      if (layer.band) {
        for (const k of ['y', 'h', 'w', 'gap']) {
          assert.equal(typeof layer.band[k], 'number', `${stage.id}/${layer.id}: band.${k}`);
        }
        assert.ok(layer.band.gap > 0, `${stage.id}/${layer.id}: a zero gap loops forever`);
      }
    }
  }
});

test('every stage has exactly one ground layer and at least one foreground', () => {
  for (const stage of STAGES) {
    assert.equal(stage.layers.filter((l) => l.ground).length, 1, `${stage.id}: one ground plane`);
    assert.ok(stage.layers.some((l) => l.foreground), `${stage.id}: needs a foreground layer`);
  }
});

test('layer factors ascend from distant to foreground', () => {
  for (const stage of STAGES) {
    const factors = stage.layers.map((l) => l.factor);
    assert.deepEqual(factors, [...factors].sort((a, b) => a - b),
      `${stage.id}: layers must be ordered back to front`);
  }
});

test('every stage can be stepped through generically', () => {
  for (const stage of STAGES) {
    const state = createStageState(stage);
    assert.equal(state.stageId, stage.id);
    assert.ok(sectionAt(stage, 0));
    assert.ok(sectionAt(stage, stage.length * 0.99).boss);
    assert.equal(layerOffsets(stage, 500).length, stage.layers.length);
  }
});

test('the money on offer is the sum of the stages', () => {
  assert.equal(totalMoneyAvailable(),
    STAGES.reduce((n, s) => n + s.moneyAvailable, 0));
});
