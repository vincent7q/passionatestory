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

/** The only files permitted to contain 禮. Its first appearance is the form. */
const ALLOWED = new Set([
  'game/js/ui/evaluation.js',
  'game/js/ui/reveal.js',
]);

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
  const offenders = walk('game').filter((p) =>
    !ALLOWED.has(p) && readFileSync(p, 'utf8').includes('禮'));

  assert.deepEqual(offenders, [],
    `禮 leaked into: ${offenders.join(', ')} — the twist is on screen`);
});

/**
 * The clock counts toward 18:00 because that is when dinner is served. Every
 * player reads it as a rescue timer, and it is quietly feeding the hidden
 * column. Labelling it "TIME LEFT" or similar would give the game away.
 */
test('C2: the clock is never labelled', () => {
  const banned = /['"`](\s*)(TIME|TIMER|TIME LEFT|RESCUE|COUNTDOWN|DEADLINE)(\s*)['"`]/i;
  const offenders = walk('game').filter((p) => banned.test(readFileSync(p, 'utf8')));
  assert.deepEqual(offenders, [], `the clock must stay a bare number: ${offenders.join(', ')}`);
});

/**
 * Nothing in the game explains the scoring. The pause menu is
 * Resume · Restart Section · Controls · Quit and nothing more.
 */
test('C2: nothing on screen explains the scoring', () => {
  const banned = /(JUDGMENT|RESTRAINT|MERCY|COURTESY|MANNERS)\s*[:=]|['"`][^'"`]*\b(judgment|restraint)\s+(score|points|bonus)/i;
  const offenders = walk('game').filter((p) => banned.test(readFileSync(p, 'utf8')));
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
