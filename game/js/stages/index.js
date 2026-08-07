/**
 * The three stages, in order. He chases the van across a city, up a mountain,
 * and into what he takes for a fortified estate.
 *
 * Every stage exposes the same shape — sections, layers, strip, and its own
 * `enemies` / `moneyDrop` / `spawnsFor` — so main.js drives all three through
 * one code path and never imports a stage individually.
 */

import { CITY } from './city.js';
import { FOREST } from './forest.js';
import { CASTLE } from './castle.js';

export const STAGES = [CITY, FOREST, CASTLE];

export const stageNumber = (stage) => STAGES.indexOf(stage) + 1;

export function nextStage(stage) {
  return STAGES[STAGES.indexOf(stage) + 1] ?? null;
}

export function stageById(id) {
  return STAGES.find((s) => s.id === id) ?? null;
}

/** Total 錢 on offer across the whole evening, for the money criterion. */
export function totalMoneyAvailable() {
  return STAGES.reduce((n, s) => n + (s.moneyAvailable ?? 0), 0);
}
