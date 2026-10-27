# Repository Guidelines

## Project Structure & Module Organization

This repository combines the Passionate Story game planning with the Claude Code Game Studios framework. The game is awaiting a Godot rewrite; `src/` contains guidance, not an implementation. No `project.godot`, game tests, or asset directory exists yet.

- `.claude/`: agents, skills, Bash hooks, rules, and document templates.
- `design/` and `docs/`: design registries, technical documentation, and engine references.
- `CCGS Skill Testing Framework/`: framework catalogs, behavioral specs, and quality rubrics.
- `production/`: local session state; generated session artifacts are ignored.
- `project.yaml`: shared configuration; use ignored `project.local.yaml` for personal overrides.

Read the game-specific section of `CLAUDE.md` for the intended architecture. Several referenced game documents are absent from this checkout; verify paths before relying on them.

## Build, Test, and Development Commands

There are currently no game build, run, lint, or test commands. Do not assume the removed JavaScript implementation or local `node_modules/` provides a working application.

For framework development:

- `claude`: start Claude Code from the repository root.
- `/skill-test static <name>`: check a skill's structure within Claude Code.
- `/skill-test spec <name>`: check behavioral assertions.
- `/skill-test audit`: report framework test coverage.
- `bash -n .claude/hooks/validate-commit.sh`: check a hook's Bash syntax.

Document executable game commands when the Godot project is introduced.

## Coding Style & Naming Conventions

For new GDScript, use tabs, explicit types, `snake_case` files/functions/variables, `PascalCase` classes, and `SCREAMING_SNAKE_CASE` constants. Keep gameplay values in data resources and content IDs stable. Use English identifiers and Traditional Chinese for Chinese text.

Skills belong in `.claude/skills/<name>/SKILL.md` with required YAML frontmatter. Preserve LF endings for shell scripts. Hooks must support Windows Git Bash, macOS, and Linux; use `grep -E`. No formatter is configured.

## Testing Guidelines

GUT with headless execution is the game's planned framework; bundled generic rules also mention gdUnit4. Resolve that mismatch when scaffolding tests. Put tests in `tests/`, with descriptive functions such as `test_damage_reduces_health`. Cover formulas, edge cases, and regressions. No numeric coverage threshold is configured. Exercise framework changes in Claude Code and record observed results.

## Commit & Pull Request Guidelines

History uses short descriptive subjects, sometimes prefixed with task IDs. `CONTRIBUTING.md` requests Conventional Commits, e.g. `docs: clarify Godot setup`; reference relevant story IDs for source changes. Use `.github/PULL_REQUEST_TEMPLATE.md`, explain changes and validation, and update matching reference docs when changing framework components.
