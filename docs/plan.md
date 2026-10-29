# V2 Development Plan

This is the single project progress tracker. Story source is under `idea/`;
active scope is in `design/game-brief.md`; all art requests and status belong in
`docs/art/asset-manifest.json`.

| Step | Owner | Status | Completion evidence |
|---|---|---|---|
| Reset repository and preserve story source | Codex | Complete | `docs/cleanup-v2.md` |
| Review the selected 《合格女婿》 full story: six family tests and three endings | User + Codex | In review | Latest revision: stage 4 three sisters/three bosses; stage 5 father 林建國; stage 6 mother 沈雅芳 as the true final boss. Updated draft in `discuss/codex_idea.html` and `discuss/codex_idea.md`; detailed story approval pending |
| Review first-slice scope and choose technical setup | User + Claude | Pending story review | Approved brief; actual Godot version, language, platform, renderer, resolution, and test approach recorded |
| Build one encounter with placeholders | Claude | Pending | Playable start-to-outcome loop; working run/test commands; retained screenshot |
| Define asset specifications and approve one visual target | Claude + Codex + user | Pending | Godot constraints in manifest; art guide updated; user approval recorded |
| Produce and integrate a small art batch | Codex + Claude | Pending | Technical checks, in-engine screenshots, and user acceptance recorded separately |
| Review slice and decide expansion | User + Claude + Codex | Pending | Playtest findings; next scope agreed |

## Immediate Handoff to Claude

The user selected 《合格女婿》 and is reviewing its six-stage, three-ending full
story draft in `discuss/codex_idea.html` (source: `discuss/codex_idea.md`). Keep
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
and unresolved technical decisions with the user. Preserve CCGS `minimal`
and this shared plan; do not convert the whole six-stage narrative directly
into an approved production backlog.

The cleanup did not create gameplay code, approve an art style, choose a test
framework, or select a precise Godot release. Old values are not defaults.

## Progress Rules

Mark work complete only with evidence. Claude may create task stories under
`production/` as needed, referencing this plan rather than copying it. Codex
tracks delivery in the manifest rather than creating another development plan.
When a visible result changes, review it in Godot before marking it accepted.
