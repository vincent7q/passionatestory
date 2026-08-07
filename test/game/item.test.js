import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Kind, createEntity } from '../../game/js/entities/entity.js';
import {
  ITEMS, WEAPONS, createWeapon, useWeapon, pickUp, dropWeapon,
  applyItem, advanceBuffs,
} from '../../game/js/entities/item.js';
import { emptyRun } from '../../shared/scoring.js';

const hero = (over = {}) => createEntity(Kind.PLAYER, {
  power: 50, powerMax: 100, spirit: 20, spiritMax: 100, ...over,
});

// ── T30: items ───────────────────────────────────────────────────────────────

test('the item roster matches the PRD', () => {
  for (const id of ['money', 'tea', 'snack', 'hot_towel', 'handkerchief',
                    'business_card', 'good_tea_leaves']) {
    assert.ok(ITEMS[id], `missing item ${id}`);
    assert.ok(ITEMS[id].name.en && ITEMS[id].name.zh, `${id} needs both names`);
  }
});

test('a snack restores power but never past the maximum', () => {
  const e = hero({ power: 95 });
  const r = applyItem(e, 'snack');
  assert.equal(e.power, 100);
  assert.equal(r.power, 5, 'reports what actually landed, not the nominal value');
});

test('tea restores spirit and adds heaviness', () => {
  const e = hero();
  applyItem(e, 'tea');
  assert.equal(e.spirit, 50);
  assert.equal(e.heaviness, 1);
});

// 二叔 BAN's three cups each make the candidate heavier and slower. Accepting
// all three is +8 禮 and leaves him at his most sluggish — then he bows.
test('heaviness accumulates across repeated cups', () => {
  const e = hero();
  applyItem(e, 'tea');
  applyItem(e, 'tea');
  applyItem(e, 'tea');
  assert.equal(e.heaviness, 3);
});

test('a handkerchief cancels the stage 1 rain debuff', () => {
  const e = hero();
  applyItem(e, 'handkerchief');
  assert.equal(e.rainProtected, true);
});

test('an unknown item is ignored rather than throwing', () => {
  assert.deepEqual(applyItem(hero(), 'nonsense'), { applied: false });
});

/**
 * Every coin dropped off a man on the Lin payroll. It was always their money —
 * the candidate gathers it all night and it counts in his favour.
 */
test('money accumulates into the run payload', () => {
  const run = emptyRun();
  const e = hero();
  applyItem(e, 'money', run);
  applyItem(e, 'money', run);
  assert.equal(run.money.collected, ITEMS.money.value * 2);
});

test('collecting money without a run does not throw', () => {
  assert.equal(applyItem(hero(), 'money').money, ITEMS.money.value);
});

test('buffs expire on their own', () => {
  const e = hero();
  applyItem(e, 'business_card');
  assert.ok(e.buffs.power_scoring);

  for (let i = 0; i < ITEMS.business_card.durationSteps - 1; i += 1) advanceBuffs(e);
  assert.ok(e.buffs.power_scoring, 'still active one step before expiry');

  advanceBuffs(e);
  assert.equal(e.buffs.power_scoring, undefined, 'and gone after');
});

test('advanceBuffs on an entity with no buffs is a no-op', () => {
  assert.doesNotThrow(() => advanceBuffs(hero()));
});

// ── T29: weapons ─────────────────────────────────────────────────────────────

test('the weapon roster matches the PRD', () => {
  for (const id of ['fruit', 'chopsticks', 'folding_chair', 'serving_tray',
                    'large_fish', 'lazy_susan']) {
    assert.ok(WEAPONS[id], `missing weapon ${id}`);
    assert.ok(WEAPONS[id].uses > 0, `${id} needs a use count`);
  }
});

test('the lazy Susan is stage 3 only and hits the whole table', () => {
  assert.equal(WEAPONS.lazy_susan.stage, 3);
  assert.equal(WEAPONS.lazy_susan.hitsAll, true);
});

test('a weapon starts with its full uses', () => {
  assert.equal(createWeapon('folding_chair').usesLeft, WEAPONS.folding_chair.uses);
});

test('an unknown weapon is null rather than a broken object', () => {
  assert.equal(createWeapon('lightsaber'), null);
});

test('a weapon breaks when its last use is spent', () => {
  const w = createWeapon('fruit');            // one use
  assert.equal(useWeapon(w), true, 'thrown fruit breaks immediately');

  const chair = createWeapon('folding_chair'); // three uses
  assert.equal(useWeapon(chair), false);
  assert.equal(useWeapon(chair), false);
  assert.equal(useWeapon(chair), true);
});

test('using a weapon that is already gone reports broken rather than throwing', () => {
  assert.equal(useWeapon(null), true);
});

test('you can only carry one weapon at a time', () => {
  const e = hero();
  assert.equal(pickUp(e, createWeapon('fruit')), true);
  assert.equal(pickUp(e, createWeapon('folding_chair')), false, 'hands are full');
  assert.equal(e.weapon.weaponId, 'fruit');
});

test('dropping frees the hands', () => {
  const e = hero();
  pickUp(e, createWeapon('fruit'));
  assert.equal(dropWeapon(e).weaponId, 'fruit');
  assert.equal(e.weapon, null);
  assert.equal(pickUp(e, createWeapon('large_fish')), true);
});
