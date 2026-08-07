/**
 * Stage 1 — 城市「追」 / The Chase
 *
 * 17:20. Commercial district, rush hour. Rain from 40%. The van is pulling away
 * and he is on foot.
 *
 * Data only. No drawing, no behaviour — the machinery is stage.js and the
 * sprites are assets.js.
 *
 * Enemies here are what he takes for the gang's street muscle. They are office
 * workers on their commute, a delivery rider, and men who happen to be standing
 * where he needs to be. One says 「不好意思」 while swinging. They go down
 * easily and they go down carefully.
 */

export const ENEMIES = {
  office_worker: {
    id: 'office_worker',
    name: { en: 'Office Worker', zh: '上班族' },
    hp: 30,
    speed: 0.5,
    behaviour: 'slow_swing',
    // Content rule 1: no character is ever rude.
    barks: ['不好意思', '抱歉', '借過一下'],
  },
  scalper: {
    id: 'scalper',
    name: { en: 'Scalper', zh: '代購黃牛' },
    hp: 35,
    speed: 0.8,
    behaviour: 'ranged_retreat',
    projectile: 'fruit',
    barks: ['等一下', '別急'],
  },
  delivery_rider: {
    id: 'delivery_rider',
    name: { en: 'Delivery Rider', zh: '外送員' },
    hp: 40,
    speed: 1.3,
    behaviour: 'hit_and_run',
    // He is the man who delivers the candidate's food every week. In the
    // reveal he waves.
    barks: ['不好意思', '我趕時間'],
  },
};

export const CITY = {
  id: 'city',
  name: { en: 'City', zh: '城市' },
  subtitle: { en: 'The Chase', zh: '追' },
  length: 3200,
  gateWidth: 480,
  strip: { yMin: 172, yMax: 250 },

  /**
   * Each layer carries its own draw data so the renderer stays generic across
   * all three stages — `band` is {y, h, w, gap}, and `accent` is an optional
   * second pass for signage, lanterns and the like.
   */
  layers: [
    { id: 'towers', factor: 0.2, colour: '#2A3247', band: { y: 40, h: 130, w: 62, gap: 96 },
      stagger: 14 },
    { id: 'shopfronts', factor: 0.5, colour: '#3C3350', band: { y: 106, h: 66, w: 66, gap: 78 },
      accent: { colour: '#E8547C', dx: 8, dy: 12, w: 3, h: 26 } },
    { id: 'pavement', factor: 1.0, ground: true, colour: '#2E2E3E',
      accent: { colour: '#4A5C7A', w: 2, gap: 64 } },
    { id: 'awnings', factor: 1.2, foreground: true, colour: '#241C2E',
      band: { y: 0, h: 26, w: 54, gap: 128 } },
  ],

  palette: { sky: '#1B2233' },

  sections: [
    {
      id: 'market_row',
      name: { en: 'Market Row', zh: '市場街' },
      from: 0, to: 0.3,
      rain: false,
      // A LOT of breakable stalls, and nothing tells the player to spare them.
      props: 9,
      waves: [
        [{ type: 'office_worker', count: 2 }],
        [{ type: 'office_worker', count: 2 }, { type: 'scalper', count: 1 }],
      ],
    },
    {
      id: 'covered_arcade',
      name: { en: 'Covered Arcade', zh: '騎樓' },
      from: 0.3, to: 0.6,
      rain: true,
      props: 4,
      // Awnings are cover. Standing under one stops the bleed, and nothing
      // says so.
      covers: [{ x0: 1000, x1: 1240 }, { x0: 1500, x1: 1720 }],
      waves: [
        [{ type: 'scalper', count: 2 }],
        [{ type: 'office_worker', count: 2 }, { type: 'delivery_rider', count: 1 }],
      ],
    },
    {
      id: 'loading_bay',
      name: { en: 'Loading Bay', zh: '卸貨區' },
      from: 0.6, to: 0.85,
      rain: true,
      props: 3,
      covers: [{ x0: 2050, x1: 2300 }],
      ambushBothSides: true,
      waves: [
        [{ type: 'delivery_rider', count: 2 }, { type: 'office_worker', count: 2 }],
        [{ type: 'scalper', count: 2 }, { type: 'delivery_rider', count: 1 }],
      ],
    },
    {
      id: 'fruit_stall',
      name: { en: 'Fruit Stall', zh: '水果攤' },
      from: 0.85, to: 1.0,
      rain: false,
      props: 0,
      boss: true,
      waves: [],
    },
  ],

  boss: 'fruit_shop_owner',

  /** Total 錢 available across the stage, for the money criterion. */
  moneyAvailable: 2400,

  // Attached so main.js can drive any stage without per-stage imports.
  get enemies() { return ENEMIES; },
  get moneyDrop() { return MONEY_DROP; },
  get spawnsFor() { return waveSpawns; },
};

/** Money dropped per enemy type. Every coin is off a man on the Lin payroll. */
export const MONEY_DROP = {
  office_worker: 100,
  scalper: 120,
  delivery_rider: 140,
};

export function enemyDef(type) {
  return ENEMIES[type];
}

/** Flatten a section's waves into concrete spawn descriptors. */
export function waveSpawns(section, waveIndex) {
  const wave = section.waves?.[waveIndex];
  if (!wave) return [];
  const out = [];
  for (const { type, count } of wave) {
    for (let i = 0; i < count; i += 1) out.push({ type, def: ENEMIES[type] });
  }
  return out;
}
