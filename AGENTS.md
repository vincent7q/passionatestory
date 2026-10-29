# Repository Guidelines

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
