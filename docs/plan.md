# V2 Development Plan

This file holds the immediate handoff: what to do next and how. Step status for
the whole project is tracked only in `docs/progress.md`. The active story draft
is in `design/narrative/`; active scope is in `design/game-brief.md`; all art
requests and status belong in `docs/art/asset-manifest.json`.

## Immediate Handoff to Claude

The user approved the fifth draft of 《合格女婿》 on 2026-10-31 as the story
baseline (`design/narrative/story-draft.md`, reading copy `.html`; earlier
decisions in `design/narrative/story-discussion.md`). Sessions Q-01…Q-13 in
`discuss/open-questions.md` are answered; decisions agreed by Vincent, Claude and
Codex are recorded in `docs/confirmed.md`, which takes precedence over older
statements in the brief until the brief is refined at step 3.3.
用戶已於 2026-10-31 批准第五稿；三方同意的決議以 `docs/confirmed.md` 為準，簡報於步驟 3.3 更新前，如有矛盾以該檔為準。

Stage order: three sisters in stage 4, father 林建輝 in stage 5, mother 沈馨芳 in
stage 6. Birth order is 以亮 → 雅婷 → 可欣 → 小雨 → 婉晴 (大姊雅婷, 二姊可欣,
妹妹婉晴), and stage 4 is one 1-vs-3 fight. **Codex handoff:** rewrite stage 4
(S4-01…S4-04) as that single fight, correct the sisters' titles across the draft,
and regenerate the HTML.

The user has also specified the final fight's two health bars: first-bar defeat
starts a fixed active-combat timeline: 林雅婷 enters at 10s, 林婉晴 at 20s,
林可欣 at 30s, 林建輝 at 40s, and 林以亮 at 50s. They fight at low reinforcement
health while 沈馨芳 eats. She returns at 60s with her second bar and any surviving
reinforcements (up to six versus one). The timeline pauses with the game and
does not accelerate when an enemy is defeated. The draft preserves
defeated enemies and damage already dealt, and ends combat on second-bar defeat.
Exact balance values remain untested; do not treat the narrative update as
implemented or playtested combat.

**Next for Claude (Stage 2), when the user says to proceed:** run
`/setup-engine godot` with Godot **4.7.2 stable** at
`C:\Godot\Godot_v4.7.2-stable_win64.exe` (console build
`Godot_v4.7.2-stable_win64_console.exe`), GDScript, 2D, Windows desktop first, keyboard only, 640×360 base
resolution with integer scaling, input routed through input actions so touch can be
added for iPad later. Use `docs/confirmed.md` Q-04, Q-05 and Q-12 for the answers;
all setup questions are already answered.
4.7 is newer than Claude's training data: fetch current official docs before
using APIs. Preserve CCGS `minimal`, this plan and `docs/progress.md`; do not
convert the whole six-stage narrative into an approved production backlog.
下一步：用戶同意後，以 Godot 4.7.2、GDScript、2D、Windows、只用鍵盤、640×360 執行引擎設定；所有設定問題已有答案。

No gameplay code, test framework or approved art exists yet. The wanted art style
is Kunio-kun SP pixel art, approved as a visual target only after the user reviews
Codex's pilot sheets. Old values are not defaults.

## Progress Rules

Mark work complete only with evidence, in `docs/progress.md`. Claude may create task stories under
`production/` as needed, referencing this plan rather than copying it. Codex
tracks delivery in the manifest rather than creating another development plan.
When a visible result changes, review it in Godot before marking it accepted.
