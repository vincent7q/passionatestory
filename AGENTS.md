# Repository Guidelines

## Project management (shared by the owner, Claude and Codex) — rules v2

The owner decides. Claude and Codex build, check and review. Each project's `docs/project_mgr.md` lists the folders and
files that project uses; read it first in a new session. It may add to these rules, not contradict them.

**Core (every project)**

1. **Git is the only thing the home and office machines share.** Anything a later session must know goes in a tracked
   file, not in local memory. At the start of a session read `docs/progress.md`; before a job ends or pauses, update it
   with where the project stands, what was done last and the next unfinished steps, so the other machine can resume.
   The owner commits and pushes; Claude and Codex do not commit or push unless the owner asks.
2. **A decision is binding only when it is in `docs/confirmed.md`.** A question for the owner goes in `docs/questions.md`
   with an `Answer:` line; after the owner answers, move it to `docs/confirmed.md`.
3. **Tasks.** Pending tasks live in `todo.md`; finished ones move to `docs/done.md`. Recurring "Regular" tasks stay.
4. **Debate in `discuss/`.** One file per topic, `YYYY-MM-DD-topic.md`, with a question and a status. Sign and date every
   entry, append only, never rewrite another author's text, state your confidence. A discussion changes nothing by
   itself. When the owner decides, move the outcome to `docs/confirmed.md` (question, decision, date), put the work in
   `todo.md`, and delete the discussion file; git history keeps the debate.
5. **Delete files nothing uses.** Git history keeps them. Search the whole repo for references first and fix them; a stale
   header does not prove a file is unused.
6. **Be honest in responses.** Say what was checked and what was not; report failures and skipped steps as they are.

**Optional modules** (use one only if the project's `docs/project_mgr.md` lists it)

- `docs/issues.md` (pending only) and `docs/issues_solved.md`: issues awaiting the owner's Fix / Defer / Reject.
- `docs/changelog.md`: one entry per version.
- `docs/reviews/YYYY-MM-DD/<subject>/`: independent verification of the other agent's work (report, replay script, raw
  results). The reviewer reads the code and commits, not the author's notes; the author does not edit the review.
- `docs/reports/`: analyses that feed a decision.

## Project State & Authority

Passionate Story V2 restarts the game from its story idea, using Godot. No game project, production art, or executable game tests exist yet. Old architecture, balance values, resolution, art style, and task completion are not V2 decisions.

Read `design/game-brief.md`, `docs/progress.md`, `docs/plan.md`, and `docs/art/README.md` before working. The active story draft is in `design/narrative/`. `docs/archive/` preserves historical source material; its original FINAL labels and technical instructions do not approve V2 requirements. Follow current user decisions and active project documents over historical references or generic skill examples.

## Responsibilities & Structure

- **Claude:** Godot code, scenes, resources, import settings, animation integration, tests, and builds. Use CCGS as the development workflow in `minimal` mode.
- **Codex:** visual proposals, image generation, art preparation, and `docs/art/asset-manifest.json`. Use the selected asset-production skill; do not start another development workflow.
- **User:** story, creative direction, scope, and final approval.

`.claude/` holds CCGS tooling; `.agents/skills/` holds selected art tooling. `design/` contains the brief and `design/narrative/` the story draft, `docs/progress.md` tracks status, `docs/plan.md` holds the next handoff, `docs/art/` coordinates art, and `production/` holds workflow artifacts. CCGS folders (`src/`, `assets/`, `tests/`, `tools/`, `prototypes/`, `production/epics/`, `production/qa/`) exist as empty placeholders; `/setup-engine` may revise the code root.

## Development & Verification

Start `claude` from the repository root. `/settings` displays CCGS configuration. The next development task is `/setup-engine godot`, using the existing brief. Verify the installed editor and record the exact version before using engine APIs.

There are no game build, run, lint, or test commands yet. Document working commands after scaffolding; never report placeholder commands as passing checks. Verify visible changes in Godot and retain evidence under `production/qa/evidence/`.

## Style & Asset Handoffs

Use readable Markdown and two-space YAML indentation. For GDScript, use tabs, typed interfaces, `snake_case` files/functions, and `PascalCase` classes. Preserve LF endings in shell scripts. Use English identifiers and Traditional Chinese for Chinese dialogue.

Agree on asset IDs, dimensions, viewpoint, scale, transparency, pivots, and animation requirements before production. Keep editable sources separate from runtime exports. Art becomes accepted only after technical checks, inspection in Godot, and user approval; the manifest records those separately.

## Commits & Pull Requests

Use concise Conventional Commits, such as `docs: define art handoff`. Explain the change and validation; include screenshots for visible changes. Do not commit, push, or publish without user instruction. Preserve third-party licenses and notices.
