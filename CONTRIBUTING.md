# Contributing to Passionate Story V2

Read `AGENTS.md` and `docs/plan.md` first. Work on the smallest task that advances
the first playable encounter; propose scope changes before implementing them.

## Ownership

- Claude changes Godot runtime files, imports, integration, tests, and builds.
- Codex changes artwork, art source files, and art delivery documentation.
- Both use `docs/art/asset-manifest.json` for handoffs. Coordinate shared
  document edits and avoid changing the same file concurrently.

## Validation

No runnable game or game test suite exists yet. When introducing the Godot
project, document exact commands and test tooling. Include relevant automated
checks once available. Visible changes require inspection in Godot and retained
screenshots. Art delivery alone is not proof of successful integration.

## Commits & Pull Requests

Use Conventional Commits, for example `feat: add encounter prototype` or
`art: add approved background study`. Include a concise description, validation
results, relevant task or asset IDs, and screenshots when applicable. Record
known limitations. Link an issue when one exists. Keep third-party licenses and
notices intact. Commit and push only when instructed by the user.
