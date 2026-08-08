import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildServer } from '../../server/index.js';

// The whole point of shared/: the browser imports the very modules Node does,
// so scoring exists exactly once and the client cannot drift from the server.
// If this route breaks, the evaluation form silently disagrees with the
// leaderboard and nothing else fails loudly.
test('serves shared/ modules over HTTP for the browser', async () => {
  const app = await buildServer();
  for (const file of ['scoring.js', 'characters.js', 'validation.js']) {
    const res = await app.inject({ method: 'GET', url: `/shared/${file}` });
    assert.equal(res.statusCode, 200, `/shared/${file} should serve`);
    assert.match(res.headers['content-type'], /javascript/, `${file} needs a JS content type`);
    assert.match(res.body, /export /, `${file} should be an ES module`);
  }
  await app.close();
});

test('serves the game at the site root', async () => {
  const app = await buildServer();
  const res = await app.inject({ method: 'GET', url: '/index.html' });
  assert.equal(res.statusCode, 200);
  assert.match(res.body, /<canvas[^>]+id="screen"/);
  assert.match(res.body, /width="480"/);
  assert.match(res.body, /height="270"/);
  await app.close();
});

test('GET /healthz returns ok', async () => {
  const app = await buildServer();
  const res = await app.inject({ method: 'GET', url: '/healthz' });
  assert.equal(res.statusCode, 200);
  assert.equal(res.json().status, 'ok');
  await app.close();
});

test('buildServer does not listen — tests must not bind a port', async () => {
  const app = await buildServer();
  assert.equal(app.server.listening, false);
  await app.close();
});

test('unknown paths 404 rather than leaking the filesystem', async () => {
  const app = await buildServer();
  for (const url of ['/nope.txt', '/js/does-not-exist.js']) {
    const res = await app.inject({ method: 'GET', url });
    assert.equal(res.statusCode, 404, `${url} should 404`);
  }
  await app.close();
});

/**
 * Every module the game imports must actually serve.
 *
 * This is the asymmetric failure SPEC.md §2.3 is about, in its other form: a
 * new file under game/js that the static route does not reach is a 404 in the
 * browser and a dead game, while every Node test stays green because Node reads
 * it straight off the disk. Walking the tree rather than listing names means a
 * module added later is covered without anyone remembering to add it here.
 */
test('every game module serves over HTTP, not just off the disk', async () => {
  const { readdirSync, statSync } = await import('node:fs');
  const { join, sep } = await import('node:path');

  const walk = (dir, out = []) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) walk(p, out);
      else if (name.endsWith('.js')) out.push(p.split(sep).join('/'));
    }
    return out;
  };

  const app = await buildServer();
  const failures = [];
  for (const file of walk('game/js')) {
    const url = file.replace(/^game/, '');
    const res = await app.inject({ method: 'GET', url });
    if (res.statusCode !== 200) failures.push(`${url} → ${res.statusCode}`);
  }
  await app.close();

  assert.deepEqual(failures, [], `these 404 in the browser: ${failures.join(', ')}`);
});
