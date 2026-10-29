# Passionate Story V2 — Godot Development

@AGENTS.md
@design/game-brief.md
@docs/plan.md
@docs/progress.md

## Development Ownership

Claude owns the Godot implementation and integration. Codex owns art production.
The user approves story, scope, and visual direction. Read `docs/art/README.md`
before requesting or integrating artwork; use its shared asset manifest.

## CCGS Configuration

`project.yaml` is the shared configuration. The retained CCGS framework is 1.1.3;
this cleanup does not upgrade it. Use `modes.rigor: minimal`. Read relevant
`.claude/skills/` and `.claude/docs/` files on demand rather than loading every
studio role. Do not run a second project workflow from the art skill library.

User authorization applies to the agreed task, including necessary routine edits.
Present material story, scope, and visual decisions for approval. CCGS templates
are supporting tools; they do not override the user's explicit instructions or
the role boundaries in `AGENTS.md`.

## Technology Stack

- **Engine:** Godot; exact version has not been selected for V2.
- **Language, renderer, target platforms, resolution, test framework:** decide
  during initial engine setup; previous implementation choices are not binding.
- **Build/run/test commands:** absent until Claude scaffolds and verifies them.

`docs/engine-reference/godot/VERSION.md` records setup status. The old template's
Godot 4.6 snapshot is not a V2 pin. Verify actual editor availability and current
official documentation before selecting APIs. Build one encounter with
placeholders before requesting a batch of production art.

## Working Rules

Keep `docs/progress.md` (status) and `docs/plan.md` (handoff) current. CCGS may create implementation stories under
`production/` when needed; they must point to this plan and shared art manifest.
Do not regenerate the storyboard or derive a full five-stage backlog during
setup. Do not reinstate the old web game, backend, scoring formulas, or art assets.
Retain screenshots for visible changes and report what was actually verified.
