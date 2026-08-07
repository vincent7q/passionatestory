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
// ── Stage 2 — 二叔 BAN 班 ─────────────────────────────────────────────────────

/**
 * An enormous, beaming man sitting in the middle of the mountain road behind a
 * folding table with a full tea service laid out.
 *
 * HE CANNOT BE BEATEN BY FIGHTING. Reduce him to zero and he pours another cup
 * and stands back up, fully restored. He is not aggressive; he is HOSPITABLE,
 * immovably so.
 *
 * Three cups. Each one accepted restores 氣 and makes the candidate heavier and
 * slower. Each one refused costs 力, because you do not refuse an uncle. The
 * third leaves him at his most sluggish — and the way through is to bow.
 *
 * This is where the player understands. A kidnapper does not do this. The
 * candidate takes it as a bizarre obstacle and keeps running.
 */
export const SECOND_UNCLE = {
  id: 'second_uncle',
  name: { en: 'BAN', zh: '二叔 班' },
  hp: 500,
  cups: 3,
};

/** Refusing costs 力. You do not refuse an uncle. */
export const REFUSE_POWER_COST = 8;
/** Each cup accepted makes him heavier and slower. Cumulative. */
export const HEAVINESS_PER_CUP = 1;
export const SPIRIT_PER_CUP = 9999;   // "restores 氣 fully"

export const TeaBeat = {
  OFFERING: 'OFFERING',     // a cup is on the table, E accepts
  POURING: 'POURING',       // he is pouring the next one
  BOW_WINDOW: 'BOW_WINDOW', // three cups down; the way through is to bow
  PASSED: 'PASSED',         // he steps aside, beaming
};

export function createSecondUncle(at = {}) {
  return createEntity(Kind.BOSS, {
    bossId: SECOND_UNCLE.id,
    charId: 'second_uncle',
    team: Team.HOUSE,
    x: at.x ?? 0, y: at.y ?? 0, z: 0,
    w: 24, depth: 12, h: FRAME_H,
    power: SECOND_UNCLE.hp, powerMax: SECOND_UNCLE.hp,
    facing: -1,
    tea: { beat: TeaBeat.OFFERING, cupsOffered: 1, cupsAccepted: 0, cupsRefused: 0 },
  });
}

/**
 * He cannot be defeated. Reducing him to zero pours another cup and restores
 * him completely.
 *
 * @returns {boolean} whether he just refilled
 */
export function refillIfDowned(uncle) {
  if (uncle.power > 0) return false;
  uncle.power = uncle.powerMax;
  uncle.state = State.IDLE;
  uncle.attacking = false;
  return true;
}

/** Accept the cup on the table. */
export function acceptCup(uncle, player, run) {
  const tea = uncle.tea;
  if (tea.beat !== TeaBeat.OFFERING) return { accepted: false };

  tea.cupsAccepted += 1;

  if (player) {
    player.spirit = player.spiritMax;
    player.heaviness = (player.heaviness ?? 0) + HEAVINESS_PER_CUP;
  }

  const done = tea.cupsAccepted + tea.cupsRefused >= SECOND_UNCLE.cups;
  if (done) {
    tea.beat = TeaBeat.BOW_WINDOW;
    // Accepting ALL THREE is the award. Refusing even one forfeits it.
    if (run) run.judgment.acceptedAllCups = tea.cupsAccepted === SECOND_UNCLE.cups;
  } else {
    tea.cupsOffered += 1;
  }

  return { accepted: true, cupsAccepted: tea.cupsAccepted, allDone: done };
}

/** Refuse, or ignore the prompt until it lapses. Costs 力 either way. */
export function refuseCup(uncle, player, run) {
  const tea = uncle.tea;
  if (tea.beat !== TeaBeat.OFFERING) return { refused: false };

  tea.cupsRefused += 1;
  if (player) player.power = Math.max(0, player.power - REFUSE_POWER_COST);

  const done = tea.cupsAccepted + tea.cupsRefused >= SECOND_UNCLE.cups;
  if (done) {
    tea.beat = TeaBeat.BOW_WINDOW;
    if (run) run.judgment.acceptedAllCups = false;
  } else {
    tea.cupsOffered += 1;
  }

  return { refused: true, powerCost: REFUSE_POWER_COST, allDone: done };
}

/**
 * Bow. The only way past him.
 *
 * He steps aside beaming and tells the candidate he's a good kid, then joins
 * and teaches 鐵山靠 — a shoulder charge.
 */
export function bowToUncle(uncle) {
  if (uncle.tea.beat !== TeaBeat.BOW_WINDOW) return { passed: false };
  uncle.tea.beat = TeaBeat.PASSED;
  uncle.state = State.ALLIED;
  uncle.team = Team.PLAYER;
  return { passed: true, teaches: 'iron_mountain', joins: true };
}

export function uncleBlocksPath(uncle) {
  return uncle.tea.beat !== TeaBeat.PASSED;
}

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
