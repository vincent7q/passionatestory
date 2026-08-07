-- Leaderboard records. Schema is SPEC.md §11.2.
--
-- run_json keeps the raw submitted payload so a future server-side replay
-- validator has something to replay. It is deliberately not parsed on read.

CREATE TABLE IF NOT EXISTS runs (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  name              TEXT    NOT NULL,          -- /^[A-Z_]{3}$/
  candidate         TEXT    NOT NULL,          -- felix | lucian | hilman
  difficulty        TEXT    NOT NULL,          -- easy | normal | hard
  power             INTEGER NOT NULL,
  money             INTEGER NOT NULL,
  judgment          INTEGER NOT NULL,
  grade             INTEGER NOT NULL,
  leaderboard_value REAL    NOT NULL,
  duration_ms       INTEGER NOT NULL,
  completed         INTEGER NOT NULL,
  stage_reached     INTEGER NOT NULL,
  run_json          TEXT    NOT NULL,
  created_at        TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_runs_board
  ON runs (candidate, difficulty, leaderboard_value DESC);
