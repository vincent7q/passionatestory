/**
 * Stage 3 — 城堡「城堡」 / The Castle
 *
 * 18:00. He is certain this is where they are keeping her.
 *
 * THE CLUES ARE NOW SCREAMED AT HIM. Catering vans in the courtyard. A seating
 * chart on an easel by the door. Warming trays. Someone tuning a piano. A
 * banner going up, and it is not a threat.
 *
 * He notices none of it. He is looking for a dungeon.
 *
 * Data only.
 */

export const ENEMIES = {
  aunt: {
    id: 'aunt',
    name: { en: 'Aunt', zh: '阿姨' },
    hp: 60,
    speed: 0.6,
    behaviour: 'relentless_spoon',
    grabbable: true,
    // Asks about his grades mid-combo. Relentless, and never once hostile.
    barks: ['成績還好嗎?', '有沒有吃飽?', '你太瘦了'],
  },
  kitchen_staff: {
    id: 'kitchen_staff',
    name: { en: 'Kitchen Staff', zh: '廚房阿姨' },
    hp: 120,
    speed: 0.35,
    behaviour: 'slow_wok',
    // Slow, enormous damage, and cannot be grabbed — you do not grab a woman
    // carrying a hot wok.
    grabbable: false,
    barks: ['小心燙', '讓一下'],
  },
  stanford_cousin: {
    id: 'stanford_cousin',
    name: { en: 'Stanford Cousin', zh: '史丹佛表哥' },
    hp: 70,
    speed: 0.9,
    behaviour: 'technical_parry',
    parries: true,
    grabbable: true,
    // Mentions Stanford. Twice.
    barks: ['我在史丹佛的時候', '這個我在史丹佛學過'],
  },
  toddler: {
    id: 'toddler',
    name: { en: 'Toddler', zh: '小表妹' },
    hp: null,
    speed: 0.4,
    behaviour: 'harmless_menace',
    /**
     * SHE CANNOT BE ATTACKED. She hits for 5 and cannot be hit back.
     * Striking her is a heavy penalty and an audible gasp from the whole room —
     * the only time the family reacts to anything all evening.
     */
    attackable: false,
    grabbable: false,
    contactDamage: 5,
    barks: ['！'],
  },
};

export const CASTLE = {
  id: 'castle',
  name: { en: 'Castle', zh: '城堡' },
  subtitle: { en: 'The Castle', zh: '城堡' },
  length: 3400,
  gateWidth: 480,
  strip: { yMin: 176, yMax: 246 },

  layers: [
    { id: 'clerestory', factor: 0.1, colour: '#20222E', band: { y: 22, h: 52, w: 34, gap: 62 } },
    { id: 'courtyard', factor: 0.3, colour: '#2B2733', band: { y: 74, h: 96, w: 108, gap: 138 },
      stagger: 10 },
    { id: 'columns', factor: 0.6, colour: '#3A2B2B', band: { y: 62, h: 116, w: 22, gap: 118 },
      // Ancestral portraits, gold-framed. He runs straight past every one.
      accent: { colour: '#8A6A38', dx: 34, dy: 26, w: 24, h: 30 } },
    { id: 'furniture', factor: 1.0, ground: true, colour: '#2E2622',
      accent: { colour: '#5A3F30', w: 3, gap: 88 } },
    { id: 'lanterns', factor: 1.2, foreground: true, colour: '#3A1C1C',
      band: { y: 0, h: 30, w: 26, gap: 112 } },
  ],

  palette: { sky: '#171520' },

  sections: [
    {
      id: 'front_courtyard',
      name: { en: 'Front Courtyard', zh: '前庭' },
      from: 0, to: 0.2,
      props: 3,
      // Catering vans. A seating chart on an easel. He is looking for a dungeon.
      clues: ['catering_vans', 'seating_chart', 'banner'],
      waves: [
        [{ type: 'aunt', count: 2 }],
        [{ type: 'aunt', count: 2 }, { type: 'stanford_cousin', count: 1 }],
      ],
    },
    {
      id: 'ancestral_hall',
      name: { en: 'Ancestral Hall', zh: '祖堂' },
      from: 0.2, to: 0.45,
      props: 4,
      clues: ['piano_being_tuned', 'ancestral_portraits'],
      // A hallway of framed portraits that break if you throw someone into them.
      breakablePortraits: true,
      waves: [
        [{ type: 'stanford_cousin', count: 2 }],
        [{ type: 'aunt', count: 3 }, { type: 'toddler', count: 1 }],
      ],
    },
    {
      id: 'kitchen',
      name: { en: 'Kitchen', zh: '廚房' },
      from: 0.45, to: 0.7,
      props: 3,
      clues: ['warming_trays'],
      // A soup tureen that must not be knocked over, and the range itself.
      hazardTureen: [{ x0: 1700, x1: 1760 }],
      hazardRange: [{ x0: 1980, x1: 2100 }],
      waves: [
        [{ type: 'kitchen_staff', count: 1 }, { type: 'aunt', count: 2 }],
        [{ type: 'kitchen_staff', count: 2 }],
      ],
    },
    {
      id: 'dining_room',
      name: { en: 'Dining Room', zh: '飯廳' },
      from: 0.7, to: 1.0,
      props: 0,
      boss: true,
      // Three waves before the dining room: aunts, then cousins, then everyone.
      waves: [
        [{ type: 'aunt', count: 3 }],
        [{ type: 'stanford_cousin', count: 2 }, { type: 'toddler', count: 1 }],
        [{ type: 'aunt', count: 2 }, { type: 'stanford_cousin', count: 1 },
         { type: 'kitchen_staff', count: 1 }],
      ],
    },
  ],

  boss: 'lin_jianguo',
  moneyAvailable: 3600,
};

export const MONEY_DROP = {
  aunt: 160,
  kitchen_staff: 220,
  stanford_cousin: 200,
  toddler: 0,
};

/** The kitchen range burns. The tureen must not be knocked over. */
export const RANGE_POWER_LOSS = 12;
export const TUREEN_HP = 20;

export function inRange(section, entity) {
  return (section.hazardRange ?? []).some((h) => entity.x >= h.x0 && entity.x <= h.x1);
}

export function applyRange(section, entity) {
  if (!inRange(section, entity)) return 0;
  const before = entity.power;
  entity.power = Math.max(0, entity.power - RANGE_POWER_LOSS);
  return before - entity.power;
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

CASTLE.enemies = ENEMIES;
CASTLE.moneyDrop = MONEY_DROP;
CASTLE.spawnsFor = waveSpawns;
