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

// ── Beat 7: the file ─────────────────────────────────────────────────────────

/**
 * 林建國 turns the page, and the evening stops being about tonight.
 *
 * The file starts the day they met. He has been graded on the hidden column for
 * two years without knowing there was one, and the evidence is not the fighting
 * — it is two small things he did when they cost him something and nobody was
 * keeping score. The second entry is the whole game in one line.
 *
 * PRD §8 is explicit: TWO entries, no more. A third would turn a quiet proof
 * into a montage, and the point is how little it took.
 */
export const FILE_OPENING = {
  zh: '這份資料不是今天才開始的。',
  en: 'This file did not start today.',
};

export const FILE_START = {
  zh: '是從你們認識那天開始的。',
  en: 'It starts the day the two of you met.',
};

export const FILE_ENTRIES = [
  {
    id: 'cafe',
    when: { zh: '兩年前', en: 'Two years ago' },
    where: { zh: '咖啡店', en: 'A café' },
    note: { zh: '他先付錢。', en: 'He paid first.' },
  },
  {
    id: 'street',
    when: { zh: '去年春天', en: 'Last spring' },
    where: { zh: '路上,幫人撿掉的袋子', en: 'A street — helping a stranger with a dropped bag' },
    note: { zh: '他以為沒人看到。', en: 'He thought no one was watching.' },
  },
];

/**
 * Entries appear one at a time so each gets the screen to itself. The last one
 * lands with roughly a third of the beat left to sit with it.
 */
export function fileEntriesShown(s) {
  if (currentBeat(s) !== Beat.FILE) return reached(s, Beat.FILE) ? FILE_ENTRIES.length : 0;
  const p = beatProgress(s);
  return Math.min(FILE_ENTRIES.length, Math.floor(p * (FILE_ENTRIES.length + 1)));
}

/**
 * The delivery rider from stage 1 is the man who brings his food every week.
 * He waves — but only if he is in the room, which means the player fought him.
 */
export function riderWaves(s) {
  return (s.lineup?.rows ?? []).some((r) => r.enemyType === 'delivery_rider' && r.total > 0);
}

// ── The stinger, PRD §8.2 ────────────────────────────────────────────────────

/**
 * Three men in black kick the door in. Real ones.
 *
 * THE CANDIDATE DOES NOT MOVE, and that is the joke — this is the one fight all
 * evening he takes no part in. He has just learned nothing tonight was real, he
 * cannot tell any more, and he is not going to be made a fool of twice.
 *
 * So the beat runs entirely on its own clock. It reads no input at all, it is
 * in UNSKIPPABLE, and a test mashes every button through it to prove the
 * sequence is identical either way. Give the player agency here and the last
 * gag in the game stops working.
 *
 * The family handles it without leaving the table. 小雨 does not look up.
 */
export const STINGER_INTRUDERS = 3;

/** One second each. Three of them, and then a beat to write on the form. */
export const STINGER_TAKEDOWN_STEPS = 60;

/** She does one of them one-handed, and the question is not rhetorical. */
export const SOUP_LINE = {
  who: '水果店老闆娘',
  zh: '還有人要湯嗎?',
  en: 'Does anyone want more soup?',
};

/** He writes it on the form first. It is the only note he shows the candidate. */
export const STINGER_LINE = {
  who: '林建國',
  zh: '那個是真的。',
  en: 'That one was real.',
};

/** How many of the three are down. Never decreases; nobody gets back up. */
export function intrudersDown(s) {
  if (currentBeat(s) !== Beat.STINGER) return reached(s, Beat.STINGER) ? STINGER_INTRUDERS : 0;
  return Math.min(STINGER_INTRUDERS, Math.floor(s.beatSteps / STINGER_TAKEDOWN_STEPS));
}

/** Asked mid-fight. Asking once it is over would just be a question. */
export function soupAsked(s) {
  if (currentBeat(s) !== Beat.STINGER) return false;
  return intrudersDown(s) >= 1;
}

export function stingerLineShown(s) {
  if (currentBeat(s) !== Beat.STINGER) return reached(s, Beat.ENDING);
  return intrudersDown(s) >= STINGER_INTRUDERS;
}

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
    // fatherScore is threaded from the caller because 71 belongs to
    // shared/scoring.js, which the leaderboard seed reads too. reveal.js may
    // not import shared/ (SPEC.md §2.3), so it arrives as a parameter.
    evaluation: createEvaluation(grade, {
      candidateName: opts.candidateName,
      fatherScore: opts.fatherScore,
    }),
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

  if (beat === Beat.FILE) {
    // Paper again, because this is the same file — he has just turned the page.
    ctx.fillStyle = '#EFE7D6';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = '#241C18';
    ctx.font = '8px monospace';
    ctx.fillText(FILE_OPENING.zh, 96, 44);
    ctx.fillText(FILE_START.zh, 96, 58);

    const shown = fileEntriesShown(s);
    for (let i = 0; i < shown; i += 1) {
      const e = FILE_ENTRIES[i];
      const y = 92 + i * 44;
      ctx.fillStyle = '#8A8296';
      ctx.fillText(`照片 — ${e.where.zh},${e.when.zh}`, 96, y);
      ctx.fillStyle = '#241C18';
      ctx.fillText(`「${e.note.zh}」`, 108, y + 14);
    }

    // He brings the food every week. Nobody remarks on it.
    if (shown >= FILE_ENTRIES.length && riderWaves(s)) {
      ctx.fillStyle = '#8A8296';
      ctx.fillText('外送員向他揮手。', 96, 196);
    }
    return;
  }

  if (beat === Beat.STINGER) {
    const down = intrudersDown(s);

    // Three figures at the door. They go out one at a time and nobody at the
    // table stands up.
    ctx.font = '8px monospace';
    for (let i = 0; i < STINGER_INTRUDERS; i += 1) {
      ctx.fillStyle = i < down ? '#4A4458' : '#F2EDE2';
      ctx.fillRect(150 + i * 60, i < down ? 150 : 120, 12, i < down ? 6 : 36);
    }

    // She is doing one of them one-handed.
    if (soupAsked(s) && down < STINGER_INTRUDERS) {
      ctx.fillStyle = DIM;
      ctx.fillText(`${SOUP_LINE.who}:「${SOUP_LINE.zh}」`, 96, 210);
    }

    // 小雨 does not look up.
    if (stingerLineShown(s)) speech(ctx, 200, STINGER_LINE.who, STINGER_LINE.zh);
  }
}
