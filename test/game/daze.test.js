import { test } from 'node:test';
import assert from 'node:assert/strict';
import { State, Team, Kind, createEntity, resetIds } from '../../game/js/entities/entity.js';
import {
  DEFAULT_WINDOW_MS, STAR_SPEED_START, STAR_SPEED_END, HELP_RANGE_X, HELP_RANGE_Y,
  msToSteps, beginDaze, dazeProgress, starSpeed, windowOpen, advanceDaze,
  inHelpRange, promptTarget, helpUp, recordStrike, starPositions,
} from '../../game/js/daze.js';
import { createRoster, isOnRoster, rosterSize } from '../../game/js/entities/ally.js';
import { applyDamage } from '../../game/js/combat.js';
import { emptyRun, DAZE_WINDOW_MS, JUDGMENT, computeJudgment } from '../../shared/scoring.js';

const WINDOW_STEPS = msToSteps(DEFAULT_WINDOW_MS);

/**
 * Overrides are applied BEFORE beginDaze so they cannot undo the reset it
 * performs; only the daze-clock fields are set afterwards, since those are
 * what a test winds forward.
 */
const downed = ({ dazeSteps, starAngle, invulnerable, ...over } = {}) => {
  const e = createEntity(Kind.ENEMY, { x: 0, y: 100, power: 0, powerMax: 30, ...over });
  beginDaze(e);
  if (dazeSteps !== undefined) e.dazeSteps = dazeSteps;
  if (starAngle !== undefined) e.starAngle = starAngle;
  if (invulnerable !== undefined) e.invulnerable = invulnerable;
  return e;
};
const hero = (over = {}) => createEntity(Kind.PLAYER, {
  x: 0, y: 100, team: Team.PLAYER, ...over,
});

// ── T31: the window and its countdown ────────────────────────────────────────

test('the window is ten seconds, and shared/ and the game agree on it', () => {
  assert.equal(DEFAULT_WINDOW_MS, 10_000);
  assert.equal(DAZE_WINDOW_MS, DEFAULT_WINDOW_MS,
    'shared/ and daze.js must not drift — a future replay depends on it');
});

test('beginDaze sits the opponent down and stops them moving', () => {
  const e = downed({ vx: 5, vy: 3, attacking: true });
  assert.equal(e.state, State.DAZED);
  assert.equal(e.vx, 0);
  assert.equal(e.attacking, false);
  assert.equal(e.dazeSteps, 0);
});

test('progress runs 0 to 1 across the window', () => {
  const e = downed();
  assert.equal(dazeProgress(e), 0);
  e.dazeSteps = WINDOW_STEPS / 2;
  assert.ok(Math.abs(dazeProgress(e) - 0.5) < 0.01);
  e.dazeSteps = WINDOW_STEPS;
  assert.equal(dazeProgress(e), 1);
});

test('progress never exceeds 1 even long after expiry', () => {
  const e = downed({ dazeSteps: WINDOW_STEPS * 5 });
  assert.equal(dazeProgress(e), 1);
});

/**
 * THE COUNTDOWN. The stars are the only signal the player ever gets that the
 * window is closing — nothing on screen says what E does or that any of this is
 * scored. A constant orbit would communicate nothing.
 */
test('the stars visibly slow across the window', () => {
  assert.equal(starSpeed(0), STAR_SPEED_START);
  assert.equal(starSpeed(1), STAR_SPEED_END);
  assert.ok(STAR_SPEED_END < STAR_SPEED_START, 'they must slow, not speed up');
});

test('star speed decreases monotonically — never a pause or a rebound', () => {
  let previous = Infinity;
  for (let p = 0; p <= 1.0001; p += 0.05) {
    const s = starSpeed(p);
    assert.ok(s < previous, `speed rose or held at progress ${p.toFixed(2)}`);
    previous = s;
  }
});

test('the stars are meaningfully slower by the end, not marginally', () => {
  assert.ok(starSpeed(1) < starSpeed(0) * 0.5,
    'the deceleration has to be readable at a glance');
});

test('advanceDaze reports open until the window closes, then expired', () => {
  const e = downed();
  for (let i = 0; i < WINDOW_STEPS - 1; i += 1) {
    assert.equal(advanceDaze(e), 'open', `step ${i} should still be open`);
  }
  assert.equal(advanceDaze(e), 'expired', 'the window closes exactly once');
});

test('the stars actually rotate as the window runs', () => {
  const e = downed();
  const before = e.starAngle;
  for (let i = 0; i < 30; i += 1) advanceDaze(e);
  assert.ok(e.starAngle > before);
});

test('starPositions returns three orbiting points', () => {
  const e = downed({ starAngle: 0.5 });
  const pts = starPositions(e);
  assert.equal(pts.length, 3);
  assert.ok(pts.every((p) => Number.isFinite(p.dx) && Number.isFinite(p.dy)));
});

// ── T32: the prompt ──────────────────────────────────────────────────────────

test('help range covers depth as well as distance', () => {
  const p = hero();
  assert.ok(inHelpRange(p, downed({ x: HELP_RANGE_X - 1, y: 100 })));
  assert.ok(!inHelpRange(p, downed({ x: HELP_RANGE_X + 5, y: 100 })));
  assert.ok(!inHelpRange(p, downed({ x: 0, y: 100 + HELP_RANGE_Y + 5 })),
    'someone on another depth line is not within reach');
});

test('the prompt targets the nearest dazed opponent in range', () => {
  const p = hero();
  const near = downed({ x: 5 });
  const far = downed({ x: 18 });
  assert.equal(promptTarget(p, [far, near]), near);
});

test('there is no prompt when nobody nearby is dazed', () => {
  const p = hero();
  const standing = createEntity(Kind.ENEMY, { x: 5, y: 100, state: State.IDLE });
  assert.equal(promptTarget(p, [standing]), null);
});

test('an expired opponent no longer offers a prompt', () => {
  const p = hero();
  assert.equal(promptTarget(p, [downed({ x: 5, dazeSteps: WINDOW_STEPS })]), null);
});

test('the player is never their own prompt target', () => {
  const p = hero();
  p.state = State.DAZED;
  assert.equal(promptTarget(p, [p]), null);
});

// ── T33: helping up, and both edges of the window ────────────────────────────

test('helping up inside the window converts and rosters them', () => {
  resetIds();
  const p = hero();
  const t = downed({ x: 8 });
  const roster = createRoster();
  const run = emptyRun();

  assert.equal(helpUp(p, t, roster, run), true);
  assert.equal(t.state, State.ALLIED);
  assert.equal(t.team, Team.PLAYER);
  assert.equal(isOnRoster(roster, t.id), true);
  assert.equal(run.judgment.helpUps, 1);
});

/** Both edges, explicitly. One step either side of the boundary. */
test('the last step inside the window still works', () => {
  const t = downed({ x: 8, dazeSteps: WINDOW_STEPS - 1 });
  assert.equal(helpUp(hero(), t, createRoster(), emptyRun()), true);
});

test('one step past the window it is too late', () => {
  const t = downed({ x: 8, dazeSteps: WINDOW_STEPS });
  const run = emptyRun();
  assert.equal(helpUp(hero(), t, createRoster(), run), false);
  assert.equal(run.judgment.helpUps, 0);
});

test('helping up out of range fails', () => {
  const run = emptyRun();
  assert.equal(helpUp(hero(), downed({ x: 200 }), createRoster(), run), false);
  assert.equal(run.judgment.helpUps, 0);
});

/**
 * The same opponent must never count twice. Input edge detection already guards
 * the button, but a second path in — an ally re-entering DAZED, say — would
 * silently inflate the one column the player is not allowed to see.
 */
test('the same opponent cannot be helped up twice', () => {
  resetIds();
  const p = hero();
  const t = downed({ x: 8 });
  const roster = createRoster();
  const run = emptyRun();

  assert.equal(helpUp(p, t, roster, run), true);
  t.state = State.DAZED;
  t.dazeSteps = 0;
  assert.equal(helpUp(p, t, roster, run), false, 'already on the roster');
  assert.equal(run.judgment.helpUps, 1);
  assert.equal(rosterSize(roster), 1);
});

test('helping up with no target is a no-op', () => {
  assert.equal(helpUp(hero(), null, createRoster(), emptyRun()), false);
});

test('each help-up is worth exactly +3 into the hidden column', () => {
  const run = emptyRun();
  const roster = createRoster();
  const p = hero();
  for (let i = 0; i < 4; i += 1) helpUp(p, downed({ x: 8 }), roster, run);
  assert.equal(run.judgment.helpUps, 4);
  assert.equal(computeJudgment(run), 4 * JUDGMENT.HELP_UP);
});

// ── T36: the penalty ─────────────────────────────────────────────────────────

test('striking a downed opponent charges the penalty once', () => {
  const run = emptyRun();
  const t = downed();
  t.invulnerable = 0;
  assert.equal(recordStrike(run, applyDamage(t, 5)), true);
  assert.equal(run.judgment.strikesOnDowned, 1);
  assert.equal(run.judgment.neverStruckDowned, false);
});

/**
 * An attack's active frames span several steps. If the penalty were charged per
 * frame of contact rather than per connection, one careless swing would cost
 * three or four times what it should.
 */
test('a hit that was ignored by invincibility is not a choice and is not charged', () => {
  const run = emptyRun();
  const t = downed({ invulnerable: 30 });
  const result = applyDamage(t, 5);
  assert.equal(result.ignored, true);
  assert.equal(recordStrike(run, result), false);
  assert.equal(run.judgment.strikesOnDowned, 0);
});

test('striking someone still standing is not penalised', () => {
  const run = emptyRun();
  const standing = createEntity(Kind.ENEMY, { power: 30, powerMax: 30, state: State.IDLE });
  assert.equal(recordStrike(run, applyDamage(standing, 5)), false);
  assert.equal(run.judgment.strikesOnDowned, 0);
});

test('the penalty outweighs the reward, so cruelty is never worth it', () => {
  const merciful = emptyRun();
  merciful.judgment.helpUps = 1;

  const cruel = emptyRun();
  cruel.judgment.helpUps = 1;
  cruel.judgment.strikesOnDowned = 1;
  cruel.judgment.neverStruckDowned = false;

  assert.ok(computeJudgment(cruel) < computeJudgment(merciful));
});

test('recordStrike tolerates a missing run or result', () => {
  assert.equal(recordStrike(null, { struckWhileDown: true }), false);
  assert.equal(recordStrike(emptyRun(), null), false);
});
