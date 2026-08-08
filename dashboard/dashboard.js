/**
 * The leaderboard. Three boards, one per candidate — docs/PRD.md, T87.
 *
 * SPOILER DISCIPLINE, AND WHY THIS FILE SHOWS ONLY TOTALS
 * ------------------------------------------------------
 * `GET /api/leaderboard` returns every column, including the hidden one. This
 * page shows the total and nothing else, on purpose.
 *
 * A leaderboard is the single screen most likely to be on display BEFORE
 * somebody plays: at a party, on a second monitor, over a shoulder while
 * someone waits for a turn. A column headed with the third criterion hands them
 * the twist for free — and unlike the HUD, which hides in plain sight because
 * every game has a power bar and a money counter, a named third criterion on a
 * scoreboard invites exactly the question the game spends twenty minutes not
 * answering.
 *
 * `test/game/spoiler.test.js` (C2) walks this directory for the same reason it
 * walks game/. If a breakdown is ever genuinely wanted, it belongs behind an
 * explicit action by someone who has already finished a run — never as the
 * default render.
 */

import { CANDIDATES, CHARACTERS } from '/shared/characters.js';

const DIFFICULTIES = ['easy', 'normal', 'hard'];

const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

/** ms → m:ss. A run is fifteen to twenty-five minutes, so hours never appear. */
export function formatDuration(ms) {
  if (!(ms > 0)) return '—';
  const total = Math.round(ms / 1000);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

/** '2026-08-08 19:04:11' → '08-08'. The year is noise on a board. */
export function formatDate(value) {
  if (typeof value !== 'string' || value.length < 10) return '';
  return value.slice(5, 10);
}

/**
 * How far he got. `completed` is the honest one — a run can reach stage 3 and
 * still not finish it.
 */
export function progressLabel(entry) {
  if (entry.completed) return '完走';
  return `第${entry.stage_reached ?? 1}關`;
}

async function fetchBoard(candidate) {
  const res = await fetch(`/api/leaderboard?candidate=${encodeURIComponent(candidate)}&limit=10`);
  if (!res.ok) throw new Error(`leaderboard ${res.status}`);
  return (await res.json()).entries ?? [];
}

function renderBoard(candidate, entries) {
  const character = CHARACTERS[candidate];
  const section = el('section', 'board');
  section.appendChild(el('h2', null, character?.name.zh ?? candidate))
    .appendChild(el('span', 'en', character?.name.en ?? ''));

  if (!entries.length) {
    section.appendChild(el('p', 'empty', '還沒有人試過。'));
    return section;
  }

  const table = el('table');
  const head = el('tr');
  // Total only. No column names a criterion — see the note at the top.
  //
  // 用時 rather than 時間: this column is a DURATION, and an 18-minute run
  // renders as "18:00" — which under a heading meaning "time" reads as six
  // o'clock, the one clock face this game has trained the player to watch.
  for (const h of ['#', '姓名', '分數', '進度', '用時', '難度', '日期']) {
    head.appendChild(el('th', null, h));
  }
  table.appendChild(el('thead')).appendChild(head);

  const body = el('tbody');
  entries.forEach((entry, i) => {
    const row = el('tr');
    // 林建國's 71 sits permanently on the board, and it is the bar.
    if (entry.name === 'LIN') row.classList.add('is-father');
    row.appendChild(el('td', 'rank', String(i + 1)));
    row.appendChild(el('td', 'name', entry.name));
    row.appendChild(el('td', 'score', String(entry.grade)));
    row.appendChild(el('td', null, progressLabel(entry)));
    row.appendChild(el('td', null, formatDuration(entry.duration_ms)));
    row.appendChild(el('td', null, entry.difficulty));
    row.appendChild(el('td', 'date', formatDate(entry.created_at)));
    body.appendChild(row);
  });
  table.appendChild(body);
  section.appendChild(table);
  return section;
}

/** Stats. Nothing here averages the hidden column, for the reason above. */
function renderStats(stats) {
  const list = document.getElementById('stat-list');
  list.replaceChildren();

  const rows = [
    ['總場次 Runs', String(stats.total ?? 0)],
    ['完走率 Completion', `${Math.round((stats.completionRate ?? 0) * 100)}%`],
    ['分數中位數 Median', String(Math.round(stats.medianGrade ?? 0))],
  ];
  for (const id of CANDIDATES) {
    rows.push([CHARACTERS[id]?.name.zh ?? id, String(stats.picks?.[id] ?? 0)]);
  }

  for (const [term, value] of rows) {
    list.appendChild(el('dt', null, term));
    list.appendChild(el('dd', null, value));
  }
  document.getElementById('stats').hidden = false;
}

async function load() {
  const boards = document.getElementById('boards');
  try {
    const results = await Promise.all(CANDIDATES.map(async (id) => [id, await fetchBoard(id)]));
    boards.replaceChildren(...results.map(([id, entries]) => renderBoard(id, entries)));
  } catch (err) {
    // A board that cannot load says so plainly rather than sitting on 載入中.
    boards.replaceChildren(el('p', 'error', `排行榜暫時無法載入。(${err.message})`));
  }

  try {
    const res = await fetch('/api/stats');
    if (res.ok) renderStats(await res.json());
  } catch {
    // Stats are a nice-to-have; the boards are the page.
  }
}

export const REFRESH_MS = 30_000;

/**
 * Start only in a browser.
 *
 * A module that fetches the moment it is imported cannot be imported by a test,
 * and the pure helpers above are worth testing. Guarding on `document` also
 * stops the refresh timer holding a Node process open forever.
 */
export function start() {
  load();
  // A board left on a second monitor should not go stale, and 30s is nothing
  // against SQLite. Paused while hidden so a forgotten tab is not polling all
  // night for nobody.
  setInterval(() => { if (!document.hidden) load(); }, REFRESH_MS);
}

if (typeof document !== 'undefined') start();

export { DIFFICULTIES, load };
