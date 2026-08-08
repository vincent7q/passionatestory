/**
 * A module resolver that does for Node what the server does for the browser.
 *
 * main.js imports shared/ ABSOLUTELY — `/shared/scoring.js` — because that is
 * the only form that works in the browser, where game/ is served at / and
 * shared/ at /shared/. See SPEC.md §2.3, and test/game/imports.test.js, which
 * requires exactly that form.
 *
 * On disk it resolves to C:\shared\scoring.js, which is nowhere. That is the
 * single reason main.js has never been importable in Node, and therefore the
 * single reason it has been the only untested file in the project.
 *
 * This hook maps the specifier the same way @fastify/static does at runtime, so
 * the test loads the very same file the browser would.
 */

import { fileURLToPath, pathToFileURL } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));

export async function resolve(specifier, context, next) {
  if (specifier.startsWith('/shared/')) {
    return { url: pathToFileURL(join(ROOT, specifier)).href, shortCircuit: true };
  }
  return next(specifier, context);
}
