import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CHARACTERS, CANDIDATES, getCharacter } from '../../shared/characters.js';

test('the three candidates, in select order', () => {
  assert.deepEqual(CANDIDATES, ['felix', 'lucian', 'hilman']);
  assert.deepEqual(Object.keys(CHARACTERS), ['felix', 'lucian', 'hilman']);
});

// Regression guard for the cast revision (commit d796d18). vincent.png sits in
// docs/images/ next to the three candidate portraits, so this is an easy
// mistake to make: VINCENT 林建國 is 小雨's father and the FINAL BOSS.
test('vincent is not a candidate — he is the final boss', () => {
  assert.equal(CHARACTERS.vincent, undefined);
  assert.ok(!CANDIDATES.includes('vincent'));
});

test('every candidate has stats, three specials, and both names', () => {
  for (const id of CANDIDATES) {
    const c = CHARACTERS[id];
    assert.equal(c.id, id, `${id}: id must match its key`);
    assert.ok(c.name.en && c.name.zh, `${id}: needs both names`);
    assert.ok(c.age > 0, `${id}: needs an age`);
    assert.ok(c.power > 0 && c.spirit > 0, `${id}: needs 力 and 氣`);
    assert.equal(c.specials.length, 3, `${id}: exactly three specials`);
    for (const s of c.specials) {
      assert.ok(s.name.en && s.name.zh, `${id}/${s.id}: needs both names`);
      assert.ok(s.cost > 0, `${id}/${s.id}: specials cost 氣`);
    }
  }
});

test('stats match the PRD and differentiate the three archetypes', () => {
  assert.equal(CHARACTERS.felix.power, 100);
  assert.equal(CHARACTERS.lucian.power, 80);
  assert.equal(CHARACTERS.hilman.power, 140);
  assert.equal(CHARACTERS.lucian.spirit, 100);
  assert.equal(CHARACTERS.hilman.spirit, 60);
  // Hilman must silhouette as the biggest of the three (SPEC.md open question 4).
  assert.ok(CHARACTERS.hilman.power > CHARACTERS.felix.power);
  assert.ok(CHARACTERS.felix.power > CHARACTERS.lucian.power);
});

test('getCharacter returns undefined for an unknown id rather than throwing', () => {
  assert.equal(getCharacter('vincent'), undefined);
  assert.equal(getCharacter('nope'), undefined);
  assert.equal(getCharacter('felix').id, 'felix');
});

// shared/ is loaded by the browser over HTTP as well as by Node.
test('no Node-only globals leak into shared/', async () => {
  const src = await import('node:fs').then((fs) =>
    fs.readFileSync(new URL('../../shared/characters.js', import.meta.url), 'utf8'));
  for (const banned of ['require(', 'process.', "from 'node:", 'from "node:']) {
    assert.ok(!src.includes(banned), `shared/ must stay portable — found ${banned}`);
  }
});
