/**
 * The reveal — PRD §8, docs/story.md "The reveal".
 *
 * THIS FILE AND ui/evaluation.js ARE THE ONLY TWO ALLOWED TO NAME THE HIDDEN
 * COLUMN. Everywhere else under game/ the character is banned outright and
 * test/game/spoiler.test.js enforces it, comments included.
 *
 * PACING IS THE WHOLE THING. Every beat here is a held moment, not a
 * transition, and a beat that lands before the previous one has registered
 * reads as noise. The two that carry the joke cannot be mashed through at all:
 *
 *   WIN     — he is standing in the wreckage, breathing hard, braced. Nobody
 *             runs. Nobody calls for help. A family is having dinner. If a
 *             player can skip this, the silence never happens and the reveal
 *             starts from nothing.
 *   STINGER — four seconds, and he does not move. He has just learned nothing
 *             tonight was real and he is not going to be made a fool of twice.
 *
 * The FORM beat does not use a dwell at all: it hands off to evaluation.js and
 * waits for that to finish, so the pleased pause stays governed by the one
 * constant that was confirmed by eye (DWELL[PLEASED], progress.md 2026-08-07).
 */

import { WIDTH, HEIGHT } from '../renderer.js';
import {
  createEvaluation, advanceEvaluation, drawEvaluation, currentBeat as formBeat,
  Beat as FormBeat,
} from './evaluation.js';
import { endingFor, fruitOffered, POST_CREDITS } from './ending.js';
import { STAGES } from '../stages/index.js';

export const Beat = {
  WIN: 'WIN',                    // 1. He wins. Nothing happens next.
  PHONE: 'PHONE',                // 2. 小雨 puts her phone down.
  LINEUP: 'LINEUP',              // 3. Everyone he defeated files in, and bows.
  AUNT: 'AUNT',                  // 3. The fruit shop owner sits down at the table.
  FORM_SLIDE: 'FORM_SLIDE',      // 4. 林建國 slides a form across the table.
  FORM: 'FORM',                  // 5-6. Three lines, then 林建國 (1994) — 71.
  FILE: 'FILE',                  // 7. He turns the page. It starts the day they met.
  STINGER: 'STINGER',            // §8.2 Three men in black. Real ones.
  ENDING: 'ENDING',              // The table, the fruit, the verdict.
  POST_CREDITS: 'POST_CREDITS',  // 「第2次」
  DONE: 'DONE',
};

export const BEAT_ORDER = [
  Beat.WIN, Beat.PHONE, Beat.LINEUP, Beat.AUNT, Beat.FORM_SLIDE,
  Beat.FORM, Beat.FILE, Beat.STINGER, Beat.ENDING, Beat.POST_CREDITS, Beat.DONE,
];

/**
 * Dwell per beat, in fixed steps at 60/s.
 *
 * FORM and ENDING are Infinity on purpose — they are paced by their own
 * contents (the evaluation's beat list, and the ending's line count, which
 * varies by how late he was) rather than by a number here.
 */
export const DWELL = {
  [Beat.WIN]: 200,          // ~3.3s of nothing at all
  [Beat.PHONE]: 120,
  [Beat.LINEUP]: 180,       // they file in, dust themselves off, and bow
  [Beat.AUNT]: 150,
  [Beat.FORM_SLIDE]: 100,
  [Beat.FORM]: Infinity,    // driven by evaluation.js
  [Beat.FILE]: 190,         // two photos, and neither is from tonight
  [Beat.STINGER]: 240,      // "about four seconds" — PRD §8.2, taken literally
  [Beat.ENDING]: Infinity,  // driven by the ending's own lines
  [Beat.POST_CREDITS]: 150,
  [Beat.DONE]: Infinity,
};

/** The two beats that carry the joke. Mashing must not reach past them. */
export const UNSKIPPABLE = new Set([Beat.WIN, Beat.STINGER]);

/** Beat 2. The first thing anyone says, and it is about the wait. */
export const PHONE_LINE = {
  who: '小雨',
  zh: '你來得好慢。',
  en: 'You took ages.',
};

// ── Beat 3: the line-up ──────────────────────────────────────────────────────

/**
 * Two parties bow who can never appear in `defeated`.
 *
 * The van crew are the prologue — they knocked him flat and drove off, and he
 * never laid a hand on them. 二叔 BAN cannot be beaten by fighting at all; the
 * only way past him was to accept his tea and bow, so he has not been defeated
 * either. Both are in the room, and both bow.
 */
export const ALWAYS_PRESENT = [
  {
    id: 'van_crew', total: 3, helped: 0,
    name: { zh: '廂型車的三個人', en: 'The three from the van' },
  },
  {
    id: 'second_uncle', total: 1, helped: 0, teaSet: true,
    name: { zh: '二叔', en: 'Second Uncle' },
  },
];

/** Display names come from the stage rosters, so there is one spelling of each. */
function enemyNames() {
  const out = {};
  for (const stage of STAGES) {
    for (const [type, def] of Object.entries(stage.enemies ?? {})) out[type] = def.name;
  }
  return out;
}

/**
 * Everyone who bows, grouped by who they are.
 *
 * Grouped rather than listed one per person because a thorough run defeats
 * dozens and the screen is 480 wide — and because "六個阿姨" reads as a family,
 * which is the joke, where six identical figures reads as a crowd.
 */
export function buildLineup(roster = {}) {
  const names = enemyNames();
  const helpedIds = new Set((roster.members ?? []).map((m) => m.id));

  const byType = new Map();
  for (const d of roster.defeated ?? []) {
    const row = byType.get(d.enemyType)
      ?? { id: d.enemyType, enemyType: d.enemyType, total: 0, helped: 0, name: names[d.enemyType] };
    row.total += 1;
    if (helpedIds.has(d.id)) row.helped += 1;
    byType.set(d.enemyType, row);
  }

  const rows = [...byType.values(), ...ALWAYS_PRESENT.map((g) => ({ ...g }))];
  return { rows, total: rows.reduce((n, r) => n + r.total, 0) };
}

// ── Beat 3b: the fruit shop owner ────────────────────────────────────────────

/**
 * She bows, walks past him, and sits down at the table. She is an aunt, she was
 * never briefed, and from his side she is a stranger whose livelihood he either
 * was or was not careful with.
 *
 * Neither line is an insult. She states a fact and then feeds him anyway, which
 * is how everyone in this family expresses everything.
 */
export const AUNT_LINES = {
  spared: { who: '水果店老闆娘', zh: '那顆瓜我留著了。', en: 'I kept that melon.' },
  wrecked: { who: '水果店老闆娘', zh: '那顆瓜很貴。', en: 'That melon was expensive.' },
};

export const auntLine = (spared) => (spared ? AUNT_LINES.spared : AUNT_LINES.wrecked);

/** ENDING sub-pacing: one line at a time, then the verdict. */
export const ENDING_LINE_STEPS = 110;
export const ENDING_VERDICT_STEPS = 200;

export function createReveal(grade, opts = {}) {
  const tier = opts.tier ?? 'on_time';
  const spareFruitStall = !!opts.spareFruitStall;
  return {
    grade,
    tier,
    spareFruitStall,
    ending: endingFor(tier),
    fruit: fruitOffered(tier, spareFruitStall),
    lineup: buildLineup(opts.roster ?? {}),
    beatIndex: 0,
    beatSteps: 0,
    endingLine: 0,
    endingSteps: 0,
    evaluation: createEvaluation(grade, { candidateName: opts.candidateName }),
  };
}

export const currentBeat = (s) => BEAT_ORDER[s.beatIndex];

/** True once a beat has been reached, so earlier beats stay on screen. */
export function reached(s, beat) {
  return s.beatIndex >= BEAT_ORDER.indexOf(beat);
}

/** 0..1 through the current beat, for anything that animates in. */
export function beatProgress(s) {
  const dwell = DWELL[currentBeat(s)];
  return Number.isFinite(dwell) ? Math.min(1, s.beatSteps / dwell) : 1;
}

function advance(s) {
  s.beatIndex += 1;
  s.beatSteps = 0;
}

/**
 * The ending is paced by its own dialogue rather than a dwell, because the
 * number of lines depends on how late he was — five if he kept her waiting
 * through the whole meal, two if he did not.
 */
function advanceEndingBeat(s, skipPressed) {
  s.endingSteps += 1;
  const done = s.endingLine >= s.ending.lines.length;
  const hold = done ? ENDING_VERDICT_STEPS : ENDING_LINE_STEPS;

  if (s.endingSteps >= hold || skipPressed) {
    s.endingSteps = 0;
    if (done) advance(s);
    else s.endingLine += 1;
  }
}

/** Advance one fixed step. @param intent {skipPressed} — an edge, not a level. */
export function advanceReveal(s, { skipPressed = false } = {}) {
  const beat = currentBeat(s);
  if (beat === Beat.DONE) return s;

  s.beatSteps += 1;

  // The form keeps its own clock, and its own rule about what may be skipped.
  if (beat === Beat.FORM) {
    advanceEvaluation(s.evaluation, { skipPressed });
    if (formBeat(s.evaluation) === FormBeat.DONE) advance(s);
    return s;
  }

  if (beat === Beat.ENDING) {
    advanceEndingBeat(s, skipPressed);
    return s;
  }

  const maySkip = skipPressed && !UNSKIPPABLE.has(beat);
  if (s.beatSteps >= DWELL[beat] || maySkip) advance(s);
  return s;
}

// ── Drawing ──────────────────────────────────────────────────────────────────

const ROOM = '#1A1520';
const INK = '#F2EDE2';
const DIM = '#8A8296';

/** A line of dialogue, attributed. Nobody in this room raises their voice. */
function speech(ctx, y, who, zh) {
  ctx.fillStyle = DIM;
  ctx.font = '8px monospace';
  ctx.fillText(who, 96, y);
  ctx.fillStyle = INK;
  ctx.fillText(`「${zh}」`, 96, y + 12);
}

export function drawReveal(ctx, s) {
  const beat = currentBeat(s);

  if (beat === Beat.FORM) {
    drawEvaluation(ctx, s.evaluation);
    return;
  }

  ctx.fillStyle = ROOM;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  if (beat === Beat.WIN) {
    // Deliberately almost nothing. He is breathing hard and waiting for
    // something to happen, and the room is eight people having dinner.
    ctx.fillStyle = DIM;
    ctx.font = '8px monospace';
    ctx.fillText('...', 232, 140);
    return;
  }

  if (beat === Beat.PHONE) {
    speech(ctx, 130, PHONE_LINE.who, PHONE_LINE.zh);
    return;
  }

  if (beat === Beat.LINEUP) {
    // They file in over the beat, dust themselves off, and bow. The ones he
    // helped up are already standing when they arrive.
    const rows = s.lineup.rows;
    const shown = Math.ceil(beatProgress(s) * rows.length);
    ctx.font = '8px monospace';
    for (let i = 0; i < shown && i < rows.length; i += 1) {
      const r = rows[i];
      ctx.fillStyle = r.helped > 0 ? '#F2C75C' : INK;
      const label = r.name?.zh ?? r.id;
      ctx.fillText(r.total > 1 ? `${label} ×${r.total}` : label, 96, 60 + i * 12);
    }
    return;
  }

  if (beat === Beat.AUNT) {
    const line = auntLine(s.spareFruitStall);
    speech(ctx, 130, line.who, line.zh);
    // She walks past him and sits down. She is family; he has never met her.
    ctx.fillStyle = DIM;
    ctx.fillText('她走過他身邊,坐了下來。', 96, 168);
    return;
  }

  if (beat === Beat.FORM_SLIDE) {
    // The form arrives before it is read. His name is already on it.
    ctx.fillStyle = '#EFE7D6';
    const slide = beatProgress(s);
    ctx.fillRect(96 + Math.round((1 - slide) * 60), 120, 220, 40);
    return;
  }
}
