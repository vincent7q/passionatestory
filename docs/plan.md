# V2 Development Plan

This file holds the immediate handoff: what to do next and how. Step status for
the whole project is tracked only in `docs/progress.md`. The active story draft
is in `design/narrative/`; active scope is in `design/game-brief.md`; all art
requests and status belong in `docs/art/asset-manifest.json`.

## Immediate Handoff to Claude

The user selected 《合格女婿》 and is reviewing its six-stage, three-ending full
story draft in `design/narrative/story-draft.html` (source:
`design/narrative/story-draft.md`; decisions in
`design/narrative/story-discussion.md`). Keep
the current task at story review; do not start the next development stage yet.
The latest confirmed order is three sisters in stage 4, father 林建國 in
stage 5, and mother 沈雅芳 in stage 6. The mother is the greedy, domineering
final boss who humiliates her husband; he recognizes the miserable marriage
future awaiting 陳以安. Stage 4 adds two bosses while retaining six stages.
The sisters' exact relationship/names, individual scenes, and third-ending
details remain draft proposals subject to user changes.

The user has also specified the final fight's two health bars: first-bar defeat
starts a fixed active-combat timeline: 林雅婷 enters at 10s, 林婉晴 at 20s,
林可欣 at 30s, 林建國 at 40s, and 林家豪 at 50s. They fight at low reinforcement
health while 沈雅芳 eats. She returns at 60s with her second bar and any surviving
reinforcements (up to six versus one). The timeline pauses with the game and
does not accelerate when an enemy is defeated. The draft preserves
defeated enemies and damage already dealt, and ends combat on second-bar defeat.
Exact balance values remain untested; do not treat the narrative update as
implemented or playtested combat.

After the story review and the user's instruction to proceed, read the brief
and `CLAUDE.md`, inspect the installed Godot editor, and use
`/setup-engine godot` to establish a reproducible project. Confirm the proposed small encounter
and unresolved technical decisions with the user. Preserve CCGS `minimal`,
this plan and `docs/progress.md`; do not convert the whole six-stage narrative directly
into an approved production backlog.

The cleanup did not create gameplay code, approve an art style, choose a test
framework, or select a precise Godot release. Old values are not defaults.

## Progress Rules

Mark work complete only with evidence, in `docs/progress.md`. Claude may create task stories under
`production/` as needed, referencing this plan rather than copying it. Codex
tracks delivery in the manifest rather than creating another development plan.
When a visible result changes, review it in Godot before marking it accepted.
