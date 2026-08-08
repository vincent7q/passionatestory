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
import { endingFor, fruitOffered, POST_CREDITS, SHE_MOUTHS } from './ending.js';
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

// ── The ending ───────────────────────────────────────────────────────────────

/** ENDING sub-pacing: one line at a time, then the verdict. */
export const ENDING_LINE_STEPS = 110;
export const ENDING_VERDICT_STEPS = 200;

/** True once every line has been said and only the verdict is left. */
export const verdictReached = (s) => s.endingLine >= s.ending.lines.length;

/**
 * She mouths it across the table without a sound — her father is sitting right
 * there, and he has just spent four minutes pretending this was a fight.
 *
 * Only if he was approved. Arrive after the plates are cleared and there is
 * nothing to mouth, which is the point of arriving then.
 */
export const sheMouthsIt = (s) => !!s.ending.approved;

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

/**
 * THE WHOLE REVEAL HAPPENS IN ONE ROOM, AND THE ROOM IS ALWAYS DRAWN.
 *
 * This was got wrong first time and it is worth recording why, because the
 * mistake is easy to repeat. PRD §8 beat 1 is "he wins, nothing happens next,
 * hold on this" — and that was implemented as a near-empty screen. On a monitor
 * it read as a crash, not as a held beat.
 *
 * The stillness is in the ACTION, not the picture. He is standing in the
 * wreckage of a dining room breathing hard, and eight people are calmly having
 * dinner around a round table. Nobody runs, nobody calls for help, nobody so
 * much as looks up. That image IS the joke, and a black screen cannot tell it.
 *
 * So every dining-room beat paints the room first and its own content on top,
 * which also makes the sequence read as one continuous moment rather than a
 * slideshow of captions. Only three beats legitimately leave the room: FORM and
 * FILE are the paperwork, full-screen on paper, and POST_CREDITS is a title
 * card.
 */
const ROOM = '#1A1520';
const FLOOR = '#241E2C';
const CLOTH = '#4A3A4E';
const SHADOW = '#2A2130';
const INK = '#F2EDE2';
const DIM = '#8A8296';
const GOLD = '#F2C75C';
const SKIN = '#E8B48E';

/** The table is round in both docs, matching the lazy Susan arena. */
const TABLE = { cx: 250, cy: 166, rx: 104, ry: 33 };

/** Eight of them. Nobody is ever rude, and nobody ever looks up. */
const DINER_SHIRTS = ['#6B7A8F', '#8F6B7A', '#7A8F6B', '#8F836B',
  '#6B8F87', '#7A6B8F', '#8F6B6B', '#6B8F6B'];

function ellipse(ctx, cx, cy, rx, ry, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * A person, in the flat style the rest of the game draws in. `bowed` drops the
 * head and shortens the body — that is the whole of the bow, and at this scale
 * it is enough to read.
 */
function figure(ctx, x, y, { shirt = DINER_SHIRTS[0], h = 20, bowed = false, gold = false } = {}) {
  const top = Math.round(y - (bowed ? h - 5 : h));
  ctx.fillStyle = gold ? GOLD : SKIN;
  ctx.fillRect(Math.round(x) - 3, top, 6, 6);
  ctx.fillStyle = shirt;
  ctx.fillRect(Math.round(x) - 4, top + 6, 8, (bowed ? h - 5 : h) - 6);
}

/** Seats around the round table, back row first so near diners draw in front. */
function seats() {
  return DINER_SHIRTS.map((shirt, i) => {
    const a = (Math.PI * 2 * i) / DINER_SHIRTS.length - Math.PI / 2;
    return {
      x: TABLE.cx + Math.cos(a) * (TABLE.rx + 12),
      y: TABLE.cy + Math.sin(a) * (TABLE.ry + 16),
      shirt,
    };
  });
}

/** The candidate. He is the only one standing, and the only one out of breath. */
function candidate(ctx, x = 52, y = 214) {
  figure(ctx, x, y, { shirt: '#C9CED6', h: 30 });
}

/**
 * The room. Dinner is on the table and going cold; a chair is over from the
 * fight nobody has mentioned.
 */
export function drawRoom(ctx, { wreckage = true } = {}) {
  ctx.fillStyle = ROOM;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = FLOOR;
  ctx.fillRect(0, 118, WIDTH, HEIGHT - 118);

  // A warm pool of light over the table. The rest of the house is dark.
  ellipse(ctx, TABLE.cx, TABLE.cy, TABLE.rx + 46, TABLE.ry + 34, 'rgba(242,199,92,0.05)');
  ellipse(ctx, TABLE.cx, TABLE.cy, TABLE.rx + 22, TABLE.ry + 16, 'rgba(242,199,92,0.05)');

  const all = seats();
  for (const s of all.filter((p) => p.y <= TABLE.cy)) figure(ctx, s.x, s.y, { shirt: s.shirt });

  ellipse(ctx, TABLE.cx, TABLE.cy + 4, TABLE.rx, TABLE.ry, SHADOW);
  ellipse(ctx, TABLE.cx, TABLE.cy, TABLE.rx, TABLE.ry, CLOTH);

  // Eight dishes going round, and the lazy Susan they sit on.
  ellipse(ctx, TABLE.cx, TABLE.cy, TABLE.rx * 0.52, TABLE.ry * 0.52, '#55425A');
  for (let i = 0; i < 8; i += 1) {
    const a = (Math.PI * 2 * i) / 8;
    ellipse(ctx, TABLE.cx + Math.cos(a) * TABLE.rx * 0.66,
      TABLE.cy + Math.sin(a) * TABLE.ry * 0.66, 7, 3, '#C9BFA8');
  }

  for (const s of all.filter((p) => p.y > TABLE.cy)) figure(ctx, s.x, s.y, { shirt: s.shirt });

  // Nobody has mentioned the fight, and nobody has picked the chair up.
  if (wreckage) {
    ctx.fillStyle = SHADOW;
    ctx.fillRect(96, 226, 22, 6);
    ctx.fillRect(96, 232, 5, 12);
    ctx.fillRect(404, 210, 18, 5);
  }
}

/** A line of dialogue, attributed. Nobody in this room raises their voice. */
function speech(ctx, y, who, zh) {
  // A panel behind it, so text never has to compete with the room.
  ctx.fillStyle = 'rgba(12,10,18,0.82)';
  ctx.fillRect(20, y - 12, WIDTH - 40, 30);
  ctx.fillStyle = DIM;
  ctx.font = '8px monospace';
  ctx.fillText(who, 30, y);
  ctx.fillStyle = INK;
  ctx.fillText(`「${zh}」`, 30, y + 12);
}

/**
 * The beats that happen at the table, and therefore paint the room.
 *
 * The three that do not: FORM and FILE are the paperwork and fill the screen
 * with paper, and POST_CREDITS is a title card — 「第2次」 over the dining room
 * would read as part of the scene rather than as the credits.
 */
const ROOM_BEATS = new Set([
  Beat.WIN, Beat.PHONE, Beat.LINEUP, Beat.AUNT, Beat.FORM_SLIDE,
  Beat.STINGER, Beat.ENDING,
]);

export function drawReveal(ctx, s) {
  const beat = currentBeat(s);

  if (beat === Beat.FORM) {
    drawEvaluation(ctx, s.evaluation);
    return;
  }

  // See the note above drawRoom — a black screen reads as a crash, not a beat.
  if (ROOM_BEATS.has(beat)) drawRoom(ctx);
  else {
    ctx.fillStyle = ROOM;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  }
  ctx.font = '8px monospace';

  if (beat === Beat.WIN) {
    // He is the only one standing. Nothing else happens, and that is the beat:
    // eight people eating, and a man who came here to rescue someone.
    candidate(ctx);
    return;
  }

  if (beat === Beat.PHONE) {
    candidate(ctx);
    // She puts the phone down. It is the first thing anyone says all evening.
    ctx.fillStyle = SHADOW;
    ctx.fillRect(300, 138, 6, 4);
    speech(ctx, 34, PHONE_LINE.who, PHONE_LINE.zh);
    return;
  }

  if (beat === Beat.LINEUP) {
    // They file in behind him over the beat, dust themselves off, and bow. The
    // ones he helped up are gold — he has no idea that is what he is looking at.
    const rows = s.lineup.rows;
    const shown = Math.ceil(beatProgress(s) * rows.length);
    const people = [];
    for (let i = 0; i < shown && i < rows.length; i += 1) {
      for (let n = 0; n < rows[i].total; n += 1) people.push(rows[i]);
    }

    const gap = Math.min(34, (WIDTH - 80) / Math.max(1, people.length));
    people.forEach((r, i) => {
      figure(ctx, 46 + i * gap, 246, { shirt: '#6B7A8F', h: 22, bowed: true, gold: r.helped > 0 });
    });
    candidate(ctx, 24, 246);

    // The roll call of everyone he beat tonight, off to the side.
    for (let i = 0; i < shown && i < rows.length; i += 1) {
      const r = rows[i];
      ctx.fillStyle = r.helped > 0 ? GOLD : DIM;
      const label = r.name?.zh ?? r.id;
      ctx.fillText(r.total > 1 ? `${label} ×${r.total}` : label, 12, 26 + i * 11);
    }
    return;
  }

  if (beat === Beat.AUNT) {
    // She bows, walks past him, and sits down. She is an aunt. From where he is
    // standing she is a stranger whose melon he did or did not wreck.
    const walk = beatProgress(s);
    candidate(ctx, 24, 246);
    figure(ctx, 60 + walk * 150, 244 - walk * 26,
      { shirt: '#8F6B7A', h: 22, bowed: walk < 0.25 });
    speech(ctx, 34, auntLine(s.spareFruitStall).who, auntLine(s.spareFruitStall).zh);
    return;
  }

  if (beat === Beat.FORM_SLIDE) {
    // He slides it across the table. His name is already on it, and it is
    // mostly already filled in.
    candidate(ctx, 24, 246);
    const slide = beatProgress(s);
    const x = Math.round(TABLE.cx + 40 - slide * 150);
    ctx.fillStyle = SHADOW;
    ctx.fillRect(x + 2, TABLE.cy - 6, 74, 28);
    ctx.fillStyle = '#EFE7D6';
    ctx.fillRect(x, TABLE.cy - 8, 74, 28);
    ctx.fillStyle = '#8A8296';
    for (let i = 0; i < 4; i += 1) ctx.fillRect(x + 6, TABLE.cy - 2 + i * 6, 50 - i * 8, 1);
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
    candidate(ctx, 24, 246);

    // The door is in, and three men in black are through it. Real ones. They go
    // down one at a time and NOBODY AT THE TABLE STANDS UP — the family is
    // still seated and still eating in the room drawn underneath this.
    ctx.fillStyle = SHADOW;
    ctx.fillRect(430, 96, 44, 78);
    for (let i = 0; i < STINGER_INTRUDERS; i += 1) {
      const x = 392 - i * 30;
      if (i < down) {
        ctx.fillStyle = '#3A3448';                       // down, and staying down
        ctx.fillRect(x - 10, 250, 22, 5);
      } else {
        figure(ctx, x, 248, { shirt: '#2B2B33', h: 26 });
      }
    }

    // She does one of them one-handed, and the question is not rhetorical.
    if (soupAsked(s) && down < STINGER_INTRUDERS) {
      speech(ctx, 34, SOUP_LINE.who, SOUP_LINE.zh);
    }

    // He writes it on the form first. 小雨 does not look up.
    if (stingerLineShown(s)) speech(ctx, 34, STINGER_LINE.who, STINGER_LINE.zh);
    return;
  }

  if (beat === Beat.ENDING) {
    // Higher up than in the other beats: the verdict panel owns the bottom of
    // the screen here, and a figure drawn behind it just disappears.
    candidate(ctx, 26, 202);

    // Which room he walked into. Not scored — it cost him nothing on the form
    // and everything here.
    ctx.fillStyle = 'rgba(12,10,18,0.82)';
    ctx.fillRect(20, 14, WIDTH - 40, 16);
    ctx.fillStyle = DIM;
    ctx.fillText(s.ending.stage.zh, 26, 25);

    // Lines land one at a time and stay up, so the room fills rather than flicks.
    const shown = Math.min(s.endingLine, s.ending.lines.length);
    if (shown > 0) {
      ctx.fillStyle = 'rgba(12,10,18,0.82)';
      ctx.fillRect(20, 36, WIDTH - 40, 8 + shown * 12);
      for (let i = 0; i < shown; i += 1) {
        const l = s.ending.lines[i];
        ctx.fillStyle = DIM;
        ctx.fillText(l.who, 26, 48 + i * 12);
        ctx.fillStyle = INK;
        ctx.fillText(`「${l.zh}」`, 74, 48 + i * 12);
      }
    }

    if (verdictReached(s)) {
      // The plate, slid across without eye contact. The highest honour in this
      // game, and nobody will ever mention it.
      if (s.fruit.offered) {
        ellipse(ctx, TABLE.cx - 40, TABLE.cy - 2, 13, 6, '#EFE7D6');
        ellipse(ctx, TABLE.cx - 40, TABLE.cy - 3, 9, 4, '#8FBF6A');
      }

      ctx.fillStyle = 'rgba(12,10,18,0.86)';
      ctx.fillRect(20, 208, WIDTH - 40, sheMouthsIt(s) ? 42 : 28);

      // No sound. Her father is sitting right there.
      if (sheMouthsIt(s)) {
        ctx.fillStyle = DIM;
        ctx.fillText(`小雨(無聲)「${SHE_MOUTHS.zh}」`, 26, 220);
      }

      ctx.fillStyle = INK;
      ctx.fillText(`林建國「${s.ending.verdict.zh}」`, 26, sheMouthsIt(s) ? 240 : 226);
    }
    return;
  }

  if (beat === Beat.POST_CREDITS) {
    // It begins again, it is harder, and he still does not know what is coming.
    ctx.fillStyle = INK;
    ctx.font = '16px monospace';
    ctx.fillText(POST_CREDITS.zh, 210, 140);
  }
}
