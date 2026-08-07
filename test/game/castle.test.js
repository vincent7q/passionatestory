import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  CASTLE, ENEMIES, MONEY_DROP, RANGE_POWER_LOSS, applyRange, inRange, waveSpawns,
} from '../../game/js/stages/castle.js';
import {
  LIN_JIANGUO, Phase, MOVES, SUMMON_INTERVAL_STEPS, SUMMON_COUNT, BOW_STAGGER_STEPS,
  createLinJianguo, healthFraction, updatePhase, forceFeed, tickSummon, bowAtBoss,
  advanceBoss, bossOpen,
} from '../../game/js/entities/boss.js';
import { createRoster, addToRoster, resolveSummon } from '../../game/js/entities/ally.js';
import { strikeToddler, isAttackable } from '../../game/js/daze.js';
import { Kind, Team, createEntity, resetIds } from '../../game/js/entities/entity.js';
import { emptyRun, computeJudgment, JUDGMENT } from '../../shared/scoring.js';

const hero = (over = {}) => createEntity(Kind.PLAYER, {
  power: 60, powerMax: 150, team: Team.PLAYER, ...over,
});

// ── T71: sections ────────────────────────────────────────────────────────────

test('the four sections match the PRD', () => {
  assert.deepEqual(CASTLE.sections.map((s) => s.id),
    ['front_courtyard', 'ancestral_hall', 'kitchen', 'dining_room']);
  assert.deepEqual(CASTLE.sections.map((s) => s.to), [0.2, 0.45, 0.7, 1.0]);
});

test('the dining room is the boss arena with three waves before it', () => {
  const dining = CASTLE.sections.at(-1);
  assert.equal(dining.boss, true);
  assert.equal(dining.waves.length, 3, 'aunts, then cousins, then everyone at once');
});

// ── T72: enemies ─────────────────────────────────────────────────────────────

test('enemy HP matches the PRD', () => {
  assert.equal(ENEMIES.aunt.hp, 60);
  assert.equal(ENEMIES.kitchen_staff.hp, 120);
  assert.equal(ENEMIES.stanford_cousin.hp, 70);
});

test('kitchen staff cannot be grabbed — she is carrying a hot wok', () => {
  assert.equal(ENEMIES.kitchen_staff.grabbable, false);
  assert.equal(ENEMIES.aunt.grabbable, true);
});

test('the Stanford cousin mentions Stanford, twice', () => {
  assert.equal(ENEMIES.stanford_cousin.parries, true);
  assert.equal(ENEMIES.stanford_cousin.barks.filter((b) => b.includes('史丹佛')).length, 2);
});

/** Content rule 1: relentless, and never once hostile. */
test('the aunt asks about his grades rather than threatening him', () => {
  assert.ok(ENEMIES.aunt.barks.some((b) => b.includes('成績')));
});

// ── T73: the toddler ─────────────────────────────────────────────────────────

test('小表妹 cannot be attacked and has no health at all', () => {
  assert.equal(ENEMIES.toddler.attackable, false);
  assert.equal(ENEMIES.toddler.hp, null);
  assert.equal(isAttackable(ENEMIES.toddler), false);
});

test('she hits for 5 and cannot be hit back', () => {
  assert.equal(ENEMIES.toddler.contactDamage, 5);
  assert.equal(ENEMIES.toddler.grabbable, false);
});

test('everything else in the castle can be attacked', () => {
  for (const [id, def] of Object.entries(ENEMIES)) {
    if (id === 'toddler') continue;
    assert.equal(isAttackable(def), true, `${id} should be attackable`);
  }
});

/**
 * The only time the family reacts to anything all evening — and even then,
 * nothing explains why.
 */
test('striking her forfeits the award and draws a gasp from the whole room', () => {
  const run = emptyRun();
  run.judgment.neverStruckToddler = true;

  const r = strikeToddler(run);
  assert.equal(r.blocked, true, 'the hit never lands');
  assert.equal(r.gasp, true);
  assert.equal(run.judgment.neverStruckToddler, false);
});

test('never striking her is worth +4', () => {
  const run = emptyRun();
  run.judgment.neverStruckToddler = true;
  assert.equal(computeJudgment(run), JUDGMENT.NEVER_STRIKE_TODDLER);
});

// ── T74: the clues, now blatant ──────────────────────────────────────────────

test('the clues are screamed at him and he notices none of them', () => {
  const clues = CASTLE.sections.flatMap((s) => s.clues ?? []);
  for (const c of ['catering_vans', 'seating_chart', 'warming_trays', 'piano_being_tuned']) {
    assert.ok(clues.includes(c), `missing clue: ${c}`);
  }
});

// ── Hazards ──────────────────────────────────────────────────────────────────

test('the kitchen range burns', () => {
  const kitchen = CASTLE.sections.find((s) => s.id === 'kitchen');
  const p = hero({ x: kitchen.hazardRange[0].x0 + 5, power: 100 });
  assert.equal(inRange(kitchen, p), true);
  assert.equal(applyRange(kitchen, p), RANGE_POWER_LOSS);
});

test('the range never drives power below zero', () => {
  const kitchen = CASTLE.sections.find((s) => s.id === 'kitchen');
  const p = hero({ x: kitchen.hazardRange[0].x0 + 5, power: 2 });
  applyRange(kitchen, p);
  assert.equal(p.power, 0);
});

test('waveSpawns expands the final wave to everyone at once', () => {
  assert.equal(waveSpawns(CASTLE.sections.at(-1), 2).length, 4);
});

test('the toddler carries no money', () => {
  assert.equal(MONEY_DROP.toddler, 0);
});

// ── T76: 林建國, Phase 1「面談」 ───────────────────────────────────────────────

test('he is 林建國 with 1000 HP, and he scored 71 in 1994', () => {
  assert.equal(LIN_JIANGUO.hp, 1000);
  assert.equal(LIN_JIANGUO.score1994, 71);
  assert.equal(LIN_JIANGUO.age, 54);
  assert.equal(LIN_JIANGUO.name.zh, '林建國');
});

test('he starts seated, in the interview', () => {
  const b = createLinJianguo();
  assert.equal(b.phase, Phase.INTERVIEW);
  assert.equal(b.seated, true);
});

test('his opening moves are the questions', () => {
  assert.equal(MOVES.how_old.id, '你幾歲?');
  assert.equal(MOVES.own_a_house.id, '有房子嗎?');
  assert.equal(MOVES.own_a_house.guardBreaking, true);
  assert.equal(MOVES.serving_chopsticks.id, '公筷');
});

/**
 * He reads it as a heal. It is not. The restore is real and visible; the cost
 * lands in the column he does not know exists, and nothing tells him.
 */
test('「吃飽了嗎?」 restores 力 and quietly costs the hidden column', () => {
  const b = createLinJianguo();
  const p = hero({ power: 60, powerMax: 150 });
  const run = emptyRun();
  run.judgment.helpUps = 13;                       // a well-stocked column
  const before = computeJudgment(run);

  const r = forceFeed(b, p, run);
  assert.equal(r.restored, 40);
  assert.equal(p.power, 100, 'the heal is real and visible');
  assert.ok(computeJudgment(run) < before, 'and the cost is invisible');
});

test('the force-feed never overheals past the maximum', () => {
  const p = hero({ power: 145, powerMax: 150 });
  forceFeed(createLinJianguo(), p, emptyRun());
  assert.equal(p.power, 150);
});

test('being force-fed repeatedly can empty the hidden column entirely', () => {
  const run = emptyRun();
  run.judgment.helpUps = 10;
  for (let i = 0; i < 3; i += 1) forceFeed(createLinJianguo(), hero(), run);
  assert.equal(computeJudgment(run), 0);
});

// ── T77: 召集 Summon — the payoff ─────────────────────────────────────────────

test('he summons two relatives every twenty seconds', () => {
  assert.equal(SUMMON_INTERVAL_STEPS, 20 * 60);
  assert.equal(SUMMON_COUNT, 2);
});

test('the summon does not fire before its interval', () => {
  const b = createLinJianguo();
  const relatives = [{ id: 1 }, { id: 2 }];
  for (let i = 0; i < SUMMON_INTERVAL_STEPS - 1; i += 1) {
    assert.equal(tickSummon(b, createRoster(), relatives, resolveSummon), null);
  }
  assert.ok(tickSummon(b, createRoster(), relatives, resolveSummon));
});

/**
 * THE PAYOFF FOR EVERY TEN-SECOND DECISION IN THE RUN. A candidate with a full
 * roster fights Phase 1 almost alone.
 */
test('relatives the candidate helped up refuse to come', () => {
  resetIds();
  const b = createLinJianguo();
  const roster = createRoster();

  const helped = createEntity(Kind.ENEMY, { enemyType: 'aunt' });
  const stranger = createEntity(Kind.ENEMY, { enemyType: 'aunt' });
  addToRoster(roster, helped);

  b.summonTimer = 1;
  const result = tickSummon(b, roster, [helped, stranger], resolveSummon);

  assert.deepEqual(result.refused.map((e) => e.id), [helped.id]);
  assert.deepEqual(result.summoned.map((e) => e.id), [stranger.id]);
});

test('a full roster leaves him summoning nobody at all', () => {
  resetIds();
  const b = createLinJianguo();
  const roster = createRoster();
  const family = [createEntity(Kind.ENEMY), createEntity(Kind.ENEMY)];
  for (const e of family) addToRoster(roster, e);

  b.summonTimer = 1;
  const result = tickSummon(b, roster, family, resolveSummon);
  assert.equal(result.summoned.length, 0, 'a merciful run fights Phase 1 almost alone');
});

test('an empty roster means both relatives answer', () => {
  const b = createLinJianguo();
  b.summonTimer = 1;
  const result = tickSummon(b, createRoster(),
    [createEntity(Kind.ENEMY), createEntity(Kind.ENEMY)], resolveSummon);
  assert.equal(result.summoned.length, 2);
});

// ── T78: Phase 2「站起來」 ────────────────────────────────────────────────────

test('at 40% he stands up from the table for the first time', () => {
  const b = createLinJianguo();
  b.power = b.powerMax * 0.5;
  assert.equal(updatePhase(b), false, 'still seated at half');

  b.power = b.powerMax * 0.4;
  assert.equal(updatePhase(b), true);
  assert.equal(b.phase, Phase.STANDING);
  assert.equal(b.seated, false, 'he does not sit back down');
});

test('he stands only once', () => {
  const b = createLinJianguo();
  b.power = 1;
  assert.equal(updatePhase(b), true);
  assert.equal(updatePhase(b), false);
});

test('phase 2 has the standing moveset', () => {
  assert.equal(MOVES.sweep.mustJump, true);
  assert.equal(MOVES.the_serving.hits, 8, 'an eight-hit advancing chain');
  assert.equal(MOVES.one_word.mustParry, true, 'blocked is not enough');
  assert.equal(MOVES.one_word.damage, 40);
});

/**
 * The way through is to bow. He respects manners more than strength, and he
 * knows exactly what he is watching for — he learned it in this room in 1994,
 * from the other side of the table.
 */
test('a timed bow staggers him for three seconds', () => {
  const b = createLinJianguo();
  b.power = 1;
  updatePhase(b);

  const run = emptyRun();
  const r = bowAtBoss(b, run);
  assert.equal(r.staggered, true);
  assert.equal(r.steps, BOW_STAGGER_STEPS);
  assert.equal(bossOpen(b), true);
  assert.equal(run.judgment.bowedOnBeat, true, 'and it is worth +6');
});

test('bowing during the interview does nothing — the window is phase 2', () => {
  const b = createLinJianguo();
  assert.equal(bowAtBoss(b, emptyRun()).staggered, false);
});

test('bowing again while already staggered does not extend it', () => {
  const b = createLinJianguo();
  b.power = 1;
  updatePhase(b);
  bowAtBoss(b, emptyRun());
  assert.equal(bowAtBoss(b, emptyRun()).staggered, false);
});

test('the stagger runs out on its own', () => {
  const b = createLinJianguo();
  b.power = 1;
  updatePhase(b);
  bowAtBoss(b, emptyRun());
  for (let i = 0; i < BOW_STAGGER_STEPS; i += 1) advanceBoss(b);
  assert.equal(bossOpen(b), false);
});

test('health fraction is safe at a zero maximum', () => {
  assert.equal(healthFraction({ power: 0, powerMax: 0 }), 0);
});

test('the fight ends when he reaches zero', () => {
  const b = createLinJianguo();
  b.power = 0;
  advanceBoss(b);
  assert.equal(b.phase, Phase.DONE);
});
