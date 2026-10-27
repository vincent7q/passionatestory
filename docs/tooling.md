# Tooling Responsibilities & Provenance

## Claude Code Game Studios — Development Workflow

Source: https://github.com/Donchitos/Claude-Code-Game-Studios

The existing toolkit is retained under `.claude/` and
`CCGS Skill Testing Framework/`. `project.yaml` identifies it as **1.1.3**.
The exact retained repository snapshot is recoverable from pre-cleanup commit
`f02d10ba1972983518f86d2cb033a2a6bc7c4124`. No upstream upgrade is part of this
cleanup. Keep the root MIT license with its original copyright notice.

Claude uses CCGS in `minimal` mode. `collaborative` automation retains user
approval of decisions; authorization already given for a concrete task remains
valid. Personal overrides belong in ignored `project.local.yaml`.

`.claude/settings.json` enables existing session-start/gap checks, commit/push
validation, and asset/skill-change checks. It grants no additional tool
permissions. Personal `.claude/settings.local.json` is left untouched. Bash and
Python are needed by these hooks; use Git Bash on Windows.

The hook configuration follows the official
[Claude Code hooks reference](https://code.claude.com/docs/en/hooks).

The retained generic studio art roles may help formulate requests, but Codex
owns art production. Keep those requests in the shared art manifest. CCGS's
framework test catalog is not a test suite for this game.

## Awesome GameDev Agent Skills — Art Support

Source: https://github.com/gamedev-skills/awesome-gamedev-agent-skills

Only `skills/disciplines/create-game-assets/` is installed, under
`.agents/skills/create-game-assets/`, at revision
`184b72be02884f782a0058f2eeae2ce4277453e4`. Its original content is retained;
`LICENSE`, `NOTICE`, and `UPSTREAM.md` accompany the subset. The skill is
available to Codex on the next turn.

No router or additional engine skill bundle is installed. This skill guides art
direction, production, preparation, and validation; CCGS remains the single
development workflow. It does not supply an image-generation service or make
generated files production-ready automatically. Optional raster helpers list
their own dependencies in `scripts/requirements.txt`; none were installed by
this cleanup.

## Shared Project State

Use `design/game-brief.md`, `docs/plan.md`, `docs/art/README.md`, and
`docs/art/asset-manifest.json`. Project-specific decisions and the user's
instructions take priority over generic examples in either toolkit.
