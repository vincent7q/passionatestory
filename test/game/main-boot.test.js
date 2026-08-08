import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import { installDom, stepFrames, uninstallDom } from '../helpers/dom-stub.js';
import { createReveal, currentBeat as revealBeat, Beat as RevealBeat }
  from '../../game/js/ui/reveal.js';
import { createRoster } from '../../game/js/entities/ally.js';
import { createNameEntry } from '../../game/js/ui/nameEntry.js';

/**
 * main.js, actually running.
 *
 * This file exists because main.js has been the one module no test could reach
 * — it touches `document` at import time — and it is also the only file that
 * has ever shipped a runtime bug in this project. Twice. Both were valid
 * syntax, both passed `node --check`, and both would have surfaced only in a
 * browser nobody had opened yet.
 *
 * Nothing here checks pixels; rendering is verified by eye (SPEC.md §12). What
 * it checks is that the thing boots and the loop turns over.
 */

let handle;
let main;

/** What advanceStage() hands the reveal when 林建國 goes down. */
const makeReveal = () => createReveal(
  { power: 38, money: 19, judgment: 12, total: 69 },
  { candidateName: '菲利克斯', fatherScore: 71, tier: 'on_time', roster: createRoster() },
);

const makeNameEntry = () => createNameEntry('___');

before(async () => {
  // main.js imports `/shared/...`, which only resolves once something plays the
  // part the static server plays in the browser. See helpers/shared-loader.js.
  register('../helpers/shared-loader.js', import.meta.url);
  handle = installDom();
  main = await import('../../game/js/main.js');
});

after(() => uninstallDom());

test('main.js loads under a stub browser without throwing', () => {
  assert.ok(main.game, 'the module must export its game object');
  assert.ok(main.States.REVEAL, 'the reveal is part of the documented machine');
});

test('it asks for a frame as soon as it is loaded', () => {
  assert.ok(handle.pending, 'nothing scheduled — the loop never started');
});

/**
 * The fixed timestep. A second of frames must not throw, and must actually
 * simulate: this is where a missing import or a deleted constant surfaces.
 */
test('the loop runs a full second of frames without throwing', () => {
  const before = main.game.frame;
  stepFrames(handle, 60);
  assert.ok(main.game.frame > before, 'frames were counted');
});

test('the simulation steps roughly 60 times a second, not once per frame', () => {
  const start = main.game.run.durationMs;
  stepFrames(handle, 60);
  const elapsed = main.game.run.durationMs - start;
  assert.ok(elapsed >= 900 && elapsed <= 1100, `a second of frames advanced ${elapsed}ms`);
});

test('the player exists, on the walkable strip, at ground level', () => {
  const { stage } = main.game;
  const p = main.game.world.entities.find((e) => e.kind === 'PLAYER' || e.charId === 'felix');
  assert.ok(p, 'no player in the world');
  assert.ok(p.y >= stage.strip.yMin && p.y <= stage.strip.yMax, 'off the walkable strip');
  assert.equal(p.z, 0, 'gravity acts on z, and he is not jumping');
});

test('a long stall does not death-spiral the accumulator', () => {
  const before = main.game.frame;
  stepFrames(handle, 1, 5000);          // a five-second tab stall
  assert.equal(main.game.frame, before + 1);
  assert.ok(main.game.debug.stepsThisFrame <= 60,
    `clamped to ${main.game.debug.stepsThisFrame} steps — a stall must not run away`);
});

/**
 * The leaderboard must fail soft. fetch() rejects in the stub, and a run still
 * has to be playable — a board being down can never stop someone finishing.
 */
test('the game runs with the API offline', () => {
  // net.js swallows the failure and yields null rather than rejecting. Without
  // a token the run cannot be submitted, and that must not stop it being played.
  assert.equal(main.game.runToken, null, 'a failed token request must resolve, not reject');
  assert.doesNotThrow(() => stepFrames(handle, 60));
});

test('input is bound and does not throw on a key it has never heard of', () => {
  assert.doesNotThrow(() => {
    handle.key('keydown', 'KeyZ');
    stepFrames(handle, 2);
    handle.key('keyup', 'KeyZ');
    handle.key('keydown', 'F13');
    stepFrames(handle, 2);
  });
});

test('holding every key at once does not throw', () => {
  const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
    'Space', 'KeyZ', 'KeyX', 'ShiftLeft', 'KeyE', 'KeyQ'];
  assert.doesNotThrow(() => {
    for (const k of keys) handle.key('keydown', k);
    stepFrames(handle, 120);
    for (const k of keys) handle.key('keyup', k);
    stepFrames(handle, 30);
  });
});

test('the debug overlay draws without throwing when toggled on', () => {
  main.game.debug.visible = true;
  assert.doesNotThrow(() => stepFrames(handle, 5));
  main.game.debug.visible = false;
});

/**
 * Every state must survive being rendered — each given the data it would
 * actually have on arriving there, since no state is ever entered without it.
 *
 * REVEAL is the one added in Phase 11 and the one with least coverage
 * elsewhere, because main.js assembles its arguments by hand and nothing else
 * can see that call.
 */
test('every state in the machine renders without throwing', () => {
  const original = main.game.state;
  main.game.reveal = makeReveal();
  main.game.nameEntry = makeNameEntry();

  for (const state of Object.values(main.States)) {
    main.game.state = state;
    assert.doesNotThrow(() => stepFrames(handle, 2), `${state} threw while rendering`);
  }
  main.game.state = original;
});

/**
 * The whole of Phase 11 rendered, beat by beat, through main.js's own draw
 * path. Nothing here asserts what it looked like — only that every beat of the
 * reveal can be drawn at all, which is the part no eye check would catch
 * reliably because most beats are on screen for two seconds.
 */
test('every beat of the reveal draws through the real loop', () => {
  const original = main.game.state;
  main.game.reveal = makeReveal();
  main.game.state = main.States.REVEAL;

  const seen = new Set();
  for (let i = 0; i < 4000 && main.game.reveal; i += 1) {
    seen.add(revealBeat(main.game.reveal));
    stepFrames(handle, 1);
    if (main.game.state !== main.States.REVEAL) break;
  }

  for (const beat of Object.values(RevealBeat)) {
    if (beat === RevealBeat.DONE) continue;
    assert.ok(seen.has(beat), `${beat} never drew`);
  }
  main.game.state = original;
});

/** The reveal hands off to name entry, which is how a run becomes a score. */
test('the reveal ends in name entry rather than stopping', () => {
  main.game.reveal = makeReveal();
  main.game.state = main.States.REVEAL;

  for (let i = 0; i < 4000 && main.game.state === main.States.REVEAL; i += 1) {
    stepFrames(handle, 1);
  }
  assert.equal(main.game.state, main.States.NAME_ENTRY);
});
