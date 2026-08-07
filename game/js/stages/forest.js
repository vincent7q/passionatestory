/**
 * Stage 2 — 森林「山路」 / The Mountain Road
 *
 * 17:45. Dusk. One private road, three kilometres, up a mountain.
 *
 * THE CLUES HERE SHOULD BE ABSURD AND UNMISSABLE. Every uniform carries a small
 * 林 on the chest. The dogs wear collars and are well fed. The guards apologise,
 * help each other up, and are unfailingly polite. The estate lights come on
 * automatically as he passes, as though someone is expecting him.
 *
 * The player works it out here. The candidate never does.
 *
 * Data only — no drawing, no behaviour.
 */

export const ENEMIES = {
  groundskeeper: {
    id: 'groundskeeper',
    name: { en: 'Groundskeeper', zh: '園丁' },
    hp: 45,
    speed: 0.6,
    behaviour: 'wide_sweep',
    // A small 林 embroidered on the chest. He does not mention it.
    uniform: true,
    barks: ['不好意思', '小心腳步', '這邊剛修過'],
  },
  guard_dog: {
    id: 'guard_dog',
    name: { en: 'Guard Dog', zh: '看門狗' },
    hp: 25,
    speed: 1.4,
    behaviour: 'fast_low',
    // Fast, low, hard to hit — and CANNOT BE THROWN. Nobody throws a dog.
    throwable: false,
    // Wearing a collar, and very well fed.
    collar: true,
    barks: [],
  },
  young_cousin: {
    id: 'young_cousin',
    name: { en: 'Young Cousin', zh: '表弟' },
    hp: 35,
    speed: 0.5,
    behaviour: 'ranged_distracted',
    projectile: 'stationery',
    // Throws stationery without once looking up from his homework.
    barks: ['等一下啦', '我在寫功課'],
  },
  estate_security: {
    id: 'estate_security',
    name: { en: 'Estate Security', zh: '保全' },
    hp: 80,
    speed: 0.7,
    // Guards, parries, waits. THE FIRST ENEMY THAT PUNISHES MASHING — which is
    // also the first mechanical nudge toward the thing being measured.
    behaviour: 'guard_and_punish',
    parries: true,
    uniform: true,
    barks: ['請留步', '不好意思'],
  },
};

export const FOREST = {
  id: 'forest',
  name: { en: 'Forest', zh: '森林' },
  subtitle: { en: 'The Mountain Road', zh: '山路' },
  length: 3800,
  gateWidth: 480,
  strip: { yMin: 178, yMax: 248 },

  /** Same shape as the city's, so the renderer needs no per-stage branch. */
  layers: [
    { id: 'ridgeline', factor: 0.2, colour: '#1D2A38', band: { y: 92, h: 90, w: 140, gap: 130 },
      stagger: 18 },
    { id: 'pines', factor: 0.4, colour: '#1B3428', band: { y: 74, h: 108, w: 30, gap: 44 },
      stagger: 12 },
    { id: 'gravel', factor: 0.8, ground: true, colour: '#2A2E27',
      // Stone lanterns along the road, warm against the dusk.
      accent: { colour: '#E8B15C', w: 3, gap: 150 } },
    { id: 'ferns', factor: 1.2, foreground: true, colour: '#16281C',
      band: { y: 244, h: 26, w: 40, gap: 96 } },
  ],

  palette: { sky: '#141F2B' },

  sections: [
    {
      id: 'lower_gate',
      name: { en: 'Lower Gate', zh: '下閘門' },
      from: 0, to: 0.25,
      props: 2,
      waves: [
        [{ type: 'groundskeeper', count: 2 }],
        [{ type: 'guard_dog', count: 2 }, { type: 'groundskeeper', count: 1 }],
      ],
    },
    {
      id: 'pond_path',
      name: { en: 'Pond Path', zh: '池畔小徑' },
      from: 0.25, to: 0.5,
      props: 3,
      // Falling in costs a lot. The koi are fine.
      hazardPond: [{ x0: 1100, x1: 1320 }],
      waves: [
        [{ type: 'young_cousin', count: 1 }, { type: 'guard_dog', count: 2 }],
        [{ type: 'groundskeeper', count: 2 }, { type: 'estate_security', count: 1 }],
      ],
    },
    {
      id: 'stone_steps',
      name: { en: 'Stone Steps', zh: '石階' },
      from: 0.5, to: 0.75,
      props: 2,
      vertical: true,
      // Motion-sensor garden lights that stagger — and which come on AHEAD of
      // him, as though someone is expecting him. He does not wonder about it.
      sensorLights: [{ x: 2050 }, { x: 2260 }, { x: 2480 }],
      waves: [
        [{ type: 'estate_security', count: 2 }],
        [{ type: 'guard_dog', count: 3 }, { type: 'young_cousin', count: 1 }],
      ],
    },
    {
      id: 'tea_pavilion',
      name: { en: 'Tea Pavilion', zh: '茶亭' },
      from: 0.75, to: 1.0,
      props: 0,
      boss: true,
      waves: [],
    },
  ],

  boss: 'second_uncle',
  moneyAvailable: 3000,

  // Attached so main.js can drive any stage without per-stage imports.
  get enemies() { return ENEMIES; },
  get moneyDrop() { return MONEY_DROP; },
  get spawnsFor() { return waveSpawns; },
};

export const MONEY_DROP = {
  groundskeeper: 130,
  guard_dog: 0,          // a dog is not carrying money
  young_cousin: 90,
  estate_security: 180,
};

/** Falling in the koi pond costs a lot of 力, all at once. */
export const POND_POWER_LOSS = 18;

export function inPond(section, entity) {
  return (section.hazardPond ?? []).some((p) => entity.x >= p.x0 && entity.x <= p.x1);
}

export function applyPond(section, entity) {
  if (!inPond(section, entity)) return 0;
  const before = entity.power;
  entity.power = Math.max(0, entity.power - POND_POWER_LOSS);
  entity.vx = 0;
  return before - entity.power;
}

/**
 * Motion-sensor lights. They come on AHEAD of the player, not behind — the
 * distinction is the entire clue, and nothing ever points at it.
 */
export const SENSOR_LEAD = 90;

export function litSensors(section, playerX) {
  return (section.sensorLights ?? []).filter((l) => l.x - playerX <= SENSOR_LEAD);
}

export function sensorIsAhead(light, playerX) {
  return light.x > playerX;
}

export function enemyDef(type) {
  return ENEMIES[type];
}

export function waveSpawns(section, waveIndex) {
  const wave = section.waves?.[waveIndex];
  if (!wave) return [];
  const out = [];
  for (const { type, count } of wave) {
    for (let i = 0; i < count; i += 1) out.push({ type, def: ENEMIES[type] });
  }
  return out;
}
