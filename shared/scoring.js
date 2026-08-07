/**
 * The three criteria. Two are the HUD. One is never named on screen.
 *
 * This is the SINGLE source of truth for a grade. The client calls it to render
 * the evaluation form; the server calls it to decide what to store. Neither
 * reimplements it, so they cannot drift. See SPEC.md §7.
 *
 * PORTABILITY: imported by the browser over HTTP and by Node. No node:
 * imports, no process, no fs, no DOM. Named exports only.
 */

export const POWER_MAX = 40;      // 力 — visible. The green bar, which is also health.
export const MONEY_MAX = 20;      // 錢 — visible. The counter.
export const JUDGMENT_MAX = 40;   // 禮 — hidden, clamped. Never named on screen.
export const GRADE_MAX = 100;

/** 林建國, Normal, 1994. Sits permanently on the board. */
export const FATHER_SCORE = 71;

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const clamp01 = (v) => clamp(v, 0, 1);

// ── 禮 ───────────────────────────────────────────────────────────────────────

/**
 * Awards deliberately OVER-SUPPLY the 40 cap, so a mercy run, a restraint run
 * and a perfect-set-pieces run each reach full marks by a different route.
 * Clamp to [0, 40] last, after the negatives.
 */
export const JUDGMENT = {
  HELP_UP: +3,                 // each
  SPARE_FRUIT_STALL: +8,       // stage 1 boss, melon undamaged
  ACCEPT_ALL_CUPS: +8,         // 二叔 BAN, all three
  BOW_ON_CORRECT_BEAT: +6,     // final boss
  NEVER_STRIKE_DOWNED: +5,     // whole run
  NEVER_STRIKE_TODDLER: +4,    // whole run
  MARKET_STALLS_INTACT: +6,    // stage 1
  STRIKE_DOWNED: -4,           // each — the heaviest penalty in the game

  /**
   * 「吃飽了嗎?」 — 林建國's unblockable grab. It force-feeds the candidate:
   * restores his 力 and quietly takes a bite out of the column he does not know
   * exists. He reads it as a heal. It is not.
   */
  FORCE_FED: -30,
};

/**
 * Arrival time is NOT scored.
 *
 * It used to be worth +8 inside the hidden column, which turned the clock into
 * a countdown and made the run stressful — and a countdown is the wrong feeling
 * for a game whose whole point is that stopping to help someone is always
 * correct. A player racing a timer will not stop.
 *
 * Instead, lateness lands as DIALOGUE at the table. It costs him nothing on the
 * form and everything in the room.
 *
 * Removing it also closed a real hole: a player who never struck a downed
 * opponent and arrived on time used to clear 71 (77) without ever helping
 * anyone up. Without the punctuality points he scores 69, and **a full 40 now
 * requires at least one act of kindness** — the set-pieces alone total 37.
 */
export const ARRIVAL = {
  ON_TIME: 'on_time',
  LATE: 'late',
  VERY_LATE: 'very_late',
};

/** In-game minutes past 18:00 at which "late" becomes "very late". */
export const VERY_LATE_AFTER_MS = 4 * 60 * 1000;

export function arrivalTier(msBefore1800) {
  if (msBefore1800 >= 0) return ARRIVAL.ON_TIME;
  if (-msBefore1800 < VERY_LATE_AFTER_MS) return ARRIVAL.LATE;
  return ARRIVAL.VERY_LATE;
}

/**
 * The ten-second window — the mechanic the whole game is built around.
 *
 * A defeated opponent sits down dazed with stars orbiting. For this long, and
 * only this long, pressing E beside them helps them up and they switch sides
 * permanently.
 *
 * ONE tuning constant. It is a guess; it may want to be 8s or 12s. It lives
 * here so both the game and any future server-side replay agree on it.
 */
export const DAZE_WINDOW_MS = 10_000;

export function computeJudgment(run) {
  const j = run?.judgment ?? {};
  let total = 0;

  total += (j.helpUps ?? 0) * JUDGMENT.HELP_UP;
  total += (j.strikesOnDowned ?? 0) * JUDGMENT.STRIKE_DOWNED;
  total += (j.forceFed ?? 0) * JUDGMENT.FORCE_FED;

  if (j.spareFruitStall) total += JUDGMENT.SPARE_FRUIT_STALL;
  if (j.acceptedAllCups) total += JUDGMENT.ACCEPT_ALL_CUPS;
  if (j.bowedOnBeat) total += JUDGMENT.BOW_ON_CORRECT_BEAT;
  if (j.neverStruckDowned) total += JUDGMENT.NEVER_STRIKE_DOWNED;
  if (j.neverStruckToddler) total += JUDGMENT.NEVER_STRIKE_TODDLER;
  if (j.marketStallsIntact) total += JUDGMENT.MARKET_STALLS_INTACT;

  // arrivalMsBefore1800 is still recorded — it drives which ending he gets —
  // but it is deliberately NOT scored. See the ARRIVAL note above.

  return Math.round(clamp(total, 0, JUDGMENT_MAX));
}

// ── 錢 ───────────────────────────────────────────────────────────────────────

export function computeMoney(run) {
  const { collected = 0, totalAvailable = 0 } = run?.money ?? {};
  if (!(totalAvailable > 0)) return 0;
  return Math.round(clamp01(collected / totalAvailable) * MONEY_MAX);
}

// ── 力 ───────────────────────────────────────────────────────────────────────

/**
 * Playtest-tunable. The masher test (C1) is the constraint these serve: a
 * maximal-violence run must land in the 56-60 band and therefore cannot reach
 * 71. If a change moves that band, tune THESE, never the test.
 */
export const POWER_TUNING = {
  DAMAGE_TARGET: 4000,
  COMBO_TARGET: 12,
  PAR_TIME_MS: 20 * 60 * 1000,
  WEIGHT_DAMAGE: 12,
  WEIGHT_COMBO: 8,
  WEIGHT_SURVIVAL: 10,
  WEIGHT_SPEED: 10,
};

export function computePower(run) {
  const p = run?.power ?? {};
  const t = POWER_TUNING;

  const combat = clamp01((p.damageDealt ?? 0) / t.DAMAGE_TARGET) * t.WEIGHT_DAMAGE
               + clamp01((p.longestCombo ?? 0) / t.COMBO_TARGET) * t.WEIGHT_COMBO;

  const survival = p.powerMax > 0
    ? clamp01((p.powerRemaining ?? 0) / p.powerMax) * t.WEIGHT_SURVIVAL
    : 0;

  // A run must actually have taken time to earn speed marks. Without this
  // guard, durationMs <= 0 divides down to a huge ratio and scores FULL speed —
  // ten free points for claiming an impossible time.
  const duration = run?.durationMs ?? 0;
  const speed = duration > 0
    ? clamp01(t.PAR_TIME_MS / duration) * t.WEIGHT_SPEED
    : 0;

  return Math.round(clamp(combat + survival + speed, 0, POWER_MAX));
}

// ── Grade ────────────────────────────────────────────────────────────────────

export function computeGrade(run) {
  const power = computePower(run);
  const money = computeMoney(run);
  const judgment = computeJudgment(run);
  return { power, money, judgment, total: power + money + judgment };
}

export const DIFFICULTY_MULTIPLIER = { easy: 0.75, normal: 1.0, hard: 1.35 };

export function leaderboardValue(grade, difficulty) {
  return grade * (DIFFICULTY_MULTIPLIER[difficulty] ?? 1.0);
}

/** A zeroed run payload. The shape is SPEC.md §7.2. */
export function emptyRun() {
  return {
    candidate: 'felix',
    difficulty: 'normal',
    name: '___',
    durationMs: 0,
    completed: false,
    stageReached: 1,
    power: {
      damageDealt: 0, longestCombo: 0,
      sectionTimesMs: [], bossTimesMs: [],
      powerRemaining: 0, powerMax: 100,
    },
    money: { collected: 0, totalAvailable: 0 },
    judgment: {
      helpUps: 0, strikesOnDowned: 0, forceFed: 0,
      spareFruitStall: false, acceptedAllCups: false, bowedOnBeat: false,
      neverStruckDowned: false, neverStruckToddler: false, marketStallsIntact: false,
      arrivalMsBefore1800: 0,
    },
  };
}
