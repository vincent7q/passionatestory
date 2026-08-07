/**
 * Pickups, 錢, and weapons. Rosters from docs/PRD.md §9.
 *
 * Every coin dropped off a man on the Lin payroll. It was always their money,
 * the candidate gathers it diligently all night, and it counts in his favour.
 * The note beside that line on the evaluation form reads 「這些是我們的錢。」
 */

import { Kind, State, createEntity } from './entity.js';

/** Consumables. Effects are applied by `applyItem`. */
export const ITEMS = {
  money: { id: 'money', name: { en: 'Money', zh: '錢' }, value: 100 },
  tea: { id: 'tea', name: { en: 'Tea', zh: '茶' }, spirit: 30, heaviness: 1 },
  snack: { id: 'snack', name: { en: 'Snack', zh: '點心' }, power: 20 },
  hot_towel: { id: 'hot_towel', name: { en: 'Hot Towel', zh: '熱毛巾' }, power: 50, rare: true },
  handkerchief: { id: 'handkerchief', name: { en: 'Handkerchief', zh: '手帕' }, cancelsRain: true },
  business_card: { id: 'business_card', name: { en: 'Business Card', zh: '名片' },
                   buff: 'power_scoring', magnitude: 0.3, durationSteps: 1800 },
  good_tea_leaves: { id: 'good_tea_leaves', name: { en: 'Good Tea Leaves', zh: '好茶葉' },
                     buff: 'guard', magnitude: 0.3, durationSteps: 1800 },
};

/** Light picks up, heavy throws. Limited uses, then they break. */
export const WEAPONS = {
  fruit: { id: 'fruit', name: { en: 'Fruit', zh: '水果' }, uses: 1, damage: 8, throwable: true },
  chopsticks: { id: 'chopsticks', name: { en: 'Chopsticks', zh: '筷子' }, uses: 3, damage: 5,
                pierces: true },
  folding_chair: { id: 'folding_chair', name: { en: 'Folding Chair', zh: '折凳' }, uses: 3,
                   damage: 14, knockback: 6 },
  serving_tray: { id: 'serving_tray', name: { en: 'Serving Tray', zh: '托盤' }, uses: 2, damage: 10,
                  wideArc: true },
  large_fish: { id: 'large_fish', name: { en: 'Large Fish', zh: '大魚' }, uses: 4, damage: 12,
                slow: true },
  lazy_susan: { id: 'lazy_susan', name: { en: 'Lazy Susan', zh: '轉盤' }, uses: 1, damage: 18,
                stage: 3, hitsAll: true },
};

export const PICKUP_RANGE = 16;

export function spawnItem(world, spawnFn, itemId, at) {
  return spawnFn(world, Kind.ITEM, {
    itemId, x: at.x, y: at.y, z: at.z ?? 0,
    w: 10, depth: 6, h: 10, state: State.IDLE,
  });
}

export function createWeapon(weaponId) {
  const def = WEAPONS[weaponId];
  if (!def) return null;
  return { weaponId, usesLeft: def.uses, damage: def.damage };
}

/** Consume one use. Returns true when the weapon has broken. */
export function useWeapon(weapon) {
  if (!weapon) return true;
  weapon.usesLeft -= 1;
  return weapon.usesLeft <= 0;
}

export function pickUp(entity, weapon) {
  if (entity.weapon) return false;
  entity.weapon = weapon;
  return true;
}

export function dropWeapon(entity) {
  const w = entity.weapon;
  entity.weapon = null;
  return w;
}

/**
 * Apply a consumable. Returns what actually changed, so the HUD can pop the
 * right numbers and the run accumulator can record the 錢.
 */
export function applyItem(entity, itemId, run = null) {
  const def = ITEMS[itemId];
  if (!def) return { applied: false };

  const out = { applied: true, power: 0, spirit: 0, money: 0 };

  if (def.power) {
    const before = entity.power;
    entity.power = Math.min(entity.powerMax, entity.power + def.power);
    out.power = entity.power - before;
  }
  if (def.spirit) {
    const before = entity.spirit;
    entity.spirit = Math.min(entity.spiritMax, entity.spirit + def.spirit);
    out.spirit = entity.spirit - before;
  }
  if (def.heaviness) {
    entity.heaviness = (entity.heaviness ?? 0) + def.heaviness;
  }
  if (def.cancelsRain) {
    entity.rainProtected = true;
  }
  if (def.buff) {
    entity.buffs = entity.buffs ?? {};
    entity.buffs[def.buff] = { magnitude: def.magnitude, stepsLeft: def.durationSteps };
  }
  if (def.value) {
    out.money = def.value;
    if (run) run.money.collected += def.value;
  }

  return out;
}

/** Tick buff timers one step; expired buffs are removed. */
export function advanceBuffs(entity) {
  if (!entity.buffs) return entity;
  for (const [name, buff] of Object.entries(entity.buffs)) {
    buff.stepsLeft -= 1;
    if (buff.stepsLeft <= 0) delete entity.buffs[name];
  }
  return entity;
}

export function createItemEntity(itemId, at = {}) {
  return createEntity(Kind.ITEM, {
    itemId, x: at.x ?? 0, y: at.y ?? 0, z: at.z ?? 0, w: 10, depth: 6, h: 10,
  });
}
