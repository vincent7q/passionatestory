/**
 * The three candidates. Stats from docs/PRD.md §3.
 *
 * PORTABILITY: this module is imported by the BROWSER over HTTP (/shared/…)
 * and by NODE. No node: imports, no process, no fs, no DOM. Named exports only.
 * See SPEC.md §2.1.
 *
 * NOTE: `vincent` is NOT a candidate id. VINCENT 林建國 is 小雨's father and the
 * final boss — he scored the 71 in 1994. docs/images/vincent.png is his
 * portrait, sitting next to the candidate portraits, which makes this an easy
 * mistake. See CLAUDE.md.
 */

export const CANDIDATES = ['felix', 'lucian', 'hilman'];

export const CHARACTERS = {
  felix: {
    id: 'felix',
    name: { en: 'FELIX', zh: '菲利克斯' },
    age: 21,
    archetype: 'balanced',
    power: 100,
    spirit: 80,
    stars: { speed: 4, power: 3, guard: 3 },
    palette: { hair: '#141414', skin: '#F6C9A8', shirt: '#8A8A94', accent: '#E85A5A' },
    specials: [
      { id: 'rapid_punch',   name: { en: 'Rapid Punch',    zh: '連環拳' }, cost: 10 },
      { id: 'tornado_kick',  name: { en: 'Tornado Kick',   zh: '旋風腿' }, cost: 20 },
      { id: 'burning_spirit', name: { en: 'Burning Spirit', zh: '熱血'  }, cost: 30 },
    ],
  },

  lucian: {
    id: 'lucian',
    name: { en: 'LUCIAN', zh: '盧西安' },
    age: 22,
    archetype: 'speed',
    power: 80,
    spirit: 100,
    stars: { speed: 5, power: 2, guard: 2 },
    palette: { hair: '#241F1C', skin: '#FBD9B4', shirt: '#3C4A6B', accent: '#F2A65A' },
    specials: [
      { id: 'dash_strike',    name: { en: 'Dash Strike',    zh: '迴避突進' }, cost: 10 },
      { id: 'aerial_barrage', name: { en: 'Aerial Barrage', zh: '空中連踢' }, cost: 25 },
      { id: 'shadow_clone',   name: { en: 'Shadow Clone',   zh: '分身'    }, cost: 40 },
    ],
  },

  hilman: {
    id: 'hilman',
    name: { en: 'HILMAN', zh: '希爾曼' },
    age: 27,
    archetype: 'power',
    power: 140,
    spirit: 60,
    stars: { speed: 2, power: 5, guard: 4 },
    palette: { hair: '#3A2A20', skin: '#F8CFA8', shirt: '#5C6B4A', accent: '#C4703A' },
    specials: [
      { id: 'power_slam',      name: { en: 'Power Slam',      zh: '摔技'   }, cost: 15 },
      { id: 'earthquake_punch', name: { en: 'Earthquake Punch', zh: '震地拳' }, cost: 25 },
      { id: 'berserker',       name: { en: 'Berserker',       zh: '拚了'   }, cost: 50 },
    ],
  },
};

/** Level cap and per-level gains. docs/PRD.md §3.1. */
export const LEVEL_CAP = 20;
export const PER_LEVEL = { power: 5, spirit: 3 };

export function getCharacter(id) {
  return Object.prototype.hasOwnProperty.call(CHARACTERS, id) ? CHARACTERS[id] : undefined;
}
