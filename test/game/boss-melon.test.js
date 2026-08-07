import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  FRUIT_SHOP_OWNER, MELON_HP, MELON_DAMAGE_POWER_COST,
  createFruitShopOwner, hitMelon, melonSpared, resolveFruitShopFight,
} from '../../game/js/entities/boss.js';
import { State, Team, Kind, createEntity } from '../../game/js/entities/entity.js';
import { emptyRun, computeJudgment, JUDGMENT } from '../../shared/scoring.js';

const hero = () => createEntity(Kind.PLAYER, { power: 100, powerMax: 100, team: Team.PLAYER });

test('the boss matches the PRD', () => {
  assert.equal(FRUIT_SHOP_OWNER.hp, 300);
  assert.equal(FRUIT_SHOP_OWNER.name.zh, '水果店老闆娘');
  assert.deepEqual(Object.keys(FRUIT_SHOP_OWNER.moves),
    ['overhead', 'rolling_bowl', 'shove']);
});

test('she starts at full health, on the house side, with an intact melon', () => {
  const b = createFruitShopOwner({ x: 100, y: 200 });
  assert.equal(b.power, 300);
  assert.equal(b.team, Team.HOUSE);
  assert.equal(b.melon.hp, MELON_HP);
  assert.equal(b.melon.damaged, false);
  assert.equal(b.melon.destroyed, false);
});

test('the melon has its own 40 HP', () => {
  assert.equal(MELON_HP, 40);
});

/**
 * THE SHARPEST RESTRAINT TEST IN THE GAME, and it lands eleven minutes before
 * the candidate has any idea he is being tested. He is desperate, out of time,
 * the van is getting away — and the correct move is to be careful with the
 * property of a woman he has never seen before.
 */
test('sparing the melon is worth +8 into the hidden column', () => {
  const b = createFruitShopOwner();
  const run = emptyRun();
  const result = resolveFruitShopFight(b, run);

  assert.equal(result.spared, true);
  assert.equal(run.judgment.spareFruitStall, true);
  assert.equal(computeJudgment(run), JUDGMENT.SPARE_FRUIT_STALL);
});

/**
 * The award is forfeited the moment the melon is TOUCHED, not only when it is
 * destroyed. A player who chips it and then stops has still not been careful
 * with a stranger's livelihood.
 */
test('one glancing hit forfeits the award, without destroying it', () => {
  const b = createFruitShopOwner();
  const run = emptyRun();

  const r = hitMelon(b, hero(), 5, run);
  assert.equal(r.damaged, true);
  assert.equal(r.destroyed, false, 'the melon survives');
  assert.equal(run.judgment.spareFruitStall, false, 'but the award is already gone');
  assert.equal(melonSpared(b), false);
  assert.equal(computeJudgment(run), 0);
});

test('damaging the melon costs power immediately', () => {
  const b = createFruitShopOwner();
  const p = hero();
  const r = hitMelon(b, p, 5, emptyRun());
  assert.equal(r.powerCost, MELON_DAMAGE_POWER_COST);
  assert.equal(p.power, 100 - MELON_DAMAGE_POWER_COST);
});

test('enough hits destroy it', () => {
  const b = createFruitShopOwner();
  const p = hero();
  const run = emptyRun();

  let destroyed = false;
  for (let i = 0; i < 10 && !destroyed; i += 1) {
    destroyed = hitMelon(b, p, 10, run).destroyed;
  }
  assert.equal(destroyed, true);
  assert.equal(b.melon.hp, 0);
  assert.equal(b.melon.destroyed, true);
});

test('a destroyed melon cannot be hit again', () => {
  const b = createFruitShopOwner();
  const p = hero();
  hitMelon(b, p, 99, emptyRun());
  const powerBefore = p.power;

  const r = hitMelon(b, p, 99, emptyRun());
  assert.equal(r.damaged, false);
  assert.equal(r.powerCost, 0);
  assert.equal(p.power, powerBefore, 'no repeated cost for hitting wreckage');
});

test('melon power cost never drives the player below zero', () => {
  const b = createFruitShopOwner();
  const p = createEntity(Kind.PLAYER, { power: 1, powerMax: 100 });
  hitMelon(b, p, 5, emptyRun());
  assert.equal(p.power, 0);
});

/**
 * Beat her without touching it and she points up the road — the direction the
 * van went. Destroy it and she sits down in the wreckage of her stall.
 * NO PENALTY IS STATED ON SCREEN. The file records it.
 */
test('sparing it makes her point up the road', () => {
  const b = createFruitShopOwner();
  assert.equal(resolveFruitShopFight(b, emptyRun()).outcome, 'points_up_the_road');
});

test('destroying it makes her sit down in the wreckage', () => {
  const b = createFruitShopOwner();
  hitMelon(b, hero(), 99, emptyRun());
  const r = resolveFruitShopFight(b, emptyRun());
  assert.equal(r.outcome, 'sits_down_in_the_wreckage');
  assert.equal(r.melonDestroyed, true);
});

test('she ends the fight dazed, never dead — nobody stays down', () => {
  const b = createFruitShopOwner();
  resolveFruitShopFight(b, emptyRun());
  assert.equal(b.state, State.DAZED);
  assert.equal(b.alive, true);
  assert.equal(b.attacking, false);
});

test('resolving without a run object does not throw', () => {
  assert.doesNotThrow(() => resolveFruitShopFight(createFruitShopOwner(), null));
  assert.doesNotThrow(() => hitMelon(createFruitShopOwner(), null, 5, null));
});

/**
 * She was not told. She is 小雨's aunt, nobody briefed her, and she is fighting
 * for the ordinary reason — that is her livelihood on the ground. From the
 * candidate's side she is a total stranger, which is all the test needs.
 */
test('the melon award and the market-row award are independent routes', () => {
  const melonOnly = emptyRun();
  melonOnly.judgment.spareFruitStall = true;

  const stallsOnly = emptyRun();
  stallsOnly.judgment.marketStallsIntact = true;

  assert.equal(computeJudgment(melonOnly), JUDGMENT.SPARE_FRUIT_STALL);
  assert.equal(computeJudgment(stallsOnly), JUDGMENT.MARKET_STALLS_INTACT);
  assert.notEqual(computeJudgment(melonOnly), computeJudgment(stallsOnly));
});
