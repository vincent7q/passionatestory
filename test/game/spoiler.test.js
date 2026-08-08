import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * HARD SUCCESS CRITERION C2 — "the character 禮 never appears on screen before
 * the evaluation form."
 *
 * The twist lives or dies on what the interface reveals, and this is the
 * easiest thing in the project to break by accident. 力 and 錢 sit on the HUD
 * all game and nobody wonders why a *rescue* has a power bar and a money
 * counter, because that is what games look like. The third column has to stay
 * invisible until the form.
 *
 * This test is a blunt instrument and that is deliberate. If it fails, you
 * leaked the twist.
 *
 * Scheduled as T41, brought forward to Phase 4 because that is the phase that
 * added the restraint award rendering — the exact place a label would slip in.
 */

/**
 * The evaluation form and the reveal. These two files ARE the payoff — showing
 * the third column and naming the criteria is their entire job — so every rule
 * below is scoped to "before the form", which means everything except these.
 */
const ALLOWED = new Set([
  'game/js/ui/evaluation.js',
  'game/js/ui/reveal.js',
]);

const guarded = (files) => files.filter((p) => !ALLOWED.has(p));

/**
 * Comments must be stripped before scanning for string literals: an apostrophe
 * in ordinary prose ("a stranger's livelihood") reads as a quote delimiter and
 * turns the surrounding sentence into a phantom string.
 */
function stringLiterals(src) {
  const code = src
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/\/\/.*$/gm, ' ');
  return [...code.matchAll(/'([^'\n]*)'|"([^"\n]*)"|`([^`]*)`/g)]
    .map((m) => m[1] ?? m[2] ?? m[3] ?? '');
}

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(js|html|css)$/.test(name)) out.push(p.replaceAll('\\', '/'));
  }
  return out;
}

test('C2: 禮 never appears outside the evaluation form', () => {
  const offenders = guarded(walk('game'))
    .filter((p) => readFileSync(p, 'utf8').includes('禮'));

  assert.deepEqual(offenders, [],
    `禮 leaked into: ${offenders.join(', ')} — the twist is on screen`);
});

/**
 * The dashboard is guarded for the same reason game/ is, and arguably a
 * stronger one.
 *
 * `GET /api/leaderboard` returns every column including the hidden one, and a
 * leaderboard is the single screen most likely to be up BEFORE somebody plays:
 * at a party, on a second monitor, over a shoulder while they wait for a turn.
 * The HUD gets away with 力 and 錢 because every game has a power bar and a
 * money counter. A named third criterion on a scoreboard invites exactly the
 * question the game spends twenty minutes not answering.
 */
test('C2: the leaderboard does not name the hidden column', () => {
  const offenders = walk('dashboard').filter((p) => readFileSync(p, 'utf8').includes('禮'));
  assert.deepEqual(offenders, [],
    `禮 leaked onto the leaderboard: ${offenders.join(', ')} — visible before anyone plays`);
});

test('C2: the leaderboard does not explain the scoring either', () => {
  const banned = /\b(JUDGMENT|RESTRAINT|MERCY|COURTESY|MANNERS)\b/i;
  const offenders = [];
  for (const p of walk('dashboard')) {
    const bad = stringLiterals(readFileSync(p, 'utf8')).filter((s) => banned.test(s));
    if (bad.length) offenders.push(`${p} (${bad.join(' / ')})`);
  }
  assert.deepEqual(offenders, [], `the board must rank, not explain: ${offenders.join(', ')}`);
});

test('the evaluation form does show the third column — that is its job', () => {
  const src = readFileSync('game/js/ui/evaluation.js', 'utf8');
  assert.ok(src.includes('禮'), 'the payoff must actually name it');
});

/**
 * The clock counts toward 18:00 because that is when dinner is served. Every
 * player reads it as a rescue timer, and it is quietly feeding the hidden
 * column. Labelling it "TIME LEFT" or similar would give the game away.
 */
test('C2: the clock is never labelled', () => {
  const banned = /['"`](\s*)(TIME|TIMER|TIME LEFT|RESCUE|COUNTDOWN|DEADLINE)(\s*)['"`]/i;
  const offenders = guarded(walk('game')).filter((p) => banned.test(readFileSync(p, 'utf8')));
  assert.deepEqual(offenders, [], `the clock must stay a bare number: ${offenders.join(', ')}`);
});

/**
 * Nothing in the game explains the scoring. The pause menu is
 * Resume · Restart Section · Controls · Quit and nothing more.
 */
test('C2: nothing on screen explains the scoring before the form', () => {
  const banned = /\b(JUDGMENT|RESTRAINT|MERCY|COURTESY|MANNERS)\b/i;
  const offenders = [];
  for (const p of guarded(walk('game'))) {
    const bad = stringLiterals(readFileSync(p, 'utf8')).filter((s) => banned.test(s));
    if (bad.length) offenders.push(`${p} (${bad.join(' / ')})`);
  }
  assert.deepEqual(offenders, [], `scoring must never be explained: ${offenders.join(', ')}`);
});

/**
 * Internal identifiers may use judgment/li/REI — this test must not be so
 * broad that it forbids naming the concept in code, only on screen.
 */
test('internal identifiers are still allowed to name the concept', () => {
  const src = readFileSync('shared/scoring.js', 'utf8');
  assert.ok(src.includes('computeJudgment'), 'code may say judgment; the screen may not');
});

/**
 * PRD §16: "Nothing in the game would be inappropriate for a child."
 *
 * Content rule 6 — cartoon violence only. Nobody bleeds, nobody is hurt, nobody
 * stays down. Defeated opponents see stars, sit down, and rub their head.
 *
 * This scans player-facing STRINGS only. It is a blunt instrument and will
 * occasionally catch an innocent word, which is the right trade: the fix is to
 * rename the identifier, as `stab` → `chord` in audio.js already was.
 */
test('no player-facing string suggests real violence', () => {
  const banned = /\b(blood|bleed|gore|corpse|kill|killed|dead|death|dying|stab|shoot|gun|knife|drunk)\b/i;
  const offenders = [];

  for (const p of [...walk('game'), ...walk('shared'), ...walk('dashboard')]) {
    const bad = stringLiterals(readFileSync(p, 'utf8')).filter((s) => banned.test(s));
    if (bad.length) offenders.push(`${p} (${bad.join(' / ')})`);
  }

  assert.deepEqual(offenders, [],
    `this has to stay playable by kids: ${offenders.join(', ')}`);
});
