import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import { installDom, stepFrames, uninstallDom } from '../helpers/dom-stub.js';
import { PAD } from '../../game/js/touch.js';
import { Action } from '../../game/js/input.js';

/**
 * main.js on a phone.
 *
 * A separate file from main-boot.test.js because ES modules are cached per
 * process: main.js runs its top-level code exactly once, so the touch branch
 * and the desktop branch cannot both be exercised in one run.
 *
 * The branch is three lines in main.js — look up the pad, unhide it, bind it —
 * but main.js is the file that cannot be imported normally and is where every
 * runtime bug in this project has lived. Three lines there are worth a test.
 */

let handle;
let main;

before(async () => {
  register('../helpers/shared-loader.js', import.meta.url);
  handle = installDom({ touch: true });
  main = await import('../../game/js/main.js');
});

after(() => uninstallDom());

test('the game boots on a touch device', () => {
  assert.ok(main.game, 'main.js did not finish loading with a pad attached');
});

test('the pad is unhidden on a coarse pointer', () => {
  const pad = handle.elements.get('pad');
  assert.ok(pad, 'main.js never looked for #pad');
  assert.equal(pad.hidden, false, 'the pad stayed hidden on a touchscreen');
});

test('every button in the table was actually built', () => {
  assert.equal(handle.elements.get('pad').children.length, PAD.length);
});

test('the loop still runs with the pad attached', () => {
  const before = main.game.frame;
  stepFrames(handle, 60);
  assert.ok(main.game.frame > before);
});

/**
 * The aim assist only exists on touch, so this is the only place it can be
 * driven through main.js at all. It must turn him and nothing else.
 */
test('a touch attack turns him toward the nearest opponent', () => {
  const world = main.game.world;
  const player = world.entities.find((e) => e.charId === 'felix');
  assert.ok(player, 'no player');

  const foe = world.entities.find((e) => e !== player && e.team !== player.team);
  assert.ok(foe, 'no opponent to face — stage 1 should have spawned some');

  // Put him behind the player, then swing with no direction held.
  foe.x = player.x - 40;
  foe.y = player.y;
  player.facing = 1;
  const x = player.x;

  const pad = handle.elements.get('pad');
  const light = pad.children.find((c) => c.id === `pad-${PAD.find((b) => b.action === Action.LIGHT).id}`);
  assert.ok(light, 'no light-attack button was built');
  light.fire('pointerdown', {});
  stepFrames(handle, 1);

  assert.equal(player.facing, -1, 'he swung the wrong way with an opponent behind him');
  assert.equal(player.x, x, 'the aim assist moved him — it must only turn him');
});
