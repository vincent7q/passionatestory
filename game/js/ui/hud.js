/**
 * The HUD. Match docs/1.jpg and docs/2.jpg.
 *
 * ┌────────────────────────────────────────────────────────────────────┐
 * │ [EXP] [Portrait]  力 ████████░░ 120/150     17:42        錢 1,000   │
 * │  ▮       Lv.9     氣 ██████░░░░  60/100                             │
 * └────────────────────────────────────────────────────────────────────┘
 *
 * NOTHING HERE IS DISGUISED OR RENAMED. This is the evaluation, live, for
 * twenty minutes, and nobody looks at it properly because it is shaped exactly
 * like a video game. 力 and 錢 are two of the three criteria and they sit on
 * screen the whole time. Do not "improve" this by relabelling anything.
 *
 * The clock is a bare number. It is never labelled, it is not a rescue timer,
 * and it is quietly feeding the column the player cannot see.
 */

import { WIDTH } from '../renderer.js';

export const COLOURS = {
  power: '#5FD35F',
  powerLow: '#D35F5F',
  spirit: '#E8A33D',
  exp: '#E8A33D',
  track: '#241E2E',
  frame: '#0E0B14',
  text: '#F2F2F8',
  money: '#E8D25F',
  award: '#F2C75C',
  seal: '#D9A441',
};

/** Power below this fraction turns the bar red. */
export const LOW_POWER = 0.25;

// ── The clock ────────────────────────────────────────────────────────────────

/** The chase starts at 17:20. Dinner is at 18:00. */
export const CLOCK_START_MIN = 17 * 60 + 20;
export const DINNER_MIN = 18 * 60;

/**
 * In-game minutes per real minute.
 *
 * 17:20 → 18:00 is forty in-game minutes across a session of roughly twenty
 * real ones. Tunable: raise it and the candidate is later, which quietly costs
 * him punctuality he does not know he is being scored on.
 */
export const CLOCK_SCALE = 2;

export function clockMinutes(elapsedMs) {
  return CLOCK_START_MIN + (elapsedMs / 60000) * CLOCK_SCALE;
}

/** "17:42". Zero-padded, 24-hour, and never accompanied by a label. */
export function formatClock(elapsedMs) {
  const total = Math.floor(clockMinutes(elapsedMs));
  const h = Math.floor(total / 60) % 24;
  const m = total % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Milliseconds of margin before 18:00, negative if late. Feeds punctuality,
 * which lives inside the hidden column because being on time is a courtesy.
 */
export function msBeforeDinner(elapsedMs) {
  const remainingGameMin = DINNER_MIN - clockMinutes(elapsedMs);
  return (remainingGameMin / CLOCK_SCALE) * 60000;
}

// ── Bars and numbers ─────────────────────────────────────────────────────────

/** How many of `segments` are filled. Never rounds a non-zero value to empty. */
export function barSegments(current, max, segments) {
  if (!(max > 0) || current <= 0) return 0;
  const exact = (current / max) * segments;
  return Math.max(1, Math.min(segments, Math.round(exact)));
}

export function barIsLow(current, max) {
  return max > 0 && current / max <= LOW_POWER;
}

/** "1,000" — thousands separated, matching the reference screenshots. */
export function formatMoney(n) {
  return Math.max(0, Math.floor(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/** White on hit, yellow and larger on critical, green with + on heal. */
export function damageStyle(kind) {
  switch (kind) {
    case 'critical': return { colour: '#F5E663', size: 10, prefix: '' };
    case 'heal': return { colour: '#7BE07B', size: 8, prefix: '+' };
    default: return { colour: '#FFFFFF', size: 8, prefix: '' };
  }
}

export const LEVEL_CAP = 20;

/** Fraction of the way to the next level, 0..1. */
export function expFraction(exp, level, perLevel = 100) {
  if (level >= LEVEL_CAP) return 1;
  const into = exp - level * perLevel;
  return Math.max(0, Math.min(1, into / perLevel));
}

// ── Drawing ──────────────────────────────────────────────────────────────────

function bar(ctx, x, y, w, h, fraction, colour) {
  ctx.fillStyle = COLOURS.track;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = colour;
  ctx.fillRect(x, y, Math.round(w * Math.max(0, Math.min(1, fraction))), h);
}

/**
 * @param {object} s {power, powerMax, spirit, spiritMax, money, elapsedMs,
 *                    level, exp, charId, ally}
 */
export function drawHud(ctx, s) {
  ctx.font = '8px monospace';

  // Portrait block, far left.
  ctx.fillStyle = COLOURS.frame;
  ctx.fillRect(4, 3, 20, 22);
  ctx.fillStyle = COLOURS.exp;
  const ef = expFraction(s.exp ?? 0, s.level ?? 1);
  ctx.fillRect(2, 3 + 22 - Math.round(22 * ef), 2, Math.round(22 * ef));
  ctx.fillStyle = COLOURS.text;
  ctx.fillText(`Lv.${s.level ?? 1}`, 4, 32);

  // 力 — health AND criterion one. Not disguised, not renamed.
  ctx.fillStyle = COLOURS.text;
  ctx.fillText('力', 28, 12);
  bar(ctx, 40, 5, 84, 7, s.power / s.powerMax,
    barIsLow(s.power, s.powerMax) ? COLOURS.powerLow : COLOURS.power);
  ctx.fillStyle = COLOURS.text;
  ctx.fillText(`${Math.ceil(s.power)}/${s.powerMax}`, 128, 12);

  // 氣 — a resource, not a criterion.
  ctx.fillText('氣', 28, 23);
  bar(ctx, 40, 16, 84, 6, (s.spirit ?? 0) / (s.spiritMax || 1), COLOURS.spirit);
  ctx.fillStyle = COLOURS.text;
  ctx.fillText(`${Math.floor(s.spirit ?? 0)}/${s.spiritMax ?? 0}`, 128, 23);

  // The clock. Centred, large, and BARE — no label, ever.
  const clock = formatClock(s.elapsedMs ?? 0);
  ctx.font = '16px monospace';
  const cw = ctx.measureText(clock).width;
  ctx.fillStyle = COLOURS.text;
  ctx.fillText(clock, Math.round(WIDTH / 2 - cw / 2), 18);

  // 錢 — criterion two, sitting in plain sight all game.
  ctx.font = '8px monospace';
  const money = formatMoney(s.money ?? 0);
  const mw = ctx.measureText(money).width;
  ctx.fillStyle = COLOURS.money;
  ctx.fillRect(WIDTH - 14 - mw - 8, 6, 5, 5);
  ctx.fillStyle = COLOURS.text;
  ctx.fillText(money, WIDTH - 8 - mw, 12);
}

/** Ally portrait and Q prompt, bottom-left, only when one is available. */
export function drawAllyPrompt(ctx, ally, y) {
  if (!ally) return;
  ctx.fillStyle = COLOURS.frame;
  ctx.fillRect(4, y - 16, 16, 16);
  ctx.fillStyle = COLOURS.text;
  ctx.font = '8px monospace';
  ctx.fillText('Q', 8, y - 4);
}

/**
 * A restraint award: a bare gold +3 with a small seal and NO LABEL.
 * Players will assume it is a minor bonus. It is the entire test.
 */
export function drawAward(ctx, x, y, amount = 3) {
  ctx.font = '8px monospace';
  ctx.fillStyle = COLOURS.seal;
  ctx.fillRect(x - 9, y - 6, 5, 5);
  ctx.fillStyle = COLOURS.award;
  ctx.fillText(`+${amount}`, x - 2, y);
}

export function drawDamageNumber(ctx, x, y, amount, kind = 'hit') {
  const { colour, size, prefix } = damageStyle(kind);
  ctx.font = `${size}px monospace`;
  ctx.fillStyle = colour;
  ctx.fillText(`${prefix}${Math.round(amount)}`, x, y);
}
