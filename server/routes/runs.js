/**
 * /api/* — run submission and the leaderboard.
 *
 * THE SERVER NEVER TRUSTS A CLIENT-SENT GRADE. It recomputes from the
 * submitted inputs using the SAME shared/scoring.js the client used, so the two
 * cannot drift and a tampered total is simply ignored. See SPEC.md §11.
 */

import { computeGrade, leaderboardValue } from '../../shared/scoring.js';
import { validateRun } from '../../shared/validation.js';
import { insertRun, leaderboard, rankOf, stats } from '../db.js';
import { issueToken, verifyToken, verifyRunSignature } from '../integrity.js';

export function registerRunRoutes(app, db) {
  /** Issues a signed token carrying a server timestamp. */
  app.post('/api/runs/start', async () => issueToken());

  app.post('/api/runs', async (request, reply) => {
    const { token, run, signature } = request.body ?? {};

    const tok = verifyToken(token);
    if (!tok.ok) return reply.code(400).send({ error: tok.reason });

    if (!verifyRunSignature(run, signature)) {
      return reply.code(400).send({ error: 'run signature invalid' });
    }

    // The check with real teeth: a run cannot have taken longer than the wall
    // clock since its token was issued, and a wall clock cannot be backdated.
    const elapsedSinceTokenMs = Date.now() - tok.issuedAt;
    const check = validateRun(run, { elapsedSinceTokenMs });
    if (!check.ok) return reply.code(400).send({ error: 'run rejected', details: check.errors });

    // Recomputed here, never read from the payload.
    const grade = computeGrade(run);
    const value = leaderboardValue(grade.total, run.difficulty);
    const createdAt = new Date().toISOString().replace('T', ' ').slice(0, 19);

    const id = insertRun(db, {
      name: run.name,
      candidate: run.candidate,
      difficulty: run.difficulty,
      power: grade.power,
      money: grade.money,
      judgment: grade.judgment,
      grade: grade.total,
      leaderboard_value: value,
      duration_ms: run.durationMs,
      completed: run.completed ? 1 : 0,
      stage_reached: run.stageReached,
      run_json: JSON.stringify(run),
      created_at: createdAt,
    });

    const rank = rankOf(db, {
      candidate: run.candidate,
      difficulty: run.difficulty,
      leaderboardValue: value,
      createdAt,
    });

    return { id, grade, leaderboardValue: value, rank };
  });

  app.get('/api/leaderboard', async (request) => {
    const { candidate, difficulty, limit } = request.query ?? {};
    const n = Math.min(100, Math.max(1, Number(limit) || 20));
    return { entries: leaderboard(db, { candidate, difficulty, limit: n }) };
  });

  app.get('/api/stats', async () => stats(db));

  return app;
}
