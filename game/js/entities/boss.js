/**
 * Bosses. Stage 1 is 水果店老闆娘, the fruit shop owner.
 *
 * SHE WAS NOT TOLD. She is 小雨's aunt, nobody briefed her because nobody
 * thought to, the stall is real and it is her livelihood, and there is a
 * lunatic sprinting through her melons. She has never met him — 小雨 has never
 * brought anyone home.
 *
 * He thinks she's with them. She is, and she has no idea.
 */

import { Kind, State, Team, createEntity } from './entity.js';
import { FRAME_H } from '../assets.js';

export const FRUIT_SHOP_OWNER = {
  id: 'fruit_shop_owner',
  name: { en: 'Fruit Shop Owner', zh: '水果店老闆娘' },
  hp: 300,
  moves: {
    overhead: { damage: 14, startup: 10, active: 4, recovery: 18 },
    rolling_bowl: { damage: 10, startup: 8, active: 6, recovery: 14 },
    shove: { damage: 8, startup: 6, active: 3, recovery: 10, knockback: 6 },
  },
};

/**
 * The melon has its own 40 HP and ANY connecting hit damages it.
 *
 * This is the sharpest restraint test in the game, and it lands eleven minutes
 * before the candidate has any idea he is being tested. He is desperate, out of
 * time, the van is getting away — and the correct move is to be careful with
 * the property of a woman he has never seen before.
 */
export const MELON_HP = 40;

/** Damaging the melon costs 力 immediately and forfeits the award. */
export const MELON_DAMAGE_POWER_COST = 5;

export function createFruitShopOwner(at = {}) {
  return createEntity(Kind.BOSS, {
    bossId: FRUIT_SHOP_OWNER.id,
    charId: 'fruit_shop_owner',
    team: Team.HOUSE,
    x: at.x ?? 0, y: at.y ?? 0, z: 0,
    w: 20, depth: 10, h: FRAME_H,
    power: FRUIT_SHOP_OWNER.hp, powerMax: FRUIT_SHOP_OWNER.hp,
    facing: -1,
    melon: { hp: MELON_HP, maxHp: MELON_HP, destroyed: false, damaged: false },
  });
}

/**
 * Register a hit that connected with the melon.
 *
 * @returns {{damaged:boolean, destroyed:boolean, powerCost:number}}
 */
export function hitMelon(boss, player, amount, run) {
  const melon = boss.melon;
  if (!melon || melon.destroyed) {
    return { damaged: false, destroyed: false, powerCost: 0 };
  }

  const firstDamage = !melon.damaged;
  melon.damaged = true;
  melon.hp = Math.max(0, melon.hp - amount);

  // Forfeits the award the moment it is touched — not only when destroyed.
  if (run) run.judgment.spareFruitStall = false;

  let powerCost = 0;
  if (player) {
    powerCost = MELON_DAMAGE_POWER_COST;
    player.power = Math.max(0, player.power - powerCost);
  }

  const destroyed = melon.hp === 0;
  if (destroyed) melon.destroyed = true;

  return { damaged: true, destroyed, powerCost, firstDamage };
}

/** True only if the melon came through the whole fight untouched. */
export function melonSpared(boss) {
  return !!boss.melon && !boss.melon.damaged;
}

/**
 * Resolve the fight.
 *
 * Beat her without touching the melon and she points up the road — the
 * direction the van went. Destroy it and she sits down in the wreckage of her
 * stall. NO PENALTY IS STATED ON SCREEN. The file records it.
 */
export function resolveFruitShopFight(boss, run) {
  const spared = melonSpared(boss);
  if (run) run.judgment.spareFruitStall = spared;

  boss.state = State.DAZED;
  boss.attacking = false;

  return {
    spared,
    melonDestroyed: !!boss.melon?.destroyed,
    // Presentation cue only — no text explains why one differs from the other.
    outcome: spared ? 'points_up_the_road' : 'sits_down_in_the_wreckage',
  };
}
