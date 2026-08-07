import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  footprint, boxesOverlap, zRange, zRangesOverlap, attackBox, canHit,
  integrate, GRAVITY, GROUND_Z,
} from '../../game/js/physics.js';

/** x = world horizontal, y = DEPTH, z = height. See SPEC.md §3.3. */
function ent(over = {}) {
  return {
    x: 0, y: 100, z: 0, vx: 0, vy: 0, vz: 0,
    w: 16, depth: 8, h: 48, facing: 1,
    ...over,
  };
}

const STRIP = { yMin: 80, yMax: 160 };

// ── T15: footprint overlap ───────────────────────────────────────────────────

test('footprint is centred on x and y', () => {
  const f = footprint(ent({ x: 100, y: 120, w: 20, depth: 10 }));
  assert.deepEqual(f, { x0: 90, x1: 110, y0: 115, y1: 125 });
});

test('overlapping footprints overlap', () => {
  assert.ok(boxesOverlap(footprint(ent({ x: 0 })), footprint(ent({ x: 8 }))));
});

test('separated footprints do not overlap', () => {
  assert.ok(!boxesOverlap(footprint(ent({ x: 0 })), footprint(ent({ x: 100 }))));
});

test('exactly touching edges do not count as overlap', () => {
  // widths 16 → half-widths 8 → a gap of exactly 16 makes edges meet at one point
  assert.ok(!boxesOverlap(footprint(ent({ x: 0 })), footprint(ent({ x: 16 }))));
});

/**
 * The depth rule. Two entities at the same x standing on different depth lines
 * must NOT overlap — this is what makes a punch miss someone standing further
 * back, and it is the single thing that separates a beat-'em-up from a
 * platformer.
 */
test('same x but different depth does not overlap', () => {
  const near = footprint(ent({ x: 50, y: 100 }));
  const far = footprint(ent({ x: 50, y: 140 }));
  assert.ok(!boxesOverlap(near, far), 'depth separation must prevent contact');
});

// ── T16: z ranges and canHit ─────────────────────────────────────────────────

test('z range runs from the feet to the head', () => {
  assert.deepEqual(zRange(ent({ z: 10, h: 48 })), { z0: 10, z1: 58 });
});

test('overlapping z ranges overlap', () => {
  assert.ok(zRangesOverlap(zRange(ent({ z: 0 })), zRange(ent({ z: 20 }))));
});

test('a jumper clears a grounded attacker', () => {
  assert.ok(!zRangesOverlap(zRange(ent({ z: 0, h: 48 })), zRange(ent({ z: 60, h: 48 }))));
});

test('the attack box sits in front of the attacker', () => {
  const right = attackBox(ent({ x: 0, facing: 1 }));
  const left = attackBox(ent({ x: 0, facing: -1 }));
  assert.ok(right.x0 >= 0, 'facing right, the box is to the right');
  assert.ok(left.x1 <= 0, 'facing left, the box is to the left');
});

test('canHit requires footprint overlap, z overlap AND facing', () => {
  const attacker = ent({ x: 0, y: 100, facing: 1, attacking: true });

  assert.ok(canHit(attacker, ent({ x: 18, y: 100 })), 'in front, same depth, grounded');
  assert.ok(!canHit(attacker, ent({ x: -18, y: 100 })), 'behind the attacker');
  assert.ok(!canHit(attacker, ent({ x: 18, y: 140 })), 'different depth line');
  assert.ok(!canHit(attacker, ent({ x: 18, y: 100, z: 60 })), 'target is airborne above');
  assert.ok(!canHit(attacker, ent({ x: 200, y: 100 })), 'out of reach');
});

test('canHit is false when the attacker is not in active frames', () => {
  const idle = ent({ x: 0, facing: 1, attacking: false });
  assert.ok(!canHit(idle, ent({ x: 18 })));
});

test('an entity cannot hit itself', () => {
  const a = ent({ x: 0, facing: 1, attacking: true });
  assert.ok(!canHit(a, a));
});

// ── T17: integration ─────────────────────────────────────────────────────────

test('velocity moves the entity on all three axes', () => {
  const e = ent({ x: 0, y: 100, z: 10, vx: 2, vy: 3, vz: 4 });
  integrate(e, STRIP);
  assert.equal(e.x, 2);
  assert.equal(e.y, 103);
  assert.ok(e.z > 10, 'z advanced before gravity pulled it back');
});

/**
 * The bug this axis system invites. y is DEPTH, not height. If gravity is ever
 * applied to y, characters slide toward the front of the screen for no visible
 * reason and it looks like a camera bug rather than a physics one.
 */
test('gravity acts on z and NEVER on y', () => {
  const e = ent({ y: 120, z: 100, vy: 0, vz: 0 });
  const yBefore = e.y;
  for (let i = 0; i < 10; i += 1) integrate(e, STRIP);
  assert.equal(e.y, yBefore, 'depth must be untouched by gravity');
  assert.ok(e.z < 100, 'height must fall');
  assert.ok(e.vz < 0, 'and be accelerating downward');
});

test('an entity lands on the ground and stops', () => {
  const e = ent({ z: 5, vz: -20 });
  integrate(e, STRIP);
  assert.equal(e.z, GROUND_Z);
  assert.equal(e.vz, 0);
  assert.equal(e.airborne, false);
});

test('a grounded entity does not accumulate downward velocity', () => {
  const e = ent({ z: 0, vz: 0 });
  for (let i = 0; i < 30; i += 1) integrate(e, STRIP);
  assert.equal(e.z, GROUND_Z);
  assert.equal(e.vz, 0);
});

test('depth is clamped to the walkable strip', () => {
  const tooFar = ent({ y: 100, vy: -100 });
  integrate(tooFar, STRIP);
  assert.equal(tooFar.y, STRIP.yMin);

  const tooNear = ent({ y: 100, vy: 100 });
  integrate(tooNear, STRIP);
  assert.equal(tooNear.y, STRIP.yMax);
});

test('gravity is a per-step constant, not a per-second rate', () => {
  // Physics constants assume the fixed 1/60s step; nothing may scale by dt.
  assert.ok(GRAVITY < 0);
  assert.ok(Math.abs(GRAVITY) < 5, 'a per-step value, not a per-second one');
});
