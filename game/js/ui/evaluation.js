/**
 * 林家 配偶評估表 — the evaluation form.
 *
 * THIS FILE IS THE FIRST PLACE 禮 APPEARS IN THE ENTIRE GAME. Everywhere else
 * under game/ it is banned, and test/game/spoiler.test.js enforces that with
 * only this file and reveal.js on the allowlist.
 *
 * PACING MATTERS MORE THAN LAYOUT. The first two lines are the HUD he has been
 * staring at all night. They animate in first and they are GOOD — he should
 * have a second to feel pleased. Then the third line writes itself in, and it
 * is worth more than either.
 *
 * 力 and 錢 land as a victory. 禮 lands as the floor going out. His own 71 sits
 * underneath, two points above, and does not need a comment.
 */

import { WIDTH } from '../renderer.js';

/** Beats, in order. Each holds until its dwell has elapsed. */
export const Beat = {
  HEADER: 'HEADER',
  POWER: 'POWER',
  MONEY: 'MONEY',
  PLEASED: 'PLEASED',     // the pause where he is briefly quite pleased
  JUDGMENT: 'JUDGMENT',   // the floor goes out
  TOTAL: 'TOTAL',
  FATHER: 'FATHER',       // 林建國 (1994) — 71
  QUOTE: 'QUOTE',
  DONE: 'DONE',
};

export const BEAT_ORDER = [
  Beat.HEADER, Beat.POWER, Beat.MONEY, Beat.PLEASED,
  Beat.JUDGMENT, Beat.TOTAL, Beat.FATHER, Beat.QUOTE, Beat.DONE,
];

/**
 * Dwell per beat, in fixed steps at 60/s.
 *
 * PLEASED is the load-bearing one. Cutting it short is the single easiest way
 * to ruin the reveal: without a real pause on a good 力 and 錢, the third line
 * arrives as information rather than as the floor going out.
 */
export const DWELL = {
  [Beat.HEADER]: 60,
  [Beat.POWER]: 70,
  [Beat.MONEY]: 70,
  [Beat.PLEASED]: 90,
  [Beat.JUDGMENT]: 140,
  [Beat.TOTAL]: 80,
  [Beat.FATHER]: 120,
  [Beat.QUOTE]: 150,
  [Beat.DONE]: Infinity,
};

export const FATHER_NAME = '林建國';
export const FATHER_YEAR = 1994;

/** 「力氣跟錢，誰都有。我看的是別的。」 */
export const CLOSING_LINE = {
  zh: '力氣跟錢,誰都有。我看的是別的。',
  en: 'Strength and money — anyone has those. I was looking at something else.',
};

/** 「這些是我們的錢。」 — the note beside the money line. */
export const MONEY_NOTE = { zh: '這些是我們的錢。', en: "That's our money." };

/** 「他沒看到這一欄。」 — the annotation beside the hidden column. */
export const JUDGMENT_NOTE = { zh: '他沒看到這一欄', en: 'He did not see this column' };

export function createEvaluation(grade, opts = {}) {
  return {
    grade,
    candidateName: opts.candidateName ?? '菲利克斯',
    fatherScore: opts.fatherScore ?? 71,
    beatIndex: 0,
    beatSteps: 0,
    skipped: false,
  };
}

export const currentBeat = (s) => BEAT_ORDER[s.beatIndex];

/** True once a beat has been reached, so earlier lines stay on screen. */
export function reached(s, beat) {
  return s.beatIndex >= BEAT_ORDER.indexOf(beat);
}

/**
 * Advance one fixed step.
 *
 * Deliberately NOT skippable before JUDGMENT. A player who mashes through the
 * pleased pause would meet the third line cold, and the whole twenty minutes
 * pays off in that one transition.
 */
export function advanceEvaluation(s, { skipPressed = false } = {}) {
  const beat = currentBeat(s);
  if (beat === Beat.DONE) return s;

  s.beatSteps += 1;

  const canSkip = skipPressed && reached(s, Beat.JUDGMENT);
  if (s.beatSteps >= DWELL[beat] || canSkip) {
    s.beatIndex += 1;
    s.beatSteps = 0;
    if (canSkip) s.skipped = true;
  }
  return s;
}

/** 0..1 through the current beat, for the line-writing animation. */
export function beatProgress(s) {
  const dwell = DWELL[currentBeat(s)];
  return Number.isFinite(dwell) ? Math.min(1, s.beatSteps / dwell) : 1;
}

/**
 * The value to display for a line, counting up as it animates in.
 * Lines that have not been reached yet show nothing at all.
 */
export function displayedValue(s, beat, finalValue) {
  if (!reached(s, beat)) return null;
  if (s.beatIndex > BEAT_ORDER.indexOf(beat)) return finalValue;
  return Math.round(finalValue * beatProgress(s));
}

// ── Drawing ──────────────────────────────────────────────────────────────────

const PAPER = '#EFE7D6';
const INK = '#241C18';
const RED = '#A33B32';

function line(ctx, y, label, zh, value, max, note) {
  ctx.fillStyle = INK;
  ctx.font = '8px monospace';
  ctx.fillText(zh, 96, y);
  ctx.fillText(label, 112, y);
  if (value !== null) {
    const text = `${value} / ${max}`;
    ctx.fillText(text, 250, y);
  }
  if (note) {
    ctx.fillStyle = RED;
    ctx.fillText(note, 310, y);
  }
}

export function drawEvaluation(ctx, s) {
  const g = s.grade;

  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, WIDTH, 270);

  ctx.fillStyle = INK;
  ctx.font = '8px monospace';
  ctx.fillText('林家 配偶評估表', 96, 44);
  ctx.fillText(`候選人:${s.candidateName}`, 96, 58);

  // The two he has been staring at all night, and never wondered about.
  line(ctx, 92, 'POWER', '力', displayedValue(s, Beat.POWER, g.power), 40);
  line(ctx, 106, 'MONEY', '錢', displayedValue(s, Beat.MONEY, g.money), 20,
    reached(s, Beat.MONEY) ? `「${MONEY_NOTE.zh}」` : null);

  if (reached(s, Beat.JUDGMENT)) {
    ctx.fillStyle = INK;
    ctx.fillRect(96, 118, 220, 1);

    // The first appearance of this character anywhere in the game.
    line(ctx, 134, 'JUDGMENT', '禮', displayedValue(s, Beat.JUDGMENT, g.judgment), 40,
      `← ${JUDGMENT_NOTE.zh}`);

    ctx.fillStyle = INK;
    ctx.fillRect(96, 144, 220, 1);
  }

  if (reached(s, Beat.TOTAL)) {
    ctx.fillStyle = INK;
    ctx.fillText('總分', 96, 162);
    ctx.fillText(`${displayedValue(s, Beat.TOTAL, g.total)} / 100`, 250, 162);
  }

  // Two points above, and it does not need a comment.
  if (reached(s, Beat.FATHER)) {
    ctx.fillStyle = INK;
    ctx.fillText(`${FATHER_NAME} (${FATHER_YEAR})`, 96, 188);
    ctx.fillText(String(s.fatherScore), 250, 188);
  }

  if (reached(s, Beat.QUOTE)) {
    ctx.fillStyle = INK;
    ctx.fillText(`「${CLOSING_LINE.zh}」`, 60, 218);
  }
}
