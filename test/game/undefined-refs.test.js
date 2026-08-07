import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Catches "used but never imported".
 *
 * Every module under game/js is imported by some test, so Node resolves their
 * bindings for us — except main.js, which touches `document` and can never be
 * imported in Node. That leaves exactly one file where a missing import is
 * invisible to both `node --check` (it is valid syntax) and the test suite, and
 * only fails at runtime in a browser.
 *
 * This found a real one: main.js used STEP_MS without importing it.
 */

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (name.endsWith('.js')) out.push(p.replaceAll('\\', '/'));
  }
  return out;
}

/** Every name exported anywhere in game/js or shared/. */
function collectExports() {
  const names = new Set();
  for (const f of [...walk('game/js'), ...walk('shared')]) {
    const src = readFileSync(f, 'utf8');
    for (const [, n] of src.matchAll(/export\s+(?:const|let|function|class)\s+([A-Za-z_$][\w$]*)/g)) {
      names.add(n);
    }
    for (const [, group] of src.matchAll(/export\s*\{([^}]*)\}/g)) {
      for (const part of group.split(',')) {
        const n = part.trim().split(/\s+as\s+/).pop().trim();
        if (n) names.add(n);
      }
    }
  }
  return names;
}

/** Names this file brings in or declares itself. */
function localBindings(src) {
  const bound = new Set();
  for (const [, group] of src.matchAll(/import\s*\{([^}]*)\}\s*from/g)) {
    for (const part of group.split(',')) {
      const n = part.trim().split(/\s+as\s+/).pop().trim();
      if (n) bound.add(n);
    }
  }
  for (const [, n] of src.matchAll(/import\s+([A-Za-z_$][\w$]*)\s+from/g)) bound.add(n);
  for (const [, n] of src.matchAll(/(?:const|let|var|function|class)\s+([A-Za-z_$][\w$]*)/g)) {
    bound.add(n);
  }
  return bound;
}

test('main.js imports everything it references', () => {
  const src = readFileSync('game/js/main.js', 'utf8');
  const exported = collectExports();
  const bound = localBindings(src);

  // Strip comments and strings so prose and labels are not mistaken for code.
  const code = src
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/\/\/.*$/gm, ' ')
    .replace(/'[^']*'|"[^"]*"|`[^`]*`/g, ' ');

  const missing = new Set();
  for (const [, name] of code.matchAll(/\b([A-Za-z_$][\w$]*)\b/g)) {
    if (!exported.has(name)) continue;   // only names some module actually exports
    if (bound.has(name)) continue;       // imported or declared here
    missing.add(name);
  }

  assert.deepEqual([...missing], [],
    `main.js uses these without importing them: ${[...missing].join(', ')}`);
});

test('every other game module resolves under Node', async () => {
  const modules = walk('game/js').filter((f) => !f.endsWith('main.js'));
  for (const f of modules) {
    await assert.doesNotReject(
      () => import(`../../${f}`),
      `${f} failed to load — a missing or broken import`,
    );
  }
});
