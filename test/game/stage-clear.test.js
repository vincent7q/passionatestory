import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createStageState, clearStage, bossReady } from '../../game/js/stages/stage.js';
import { CITY } from '../../game/js/stages/city.js';
import { emptyRun, computeMoney, MONEY_MAX } from '../../shared/scoring.js';
import { validateRun, MIN_RUN_MS } from '../../shared/validation.js';

test('clearing stage 1 records the stage reached but not completion', () => {
  const run = emptyRun();
  const state = createStageState(CITY);
  clearStage(CITY, state, run, 1);

  assert.equal(state.cleared, true);
  assert.equal(state.bossDefeated, true);
  assert.equal(run.stageReached, 1);
  assert.equal(run.completed, false, 'only reaching stage 3 completes the run');
});

test('only clearing stage 3 marks the run complete', () => {
  const run = emptyRun();
  clearStage(CITY, createStageState(CITY), run, 3);
  assert.equal(run.completed, true);
  assert.equal(run.stageReached, 3);
});

test('stage reached never goes backwards', () => {
  const run = emptyRun();
  run.stageReached = 2;
  clearStage(CITY, createStageState(CITY), run, 1);
  assert.equal(run.stageReached, 2);
});

/**
 * The money criterion is a fraction of what was actually on offer, so a player
 * who dies in stage 1 is not scored against three stages' worth of coins.
 */
test('clearing a stage adds its money to the total available', () => {
  const run = emptyRun();
  clearStage(CITY, createStageState(CITY), run, 1);
  assert.equal(run.money.totalAvailable, CITY.moneyAvailable);

  run.money.collected = CITY.moneyAvailable;
  assert.equal(computeMoney(run), MONEY_MAX, 'collecting everything on offer maxes 錢');
});

test('collecting half of what was on offer scores half', () => {
  const run = emptyRun();
  clearStage(CITY, createStageState(CITY), run, 1);
  run.money.collected = CITY.moneyAvailable / 2;
  assert.equal(computeMoney(run), MONEY_MAX / 2);
});

test('bossReady is false until the player reaches the arena', () => {
  const state = createStageState(CITY);
  state.sectionIndex = CITY.sections.length - 1;
  assert.equal(bossReady(CITY, state, 0), false);
  assert.equal(bossReady(CITY, state, CITY.length * 0.95), true);
});

test('bossReady is false once the boss is beaten', () => {
  const state = createStageState(CITY);
  state.sectionIndex = CITY.sections.length - 1;
  state.bossDefeated = true;
  assert.equal(bossReady(CITY, state, CITY.length * 0.95), false);
});

test('a cleared stage 1 run passes validation', () => {
  const run = emptyRun();
  run.name = 'VIN';
  run.durationMs = MIN_RUN_MS[1] + 60_000;
  clearStage(CITY, createStageState(CITY), run, 1);
  run.power.powerRemaining = 40;
  run.power.powerMax = 100;

  const res = validateRun(run);
  assert.equal(res.ok, true, res.errors.join(' | '));
});

test('clearing without a run object does not throw', () => {
  assert.doesNotThrow(() => clearStage(CITY, createStageState(CITY), null, 1));
});
