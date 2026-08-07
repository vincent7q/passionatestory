/**
 * SQLite via better-sqlite3 — synchronous, so no async ceremony.
 *
 * THE DATABASE FILE MUST LIVE ON A MOUNTED VOLUME (/data/records.db, DB_PATH).
 * Inside the image, every redeploy silently wipes all records. That is the
 * deployment mistake that actually hurts.
 *
 * SQLite also means ONE CONTAINER ONLY. Never scale to replicas.
 */

import Database from 'better-sqlite3';
import { readFileSync, readdirSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MIGRATIONS = join(__dirname, 'migrations');

/** 林建國's 71, scored on Normal in 1994. Sits permanently on the board. */
export const SEED_RUN = {
  name: 'LIN',
  candidate: 'felix',
  difficulty: 'normal',
  power: 38,
  money: 19,
  judgment: 14,
  grade: 71,
  leaderboard_value: 71,
  duration_ms: 18 * 60 * 1000,
  completed: 1,
  stage_reached: 3,
  created_at: '1994-01-01 19:00:00',
};

export function openDatabase(dbPath = process.env.DB_PATH ?? ':memory:') {
  if (dbPath !== ':memory:') mkdirSync(dirname(dbPath), { recursive: true });

  const db = new Database(dbPath);

  // WAL lets the dashboard read while a run is being written. It is a no-op on
  // an in-memory database, which is what the tests use.
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  migrate(db);
  seed(db);
  return db;
}

/** Apply every .sql file in migrations/, in filename order. Idempotent. */
export function migrate(db) {
  const files = readdirSync(MIGRATIONS).filter((f) => f.endsWith('.sql')).sort();
  for (const f of files) db.exec(readFileSync(join(MIGRATIONS, f), 'utf8'));
  return files;
}

/**
 * 林建國's record. Inserted once and never duplicated, so a restart cannot
 * stack up copies of the score the whole design is measured against.
 */
export function seed(db) {
  const existing = db.prepare('SELECT id FROM runs WHERE name = ? AND created_at = ?')
    .get(SEED_RUN.name, SEED_RUN.created_at);
  if (existing) return false;

  insertRun(db, { ...SEED_RUN, run_json: JSON.stringify({ seeded: true, year: 1994 }) });
  return true;
}

export function insertRun(db, row) {
  const stmt = db.prepare(`
    INSERT INTO runs (name, candidate, difficulty, power, money, judgment, grade,
                      leaderboard_value, duration_ms, completed, stage_reached,
                      run_json, created_at)
    VALUES (@name, @candidate, @difficulty, @power, @money, @judgment, @grade,
            @leaderboard_value, @duration_ms, @completed, @stage_reached,
            @run_json, COALESCE(@created_at, datetime('now')))
  `);
  const info = stmt.run({ created_at: null, ...row });
  return info.lastInsertRowid;
}

/**
 * Three boards, one per candidate; difficulty multiplies. Ranked by
 * leaderboard_value, with the earlier run winning a tie — first to get there
 * keeps the spot.
 */
export function leaderboard(db, { candidate, difficulty, limit = 20 } = {}) {
  const where = [];
  const params = {};
  if (candidate) {
    where.push('candidate = @candidate');
    params.candidate = candidate;
  }
  if (difficulty) {
    where.push('difficulty = @difficulty');
    params.difficulty = difficulty;
  }
  const clause = where.length ? `WHERE ${where.join(' AND ')}` : '';

  return db.prepare(`
    SELECT id, name, candidate, difficulty, power, money, judgment, grade,
           leaderboard_value, duration_ms, completed, stage_reached, created_at
    FROM runs ${clause}
    ORDER BY leaderboard_value DESC, created_at ASC
    LIMIT @limit
  `).all({ ...params, limit });
}

/** 1-based position on the board this run belongs to. */
export function rankOf(db, { candidate, difficulty, leaderboardValue, createdAt }) {
  const row = db.prepare(`
    SELECT COUNT(*) AS better FROM runs
    WHERE candidate = @candidate AND difficulty = @difficulty
      AND (leaderboard_value > @leaderboardValue
        OR (leaderboard_value = @leaderboardValue AND created_at < @createdAt))
  `).get({ candidate, difficulty, leaderboardValue, createdAt: createdAt ?? '9999' });
  return row.better + 1;
}

/**
 * Completion rate, candidate picks, median grade, and average judgment.
 *
 * WATCH AVERAGE JUDGMENT ACROSS ALL RUNS. If it trends toward zero the central
 * premise is not landing, and the restraint rewards need raising or better
 * signposting.
 */
export function stats(db) {
  const total = db.prepare('SELECT COUNT(*) AS n FROM runs').get().n;
  if (total === 0) {
    return { total: 0, completionRate: 0, medianGrade: 0, averageJudgment: 0, picks: {} };
  }

  const completed = db.prepare('SELECT COUNT(*) AS n FROM runs WHERE completed = 1').get().n;
  const avgJudgment = db.prepare('SELECT AVG(judgment) AS a FROM runs').get().a;

  const grades = db.prepare('SELECT grade FROM runs ORDER BY grade').all().map((r) => r.grade);
  const mid = Math.floor(grades.length / 2);
  const medianGrade = grades.length % 2
    ? grades[mid]
    : (grades[mid - 1] + grades[mid]) / 2;

  const picks = {};
  for (const row of db.prepare('SELECT candidate, COUNT(*) AS n FROM runs GROUP BY candidate').all()) {
    picks[row.candidate] = row.n;
  }

  return {
    total,
    completionRate: completed / total,
    medianGrade,
    averageJudgment: avgJudgment,
    picks,
  };
}
