/**
 * Every sprite frame in the game, built procedurally at boot from a
 * parameterised chibi rig and cached to offscreen canvases.
 *
 * THIS IS THE ONLY FILE THAT KNOWS HOW A SPRITE IS DRAWN. Game code asks for a
 * frame by name and never learns how it was made. That is the seam where real
 * spritesheets drop in later without touching entity or stage logic.
 * See SPEC.md §2.2 and §10.
 *
 * 32×48 base, chibi proportions, head ≈ ½ body height. Reference is River City
 * Girls (2019): chunky modern pixel art, thick outlines, saturated colour.
 */

export const FRAME_W = 32;
export const FRAME_H = 48;

/** Frame counts per animation. docs/PRD.md §11. */
export const ANIMATIONS = {
  idle: 2,
  walk: 4,
  light: 3,
  heavy: 3,
  jump: 2,
  hurt: 1,
  knockdown: 2,
  dazed: 4,
  special: 6,
};

/**
 * Pose table: per animation, per frame, the rig's joint offsets.
 *
 * Values are small pixel deltas from the neutral pose. Kept as data rather than
 * code so poses can be retuned without touching drawing logic — and so a real
 * spritesheet can replace the whole renderer below while this table stays
 * meaningful as documentation of what each frame is supposed to read as.
 */
export const POSES = {
  //            bob  armL  armR  legL  legR  lean
  idle:      [[0, 0, 0, 0, 0, 0], [1, 0, 0, 0, 0, 0]],
  walk:      [[0, -2, 2, 3, -3, 0], [1, 0, 0, 0, 0, 0],
              [0, 2, -2, -3, 3, 0], [1, 0, 0, 0, 0, 0]],
  light:     [[0, 6, -2, 0, 0, 1], [0, 10, -2, 0, 1, 2], [0, 4, 0, 0, 0, 1]],
  heavy:     [[-1, -4, -4, 0, 0, -2], [0, 12, -3, 1, 2, 3], [1, 6, -1, 0, 1, 2]],
  jump:      [[-2, -4, -4, -4, -4, 0], [-1, -2, -2, 2, 2, 0]],
  hurt:      [[1, -3, -3, 0, 0, -3]],
  knockdown: [[3, -6, -6, -2, -2, -6], [6, -8, -8, -6, -6, -9]],
  dazed:     [[4, -5, -5, -4, -4, -4], [4, -4, -6, -4, -4, -3],
              [4, -5, -5, -4, -4, -4], [4, -6, -4, -4, -4, -5]],
  special:   [[0, -6, -6, 0, 0, -2], [0, 2, -4, 0, 1, 0], [0, 8, -2, 1, 2, 2],
              [0, 12, 0, 2, 2, 3], [0, 8, 2, 1, 1, 2], [0, 2, 0, 0, 0, 1]],
};

const cache = new Map();
const key = (charId, anim, frame) => `${charId}:${anim}:${frame}`;

/** Offscreen canvas. Browser-only; the cache is what game code touches. */
function createSurface(w, h) {
  if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(w, h);
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

function px(ctx, x, y, w, h, colour) {
  ctx.fillStyle = colour;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

/**
 * Draw one posed frame of the chibi rig.
 * Head is roughly half the body height, per the art direction.
 */
function drawRig(ctx, palette, pose) {
  const [bob, armL, armR, legL, legR, lean] = pose;
  const outline = '#1A1118';
  const cx = FRAME_W / 2;
  const top = 6 + bob;

  // Legs
  px(ctx, cx - 6, 34 + legL, 5, 10, palette.shirt);
  px(ctx, cx + 1, 34 + legR, 5, 10, palette.shirt);
  px(ctx, cx - 7, 43 + legL, 7, 3, outline);
  px(ctx, cx, 43 + legR, 7, 3, outline);

  // Torso
  px(ctx, cx - 7 + lean, top + 16, 14, 18, palette.shirt);
  px(ctx, cx - 7 + lean, top + 16, 14, 2, palette.accent);

  // Arms
  px(ctx, cx - 10 + lean, top + 18 - armL, 4, 12, palette.skin);
  px(ctx, cx + 6 + lean, top + 18 - armR, 4, 12, palette.skin);

  // Head — outline, face, hair
  px(ctx, cx - 9 + lean, top - 1, 18, 18, outline);
  px(ctx, cx - 8 + lean, top, 16, 16, palette.skin);
  px(ctx, cx - 8 + lean, top, 16, 6, palette.hair);
  px(ctx, cx - 9 + lean, top - 1, 18, 3, palette.hair);

  // Eyes
  px(ctx, cx - 5 + lean, top + 8, 2, 3, outline);
  px(ctx, cx + 3 + lean, top + 8, 2, 3, outline);
}

/** Build and cache every frame for one character. Idempotent. */
export function buildCharacter(charId, palette) {
  for (const [anim, count] of Object.entries(ANIMATIONS)) {
    for (let f = 0; f < count; f += 1) {
      const surface = createSurface(FRAME_W, FRAME_H);
      const ctx = surface.getContext('2d');
      ctx.imageSmoothingEnabled = false;
      const poses = POSES[anim] ?? POSES.idle;
      drawRig(ctx, palette, poses[f % poses.length]);
      cache.set(key(charId, anim, f), surface);
    }
  }
  return cache;
}

/**
 * The entire public surface. Game code calls this and nothing else.
 * Out-of-range frames wrap rather than returning undefined, so an animation
 * whose length changes cannot crash a caller mid-frame.
 */
export function getFrame(charId, anim, frame = 0) {
  const count = ANIMATIONS[anim] ?? 1;
  return cache.get(key(charId, anim, frame % count));
}

export function frameCount(anim) {
  return ANIMATIONS[anim] ?? 1;
}

export function isBuilt(charId) {
  return cache.has(key(charId, 'idle', 0));
}

export function clearCache() {
  cache.clear();
}
