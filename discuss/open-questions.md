# Open Questions — Discussion Sessions / 待決問題與討論場次

**Participants / 參與者:** Vincent (decision maker / 決策者) · Claude · Codex
**Opened / 開啟日期:** 2026-10-29
**Purpose / 目的:** Every question that must be answered before and during the first
playable slice, grouped into sessions so each can be discussed in its own chat.
/ 把進入第一個可玩切片之前與期間必須回答的問題，分成獨立場次，每場可在各自的對話中討論。

Story topics T-01…T-09 are already recorded in `design/narrative/story-discussion.md`.
This file holds only what is still open. The project tracker is `docs/progress.md`;
its step IDs (for example 2.2) are quoted in each session so the two stay linked.

## How to run a session / 場次進行方式

1. Open a new chat and name the session, for example: "Let's discuss Q-05."
2. Claude reads that session and the files it lists, then brings 2–3 concrete options
   (with sketches or examples where they help). Codex adds its view where the
   session lists Codex. Vincent decides.
3. Record the outcome under **Decision**, set **Status**, and fill **Change list**
   (which file changes, and who applies it).
4. Claude updates `docs/progress.md` (steps and open items) after each decision.
5. Write only under your own name; do not edit anyone else's text.
   Status values: **Open** · **Leaning** · **Decided** · **Parked**.
6. No change to the brief (`design/game-brief.md`), the story draft or the code until a
   session is **Decided** and Vincent has confirmed it. Claude's recommendations below
   are starting points, not decisions.

## Index and suggested order / 目錄與建議順序

| ID | Session / 場次 | Blocks (progress step) | Lead | Status |
|---|---|---|---|---|
| Q-01 | Approve the fifth story draft / 審閱並批准第五稿 | 1.3 → Stage 2 | Vincent + Codex | Open |
| Q-04 | Godot editor, version, language / Godot 安裝、版本、語言 | 2.1, 2.2 | Vincent + Claude | Open |
| Q-05 | Game form: 2D or 3D, view, platform, input, resolution / 遊戲形式 | 2.2, 2.4 | Vincent + Claude | Open |
| Q-06 | First-slice scope (MVP) / 首批範圍 | 3.2, 3.3 | Vincent + Claude | Open |
| Q-07 | Slice A: player controls and moves / 阿安的操作與招式 | 3.1 | Vincent + Claude | Open |
| Q-08 | Slice A: 林家豪 boss design / 家豪頭目設計 | 3.1 | Vincent + Claude + Codex | Open |
| Q-09 | Lives, health, respawn / 生命、血量、重來 | 3.3 | Vincent + Claude | Open |
| Q-12 | Language, font, text, audio basics / 語言、字型、文字、音訊 | Slice A (font) | Vincent + Claude | Open |
| Q-11 | Art direction and reference images / 美術方向與參考圖 | 2.4, Stage 5 | Vincent + Codex + Claude | Open |
| Q-02 | The three sisters / 三姊妹 | Stage 4 content, not Slice A | Vincent + Codex | Open |
| Q-03 | Third ending / 第三結局 | Ending production, not Slice A | Vincent + Codex | Open |
| Q-13 | Process and housekeeping / 流程與整理 | none | Vincent + Claude | Open |
| Q-10 | Attack-limit rule (T-07) / 同時進攻人數規則 | 6.2 (Slice B) | Vincent + Claude | Parked until Slice B |

Order: Q-01 → Q-04 → Q-05 first (they unblock engine setup). Then Q-06 → Q-07 → Q-08 →
Q-09 (they define Slice A for the brief and stories). Q-12 and Q-11 can run beside them.
Q-02, Q-03, Q-13 are not blocking. Q-10 waits for Slice B.

---

## Q-01 Approve the fifth story draft / 審閱並批准第五稿

**Status:** Open · **Blocks:** step 1.3, then engine setup · **Files:** `design/narrative/story-draft.md` (or `.html`), `production/qa/evidence/2026-10-29/story-revision-t02-t05.md`

**Context.** Codex applied T-02…T-05 to produce the fifth draft. The draft's own review
list (「你可以優先評論的地方」) has six prompts; three belong here, and the rest are Q-02, Q-03
and prototype work (the final-fight balance, item 6, is tested in Slice B).

**Questions**
1. Do you approve the fifth draft as the story baseline? (Later edits remain possible; approval means
   "good enough to start building Slice A and Slice B on".)
2. Father 林建國: he speaks plainly in private but cannot raise his head in public. Is that the strength you want?
3. Mother 沈雅芳: should her greed, public scolding and final fight be more exaggerated, or stay close to
   everyday pressure? (T-01 says satirical realism; Codex noted she is strongest when she sincerely
   believes her demands are reasonable.)
4. Stages 1–3: after he learns it is a test at S3-01, is his reason to keep going (he still loves her and
   expects to be accepted) shown well enough?

- **Vincent:**
- **Claude:**
- **Codex:**
- **Decision:**
- **Change list:**

---

## Q-04 Godot editor, version, language / Godot 安裝、版本、語言

**Status:** Open · **Blocks:** steps 2.1, 2.2 · **Files:** `docs/engine-reference/godot/VERSION.md`, `AGENTS.md`

**Context.** On 2026-10-29 Claude found no `godot` on PATH or in common folders. `/setup-engine`
looks up the current version and writes `project.godot`, `project.yaml` and the engine reference.
`AGENTS.md` already sets GDScript style rules (tabs, typed interfaces).

**Questions**
1. Is the Godot editor installed on this computer? If yes, where? If not, should Claude walk you through installing it?
2. Version: use the current stable release at setup time (Claude verifies it against the official site and
   records the exact number)? Or do you need a specific version?
3. Language: GDScript or C#? Claude's initial position: GDScript (simplest for a solo project, no extra
   toolchain, already assumed by `AGENTS.md`).
4. Do you develop and test on this Windows computer only?

- **Vincent:**
- **Claude:**
- **Codex:**
- **Decision:**
- **Change list:** `project.yaml`, `docs/engine-reference/godot/VERSION.md`, `AGENTS.md` (run command)

---

## Q-05 Game form: 2D or 3D, view, platform, input, resolution / 遊戲形式

**Status:** Open · **Blocks:** steps 2.2, 2.4 · **Files:** `design/game-brief.md`, `docs/art/README.md`

**Context.** The brief leaves these open ("To be decided during setup"). The old project was a
side-scrolling game; the V2 brief says old technical choices are not binding. The story's fights
are one boss at a time, then six against one in the finale. Resolution depends on the art style (Q-11).

**Questions**
1. 2D or 3D? Claude's initial position: 2D (best fit for Godot, the reference art is 2D, and the cost is far lower).
2. View: (a) side-scrolling with depth lanes, the classic beat-'em-up (players can walk up and down);
   (b) flat side view, left and right only; (c) top-down. Claude's initial position: (a), because the finale
   needs room for six fighters to circle and wait.
3. Target platform: Windows PC (desktop build), web browser, or mobile? Claude's initial position: Windows PC first.
4. Input: keyboard only, gamepad only, or both? Claude's initial position: both, with gamepad support early so controls are designed for it.
5. Window and aspect: 16:9 at 1920×1080 base, or a low base resolution scaled up? (Settle with Q-11.)

- **Vincent:**
- **Claude:**
- **Codex:**
- **Decision:**
- **Change list:** `project.yaml`, `design/game-brief.md` (platform/controls line), `docs/art/README.md` (technical frame)

---

## Q-06 First-slice scope (MVP) / 首批範圍

**Status:** Open · **Blocks:** steps 3.2, 3.3 · **Files:** `design/game-brief.md`

**Context.** `/create-stories` makes one story per item in the brief's MVP list. The brief's MVP
paragraph says "one encounter, one opponent", but T-08 and the Build order say Slice A (S1-02 家豪) then
Slice B (the S6 final-fight timeline).

**Questions**
1. Does the MVP list contain both slices, with a review after Slice A before Slice B? Claude's initial
   position: yes, both as separate stories, Slice A first.
2. Which supporting pieces are inside Slice A? Claude's initial position:

   | Piece | Include? |
   |---|---|
   | Health and lives display (HUD) | Yes |
   | Dialogue box and the stamp beat after the fight | Yes |
   | Game over screen (lose all 3 lives) | Yes, plain |
   | Title screen, menus, settings, pause | No |
   | Saving | No |
   | The S1-01 corridor fights before the boss | No (boss fight only, with a short walk-in) |
3. What makes you say "Slice A works"? (The brief says you approve its feel. Which words or tests would you use?)

- **Vincent:**
- **Claude:**
- **Codex:**
- **Decision:**
- **Change list:** `design/game-brief.md` (MVP list, Out of scope, Build order, Success measure)

---

## Q-07 Slice A: player controls and moves / 阿安的操作與招式

**Status:** Open · **Blocks:** step 3.1 · **Depends on:** Q-05 · **Files:** `design/game-brief.md`

**Context.** 阿安 is a repair worker with good fighting skills. The draft describes him reading an
opponent's balance and finding an opening. Nothing about his moves is decided.

**Questions**
1. Movement: 8-direction on the ground (with depth lanes) or left/right only? Jump or no jump?
2. Attacks: a 3-hit light combo, one heavy attack, a kick or jump attack? Claude's initial position for Slice A:
   light combo plus one heavy attack only.
3. Defence: block, dodge or roll, or none? Claude's initial position: one dodge (it makes "finding the opening" playable).
4. Anything special (grab, throw, a signature repair-tool move)? Claude's initial position: none in Slice A.
5. Hit reactions: knockback and stagger for both sides?
6. Should he fight with fists only, or can he pick up props such as crates?

- **Vincent:**
- **Claude:**
- **Codex:**
- **Decision:**
- **Change list:** `design/game-brief.md` (MVP bullets); story acceptance criteria

---

## Q-08 Slice A: 林家豪 boss design / 家豪頭目設計

**Status:** Open · **Blocks:** step 3.1 · **Depends on:** Q-07 · **Files:** `design/narrative/story-draft.md` (S1-02)

**Context.** S1-02: 家豪 blocks the last gate, relies on shoves, heavy pushes and pinning the player
in a corner, and mocks him for backing away. 阿安 "reads his balance and finds an opening", knocks him back,
then 家豪 says his line, opens the gate, and the stamp scene follows.

**Questions**
1. Attack patterns: which 3–4? Claude's initial position: (a) a charging shove, (b) a corner pin that punishes
   fleeing into a wall, (c) a heavy two-handed slam, (d) a taunt that baits the player to retreat.
2. The "opening": after a heavy attack he is off balance for a moment, and a hit then staggers him? Is that the main way to win?
3. Length and difficulty: a boss fight of roughly 45–90 seconds, and easier than the final-fight first phase? (Stage 1 boss.)
4. Health: one health bar, no phases?
5. End of the fight: when his health reaches zero, is the dialogue and stamp an automatic cutscene (skippable), or does the player act?
6. Look: placeholders only (labelled coloured rectangles, no art). Agreed?
7. Codex: should the story's wording be adjusted if the final moves differ from S1-02's prose?

- **Vincent:**
- **Claude:**
- **Codex:**
- **Decision:**
- **Change list:** `design/game-brief.md`; S1-02 wording if needed (Codex)

---

## Q-09 Lives, health, respawn / 生命、血量、重來

**Status:** Open · **Blocks:** step 3.3 (the stories need a lose rule) · **Files:** `design/game-brief.md` (Player goal & fail state), `design/narrative/story-discussion.md` (T-06)

**Context.** Decided (T-06): 3 lives for the whole run, no refill between stages, health recovers
in each stage, game over returns to stage 1. Still open: the details below.

**Questions**
1. After losing a life, what happens? (a) Respawn on the spot with the enemy keeping its damage;
   (b) restart the same encounter with full health; (c) a checkpoint inside long stages.
   Claude's initial position for Slice A: (b), the simplest to build and test.
2. Continues or extra lives: none, a pickup, or earned some other way? Claude's initial position: none for now.
3. What does "health recovers in each stage" mean? (a) Full health at the start of each stage;
   (b) healing items inside a stage; (c) slow recovery out of combat. An idea tied to the story: a cup of
   water as the healing item, echoing 「我先喝完」 and 建國's request for water.
4. How long should a full six-stage run be (for example 30–40 minutes)? Sending a player back to stage 1 is harsh at that length.
5. On a retry, can the player skip already-seen dialogue? Claude's initial position: yes.

- **Vincent:**
- **Claude:**
- **Codex:**
- **Decision:**
- **Change list:** `design/game-brief.md` (Player goal & fail state); story discussion T-06

---

## Q-12 Language, font, text, audio basics / 語言、字型、文字、音訊

**Status:** Open · **Blocks:** Slice A needs a Chinese font; audio can wait · **Files:** `AGENTS.md`, `.claude/rules/narrative.md`

**Context.** Dialogue is in Traditional Chinese; identifiers are in English. The narrative rules cap
a dialogue line at 120 characters and ask for localization-ready text.

**Questions**
1. Languages for the first release: Traditional Chinese only, or also English?
2. Font: Claude proposes an openly licensed Traditional Chinese font for the dialogue box (for example the Noto Sans TC family).
   Do you have a preferred look?
3. Store all text in a string table from the start (small extra effort, makes translation later cheap)? Claude's initial position: yes.
4. Audio: silent placeholders in Slice A, or free temporary sound effects? Who sources final music and sound effects, and under what licence?
5. Voice acting: none (text only)? Claude's initial position: none.

- **Vincent:**
- **Claude:**
- **Codex:**
- **Decision:**
- **Change list:** `project.yaml` / `AGENTS.md` (font, language); `docs/art/README.md`

---

## Q-11 Art direction and reference images / 美術方向與參考圖

**Status:** Open · **Blocks:** steps 2.4 and Stage 5 (not Slice A, which uses placeholders) · **Files:** `docs/art/README.md`, `art/source/reference/README.md`

**Context.** You added 47 reference images in `art/source/reference/characters/` (kept local, not in git).
`full_body/` holds 21 smooth-cartoon full-body drawings generated on 2026-10-25 for the old project
(1254×1254 RGBA); that project's documented pipeline was pixel art. The brief says no style is approved.

**Questions**
1. Style: smooth cartoon like the `full_body` set, pixel art, or something else? This decides the resolution in Q-05 and the animation method.
2. Which reference image inspires which character? (Cast: 陳以安, 林小雨, 沈雅芳, 林建國, 林雅婷, 林婉晴, 林可欣, 林家豪, 二姑, 舅舅, and later 知夏.)
   Which images are for identity (face, hair, glasses) and which only for style?
3. Several references are photos of real people. Should the characters look like them, or only be inspired by them?
   If the game is ever shared publicly, does everyone shown agree? (The photos stay on this computer either way.)
4. Animation method (frame-by-frame, cut-out/skeletal, sprite sheets): decide with Codex once the style is chosen.
5. Codex: the empty `docs/concept_images/style_1` and `style_2` folders: move to `art/source/concepts/` or delete?
6. Timing: art requests start after Slice A is playable with placeholders (project rule). Agreed?

- **Vincent:**
- **Claude:**
- **Codex:**
- **Decision:**
- **Change list:** `docs/art/README.md`, `docs/art/asset-manifest.json`, `art/source/reference/README.md`

---

## Q-02 The three sisters / 三姊妹

**Status:** Open · **Blocks:** stage 4 content (not Slice A) · **Files:** `design/narrative/story-draft.md` (S4-01…S4-04, characters)

**Context.** The draft has 大姊林雅婷 (comparing), 二姊林婉晴 (always on call), 三姊林可欣 (hands over all chores). The brief
still calls their relationship, names, scenes and combat "provisional".

**Questions**
1. Family order: the draft makes the three older sisters of 小雨. What is the full birth order of all five children, including 家豪 and 小雨, and their rough ages?
2. Are the names 雅婷, 婉晴, 可欣 final?
3. Are the three roles right (comparison / always available / chores and cheerfulness)?
4. Combat: should each sister have a clearly different fighting style? Draft hints: 雅婷 changes comparisons and targets, 婉晴 calls, swaps position and feints, 可欣 blocks movement with event props.
5. Does every sister need her own full scene, or can stage 4 be shortened?

- **Vincent:**
- **Claude:**
- **Codex:**
- **Decision:**
- **Change list:** story draft and brief (Codex edits the draft)

---

## Q-03 Third ending / 第三結局

**Status:** Open · **Blocks:** ending production (not Slice A) · **Files:** `design/narrative/story-draft.md` (結局三 and the final-choice section 「真相與選擇」)

**Context.** The draft's third ending, 〈另一份合約〉: 阿安 declines marriage and joins the family's testing business,
swapping seats yet still under 沈雅芳. The draft keeps a clear confirmation so the player knows what they choose.

**Questions**
1. Keep this ending as written, or change it?
2. The three final choices (marry / leave / take over testing) show no good-or-bad label. Keep that?
3. Are endings short story scenes (dialogue and stills) rather than playable stages? Claude's initial position: yes, cheaper to build.
4. Does the player see all three endings in one run, or must they replay?

- **Vincent:**
- **Claude:**
- **Codex:**
- **Decision:**
- **Change list:** story draft; brief (Story structure)

---

## Q-13 Process and housekeeping / 流程與整理

**Status:** Open · **Blocks:** nothing · **Files:** `docs/progress.md`, `AGENTS.md`

**Questions**
1. Commits: the folder rearrangement, brief updates and tracker are uncommitted on branch `V2`. Commit them now
   (in one or two commits), or wait? Claude commits only on your instruction.
2. After any draft edit, Codex regenerates the HTML reading copy. Agreed?
3. `discuss/` (this folder) holds open-question sessions; decisions go back into the brief, story discussion or art docs. Agreed?
4. Documents bilingual (English plus Traditional Chinese) or one language? Which for the brief and tracker?
5. Step 7.3 (after both slices): raise CCGS rigor or stay at `minimal`? Parked until then.

- **Vincent:**
- **Claude:**
- **Codex:**
- **Decision:**
- **Change list:**

---

## Q-10 Attack-limit rule (T-07) / 同時進攻人數規則

**Status:** Parked until Slice B · **Blocks:** step 6.2 · **Files:** `design/narrative/story-discussion.md` (T-07)

**Context.** Agreed so far: 1–3 nearby enemies attack at once, 沈雅芳 counts toward the limit. Claude's proposal:
an "attack token" system. Only an enemy holding a token may start an attack. Waiting enemies circle. If the
player approaches a waiting enemy, it reacts at once without damage (steps back, guards or feints) and takes the
next free token.

**Questions (answer in Slice B)**
1. Confirm the token approach.
2. N = 2 or 3 attackers at the same time?
3. What does an approached waiting enemy do (step back, guard, feint, taunt)?
4. How does the player tell who is about to attack (telegraph)?
5. Prototype first with `/prototype --spike` (about 4 hours, throwaway), or build it directly in the Slice B story?

- **Vincent:**
- **Claude:**
- **Codex:**
- **Decision:**
- **Change list:** story discussion T-07; brief

---

## Decision log / 決議紀錄

| ID | Decision | By | Date | Applied? |
|---|---|---|---|---|
| — | _(no decisions yet)_ | | | |
