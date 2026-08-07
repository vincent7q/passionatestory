import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  ANIMATIONS, POSES, FRAME_W, FRAME_H, frameCount,
} from '../../game/js/assets.js';
import { CHARACTERS, CANDIDATES } from '../../shared/characters.js';

/**
 * The pixels cannot be unit tested without a canvas, and faking that would
 * prove nothing (SPEC.md §12). What IS worth testing is the contract: the
 * frame table, the pose data, and the fact that game code can only reach
 * sprites through getFrame.
 */

test('sprite dimensions match the art direction', () => {
  assert.equal(FRAME_W, 32);
  assert.equal(FRAME_H, 48);
});

test('animation frame counts match the PRD', () => {
  assert.deepEqual(ANIMATIONS, {
    idle: 2, walk: 4, light: 3, heavy: 3, jump: 2,
    hurt: 1, knockdown: 2, dazed: 4, special: 6,
  });
});

test('every animation has exactly as many poses as frames', () => {
  for (const [anim, count] of Object.entries(ANIMATIONS)) {
    assert.equal(POSES[anim].length, count, `${anim}: pose table and frame count disagree`);
  }
});

test('every pose has the full set of six joint offsets', () => {
  for (const [anim, poses] of Object.entries(POSES)) {
    for (const [i, pose] of poses.entries()) {
      assert.equal(pose.length, 6, `${anim}[${i}] is malformed`);
      assert.ok(pose.every(Number.isFinite), `${anim}[${i}] has a non-numeric offset`);
    }
  }
});

// The dazed loop is the countdown on the ten-second window — the stars orbiting
// a defeated opponent are the ONLY signal the player gets that the window is
// closing. It cannot be a single static frame.
test('the dazed animation has enough frames to read as a loop', () => {
  assert.ok(frameCount('dazed') >= 4);
});

test('an unknown animation degrades to one frame rather than crashing', () => {
  assert.equal(frameCount('does-not-exist'), 1);
});

test('every candidate has a complete palette to tint the rig with', () => {
  for (const id of CANDIDATES) {
    const p = CHARACTERS[id].palette;
    for (const slot of ['hair', 'skin', 'shirt', 'accent']) {
      assert.match(p[slot], /^#[0-9A-Fa-f]{6}$/, `${id}.palette.${slot} must be a hex colour`);
    }
  }
});

test('candidate palettes are visually distinct from one another', () => {
  const shirts = CANDIDATES.map((id) => CHARACTERS[id].palette.shirt);
  assert.equal(new Set(shirts).size, shirts.length, 'candidates must not share a shirt colour');
});

// The seam that lets real spritesheets replace this file later.
test('assets.js exposes frames only through getFrame — no drawing internals', async () => {
  const mod = await import('../../game/js/assets.js');
  for (const internal of ['drawRig', 'px', 'createSurface']) {
    assert.equal(mod[internal], undefined, `${internal} must stay private to assets.js`);
  }
  assert.equal(typeof mod.getFrame, 'function');
});

// Entities and stages must never draw. If this fails, the spritesheet swap
// described in SPEC.md §10 stops being a drop-in.
test('no entity or stage file contains drawing logic', async () => {
  const { readdirSync, readFileSync, existsSync } = await import('node:fs');
  const { join } = await import('node:path');
  for (const dir of ['game/js/entities', 'game/js/stages']) {
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir).filter((n) => n.endsWith('.js'))) {
      const src = readFileSync(join(dir, f), 'utf8');
      for (const banned of ['fillRect(', 'getContext(', 'drawImage(']) {
        assert.ok(!src.includes(banned),
          `${dir}/${f} draws directly — that belongs in assets.js or renderer.js`);
      }
    }
  }
});
