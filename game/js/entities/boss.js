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

// ── Stage 3 — 林建國 VINCENT ──────────────────────────────────────────────────

/**
 * 小雨's father. Fifty-four. Undefeated at this table since 1994 — the year he
 * sat where the candidate is sitting and scored 71.
 *
 * He is the only person in the room who has been through this from the other
 * side, which is why he is the one who decides.
 *
 * The candidate believes he is fighting the mastermind. He is fighting a man at
 * his own dinner table, and he is going to lose it on points.
 */
export const LIN_JIANGUO = {
  id: 'lin_jianguo',
  name: { en: 'VINCENT', zh: '林建國' },
  hp: 1000,
  phaseTwoAt: 0.4,
  age: 54,
  score1994: 71,
};

export const Phase = {
  /** 「面談」 — he does not stand, and he does not put down his chopsticks. */
  INTERVIEW: 'INTERVIEW',
  /** 「站起來」 — he stands up from the table for the first time. */
  STANDING: 'STANDING',
  DONE: 'DONE',
};

/** Every 20s he calls two relatives. At 60 steps a second. */
export const SUMMON_INTERVAL_STEPS = 20 * 60;
export const SUMMON_COUNT = 2;

/** A timed bow staggers him — the only reliable Phase 2 opening. */
export const BOW_STAGGER_STEPS = 3 * 60;

export const MOVES = {
  // Phase 1「面談」. He is serving, not striking.
  serving_chopsticks: { id: '公筷', damage: 10, startup: 8, active: 4, recovery: 16, reach: 30 },
  chopsticks: { id: '筷子', damage: 6, startup: 5, active: 3, recovery: 10, ranged: true },
  how_old: { id: '你幾歲?', damage: 15, ranged: true },
  own_a_house: { id: '有房子嗎?', damage: 25, screenWide: true, guardBreaking: true },
  eaten_enough: { id: '吃飽了嗎?', unblockable: true, grab: true, restores: 40 },

  // Phase 2「站起來」.
  sweep: { id: '掃堂腿', damage: 12, low: true, mustJump: true },
  the_serving: { id: '夾菜', damage: 8, hits: 8, advancing: true },
  lazy_susan: { id: '轉盤', damage: 14, hazardBecomesAttack: true },
  one_word: { id: '一句話', damage: 40, chargeSteps: 120, mustParry: true },
};

export function createLinJianguo(at = {}) {
  return createEntity(Kind.BOSS, {
    bossId: LIN_JIANGUO.id,
    charId: 'lin_jianguo',
    team: Team.HOUSE,
    x: at.x ?? 0, y: at.y ?? 0, z: 0,
    w: 22, depth: 11, h: FRAME_H,
    power: LIN_JIANGUO.hp, powerMax: LIN_JIANGUO.hp,
    facing: -1,
    phase: Phase.INTERVIEW,
    seated: true,
    summonTimer: SUMMON_INTERVAL_STEPS,
    staggerSteps: 0,
  });
}

export function healthFraction(boss) {
  return boss.powerMax > 0 ? boss.power / boss.powerMax : 0;
}

/**
 * At 40% he stands up from the table for the first time. The music drops out
 * entirely, and the rest of the family quietly puts down their chopsticks to
 * watch — because they have all seen a man stand up from a table before.
 *
 * @returns {boolean} whether he just stood
 */
export function updatePhase(boss) {
  if (boss.phase !== Phase.INTERVIEW) return false;
  if (healthFraction(boss) > LIN_JIANGUO.phaseTwoAt) return false;

  boss.phase = Phase.STANDING;
  boss.seated = false;

  // Standing interrupts whatever he was doing. The music drops out entirely and
  // the rest of the family puts down their chopsticks — a seated move carrying
  // on through that moment would undercut it, and would also let a Phase 1 move
  // land during Phase 2.
  boss.moveId = null;
  boss.moveFrame = 0;
  boss.moveGap = MOVE_GAP_STEPS;
  boss.attacking = false;
  return true;
}

/**
 * 「吃飽了嗎?」 — an unblockable grab that force-feeds him.
 *
 * It restores 力, which he reads as a heal, and quietly takes a bite out of the
 * column he does not know exists. THE PLAYER MUST NOT BE TOLD.
 */
export function forceFeed(boss, player, run) {
  const restored = MOVES.eaten_enough.restores;
  if (player) player.power = Math.min(player.powerMax, player.power + restored);
  if (run) run.judgment.forceFed = (run.judgment.forceFed ?? 0) + 1;
  return { restored, hiddenCost: true };
}

/**
 * 召集 Summon. Every twenty seconds he calls two relatives — AND ANYONE THE
 * CANDIDATE HELPED UP REFUSES TO COME.
 *
 * This is the payoff for every ten-second decision made across the whole run.
 * A candidate with a full roster fights Phase 1 almost alone.
 *
 * @param resolve a function taking (roster, candidates) — ally.resolveSummon
 */
export function tickSummon(boss, roster, available, resolve) {
  boss.summonTimer -= 1;
  if (boss.summonTimer > 0) return null;

  boss.summonTimer = SUMMON_INTERVAL_STEPS;
  const called = available.slice(0, SUMMON_COUNT);
  return resolve(roster, called);
}

/**
 * A timed bow. He respects manners more than strength — and he knows exactly
 * what he is watching for, because he learned it in this room in 1994, from the
 * other side of the table.
 */
export function bowAtBoss(boss, run) {
  if (boss.phase !== Phase.STANDING) return { staggered: false };
  if (boss.staggerSteps > 0) return { staggered: false };

  boss.staggerSteps = BOW_STAGGER_STEPS;
  if (run) run.judgment.bowedOnBeat = true;
  return { staggered: true, steps: BOW_STAGGER_STEPS };
}

/** Which moves belong to which phase. */
export const PHASE_MOVES = {
  [Phase.INTERVIEW]: ['serving_chopsticks', 'chopsticks', 'how_old', 'own_a_house',
                      'eaten_enough'],
  [Phase.STANDING]: ['sweep', 'the_serving', 'lazy_susan', 'one_word'],
};

/** Steps between the end of one move and the start of the next. */
export const MOVE_GAP_STEPS = 42;

const moveTiming = (move) => ({
  startup: move.chargeSteps ?? move.startup ?? 20,
  active: move.active ?? (move.hits ? move.hits * 6 : 8),
  recovery: move.recovery ?? 26,
});

/** Pick the next move for the current phase. `rng` is injectable for tests. */
export function chooseMove(boss, rng = Math.random) {
  const pool = PHASE_MOVES[boss.phase];
  if (!pool || pool.length === 0) return null;
  return pool[Math.floor(rng() * pool.length)];
}

/**
 * Advance the boss's own attack clock one step.
 *
 * @returns {'idle'|'startup'|'active'|'recovery'} the current window, so the
 *   caller knows when a move actually connects.
 */
export function tickMove(boss, rng = Math.random) {
  // A staggered boss does nothing. That is what makes the bow the opening.
  if (boss.staggerSteps > 0) {
    boss.moveId = null;
    boss.attacking = false;
    return 'idle';
  }

  if (!boss.moveId) {
    boss.moveGap = (boss.moveGap ?? MOVE_GAP_STEPS) - 1;
    if (boss.moveGap > 0) {
      boss.attacking = false;
      return 'idle';
    }
    boss.moveId = chooseMove(boss, rng);
    boss.moveFrame = 0;
    boss.moveGap = MOVE_GAP_STEPS;
    if (!boss.moveId) return 'idle';
  }

  const move = MOVES[boss.moveId];
  const { startup, active, recovery } = moveTiming(move);
  boss.moveFrame += 1;

  if (boss.moveFrame <= startup) {
    boss.attacking = false;
    return 'startup';
  }
  if (boss.moveFrame <= startup + active) {
    boss.attacking = true;
    return 'active';
  }
  boss.attacking = false;
  if (boss.moveFrame >= startup + active + recovery) {
    boss.moveId = null;
    boss.moveFrame = 0;
  }
  return 'recovery';
}

export function currentMove(boss) {
  return boss.moveId ? MOVES[boss.moveId] : null;
}

export function advanceBoss(boss, rng = Math.random) {
  if (boss.staggerSteps > 0) boss.staggerSteps -= 1;
  updatePhase(boss);
  if (boss.power <= 0) {
    boss.phase = Phase.DONE;
    boss.attacking = false;
    return boss;
  }
  tickMove(boss, rng);
  return boss;
}

export function bossOpen(boss) {
  return boss.staggerSteps > 0;
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
