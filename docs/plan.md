# V2 Development Plan

This is the single project progress tracker. Story source is under `idea/`;
active scope is in `design/game-brief.md`; all art requests and status belong in
`docs/art/asset-manifest.json`.

| Step | Owner | Status | Completion evidence |
|---|---|---|---|
| Reset repository and preserve story source | Codex | Complete | `docs/cleanup-v2.md` |
| Review first-slice scope and choose technical setup | User + Claude | Next | Approved brief; actual Godot version, language, platform, renderer, resolution, and test approach recorded |
| Build one encounter with placeholders | Claude | Pending | Playable start-to-outcome loop; working run/test commands; retained screenshot |
| Define asset specifications and approve one visual target | Claude + Codex + user | Pending | Godot constraints in manifest; art guide updated; user approval recorded |
| Produce and integrate a small art batch | Codex + Claude | Pending | Technical checks, in-engine screenshots, and user acceptance recorded separately |
| Review slice and decide expansion | User + Claude + Codex | Pending | Playtest findings; next scope agreed |

## Immediate Handoff to Claude

Read the brief and `CLAUDE.md`, inspect the installed Godot editor, and use
`/setup-engine godot` to establish a reproducible project. Confirm the proposed
encounter and unresolved technical decisions with the user. Preserve the chosen
`minimal` workflow and the shared plan; do not restart brainstorming from zero
or regenerate the old five-stage production plan.

The cleanup did not create gameplay code, approve an art style, choose a test
framework, or select a precise Godot release. Old values are not defaults.

## Progress Rules

Mark work complete only with evidence. Claude may create task stories under
`production/` as needed, referencing this plan rather than copying it. Codex
tracks delivery in the manifest rather than creating another development plan.
When a visible result changes, review it in Godot before marking it accepted.
