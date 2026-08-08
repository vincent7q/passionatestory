import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Kind, State, Team, createEntity, resetIds } from '../../game/js/entities/entity.js';
import {
  TECHNIQUES, createRoster, addToRoster, isOnRoster, rosterSize,
  getActive, setActive, techniques, canCallAlly, callAlly, resetFight,
  resolveSummon, convertToAlly, recordDefeat,
} from '../../game/js/entities/ally.js';

const opponent = (enemyType, over = {}) => createEntity(Kind.ENEMY, {
  enemyType, powerMax: 40, power: 0, ...over,
});

// ── T34: the roster ──────────────────────────────────────────────────────────

test('a new roster is empty with nobody active', () => {
  const r = createRoster();
  assert.equal(rosterSize(r), 0);
  assert.equal(getActive(r), null);
});

test('helping someone up puts them on the roster permanently', () => {
  resetIds();
  const r = createRoster();
  const e = opponent('office_worker');
  assert.equal(addToRoster(r, e), true);
  assert.equal(isOnRoster(r, e.id), true);
});

test('the same opponent is never rostered twice', () => {
  resetIds();
  const r = createRoster();
  const e = opponent('office_worker');
  addToRoster(r, e);
  assert.equal(addToRoster(r, e), false);
  assert.equal(rosterSize(r), 1);
});

test('the first person helped becomes the active ally automatically', () => {
  resetIds();
  const r = createRoster();
  const first = opponent('office_worker');
  addToRoster(r, first);
  assert.equal(getActive(r).id, first.id);

  const second = opponent('scalper');
  addToRoster(r, second);
  assert.equal(getActive(r).id, first.id, 'later additions do not steal the slot');
});

test('each opponent type teaches a technique', () => {
  resetIds();
  const r = createRoster();
  addToRoster(r, opponent('office_worker'));
  addToRoster(r, opponent('second_uncle'));
  assert.deepEqual(techniques(r),
    [TECHNIQUES.office_worker.id, TECHNIQUES.second_uncle.id]);
});

test('二叔 BAN teaches 鐵山靠', () => {
  assert.equal(TECHNIQUES.second_uncle.name.zh, '鐵山靠');
});

// ── T35: the active ally ─────────────────────────────────────────────────────

test('swapping the active ally never changes the roster', () => {
  resetIds();
  const r = createRoster();
  const a = opponent('office_worker');
  const b = opponent('scalper');
  addToRoster(r, a);
  addToRoster(r, b);

  const before = rosterSize(r);
  assert.equal(setActive(r, b.id), true);
  assert.equal(getActive(r).id, b.id);
  assert.equal(rosterSize(r), before, 'the roster is permanent; only the active slot moves');
  assert.equal(isOnRoster(r, a.id), true, 'the swapped-out ally is still on it');
});

test('you cannot activate someone you never helped', () => {
  const r = createRoster();
  assert.equal(setActive(r, 999), false);
});

test('an ally can be called once per fight', () => {
  resetIds();
  const r = createRoster();
  addToRoster(r, opponent('office_worker'));

  assert.equal(canCallAlly(r), true);
  assert.ok(callAlly(r));
  assert.equal(canCallAlly(r), false, 'once per fight');
  assert.equal(callAlly(r), null);
});

test('the call resets at the start of the next fight', () => {
  resetIds();
  const r = createRoster();
  addToRoster(r, opponent('office_worker'));
  callAlly(r);
  resetFight(r);
  assert.equal(canCallAlly(r), true);
});

test('calling with an empty roster does nothing', () => {
  assert.equal(callAlly(createRoster()), null);
});

test('converting flips team and state without killing them', () => {
  const e = opponent('office_worker', { state: State.DAZED, team: Team.HOUSE });
  convertToAlly(e);
  assert.equal(e.state, State.ALLIED);
  assert.equal(e.team, Team.PLAYER);
  assert.ok(e.power > 0, 'they get back up with something left');
  assert.equal(e.alive, true);
});

// ── The payoff ───────────────────────────────────────────────────────────────

/**
 * 召集 Summon. Every 20s 林建國 calls two relatives, and anyone the candidate
 * helped up REFUSES TO COME. This is the payoff for every ten-second decision
 * made across the entire run — a candidate with a full roster fights Phase 1
 * almost alone.
 */
test('summoned relatives you helped up refuse to fight you', () => {
  resetIds();
  const r = createRoster();
  const helped = opponent('estate_security');
  const stranger = opponent('estate_security');
  addToRoster(r, helped);

  const { summoned, refused } = resolveSummon(r, [helped, stranger]);
  assert.deepEqual(refused.map((e) => e.id), [helped.id]);
  assert.deepEqual(summoned.map((e) => e.id), [stranger.id]);
});

test('a full roster leaves the boss summoning nobody', () => {
  resetIds();
  const r = createRoster();
  const family = [opponent('aunt'), opponent('aunt'), opponent('estate_security')];
  for (const e of family) addToRoster(r, e);

  const { summoned, refused } = resolveSummon(r, family);
  assert.equal(summoned.length, 0, 'a merciful run fights Phase 1 almost alone');
  assert.equal(refused.length, family.length);
});

test('an empty roster means everyone answers the summon', () => {
  resetIds();
  const family = [opponent('aunt'), opponent('estate_security')];
  const { summoned, refused } = resolveSummon(createRoster(), family);
  assert.equal(summoned.length, 2);
  assert.equal(refused.length, 0);
});

// Swapping the active ally at a checkpoint must not cost you the summon payoff.
test('the summon checks the roster, not the active ally', () => {
  resetIds();
  const r = createRoster();
  const a = opponent('office_worker');
  const b = opponent('scalper');
  addToRoster(r, a);
  addToRoster(r, b);
  setActive(r, b.id);

  const { refused } = resolveSummon(r, [a]);
  assert.equal(refused.length, 1, 'a benched ally still refuses to fight you');
});

// ── T80: who bows at the end ─────────────────────────────────────────────────

/**
 * DEFEATED is a strictly larger set than ROSTER, and conflating the two would
 * empty the bow line-up for exactly the player who earned it most — someone who
 * helped everyone up would otherwise have nobody left "merely defeated" to bow.
 */
test('defeat is recorded separately from being helped up', () => {
  resetIds();
  const r = createRoster();
  const a = opponent('office_worker');

  recordDefeat(r, a);
  assert.equal(r.defeated.length, 1);
  assert.equal(rosterSize(r), 0, 'knocking someone down is not a kindness');

  addToRoster(r, a);
  assert.equal(r.defeated.length, 1, 'helping him up does not un-defeat him');
  assert.equal(rosterSize(r), 1);
});

test('the same opponent is only ever recorded as defeated once', () => {
  resetIds();
  const r = createRoster();
  const a = opponent('scalper');

  assert.equal(recordDefeat(r, a), true);
  // Helped up, fought again, knocked down again — still one man, one bow.
  assert.equal(recordDefeat(r, a), false);
  assert.equal(r.defeated.length, 1);
});

test('a defeated opponent remembers what kind of person they were', () => {
  resetIds();
  const r = createRoster();
  recordDefeat(r, opponent('delivery_rider'));
  assert.equal(r.defeated[0].enemyType, 'delivery_rider');
});
