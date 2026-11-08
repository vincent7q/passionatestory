# Project management — passionatestory

The shared rules ("rules v2") are in `CLAUDE.md` and `AGENTS.md`; the master copy is `docs/general_rules_v2.md` in
the Arbitrage repository. This file is the map for this project: it names the files the rules use here and where
this project differs. Written 2026-11-08 from what the folders contained that day.

## Core files

| File | Used for | State |
|---|---|---|
| `todo.md` | Pending tasks (rule 3) | not yet; create on first use |
| `docs/done.md` | Finished tasks (rule 3) | not yet; create on first use |
| `docs/questions.md` | Questions for the owner (rule 2) | not yet; create on first use |
| `docs/confirmed.md` | Owner decisions (rule 2) | exists |
| `docs/progress.md` | Status for the other machine (rule 1) | exists |
| `discuss/` | Debates between owner, Claude and Codex (rule 4) | exists |

## Optional modules in use

None yet.

## This project

- The rules block is in `AGENTS.md` only: `CLAUDE.md` imports `AGENTS.md`, so Claude reads it too.
- Roles (`AGENTS.md`): Claude builds the Godot game, Codex produces the art, you approve story, scope and visual direction.
- `docs/progress.md` is the status file and `docs/plan.md` the next handoff; both are imported by `CLAUDE.md`. `docs/art/` coordinates the art, with `asset-manifest.json`.
- `docs/archive/` keeps historical source material that `AGENTS.md` treats as non-binding; `discuss/archieve/` (sic) holds older discussions. Both are left as they are.
- Open questions for the owner are in `discuss/open-questions.md`; there is no `docs/questions.md`.

## Open points for the owner

- Rule 5 says to delete files nothing uses; keep `docs/archive/` as source material, or clean it up?
