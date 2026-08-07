import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  FOREST, ENEMIES, MONEY_DROP, POND_POWER_LOSS, SENSOR_LEAD,
  inPond, applyPond, litSensors, sensorIsAhead, waveSpawns,
} from '../../game/js/stages/forest.js';
import {
  SECOND_UNCLE, TeaBeat, REFUSE_POWER_COST, HEAVINESS_PER_CUP,
  createSecondUncle, refillIfDowned, acceptCup, refuseCup, bowToUncle, uncleBlocksPath,
} from '../../game/js/entities/boss.js';
import { State, Team, Kind, createEntity } from '../../game/js/entities/entity.js';
import { sectionAt, progress } from '../../game/js/stages/stage.js';
import { emptyRun, computeJudgment, JUDGMENT } from '../../shared/scoring.js';
import { moveSpeed, MOVE } from '../../game/js/entities/player.js';

const hero = (over = {}) => createEntity(Kind.PLAYER, {
  x: 0, y: 200, power: 100, powerMax: 100, spirit: 0, spiritMax: 100,
  team: Team.PLAYER, heaviness: 0, ...over,
});

// ── T65: sections ────────────────────────────────────────────────────────────

test('the four sections match the PRD', () => {
  assert.deepEqual(FOREST.sections.map((s) => s.id),
    ['lower_gate', 'pond_path', 'stone_steps', 'tea_pavilion']);
});

test('section boundaries are 25 / 50 / 75 percent', () => {
  assert.deepEqual(FOREST.sections.map((s) => s.to), [0.25, 0.5, 0.75, 1.0]);
});

test('sections tile the stage with no gaps', () => {
  for (let i = 1; i < FOREST.sections.length; i += 1) {
    assert.equal(FOREST.sections[i].from, FOREST.sections[i - 1].to);
  }
});

test('the tea pavilion is the boss arena', () => {
  assert.equal(sectionAt(FOREST, FOREST.length * 0.9).boss, true);
  assert.equal(progress(FOREST, FOREST.length), 1);
});

test('the layers match the PRD, distant to foreground', () => {
  assert.deepEqual(FOREST.layers.map((l) => l.factor), [0.2, 0.4, 0.8, 1.2]);
});

test('the stone steps section is marked vertical', () => {
  assert.equal(FOREST.sections.find((s) => s.id === 'stone_steps').vertical, true);
});

// ── T66: enemies ─────────────────────────────────────────────────────────────

test('enemy HP matches the PRD', () => {
  assert.equal(ENEMIES.groundskeeper.hp, 45);
  assert.equal(ENEMIES.guard_dog.hp, 25);
  assert.equal(ENEMIES.young_cousin.hp, 35);
  assert.equal(ENEMIES.estate_security.hp, 80);
});

test('a dog cannot be thrown — nobody throws a dog', () => {
  assert.equal(ENEMIES.guard_dog.throwable, false);
});

/** Guards, parries, waits. The first enemy that punishes mashing. */
test('estate security parries and is the toughest of the four', () => {
  assert.equal(ENEMIES.estate_security.parries, true);
  const hps = Object.values(ENEMIES).map((e) => e.hp);
  assert.equal(Math.max(...hps), ENEMIES.estate_security.hp);
});

test('waveSpawns expands counts', () => {
  const spawns = waveSpawns(FOREST.sections[0], 1);
  assert.equal(spawns.length, 3);
  assert.equal(spawns.filter((s) => s.type === 'guard_dog').length, 2);
});

test('a dog carries no money, because a dog would not', () => {
  assert.equal(MONEY_DROP.guard_dog, 0);
  assert.ok(MONEY_DROP.estate_security > 0);
});

// ── T68: the clues, which are the point of this stage ────────────────────────

/** Every uniform carries a small 林. Nobody mentions it. */
test('the staff in uniform wear it; the cousin and the dog do not', () => {
  assert.equal(ENEMIES.groundskeeper.uniform, true);
  assert.equal(ENEMIES.estate_security.uniform, true);
  assert.equal(ENEMIES.young_cousin.uniform, undefined, 'a cousin is not staff');
});

test('the dogs wear collars', () => {
  assert.equal(ENEMIES.guard_dog.collar, true);
});

/** Content rule 1: no character is ever rude, even while attacking. */
test('every human enemy is polite', () => {
  for (const [id, def] of Object.entries(ENEMIES)) {
    if (id === 'guard_dog') continue;
    assert.ok(def.barks.length > 0, `${id} needs something polite to say`);
  }
  assert.ok(ENEMIES.groundskeeper.barks.includes('不好意思'));
});

// ── T67: hazards ─────────────────────────────────────────────────────────────

test('falling in the koi pond costs a lot of power at once', () => {
  const pond = FOREST.sections.find((s) => s.id === 'pond_path');
  const p = hero({ x: pond.hazardPond[0].x0 + 10, vx: 3 });
  assert.equal(inPond(pond, p), true);
  assert.equal(applyPond(pond, p), POND_POWER_LOSS);
  assert.equal(p.vx, 0, 'and stops you dead');
});

test('the pond does not reach beyond its banks', () => {
  const pond = FOREST.sections.find((s) => s.id === 'pond_path');
  assert.equal(applyPond(pond, hero({ x: pond.hazardPond[0].x0 - 50 })), 0);
});

test('the pond never drives power below zero', () => {
  const pond = FOREST.sections.find((s) => s.id === 'pond_path');
  const p = hero({ x: pond.hazardPond[0].x0 + 5, power: 3 });
  applyPond(pond, p);
  assert.equal(p.power, 0);
});

/**
 * The lights come on AHEAD of him, not behind. That distinction is the entire
 * clue — someone is expecting him — and nothing ever points at it.
 */
test('the sensor lights come on ahead of the player', () => {
  const steps = FOREST.sections.find((s) => s.id === 'stone_steps');
  const light = steps.sensorLights[0];
  const playerX = light.x - SENSOR_LEAD + 10;

  assert.ok(litSensors(steps, playerX).includes(light), 'it lights before he arrives');
  assert.equal(sensorIsAhead(light, playerX), true, 'and it is still in front of him');
});

test('a light far up the road has not come on yet', () => {
  const steps = FOREST.sections.find((s) => s.id === 'stone_steps');
  assert.equal(litSensors(steps, 0).length, 0);
});

// ── T69: 二叔 BAN, who cannot be beaten by fighting ───────────────────────────

test('he is 二叔 BAN 班 with 500 HP and three cups', () => {
  assert.equal(SECOND_UNCLE.hp, 500);
  assert.equal(SECOND_UNCLE.cups, 3);
  assert.ok(SECOND_UNCLE.name.zh.includes('班'));
});

/**
 * THE BEAT WHERE THE PLAYER WORKS IT OUT. Reduce him to zero and he pours
 * another cup and stands back up, fully restored. A kidnapper does not do this.
 */
test('he cannot be beaten by fighting — he simply refills', () => {
  const uncle = createSecondUncle();
  for (let i = 0; i < 5; i += 1) {
    uncle.power = 0;
    assert.equal(refillIfDowned(uncle), true, `round ${i}: he gets back up`);
    assert.equal(uncle.power, uncle.powerMax, 'fully restored, every time');
  }
  assert.equal(uncleBlocksPath(uncle), true, 'and he is still in the road');
});

test('refilling only happens at zero', () => {
  const uncle = createSecondUncle();
  uncle.power = 100;
  assert.equal(refillIfDowned(uncle), false);
  assert.equal(uncle.power, 100);
});

// ── T70: the three cups ──────────────────────────────────────────────────────

test('accepting a cup restores 氣 fully and adds heaviness', () => {
  const uncle = createSecondUncle();
  const p = hero({ spirit: 10 });
  acceptCup(uncle, p, emptyRun());
  assert.equal(p.spirit, p.spiritMax);
  assert.equal(p.heaviness, HEAVINESS_PER_CUP);
});

test('heaviness accumulates, leaving him at his slowest after three', () => {
  const uncle = createSecondUncle();
  const p = hero();
  const before = moveSpeed(p, MOVE.SPEED_X);

  for (let i = 0; i < 3; i += 1) acceptCup(uncle, p, emptyRun());

  assert.equal(p.heaviness, 3);
  assert.ok(moveSpeed(p, MOVE.SPEED_X) < before, 'each cup makes him slower');
});

test('refusing costs power, because you do not refuse an uncle', () => {
  const uncle = createSecondUncle();
  const p = hero();
  const r = refuseCup(uncle, p, emptyRun());
  assert.equal(r.powerCost, REFUSE_POWER_COST);
  assert.equal(p.power, 100 - REFUSE_POWER_COST);
});

test('accepting all three is worth +8 into the hidden column', () => {
  const uncle = createSecondUncle();
  const run = emptyRun();
  const p = hero();
  for (let i = 0; i < 3; i += 1) acceptCup(uncle, p, run);

  assert.equal(run.judgment.acceptedAllCups, true);
  assert.equal(computeJudgment(run), JUDGMENT.ACCEPT_ALL_CUPS);
});

test('refusing even one forfeits the award', () => {
  const uncle = createSecondUncle();
  const run = emptyRun();
  const p = hero();
  acceptCup(uncle, p, run);
  acceptCup(uncle, p, run);
  refuseCup(uncle, p, run);

  assert.equal(run.judgment.acceptedAllCups, false);
  assert.equal(computeJudgment(run), 0);
});

test('after three cups the bow window opens', () => {
  const uncle = createSecondUncle();
  const p = hero();
  for (let i = 0; i < 3; i += 1) acceptCup(uncle, p, emptyRun());
  assert.equal(uncle.tea.beat, TeaBeat.BOW_WINDOW);
});

test('a fourth cup is never offered', () => {
  const uncle = createSecondUncle();
  const p = hero();
  for (let i = 0; i < 3; i += 1) acceptCup(uncle, p, emptyRun());
  assert.equal(acceptCup(uncle, p, emptyRun()).accepted, false);
  assert.equal(uncle.tea.cupsAccepted, 3);
});

/**
 * The way through is to bow. He steps aside beaming, tells the candidate he's a
 * good kid, joins, and teaches 鐵山靠.
 */
test('bowing is the only way past him', () => {
  const uncle = createSecondUncle();
  const p = hero();

  assert.equal(bowToUncle(uncle).passed, false, 'you cannot bow before the cups');

  for (let i = 0; i < 3; i += 1) acceptCup(uncle, p, emptyRun());
  const r = bowToUncle(uncle);

  assert.equal(r.passed, true);
  assert.equal(r.teaches, 'iron_mountain');
  assert.equal(r.joins, true);
  assert.equal(uncle.state, State.ALLIED);
  assert.equal(uncle.team, Team.PLAYER);
  assert.equal(uncleBlocksPath(uncle), false);
});

test('bowing works even after refusing every cup', () => {
  const uncle = createSecondUncle();
  const p = hero();
  for (let i = 0; i < 3; i += 1) refuseCup(uncle, p, emptyRun());
  assert.equal(bowToUncle(uncle).passed, true, 'rudeness costs points, not passage');
});

test('the tea ceremony tolerates a missing player or run', () => {
  const uncle = createSecondUncle();
  assert.doesNotThrow(() => acceptCup(uncle, null, null));
  assert.doesNotThrow(() => refuseCup(uncle, null, null));
});
