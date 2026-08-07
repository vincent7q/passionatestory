import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (name.endsWith('.js')) out.push(p.replaceAll('\\', '/'));
  }
  return out;
}

const GAME_FILES = walk('game/js');

/**
 * SPEC.md §2.3. game/ is served at / while shared/ is served at /shared/, so
 * the two trees sit at different depths on disk and in the browser. A relative
 * import of shared/ from a deep game module therefore works in exactly ONE
 * environment, and the failure is asymmetric: every Node test passes while the
 * game 404s in the browser, or the reverse.
 *
 * Only main.js may reach shared/, and only via the absolute /shared/ form.
 */
test('only main.js imports shared/', () => {
  const offenders = GAME_FILES
    .filter((f) => !f.endsWith('game/js/main.js'))
    .filter((f) => /from\s+['"][^'"]*shared\//.test(readFileSync(f, 'utf8')));

  assert.deepEqual(offenders, [],
    `these must take the data as a parameter instead: ${offenders.join(', ')}`);
});

test('main.js imports shared/ absolutely, never relatively', () => {
  const src = readFileSync('game/js/main.js', 'utf8');
  const specifiers = [...src.matchAll(/from\s+['"]([^'"]*shared\/[^'"]*)['"]/g)].map((m) => m[1]);
  assert.ok(specifiers.length > 0, 'main.js is expected to wire shared/ in');
  for (const s of specifiers) {
    assert.ok(s.startsWith('/shared/'),
      `"${s}" must be absolute — a relative form breaks in one environment or the other`);
  }
});

/**
 * The same trap in reverse. shared/ is fetched by the browser over HTTP, so a
 * Node-only import there breaks the game at runtime while every server-side
 * test stays green.
 */
test('shared/ imports nothing Node-only', () => {
  for (const f of walk('shared')) {
    const src = readFileSync(f, 'utf8');
    for (const banned of ["from 'node:", 'from "node:', 'require(', 'process.']) {
      assert.ok(!src.includes(banned), `${f} contains ${banned}`);
    }
  }
});

test('every game module resolves its relative imports to a real file', () => {
  const missing = [];
  for (const f of GAME_FILES) {
    const dir = f.slice(0, f.lastIndexOf('/'));
    for (const [, spec] of readFileSync(f, 'utf8').matchAll(/from\s+['"](\.[^'"]+)['"]/g)) {
      try {
        statSync(join(dir, spec));
      } catch {
        missing.push(`${f} → ${spec}`);
      }
    }
  }
  assert.deepEqual(missing, [], `broken relative imports: ${missing.join(', ')}`);
});
