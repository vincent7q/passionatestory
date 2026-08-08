import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  Beat, BEAT_ORDER, DWELL, UNSKIPPABLE, PHONE_LINE, ALWAYS_PRESENT, AUNT_LINES,
  FILE_ENTRIES, FILE_OPENING, FILE_START,
  STINGER_INTRUDERS, STINGER_LINE, SOUP_LINE,
  createReveal, currentBeat, reached, advanceReveal, beatProgress,
  buildLineup, auntLine, fileEntriesShown, riderWaves,
  intrudersDown, soupAsked, stingerLineShown,
} from '../../game/js/ui/reveal.js';
import { createRoster, addToRoster, recordDefeat } from '../../game/js/entities/ally.js';
import { FATHER_SCORE } from '../../shared/scoring.js';
import {
  Beat as FormBeat, BEAT_ORDER as FORM_ORDER, DWELL as FORM_DWELL,
} from '../../game/js/ui/evaluation.js';

/**
 * PRD §8. The reveal is the twenty minutes paying off, and the ONLY thing that
 * can break it is pacing — a beat that lands before the previous one has
 * registered reads as noise.
 */

const GRADE = { power: 38, money: 19, judgment: 12, total: 69 };

const reveal = (opts = {}) => createReveal(GRADE, { tier: 'on_time', ...opts });

/** Run the machine until `beat`, or blow up. Returns steps taken. */
function runTo(s, beat, { skipPressed = false, limit = 60_000 } = {}) {
  let steps = 0;
  while (currentBeat(s) !== beat) {
    advanceReveal(s, { skipPressed });
    steps += 1;
    assert.ok(steps < limit, `never reached ${beat}, stuck at ${currentBeat(s)}`);
  }
  return steps;
}

// ── The order ────────────────────────────────────────────────────────────────

test('the sequence opens on the win and closes on the post-credits card', () => {
  assert.equal(BEAT_ORDER[0], Beat.WIN);
  assert.equal(BEAT_ORDER.at(-1), Beat.DONE);
  assert.equal(BEAT_ORDER.at(-2), Beat.POST_CREDITS);
});

test('every beat has a dwell, and every dwell names a real beat', () => {
  for (const b of BEAT_ORDER) {
    assert.ok(DWELL[b] !== undefined, `${b} has no dwell — it would flash past`);
  }
  for (const b of Object.keys(DWELL)) {
    assert.ok(BEAT_ORDER.includes(b), `DWELL names ${b}, which is not in the order`);
  }
});

test('the beats run in the order the PRD tells the story in', () => {
  const i = (b) => BEAT_ORDER.indexOf(b);
  // He wins, then she speaks, then they bow, then the aunt sits down.
  assert.ok(i(Beat.WIN) < i(Beat.PHONE));
  assert.ok(i(Beat.PHONE) < i(Beat.LINEUP));
  assert.ok(i(Beat.LINEUP) < i(Beat.AUNT));
  // Only then is the form slid across, and only then read.
  assert.ok(i(Beat.AUNT) < i(Beat.FORM_SLIDE));
  assert.ok(i(Beat.FORM_SLIDE) < i(Beat.FORM));
  // The file is turned to AFTER the form has landed — it is the answer to it.
  assert.ok(i(Beat.FORM) < i(Beat.FILE));
  // The stinger is the last gag, and the ending is genuinely last.
  assert.ok(i(Beat.FILE) < i(Beat.STINGER));
  assert.ok(i(Beat.STINGER) < i(Beat.ENDING));
});

test('DONE is terminal — advancing past the end does not wrap or throw', () => {
  const s = reveal();
  runTo(s, Beat.DONE, { skipPressed: true });
  for (let i = 0; i < 600; i += 1) advanceReveal(s, { skipPressed: true });
  assert.equal(currentBeat(s), Beat.DONE);
});

// ── Beat 1: he wins, and nothing happens ─────────────────────────────────────

/**
 * The single most important pause in the game. He is standing in the wreckage
 * braced for what comes next, and what comes next is a family having dinner.
 * A player who can mash through it never feels the silence.
 */
test('the win holds — nobody runs, nobody calls for help', () => {
  const s = reveal();
  assert.equal(currentBeat(s), Beat.WIN);

  for (let i = 0; i < DWELL[Beat.WIN] - 1; i += 1) {
    advanceReveal(s, { skipPressed: true });
    assert.equal(currentBeat(s), Beat.WIN, 'the silence must not be skippable');
  }
  advanceReveal(s, { skipPressed: true });
  assert.equal(currentBeat(s), Beat.PHONE);
});

/**
 * "Hold on this." Three full seconds of a man braced for consequences that are
 * not coming. The stinger is longer, but the stinger has a fight in it — this
 * is the longest beat in which nothing whatsoever happens.
 */
test('the win holds for at least three seconds', () => {
  assert.ok(DWELL[Beat.WIN] >= 180, `${DWELL[Beat.WIN]} steps is not a held silence`);
});

test('the win outlasts every beat between it and the form', () => {
  const between = BEAT_ORDER
    .slice(BEAT_ORDER.indexOf(Beat.WIN) + 1, BEAT_ORDER.indexOf(Beat.FORM))
    .map((b) => DWELL[b]);
  assert.ok(DWELL[Beat.WIN] > Math.max(...between),
    'if the bowing outlasts the silence, the silence is not the point any more');
});

// ── Beat 2: 小雨 ──────────────────────────────────────────────────────────────

test('her line is the first thing anyone says, and it is about the wait', () => {
  assert.equal(PHONE_LINE.who, '小雨');
  assert.equal(PHONE_LINE.zh, '你來得好慢。');
});

// ── Beat 3: the line-up ──────────────────────────────────────────────────────

/** A roster where `defeated` are ids beaten and `helped` are ids helped up. */
function rosterWith(defeated, helped = []) {
  const r = createRoster();
  for (const [id, enemyType] of defeated) recordDefeat(r, { id, enemyType });
  for (const [id, enemyType] of defeated) {
    if (helped.includes(id)) addToRoster(r, { id, enemyType });
  }
  return r;
}

test('everyone he defeated files in — grouped, and counted honestly', () => {
  const r = rosterWith([
    [1, 'office_worker'], [2, 'office_worker'], [3, 'scalper'],
  ]);
  const rows = buildLineup(r).rows.filter((x) => x.enemyType);

  const office = rows.find((x) => x.enemyType === 'office_worker');
  assert.equal(office.total, 2);
  assert.equal(rows.find((x) => x.enemyType === 'scalper').total, 1);
});

test('the same opponent never bows twice', () => {
  const r = createRoster();
  recordDefeat(r, { id: 7, enemyType: 'scalper' });
  recordDefeat(r, { id: 7, enemyType: 'scalper' });
  assert.equal(buildLineup(r).rows.find((x) => x.enemyType === 'scalper').total, 1);
});

test('the line-up marks who was helped up, and who was only beaten', () => {
  const r = rosterWith([[1, 'office_worker'], [2, 'office_worker']], [1]);
  const office = buildLineup(r).rows.find((x) => x.enemyType === 'office_worker');
  assert.equal(office.total, 2);
  assert.equal(office.helped, 1);
});

/**
 * The three from the van and Second Uncle are there whatever the player did.
 * The van crew were never fought — they are the prologue — and 二叔 cannot be
 * beaten by fighting at all, so neither can ever appear in `defeated`.
 */
test('the van crew and Second Uncle bow even on an empty roster', () => {
  const rows = buildLineup(createRoster()).rows;
  for (const guest of ALWAYS_PRESENT) {
    assert.ok(rows.some((x) => x.id === guest.id), `${guest.id} must be in the line-up`);
  }
});

test('Second Uncle is still holding the tea set', () => {
  const uncle = ALWAYS_PRESENT.find((g) => g.id === 'second_uncle');
  assert.equal(uncle.teaSet, true);
});

test('the van crew are three men, because three men took her', () => {
  assert.equal(ALWAYS_PRESENT.find((g) => g.id === 'van_crew').total, 3);
});

test('the line-up total counts every person bowing, guests included', () => {
  const r = rosterWith([[1, 'office_worker'], [2, 'scalper']]);
  const { rows, total } = buildLineup(r);
  assert.equal(total, rows.reduce((n, x) => n + x.total, 0));
  assert.equal(total, 2 + 3 + 1); // two beaten, three from the van, one uncle
});

test('a defeated toddler is impossible, so she is never in the line-up', () => {
  // 小表妹 cannot be attacked at all — the hit resolver refuses the swing.
  const rows = buildLineup(rosterWith([[1, 'aunt']])).rows;
  assert.ok(!rows.some((x) => x.enemyType === 'toddler'));
});

// ── Beat 3b: the aunt ────────────────────────────────────────────────────────

test('she is still angry about the melon — factually, never rudely', () => {
  assert.equal(auntLine(false).zh, AUNT_LINES.wrecked.zh);
  assert.match(AUNT_LINES.wrecked.zh, /瓜/);
});

test('spare the melon and she says something else entirely', () => {
  assert.equal(auntLine(true).zh, AUNT_LINES.spared.zh);
  assert.notEqual(AUNT_LINES.spared.zh, AUNT_LINES.wrecked.zh);
});

test('neither of her lines is an insult — content rule 1 holds for family too', () => {
  for (const line of Object.values(AUNT_LINES)) {
    assert.equal(line.who, '水果店老闆娘');
    assert.ok(!/[!！?？]/.test(line.zh), `"${line.zh}" is raised, and nobody here raises their voice`);
  }
});

test('the reveal carries the line-up it was given', () => {
  const r = rosterWith([[1, 'office_worker']]);
  const s = reveal({ roster: r });
  assert.ok(s.lineup.total >= 4, 'the van crew and the uncle are always there');
});

// ── Skipping ─────────────────────────────────────────────────────────────────

test('unskippable beats are exactly the ones that carry the joke', () => {
  for (const b of UNSKIPPABLE) {
    assert.ok(BEAT_ORDER.includes(b), `${b} is unskippable but not in the order`);
  }
  assert.ok(UNSKIPPABLE.has(Beat.WIN), 'the silence is the whole gag');
  assert.ok(UNSKIPPABLE.has(Beat.STINGER), 'four seconds, and he does not move');
});

test('a skippable beat advances early on the button, an unskippable one does not', () => {
  const skipped = reveal();
  const patient = reveal();
  runTo(skipped, Beat.PHONE, { skipPressed: true });
  runTo(patient, Beat.PHONE);

  // Both are now on a skippable beat. One presses, one waits.
  advanceReveal(skipped, { skipPressed: true });
  assert.notEqual(currentBeat(skipped), Beat.PHONE);

  for (let i = 0; i < DWELL[Beat.PHONE] - 1; i += 1) advanceReveal(patient, {});
  assert.equal(currentBeat(patient), Beat.PHONE);
});

test('mashing cannot reach the ending faster than the unskippable beats allow', () => {
  const s = reveal();
  const floor = [...UNSKIPPABLE].reduce((n, b) => n + DWELL[b], 0);
  const steps = runTo(s, Beat.ENDING, { skipPressed: true });
  assert.ok(steps >= floor,
    `mashed to the ending in ${steps} steps; the unskippable beats alone are ${floor}`);
});

// ── Progress ─────────────────────────────────────────────────────────────────

test('beat progress runs 0..1 and never exceeds it', () => {
  const s = reveal();
  assert.equal(beatProgress(s), 0);
  for (let i = 0; i < DWELL[Beat.WIN] - 1; i += 1) advanceReveal(s, {});
  const p = beatProgress(s);
  assert.ok(p > 0 && p <= 1, `progress was ${p}`);
});

test('reached() keeps earlier beats on screen and hides later ones', () => {
  const s = reveal();
  runTo(s, Beat.LINEUP, { skipPressed: true });
  assert.ok(reached(s, Beat.WIN));
  assert.ok(reached(s, Beat.PHONE));
  assert.ok(reached(s, Beat.LINEUP));
  assert.ok(!reached(s, Beat.FILE));
});

// ── The form hand-off ────────────────────────────────────────────────────────

test('the form beat carries a real evaluation, built from the grade', () => {
  const s = reveal({ candidateName: '希爾曼' });
  assert.equal(s.evaluation.grade.total, 69);
  assert.equal(s.evaluation.candidateName, '希爾曼');
  assert.equal(s.evaluation.beatIndex, 0, 'the form must not have started early');
});

test('the form beat waits for the evaluation rather than a dwell', () => {
  const s = reveal();
  runTo(s, Beat.FORM, { skipPressed: true });

  // Far longer than any dwell in the table. The form is still up, because the
  // form ends when the form says so.
  for (let i = 0; i < 400; i += 1) advanceReveal(s, {});
  assert.equal(currentBeat(s), Beat.FORM);
  assert.notEqual(s.evaluation.beatIndex, 0, 'the embedded form should be running');
});

test('the reveal leaves the form only once it reaches its own DONE', () => {
  const s = reveal();
  runTo(s, Beat.FORM, { skipPressed: true });
  runTo(s, Beat.FILE, { skipPressed: true });
  assert.equal(s.evaluation.beatIndex, Object.keys(FormBeat).length - 1);
});

/**
 * The pleased pause is load-bearing and confirmed by eye (progress.md,
 * 2026-08-07). Mashing through the reveal must not fast-forward it.
 */
// ── T81: the form, then 71 ───────────────────────────────────────────────────

/** 「候選人:」 — his name is on it, and it is mostly already filled in. */
test('the form slid across the table already has his name on it', () => {
  const s = reveal({ candidateName: '盧西安' });
  runTo(s, Beat.FORM_SLIDE, { skipPressed: true });
  assert.equal(s.evaluation.candidateName, '盧西安');
});

/**
 * 71 is 林建國's score and it lives in shared/scoring.js, where the leaderboard
 * seed also reads it. If the form re-hardcoded it, changing the constant would
 * move the bar on the board and leave the reveal claiming the old number.
 */
test("the father's score is threaded in, not re-hardcoded", () => {
  const s = createReveal(GRADE, { tier: 'on_time', fatherScore: 77 });
  assert.equal(s.evaluation.fatherScore, 77);
});

test('the father figure defaults to the one shared/scoring.js publishes', () => {
  assert.equal(reveal().evaluation.fatherScore, FATHER_SCORE);
});

test("the father's score never moves with the candidate's", () => {
  const weak = createReveal({ power: 5, money: 1, judgment: 0, total: 6 }, {});
  const strong = createReveal({ power: 40, money: 20, judgment: 40, total: 100 }, {});
  assert.equal(weak.evaluation.fatherScore, strong.evaluation.fatherScore);
});

test('the form is reached only after the whole line-up has bowed', () => {
  const s = reveal();
  runTo(s, Beat.FORM, { skipPressed: true });
  assert.ok(reached(s, Beat.LINEUP));
  assert.ok(reached(s, Beat.AUNT));
});

/** The page is turned AFTER the 71 has landed — the file is the answer to it. */
test('the file is not reached until the father line and the quote have shown', () => {
  const s = reveal();
  runTo(s, Beat.FILE, { skipPressed: true });
  const order = Object.values(FormBeat);
  assert.equal(s.evaluation.beatIndex, order.length - 1);
  assert.ok(s.evaluation.beatIndex > order.indexOf(FormBeat.FATHER));
  assert.ok(s.evaluation.beatIndex > order.indexOf(FormBeat.QUOTE));
});

// ── T82: beat 7, the file ────────────────────────────────────────────────────

/**
 * The file does not start tonight. It starts the day they met — which means he
 * was being graded on the hidden column two years before he had any idea there
 * was one, and the evidence is two things he did when it cost him something and
 * nobody was keeping score.
 */
test('the file holds exactly two entries — PRD §8 says two, no more', () => {
  assert.equal(FILE_ENTRIES.length, 2);
});

test('neither entry is from tonight', () => {
  for (const e of FILE_ENTRIES) {
    assert.ok(e.when?.zh, `${e.id} is undated — the date is the whole point`);
    assert.ok(!/今天|今晚/.test(e.when.zh), `${e.id} is from tonight`);
  }
});

test('he paid first, in a café, two years ago', () => {
  const cafe = FILE_ENTRIES[0];
  assert.equal(cafe.note.zh, '他先付錢。');
  assert.match(cafe.when.zh, /兩年/);
});

/** The one that carries the game: an act with no witness, and it was witnessed. */
test('the second entry is a kindness he thought nobody saw', () => {
  assert.equal(FILE_ENTRIES[1].note.zh, '他以為沒人看到。');
});

test('the opening line says the file predates tonight', () => {
  assert.ok(!/今天開始|今晚開始/.test(FILE_START.zh));
  assert.match(FILE_OPENING.zh, /不是今天/);
});

test('the entries turn up one at a time, and both are read by the end', () => {
  const s = reveal();
  runTo(s, Beat.FILE, { skipPressed: true });
  assert.equal(fileEntriesShown(s), 0, 'the page has only just been turned');

  const seen = new Set();
  for (let i = 0; i < DWELL[Beat.FILE] - 1; i += 1) {
    advanceReveal(s, {});
    seen.add(fileEntriesShown(s));
  }
  assert.deepEqual([...seen].sort(), [0, 1, 2], 'each entry must get the screen to itself');
  assert.equal(fileEntriesShown(s), FILE_ENTRIES.length);
});

test('the entry count never runs past the entries that exist', () => {
  const s = reveal();
  runTo(s, Beat.FILE, { skipPressed: true });
  for (let i = 0; i < 5000; i += 1) {
    assert.ok(fileEntriesShown(s) <= FILE_ENTRIES.length);
    advanceReveal(s, {});
  }
});

/**
 * The delivery rider he fought in stage 1 brings his food every week. He waves.
 * He can only wave if he is actually in the room, which means the player fought
 * him — so this reads the line-up rather than asserting it.
 */
test('the delivery rider waves, having been fought in stage 1', () => {
  const r = rosterWith([[1, 'delivery_rider']]);
  assert.equal(riderWaves(createReveal(GRADE, { roster: r })), true);
});

test('a rider never met does not wave from a room he is not in', () => {
  const r = rosterWith([[1, 'office_worker']]);
  assert.equal(riderWaves(createReveal(GRADE, { roster: r })), false);
});

// ── T83: the stinger ─────────────────────────────────────────────────────────

test('three men kick the door in, and there are three of them', () => {
  assert.equal(STINGER_INTRUDERS, 3);
});

test('four seconds, taken literally from PRD §8.2', () => {
  assert.equal(DWELL[Beat.STINGER], 4 * 60);
});

/**
 * THE CANDIDATE DOES NOT MOVE. He has just learned nothing tonight was real, he
 * cannot tell any more, and he is not going to be made a fool of twice.
 *
 * This is the one fight in the game he takes no part in, and that is the joke —
 * so it must resolve on its own clock no matter what the player does with the
 * pad. Mashing every button has to produce the identical sequence.
 */
test('he does not move — the stinger ignores the player entirely', () => {
  const still = reveal();
  const mashing = reveal();
  runTo(still, Beat.STINGER, { skipPressed: true });
  runTo(mashing, Beat.STINGER, { skipPressed: true });

  for (let i = 0; i < DWELL[Beat.STINGER]; i += 1) {
    assert.equal(intrudersDown(mashing), intrudersDown(still),
      `input changed the stinger at step ${i}`);
    advanceReveal(still, {});
    advanceReveal(mashing, { skipPressed: true });
  }
  assert.equal(currentBeat(still), currentBeat(mashing));
});

test('the family takes all three down, one at a time, inside the four seconds', () => {
  const s = reveal();
  runTo(s, Beat.STINGER, { skipPressed: true });
  assert.equal(intrudersDown(s), 0, 'the door has only just come in');

  const seen = new Set();
  for (let i = 0; i < DWELL[Beat.STINGER] - 1; i += 1) {
    advanceReveal(s, {});
    seen.add(intrudersDown(s));
  }
  assert.deepEqual([...seen].sort(), [0, 1, 2, 3], 'they go down one at a time, not together');
  assert.equal(intrudersDown(s), STINGER_INTRUDERS);
});

test('nobody leaves the table, so nobody can be taken down twice', () => {
  const s = reveal();
  runTo(s, Beat.STINGER, { skipPressed: true });
  let previous = 0;
  for (let i = 0; i < DWELL[Beat.STINGER] - 1; i += 1) {
    advanceReveal(s, {});
    const n = intrudersDown(s);
    assert.ok(n >= previous && n <= STINGER_INTRUDERS, `count went ${previous} → ${n}`);
    previous = n;
  }
});

/** She does one of them one-handed. The soup question is not rhetorical. */
test('the soup is asked about mid-fight, not after it', () => {
  const s = reveal();
  runTo(s, Beat.STINGER, { skipPressed: true });

  let askedWhileFighting = false;
  for (let i = 0; i < DWELL[Beat.STINGER] - 1; i += 1) {
    advanceReveal(s, {});
    if (soupAsked(s) && intrudersDown(s) < STINGER_INTRUDERS) askedWhileFighting = true;
  }
  assert.ok(askedWhileFighting, 'asking after it is over is just a question');
  assert.equal(SOUP_LINE.who, '水果店老闆娘');
});

test('「那個是真的。」 lands only once all three are down', () => {
  const s = reveal();
  runTo(s, Beat.STINGER, { skipPressed: true });
  for (let i = 0; i < DWELL[Beat.STINGER] - 1; i += 1) {
    advanceReveal(s, {});
    if (stingerLineShown(s)) {
      assert.equal(intrudersDown(s), STINGER_INTRUDERS,
        'he would not say it while it was still going on');
    }
  }
  assert.ok(stingerLineShown(s), 'the line has to actually arrive');
  assert.equal(STINGER_LINE.zh, '那個是真的。');
  assert.equal(STINGER_LINE.who, '林建國');
});

/** The last thing he learns is that the evening had one real moment in it. */
test('the stinger is the last thing before the table resolves', () => {
  const i = (b) => BEAT_ORDER.indexOf(b);
  assert.equal(i(Beat.ENDING), i(Beat.STINGER) + 1);
});

test('mashing the reveal cannot skip the pause before the third line', () => {
  const s = reveal();
  runTo(s, Beat.FORM, { skipPressed: true });

  const judgment = FORM_ORDER.indexOf(FormBeat.JUDGMENT);
  const floor = FORM_ORDER.slice(0, judgment).reduce((n, b) => n + FORM_DWELL[b], 0);

  let steps = 0;
  while (s.evaluation.beatIndex < judgment && steps < 10_000) {
    advanceReveal(s, { skipPressed: true });
    steps += 1;
  }
  assert.ok(steps >= floor,
    `reached the third line in ${steps} steps; the pleased pause alone requires ${floor}`);
});
