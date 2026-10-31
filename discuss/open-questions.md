# Open Questions — Discussion Sessions / 待決問題與討論場次

**Participants / 參與者:** Vincent (decision maker / 決策者) · Claude · Codex
**Opened / 開啟日期:** 2026-10-29
**Purpose / 目的:** Every question that must be answered before and during the first
playable slice, grouped into sessions so each can be discussed in its own chat.
/ 把進入第一個可玩切片之前與期間必須回答的問題，分成獨立場次，每場可在各自的對話中討論。

Story topics T-01…T-09 are already recorded in `design/narrative/story-discussion.md`.
This file holds the sessions; decisions agreed by all three are recorded in `docs/confirmed.md`. The project tracker is `docs/progress.md`;
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
| Q-01 | Approve the fifth story draft / 審閱並批准第五稿 | 1.3 → Stage 2 | Vincent + Codex | Decided |
| Q-04 | Godot editor, version, language / Godot 安裝、版本、語言 | 2.1, 2.2 | Vincent + Claude | Decided |
| Q-05 | Game form: 2D or 3D, view, platform, input, resolution / 遊戲形式 | 2.2, 2.4 | Vincent + Claude | Decided |
| Q-06 | First-slice scope (MVP) / 首批範圍 | 3.2, 3.3 | Vincent + Claude | Decided |
| Q-07 | Slice A: player controls and moves / 阿曦的操作與招式 | 3.1 | Vincent + Claude | Decided |
| Q-08 | Slice A: 林以亮 boss design / 以亮頭目設計 | 3.1 | Vincent + Claude + Codex | Decided |
| Q-09 | Lives, health, respawn / 生命、血量、重來 | 3.3 | Vincent + Claude | Decided |
| Q-12 | Language, font, text, audio basics / 語言、字型、文字、音訊 | Slice A (font) | Vincent + Claude | Decided |
| Q-11 | Art direction and reference images / 美術方向與參考圖 | 2.4, Stage 5 | Vincent + Codex + Claude | Leaning |
| Q-02 | The three sisters / 三姊妹 | Stage 4 content, not Slice A | Vincent + Codex | Decided |
| Q-03 | Third ending / 第三結局 | Ending production, not Slice A | Vincent + Codex | Decided |
| Q-13 | Process and housekeeping / 流程與整理 | none | Vincent + Claude | Decided |
| Q-10 | Attack-limit rule (T-07) / 同時進攻人數規則 | 6.2 (Slice B) | Vincent + Claude | Decided (built in Slice B) |

Order: Q-01 → Q-04 → Q-05 first (they unblock engine setup). Then Q-06 → Q-07 → Q-08 →
Q-09 (they define Slice A for the brief and stories). Q-12 and Q-11 can run beside them.
Q-02, Q-03, Q-13 are not blocking. Q-10 waits for Slice B.

---

## Q-01 Approve the fifth story draft / 審閱並批准第五稿

**Status:** Decided · **Blocks:** step 1.3, then engine setup · **Files:** `design/narrative/story-draft.md` (or `.html`), `production/qa/evidence/2026-10-29/story-revision-t02-t05.md`

**Context.** Codex applied T-02…T-05 to produce the fifth draft. The draft's own review
list (「你可以優先評論的地方」) has six prompts; three belong here, and the rest are Q-02, Q-03
and prototype work (the final-fight balance, item 6, is tested in Slice B).

**Questions**
1. Do you approve the fifth draft as the story baseline? (Later edits remain possible; approval means
   "good enough to start building Slice A and Slice B on".)
2. Father 林建輝: he speaks plainly in private but cannot raise his head in public. Is that the strength you want?
3. Mother 沈馨芳: should her greed, public scolding and final fight be more exaggerated, or stay close to
   everyday pressure? (T-01 says satirical realism; Codex noted she is strongest when she sincerely
   believes her demands are reasonable.)
4. Stages 1–3: after he learns it is a test at S3-01, is his reason to keep going (he still loves her and
   expects to be accepted) shown well enough?

- **Vincent:** 
1. yes
2. yes
3. it is her personality and selfish and believe she is 100% correct and look down poor guys. therefore, she need whole family members listen to her.
4. he still loves her and believe she  loves him too. but, after test by test, he starts to change his mind and wake up because he knows she is coming from this kind of family.

- **Claude:** (2026-10-31)
  1. Approval noted. It unblocks Stage 2 (engine setup).
  2. Agreed.
  3. This fits the satirical-realism tone (T-01): she is not loud for its own sake. She is certain she is right, she despises men without money, and so she needs the whole family to obey her. The draft already shows this through "這個家，我說了算" (S6-02). No rewrite is needed. If Codex edits anything, the useful target is her contempt for poor men, which can be shown in small everyday lines (prices, comparisons, his job).
  4. Your answer describes a gradual awakening across all six stages, not a single turn at S3-01. Codex should check that **each stage ends with one small, visible step** in that awakening (a doubt, a noticed pattern, a line he does not say). Without that, the change may look sudden at the verdict. This is a review check, not a rewrite request.
  - **Proposed decision:** Fifth draft approved as the baseline; Codex checks the stage-by-stage awakening (item 4) as a later polish pass, not blocking Slice A.
  - 中文摘要：第五稿批准為基準。母親的性格寫法符合；請 Codex 檢查每一關結尾是否都有主角「逐步醒覺」的一小步。
- **Codex:** (2026-10-31)
  1. Your approval is clear; the fifth draft is the baseline. The later Stage 4 correction in Q-02 can be applied without reopening that approval.
  2. I checked the gradual awakening: S1-04 records suspicious details; S2-04 exposes the preprinted documents; S3-04 explicitly keeps his love and hope alive; S4-03 shows 小雨 requesting extra pressure; Stage 5 shows his possible future through 建輝. The progression already works. When Stage 4 is combined into one fight, its message from 小雨 and the 「我先喝完」 moment should survive.
  3. Keep the mother's contempt concrete: what she says about his income, repair work and ability to provide. 阿曦 should judge 小雨 by her own participation and response to him; her family background alone should not settle his opinion of her. This preserves the responsibility already established in the draft.
  - 中文摘要：第五稿已獲批准；逐步醒覺已有鋪排。第四關改寫時保留小雨主動加碼及喝水的轉折，主角根據她自己的行為作判斷。
- **Decision:** (2026-10-31, recorded by Claude) **Decided.**
  - **Confirmed by all three → [`docs/confirmed.md`](../docs/confirmed.md) Q-01:** fifth draft approved as baseline; father as written; mother's selfish certainty and contempt for poor men, shown concretely; gradual awakening already present in the draft and kept through the stage 4 rewrite.
  - **Resolved (Vincent, chat 2026-10-31: "agree"):** Codex's framing is confirmed: the family explains 小雨, but her own participation and responses decide 阿曦's view of her.
  - 中文：已確認第五稿為基準；你同意主角根據小雨本人的行為作判斷，家庭背景只作解釋。
- **Change list:** none to the draft. `docs/progress.md` step 1.3 → Complete (Claude, done).

---

## Q-04 Godot editor, version, language / Godot 安裝、版本、語言

**Status:** Decided · **Blocks:** steps 2.1, 2.2 · **Files:** `docs/engine-reference/godot/VERSION.md`, `AGENTS.md`

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
1. Godot installed at c:\Godot 
2. Godot version 4.7.2
3. GDScript
4. develpment in windows

- **Claude:** (2026-10-31)
  1. Verified: `C:\Godot\Godot_v4.7.2-stable_win64.exe` and `_console.exe` exist, and the console build reports `4.7.2.stable.official.ed1daf0bf`.
  2. Pin 4.7.2 exactly. 4.7 is newer than my training data, so `/setup-engine` will fetch the current official docs and record the API changes in `docs/engine-reference/godot/`.
  3. GDScript agreed.
  4. Windows only for development. Tablet export is covered in Q-05.
  - **Proposed decision:** Godot 4.7.2 stable at `C:\Godot`, GDScript, Windows development machine.
  - 中文摘要：已確認 C:\Godot 安裝 4.7.2；鎖定此版本，使用 GDScript，在 Windows 開發。
- **Codex:** (2026-10-31)
  1. Independently verified with `C:\Godot\Godot_v4.7.2-stable_win64_console.exe --version`: `4.7.2.stable.official.ed1daf0bf`. The installation and exact version are established, rather than still waiting for you to locate the editor.
  2. GDScript and Windows development are clear. Claude can record this version during engine setup and check documentation against it; this verification does not mean setup or a playable project is complete.
  - 中文摘要：已實際執行版本查詢，確認 Godot 4.7.2；安裝位置問題已解決，專案設定仍由 Claude 執行。
- **Decision:** (2026-10-31, recorded by Claude) **Decided.** Confirmed by all three → [`docs/confirmed.md`](../docs/confirmed.md) Q-04: Godot 4.7.2 stable at `C:\Godot` (verified twice), GDScript, Windows development. Nothing open.
  中文：已確認 Godot 4.7.2、GDScript、Windows 開發；無待決事項。
- **Change list:** `project.yaml`, `docs/engine-reference/godot/VERSION.md`, `AGENTS.md` (run command)

---

## Q-05 Game form: 2D or 3D, view, platform, input, resolution / 遊戲形式

**Status:** Decided · **Blocks:** steps 2.2, 2.4 · **Files:** `design/game-brief.md`, `docs/art/README.md`

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
1. 2D
2.  (a) side-scrolling with depth lanes, the classic beat-'em-up (players can walk up and down);
3.  Windows PC (desktop build). however, i expect later can play on tablet like ipad .... let me know if it is not possible.

- **Claude:** (2026-10-31)
  1. 2D agreed.
  2. (a) agreed. Depth lanes also suit stage 4 (one against three) and the six-against-one finale.
  3. **iPad later is possible.** Godot 4 exports to iOS and Android. The costs: building for iPad needs a Mac with Xcode, and publishing needs an Apple Developer account (about US$99 a year). Testing on your own iPad works with a free account, but the install expires after 7 days. To keep that door open at no cost now: (a) all controls go through Godot input actions, so touch buttons can be added later without changing gameplay code; (b) the HUD and dialogue text are sized to stay readable on a tablet; (c) the screen layout handles 4:3 (iPad) as well as 16:9.
  4. Input (not answered): I propose keyboard and gamepad now, touch later. Q-07 gives four buttons (jump, attack, pick/throw, 絕招) plus movement, which fits a gamepad and a touch layout.
  5. Resolution (not answered): Codex's pilot sheets have 48 px adults in 64×64 cells. I propose a **480×270 base, scaled ×4 to 1920×1080** (×2 to 960×540, pixel-perfect). A 48 px adult is then about 18% of the screen height, close to the Kunio-kun look. On iPad (4:3) the view grows taller instead of stretching. I will check this early in Slice A with placeholders at 48 px and also try 640×360; you choose after seeing both.
  - **Proposed decision:** 2D, side-scrolling beat-'em-up with depth lanes, Windows first, built so that iPad/tablet export stays possible; keyboard + gamepad; 480×270 base pending a Slice A comparison with 640×360.
  - 中文摘要：iPad 日後可行（需 Mac 及 Apple 開發者帳號）；現在先以 Windows 為主，但操作與介面預留觸控。建議 480×270 基準解像度放大 4 倍，Slice A 時再與 640×360 比較讓你選。
- **Codex:** (2026-10-31)
  1. Your chosen 2D view with depth lanes suits the requested fights. Native iPad support later is feasible: Godot documents an iOS export route requiring macOS and Xcode. Windows remains the first build target; an iPad build still needs its own controls and device testing. [Godot iOS export requirements](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_ios.html#requirements).
  2. Keyboard/gamepad support and 480×270 versus 640×360 are Claude's proposals, not answers you have already selected. I support comparing the two sizes with the same arena, character scale, HUD and Traditional Chinese dialogue before locking the runtime frame.
  3. The pilot's 48 px adults and 64×64 cells are reference-study dimensions. They should not decide the camera or runtime sprite size automatically. Include room for future touch controls and check different tablet aspect ratios during the layout comparison.
  - 中文摘要：先做 Windows，日後可輸出 iPad，但需 Mac、Xcode 及實機測試。解像度、輸入方式與遊戲角色尺寸仍是待驗證提案，不能直接沿用參考圖規格。
- **Decision:** (2026-10-31, recorded by Claude) **Decided.**
  - **Confirmed by all three → [`docs/confirmed.md`](../docs/confirmed.md) Q-05:** 2D; side-scrolling beat-'em-up with depth lanes; Windows desktop first; iPad later is possible (macOS + Xcode, own touch controls, device testing) and the Windows build keeps that door open; pilot sheet sizes do not set the runtime size by themselves.
  - **Resolved (Vincent, chat 2026-10-31):**
    1. Input: **keyboard only** (no gamepad). Controls still go through Godot input actions, so touch can be added for iPad later.
    2. Resolution: **640×360 base**, chosen directly; no 480×270 comparison. It scales ×2 to 1280×720 and ×3 to 1920×1080.
  - 中文：已確定 2D 縱深走道清版、先做 Windows、日後可做 iPad；只支援鍵盤；基準解像度 640×360。
- **Change list:** `project.yaml`, `design/game-brief.md` (platform/controls line), `docs/art/README.md` (technical frame)

---

## Q-06 First-slice scope (MVP) / 首批範圍

**Status:** Decided · **Blocks:** steps 3.2, 3.3 · **Files:** `design/game-brief.md`

**Context.** `/create-stories` makes one story per item in the brief's MVP list. The brief's MVP
paragraph says "one encounter, one opponent", but T-08 and the Build order say Slice A (S1-02 以亮) then
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
1. Slice A first
2. OK
3. it matched my expectation to have fun  enough. 

- **Claude:** (2026-10-31)
  1. Slice A first, then a review, then Slice B.
  2. The table stands. Note that Q-07 enlarges Slice A considerably (jump, pick/throw, weapons, 絕招, three selectable characters); see my proposal there for how to split it.
  3. "Fun enough" stays your judgement. To make the playtest useful, I will ask you these after each build: Can you play from walk-in to the stamp scene without help? Do your hits feel like they land? Can you see each 以亮 attack coming and react? Did you win within two or three tries, and did losing feel fair? Do you want to play it again?
  - **Proposed decision:** MVP list = Slice A, review, then Slice B. Slice A includes HUD, dialogue + stamp beat and a plain game-over screen; excludes title/menus/pause/saving and the S1-01 corridor fights. Success = Vincent finds it fun enough, judged with the five playtest questions above.
  - 中文摘要：先做 Slice A，檢討後才做 Slice B。「好玩」由你判斷，我每次會用五條試玩問題協助你評估。
- **Codex:** (2026-10-31)
  1. Agree with Slice A first, then your review before Slice B. Keep the full campaign outside this first scope.
  2. Q-07 adds an anger meter to the HUD and a small character selector to the agreed supporting pieces. That selector is a specific exception to the menu exclusion, rather than a reason to build a complete title/settings flow.
  3. Claude's playtest questions are useful prompts. Winning within two or three tries should be a difficulty observation, not a condition that overrides your judgement of whether it is fun. Test one build first, then assess all three before calling the requested Slice A complete.
  - 中文摘要：先做 Slice A 再檢討；加入怒氣顯示及簡單選角。試玩問題協助判斷，不把「兩三次內打贏」當成硬性合格線。
- **Decision:** (2026-10-31, recorded by Claude) **Decided.** Confirmed by all three → [`docs/confirmed.md`](../docs/confirmed.md) Q-06: Slice A → your review → Slice B; Slice A includes HUD with anger meter, dialogue and stamp, plain game-over and a small character selector; excludes title, menus, settings, pause, saving and S1-01 corridor fights; success is your judgement of fun, with the playtest questions as prompts only; one fighter tested first, all three before Slice A is complete. Nothing open.
  中文：已確認範圍及合格標準；無待決事項。
- **Change list:** `design/game-brief.md` (MVP list, Out of scope, Build order, Success measure)

---

## Q-07 Slice A: player controls and moves / 阿曦的操作與招式

**Status:** Decided · **Blocks:** step 3.1 · **Depends on:** Q-05 · **Files:** `design/game-brief.md`

**Context.** 阿曦 is a repair worker with good fighting skills. The draft describes him reading an
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
1. 8-direction on the ground (with depth lanes) and can jump 
2. I would like to have 3 characters player can select to be 陳以曦. 3 characters have different Blood level, fight skill (hand/leg) and attack distance, power level, 絕招
make it simple:
a button: hand/leg attack
a button: pick up item/weapon or threw item (pick-> item -> threw)  or (pick -> weapon -> use limit times -> threw)  
a button: 絕招 (need to accumulate enough angry)

- **Claude:** (2026-10-31)
  My reading: the story hero is always 陳以曦, but the player picks one of three looks/fighting builds for him (this links to Q-11 answer 3, where Codex makes selectable characters). Please correct me if you meant something else.
  1. **Controls (proposal):** movement = 8 directions on the depth lanes; four buttons:
     - **Jump.** Attack while in the air = jump attack.
     - **Attack.** Press repeatedly for a 3-hit combo; the build decides whether the hits are punches or kicks.
     - **Pick / throw.** Near a light item (box, cone, bin): pick it up; press again to throw. Near a weapon (pipe, wrench, which suits a repair worker): pick it up, then Attack swings it; it breaks after a set number of hits (about 5), or press Pick again to throw it.
     - **絕招.** Available when the anger bar is full. The bar fills when he takes damage and, more slowly, when he deals it. A full bar is spent in one move that hits everyone nearby.
  2. **Three builds (example to react to):** (A) fast fists, short reach, lower health; (B) kicks, longer reach, slower; (C) heavy, most health and power, slowest. Each has its own 絕招. All numbers are tuned during play.
  3. No dodge or block: jumping and changing lanes are the defence. This follows your "make it simple".
  4. Hit reactions: both sides flinch on light hits; heavy hits, combo finishers, throws and 絕招 knock down, followed by a get-up.
  5. **Scope warning:** this roughly doubles Slice A. My proposal: build the full control set with **one** build first, with health, reach, power, attack type and 絕招 kept as data. Once you approve the feel, add builds B and C and a simple selection screen as the last Slice A stories. Adding them then is mostly data and placeholders, not new code.
  - **Proposed decision:** as items 1–5, pending your confirmation of my reading of "3 characters".
  - 中文摘要：理解為三個可選外形與打法的「陳以曦」。四鍵：跳、攻擊（連按三連擊）、拾取／投擲（武器可用約 5 次）、絕招（怒氣滿才可用）。先做一個角色調好手感，再加其餘兩個及選角畫面。
- **Codex:** (2026-10-31)
  1. I share Claude's working interpretation: three selectable fighters take the same 陳以曦 story role. Give them clearly different silhouettes and fighting rhythms, as well as different health, reach, power and 絕招, so selecting one changes how the fight feels.
  2. Four actions including Jump fit your request for simple controls. The Attack button can handle the equipped weapon, while Pick/throw handles acquiring and discarding it. The three-hit combo, jump attack, anger gain formula and exact weapon durability remain design proposals; your answers do not fix those details.
  3. Building one fighter first is a useful sequence, while retaining your requested three. I disagree that the other two are mostly data if their hand/leg moves and 絕招 differ: those differences also need animation poses, attack timing, effects and playtesting. Plan their art requests separately after the shared controls work.
  - 中文摘要：理解為三款可代入同一故事主角的角色，外形與打法都要有差別。可先做好一款，再完成其餘兩款；不同拳腳與絕招亦需要獨立動畫及調整。
- **Decision:** (2026-10-31, recorded by Claude) **Decided.**
  - **Confirmed by all three → [`docs/confirmed.md`](../docs/confirmed.md) Q-07:** 8-direction movement with jump; four actions (Jump, Attack, Pick/throw with limited-use weapons, 絕招 from a full anger meter); three fighters differing in health, hand/leg attacks, reach, power, 絕招, silhouette and rhythm; one fighter built first, the other two as their own stories with their own animation, timing, effects, playtest and art requests (Claude accepts Codex's correction that they are not "mostly data"). Combo, jump attack, anger gain, weapon durability, no dodge/block and hit reactions are provisional and tuned in play.
  - **Resolved (Vincent, chat 2026-10-31):** exactly three selectable characters ("3 faces"), all named 陳以曦; only the face and skills differ.
  - 中文：已確認操作方式；三個可選角色同名陳以曦，只是樣貌及招式不同。
- **Change list:** `design/game-brief.md` (MVP bullets); story acceptance criteria

---

## Q-08 Slice A: 林以亮 boss design / 以亮頭目設計

**Status:** Decided · **Blocks:** step 3.1 · **Depends on:** Q-07 · **Files:** `design/narrative/story-draft.md` (S1-02)

**Context.** S1-02: 以亮 blocks the last gate, relies on shoves, heavy pushes and pinning the player
in a corner, and mocks him for backing away. 阿曦 "reads his balance and finds an opening", knocks him back,
then 以亮 says his line, opens the gate, and the stamp scene follows.

**Questions**
1. Attack patterns: which 3–4? Claude's initial position: (a) a charging shove, (b) a corner pin that punishes
   fleeing into a wall, (c) a heavy two-handed slam, (d) a taunt that baits the player to retreat.
2. The "opening": after a heavy attack he is off balance for a moment, and a hit then staggers him? Is that the main way to win?
3. Length and difficulty: a boss fight of roughly 45–90 seconds, and easier than the final-fight first phase? (Stage 1 boss.)
4. Health: one health bar, no phases?
5. End of the fight: when his health reaches zero, is the dialogue and stamp an automatic cutscene (skippable), or does the player act?
6. Look: placeholders only (labelled coloured rectangles, no art). Agreed?
7. Codex: should the story's wording be adjusted if the final moves differ from S1-02's prose?

- **Vincent:** Claude to define it.
- **Claude:** (2026-10-31) Proposed design for 林以亮 at the depot's last gate (S1-02):
  1. **Attacks (each has a clear wind-up pose before it hits):**
     - **(a) Shoulder charge.** He lowers his shoulder (about 0.6 s), then rushes along his lane. Avoid it by changing lane or jumping. If he misses and hits the wall or a crate, he is dazed for about 1.5 s.
     - **(b) Corner pin.** If the player stays near the screen edge, a wall or a corner, he grabs and pushes the player against it, doing damage over time. Pressing Attack quickly breaks free. This turns "backing away" into a real mistake, as in the story.
     - **(c) Two-handed slam.** He raises both arms (about 0.8 s) and slams the ground close in front of him. Afterwards he is off balance for about 1.2 s.
     - **(d) Taunt.** If the player keeps far away for a few seconds, he stops and mocks him (lines taken from S1-02). The taunt is itself an opening: it is a good time to throw a box at him.
  2. **The opening:** hits landed while he is dazed (after a missed charge) or off balance (after the slam) do extra damage and can knock him down. This is the main way to win and matches "reads his balance and finds an opening". Plain attacks against him at other times work but are slower and risk a counter-shove.
  3. **Length and difficulty:** about 60–90 s for a first-time player, clearly easier than the finale. Below 40% health he charges more often, so the fight changes without a second bar.
  4. **Health:** one bar, no phases.
  5. **Ending:** when his health reaches zero the fight stops, and the dialogue and stamp play automatically as a short scene. On retry it can be skipped.
  6. **Look:** labelled coloured placeholders, sized as 48 px characters, so later art fits without retuning.
  7. **Arena props for Q-07:** two or three boxes and cones to throw, one pipe as a weapon.
  8. **Codex (wording):** S1-02 already describes shoves, a heavy push, the corner and mocking, so it matches. Codex only needs to mention the props and weapon if you want them in the prose.
  - **Proposed decision:** as items 1–8.
  - 中文摘要：以亮四招：肩撞衝刺（撞牆會暈）、困角擠壓（連按掙脫）、雙手重砸（之後失衡）、嘲諷（給玩家擲物機會）。破綻時攻擊傷害更高，是主要取勝方法。一條血，約 60–90 秒，戰後自動播對白與蓋章，可在重試時略過。
- **Codex:** (2026-10-31)
  1. You delegated this design to Claude. His charge, corner pressure and recovery openings fit S1-02's existing description; the story does not need a catalogue of every move or prop. Revise its prose only if the resulting fight changes the dramatic action.
  2. For visual readability, give charge preparation, slam preparation and recovery distinct poses. In the placeholder build, direction markers and a visible preparation change can test that before production sprites exist. A rectangle alone cannot show whether he is preparing to hit or open to attack.
  3. My suggested adjustment is a forgiving grab escape rather than requiring very fast button presses. At victory, stop damage and hostile props before the dialogue/stamp beat. Keep the numeric timings as tuning targets until the encounter is played.
  - 中文摘要：以亮設計由 Claude 決定，現有故事文字已大致吻合。先用佔位圖測試蓄勢與破綻是否清楚；掙脫宜寬鬆，勝利後先停止傷害再播對白。
- **Decision:** (2026-10-31, recorded by Claude) **Decided** (delegated to Claude). Claude's design with all of Codex's adjustments accepted → [`docs/confirmed.md`](../docs/confirmed.md) Q-08: four attacks with distinct wind-ups (charge, corner pin with a forgiving escape, slam, taunt); win mainly through openings; one bar, more charges below 40%; about 60–90 s; boxes, cones and a pipe in the arena; victory stops damage and hostile props before the automatic dialogue and stamp (skippable on retry); placeholders show preparation, direction and recovery; timings are tuning targets; S1-02 prose unchanged unless the dramatic action changes. Nothing open.
  中文：以亮設計已確定（含 Codex 的調整：寬鬆掙脫、勝利先停傷害、佔位圖顯示蓄勢）；無待決事項。
- **Change list:** `design/game-brief.md`; S1-02 wording if needed (Codex)

---

## Q-09 Lives, health, respawn / 生命、血量、重來

**Status:** Decided · **Blocks:** step 3.3 (the stories need a lose rule) · **Files:** `design/game-brief.md` (Player goal & fail state), `design/narrative/story-discussion.md` (T-06)

**Context.** Decided (T-06): 3 lives for the whole run, no refill between stages, health recovers
in each stage, game over returns to stage 1. Still open: the details below.

**Questions**
1. After losing a life, what happens? (a) Respawn on the spot with the enemy keeping its damage;
   (b) restart the same encounter with full health; (c) a checkpoint inside long stages.
   Claude's initial position for Slice A: (b), the simplest to build and test.
2. Continues or extra lives: none, a pickup, or earned some other way? Claude's initial position: none for now.
3. What does "health recovers in each stage" mean? (a) Full health at the start of each stage;
   (b) healing items inside a stage; (c) slow recovery out of combat. An idea tied to the story: a cup of
   water as the healing item, echoing 「我先喝完」 and 建輝's request for water.
4. How long should a full six-stage run be (for example 30–40 minutes)? Sending a player back to stage 1 is harsh at that length.
5. On a retry, can the player skip already-seen dialogue? Claude's initial position: yes.

- **Vincent:** claude decide it.
- **Claude:** (2026-10-31) My decisions, open to your veto:
  1. **(b) Restart the same encounter with full health.** The enemy also resets. A lost life costs time, not progress inside the fight. Long stages later get checkpoints at the start of each encounter, so the same rule holds.
  2. **No continues or extra lives** in Slice A and Slice B.
  3. **Full health at the start of each stage, plus a cup of water as the healing item.** Water comes out of breakable boxes or is placed in the arena; it restores part of the health bar. This echoes 「我先喝完」 and 建輝's request for water, and it is cheap to build. No slow regeneration.
  4. **Run length:** aim for about 40–60 minutes for six stages. **Concern:** losing all three lives and restarting from stage 1 (T-06) is harsh at that length. I will not change it now, but I will raise it again after Slice B's playtest, with options such as continuing from the current stage.
  5. **Skipping dialogue already seen: yes.**
  6. The anger bar (Q-07) empties when a life is lost.
  - **Proposed decision:** items 1–6.
  - 中文摘要：失去一命後以滿血重打同一場戰鬥；暫不設接關；每關開始回滿血，場內可拾「一杯水」回血；看過的對白可略過。從第一關重來可能太嚴苛，Slice B 試玩後再討論。
- **Codex:** (2026-10-31)
  1. You delegated these rules to Claude. Restarting the encounter is a workable first rule; its cost is one life and the progress made within that fight, while earlier cleared encounters remain cleared until game over.
  2. The retry should restore a consistent encounter state: enemies, props, healing items and weapon uses, with anger reset as Claude proposes. For Slice B, restarting the whole final encounter would also reset both boss bars and the reinforcement timeline; Claude should state that explicitly in its acceptance criteria.
  3. Water suits the story, but combat pickups and scripted drinking scenes are separate uses. In particular, the mother's refusal to let 建輝 offer water should retain its meaning. The 40–60-minute full run is an untested target; assess the three-life rule after playtesting without silently adding continues.
  - 中文摘要：同意由 Claude 定義重試規則；需一併說明敵人、道具、怒氣與最終戰時間表如何重置。完整流程長度未經測試，暫不更改三命規則。
- **Decision:** (2026-10-31, recorded by Claude) **Decided** (delegated to Claude). Claude's rules with Codex's reset details accepted → [`docs/confirmed.md`](../docs/confirmed.md) Q-09: restart the same encounter at full health; a retry resets enemies, props, healing items, weapon uses and anger (and, in Slice B, both boss bars and the timeline); no continues; T-06 unchanged and reassessed after playtesting; full health at stage start plus a water-cup pickup, kept separate from scripted drinking scenes; 40–60 min run as an untested target; seen dialogue skippable. Nothing open.
  中文：重試及回血規則已確定（含重置細節）；無待決事項。
- **Change list:** `design/game-brief.md` (Player goal & fail state); story discussion T-06

---

## Q-12 Language, font, text, audio basics / 語言、字型、文字、音訊

**Status:** Decided · **Blocks:** Slice A needs a Chinese font; audio can wait · **Files:** `AGENTS.md`, `.claude/rules/narrative.md`

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
1. traditional chinese
2. ok
3. agree calude.
4. silent placeholder is fine for Slice A
5. none.

- **Claude:** (2026-10-31)
  1. Traditional Chinese only. Text still goes into a string table (item 3), so English stays cheap to add later.
  2. **One change to suggest:** since Q-11 chose Kunio-kun pixel art, a smooth font like Noto Sans TC will look out of place in the dialogue box. A Traditional Chinese **pixel font** fits better. Candidates: Cubic 11 (俐方體11號) or Fusion Pixel Font. Both are published under the SIL Open Font License, which allows use in a game; I will re-check the licence file when downloading. Noto Sans TC stays as the fallback for any character the pixel font lacks. I will show you a dialogue box with each in Slice A.
  3. String table from the start, agreed.
  4. Silent placeholders in Slice A. Final music and sound sources and licences can be decided before Stage 5.
  5. No voice acting.
  - **Proposed decision:** Traditional Chinese only; a pixel font (Cubic 11 or Fusion Pixel, chosen from a Slice A screenshot) with Noto Sans TC fallback; string table from the start; silent Slice A; no voice.
  - 中文摘要：既然選了像素風，對白建議用繁中像素字型（俐方體11號或 Fusion Pixel），Noto Sans TC 作後備；Slice A 時給你看兩款效果再選。
- **Codex:** (2026-10-31)
  1. Traditional Chinese, string tables, silent Slice A and no voice acting are clear. Include interface labels and ending choices in the text table too.
  2. I disagree that pixel characters require a pixel dialogue font. You already accepted the proposed Noto Sans TC direction; readable text can sit alongside pixel art. Keep that as the starting option and compare a pixel font in context if useful, rather than creating another prerequisite.
  3. Judge the font using actual dialogue, names, punctuation and HUD numbers at the proposed game/display sizes, including tablet-sized viewing. Silent placeholders are suitable for testing structure, but final hit feedback and satisfaction will need another review once sound is added.
  - 中文摘要：繁中、字串表、Slice A 靜音及無配音已清楚。像素角色不代表必須用像素字型；先以可讀性為準，毋須推翻已接受的字型方向。
- **Decision:** (2026-10-31, recorded by Claude) **Decided.** Claude withdraws the pixel-font change: you accepted Noto Sans TC. Confirmed by all three → [`docs/confirmed.md`](../docs/confirmed.md) Q-12: Traditional Chinese only; string table for all text including interface labels and ending choices; Noto Sans TC as the starting font, with an optional pixel-font comparison in a Slice A screenshot; silent Slice A, hit feedback reviewed again when sound is added; no voice acting.
  - **Open later (not now, before Stage 5):** who sources final music and sound effects, and under what licence.
  - 中文：已確定繁中、字串表、先用 Noto Sans TC、Slice A 無聲、無配音。最終音樂及音效來源於第五階段前再決定。
- **Change list:** `project.yaml` / `AGENTS.md` (font, language); `docs/art/README.md`

---

## Q-11 Art direction and reference images / 美術方向與參考圖

**Status:** Leaning · **Blocks:** steps 2.4 and Stage 5 (not Slice A, which uses placeholders) · **Files:** `docs/art/README.md`, `art/source/reference/README.md`

**Context.** You added 47 reference images in `art/source/reference/characters/` (kept local, not in git).
`full_body/` holds 21 smooth-cartoon full-body drawings generated on 2026-10-25 for the old project
(1254×1254 RGBA); that project's documented pipeline was pixel art. The brief says no style is approved.

**Questions**
1. Style: smooth cartoon like the `full_body` set, pixel art, or something else? This decides the resolution in Q-05 and the animation method.
2. Which reference image inspires which character? (Cast: 陳以曦, 林小雨, 沈馨芳, 林建輝, 林雅婷, 林婉晴, 林可欣, 林以亮, 二姑, 舅舅, and later 知夏.)
   Which images are for identity (face, hair, glasses) and which only for style?
3. Several references are photos of real people. Should the characters look like them, or only be inspired by them?
   If the game is ever shared publicly, does everyone shown agree? (The photos stay on this computer either way.)
4. Animation method (frame-by-frame, cut-out/skeletal, sprite sheets): decide with Codex once the style is chosen.
5. Codex: the empty `docs/concept_images/style_1` and `style_2` folders: move to `art/source/concepts/` or delete?
6. Timing: art requests start after Slice A is playable with placeholders (project rule). Agreed?

- **Vincent:** (2026-10-31) Q1: the wanted game style is 熱血物語 (Kunio-kun SP) grid pixel art, per `art/source/reference/characters/SP/style1.png` and `style2.png`. All 21 photos, plus 10 original story-role characters for review, go to Codex as front/side sheets with eight poses: [`codex-sp-character-sheets.md`](codex-sp-character-sheets.md). The visual target is approved after the pilot sheets.
2. claude you pick one
3. codex is doing simulation and will have characters to select
4. claude you tell codex how to do this part.
5. images move to art\source\reference\characters\SP\style1.png/style2.png
6. agree

- **Claude:** (2026-10-31)
  1. Kunio-kun SP pixel art noted. Codex's four pilot sheets (`vincent2`, `girl1`, `aa13`, `misc-depot-guard`, 48 px adults in 64×64 cells) are in `art/source/reference/characters/SP/` and await your review; that review gates the other 27 sheets.
  2. **Mapping.** I will propose one sheet per story character once the Phase 2 sheets exist, so the choice is made from the whole set rather than from four pilots. The three selectable builds of 陳以曦 (Q-07) need three of the sheets. You approve the table before anything is assigned.
  3. Your answer covers how characters are chosen but not the real-person question. If a character clearly looks like a friend or relative, and especially if it is one of the villains (for example the mother who humiliates her husband), please make sure that person agrees before the game is shown publicly. Inside this computer it does not matter.
  4. **Instruction for Codex (animation method):** frame-by-frame pixel sprite sheets, the classic Kunio-kun method.
     - **Cells and pivot:** keep the pilot's 64×64 cells, 48 px adults, feet on row 60, pivot at the bottom centre (32, 60). Attacks and 絕招 that reach further may use 96×64 cells with the same feet position.
     - **Direction:** in play, characters only face right; Godot mirrors them for left. The front view is kept for portraits and dialogue.
     - **Files:** one horizontal PNG strip per animation, named `<id>_<animation>.png`, same palette rules as the pilot (at most 16 colours, shared outline and skin, binary alpha, no anti-aliasing). Colour ramps stay separate so Slice B's colour swaps work with a palette shader.
     - **Player animations (frame counts are a starting point):** idle 2–4, walk 4–6, jump 3 (take-off, air, landing), punch or kick 3-hit combo (2–3 per hit), jump attack 2, pick up 2, carry idle/walk 2–4, throw 3, weapon swing 3, hurt 2, knockdown 3, lying 1, get up 2, 絕招 6–8, defeated 2, victory 2.
     - **Boss 林以亮:** idle, walk, charge wind-up + charge + dazed, slam wind-up + slam + off-balance, grab/pin, taunt, hurt, knockdown, get up, defeated.
     - **Not in the art:** hit boxes, timing and effects are set in Godot by Claude. Impact sparks and dust are separate small sprites.
     - **Timing:** Codex delivers frames; Claude sets the speed (about 8–12 frames per second) in Godot and reports back anything that reads badly.
  5. Noted. `docs/concept_images/style_1` and `style_2` still exist on disk as empty folders; Codex can delete them.
  6. Agreed: production art requests start after Slice A plays with placeholders.
  - **Proposed decision:** Kunio-kun SP pixel art, frame-by-frame sprite strips per the specification in item 4; cast mapping proposed by Claude after Phase 2 and approved by Vincent; public use of photo-based likenesses needs the people's agreement.
  - 中文摘要：動畫用逐格像素圖（同熱血物語），64×64 格、角色高 48 px、腳底對齊；每個動作一條 PNG，只畫面向右。角色與參考圖的對應待第二批圖完成後由我提出、你批准。用真人樣貌公開前，請先取得本人同意。
- **Codex:** (2026-10-31)
  1. The chosen direction is Kunio-kun SP grid pixel art. The four pilot sheets are still awaiting your review; their eight poses per view are design references, not finished animation cycles. The remaining 27 reference sheets follow that pilot review, and runtime production follows playable Slice A plus agreed requests.
  2. Frame-by-frame sprite strips are a suitable proposed production method. Claude's dimensions, facing, frame counts and playback speed should remain provisional until one player and 以亮 are checked at the intended game scale. Start with a short movement/attack/hurt sample before producing the whole animation list.
  3. One technical clarification: a 96×64 frame has a different centre from a 64×64 frame. Record an explicit ground anchor/offset per layout so an extended punch does not shift the character. Ground position stays consistent; airborne and knocked-down artwork can move relative to that anchor. The full state list also needs to cover all three builds and the held-item/weapon states actually implemented.
  4. Claude owns the reference-to-cast mapping you delegated. The SP paths are already identified in the character-sheet handoff. This review does not require moving those images, deleting folders or adding reference sheets to the runtime manifest.
  - 中文摘要：風格已選，但試作圖仍待審閱，八姿勢不等於完整動畫。逐格圖條方向可行；尺寸、錨點與動作規格先用少量樣本驗證，再正式交接及量產。
- **Decision:** (2026-10-31, recorded by Claude) **Leaning** — partly confirmed.
  - **Confirmed by all three → [`docs/confirmed.md`](../docs/confirmed.md) Q-11:** Kunio-kun SP grid pixel art as the wanted style (visual target approved only after your pilot review); production art after Slice A plays with placeholders; cast mapping delegated to Claude after the Phase 2 sheets; frame-by-frame sprite strips, with sizes, facing, frame counts and speed provisional until one fighter and 以亮 are checked at game scale, a short movement/attack/hurt sample first, and an explicit ground anchor per layout (Claude accepts Codex's correction for 96×64 frames).
  - **Resolved (Vincent, chat 2026-10-31):**
    - Real-person likeness: the people in the photos are Vincent's family and friends and have agreed. The designs are stylised cartoon/pixel characters, not portraits.
    - Empty folders: deleted by Claude on 2026-10-31 (`docs/concept_images/style_1`, `style_2` and the empty parent `docs/concept_images/`).
  - **Open for Vincent:** review Codex's four pilot sheets (`art/source/reference/characters/SP/preview.html`). This gates the other 27 sheets.
  - 中文：真人樣貌已得家人朋友同意；空資料夾已刪除。待你回覆：審閱四張試作圖。
- **Change list:** `docs/art/README.md`, `docs/art/asset-manifest.json`, `art/source/reference/README.md`

---

## Q-02 The three sisters / 三姊妹

**Status:** Decided · **Blocks:** stage 4 content (not Slice A) · **Files:** `design/narrative/story-draft.md` (S4-01…S4-04, characters)

**Context.** The draft has 大姊林雅婷 (comparing), 二姊林婉晴 (always on call), 三姊林可欣 (hands over all chores). The brief
still calls their relationship, names, scenes and combat "provisional".

**Questions**
1. Family order: the draft makes the three older sisters of 小雨. What is the full birth order of all five children, including 以亮 and 小雨, and their rough ages?
2. Are the names 雅婷, 婉晴, 可欣 final?
3. Are the three roles right (comparison / always available / chores and cheerfulness)?
4. Combat: should each sister have a clearly different fighting style? Draft hints: 雅婷 changes comparisons and targets, 婉晴 calls, swaps position and feints, 可欣 blocks movement with event props.
5. Does every sister need her own full scene, or can stage 4 be shortened?

- **Vincent:**
1. 以亮->雅婷->可欣->小雨->婉晴
2. yes
3. ok
4. yes, better to have different style 
5. i mean 3 sisters fight together with 陳以曦. (i mean 1 vs 3). therefore, stage should be same as others.

- **Claude:** (2026-10-31) Two of these answers change the draft:
  1. **Birth order changes the sisters' titles.** With 以亮 → 雅婷 → 可欣 → 小雨 → 婉晴: 雅婷 is 大姊, 可欣 becomes **二姊** (the draft says 三姊), and 婉晴 is **小雨's younger sister, 妹妹** (the draft calls her 二姊 and 「小雨的姊姊」). Every 二姊/三姊 label and the line 「小雨的三位姊姊」 need updating. Please also give rough ages if you want them in the draft.
  2. Names final, noted.
  3. Roles kept: 雅婷 comparison, 婉晴 always on call, 可欣 chores and cheerfulness. A younger sister demanding he be on call works well.
  4. Different fighting styles, agreed. Starting ideas: 雅婷 throws brochures/photos from range and taunts with comparisons; 婉晴 is fast, feints and repositions ("calls" him to another spot); 可欣 places event props (chairs, trays) that block lanes.
  5. **Stage 4 becomes one fight against all three at once.** The draft now has three separate boss scenes (S4-01…S4-03, 「依次通過」, 「各自出戰」), so Codex needs to rewrite stage 4 as one shared fight. The story can still keep each sister's test as dialogue before and during the fight, and each still signs her own mark. It is still eight family bosses in six stages.
  6. **Effect on design:** a one-against-three fight in stage 4 uses the attack-limit rule (Q-10) earlier than Slice B. With N = 3, all three sisters may attack at once, so stage 4 would be harder than the finale's first part unless tuned. I suggest stage 4 uses N = 2 and the finale N = 3; this is decided when stage 4 is built.
  7. **Finale order:** the user-set arrivals are 雅婷 10 s, 婉晴 20 s, 可欣 30 s. Keep that order, or change it to birth order (雅婷, 可欣, 婉晴)?
  - **Proposed decision:** birth order 以亮 → 雅婷 → 可欣 → 小雨 → 婉晴 (titles 大姊 雅婷, 二姊 可欣, 妹妹 婉晴); names and roles final; distinct styles; stage 4 is one 1-vs-3 fight. Codex rewrites stage 4 and the character list; the finale order awaits your answer to item 7.
  - 中文摘要：按出生次序，可欣變二姊、婉晴變小雨的妹妹，草稿稱謂要改。第四關改為一打三的單場戰鬥，需由 Codex 重寫。請確認最終戰援軍次序是否維持原定。
- **Codex:** (2026-10-31)
  1. The birth order and names are clear: 以亮 → 雅婷 → 可欣 → 小雨 → 婉晴. 雅婷 and 可欣 are 小雨's older sisters; 婉晴 is her younger sister. Keep the collective 三姊妹, but correct the character list, dialogue, headings and tables that call all three her older sisters. Exact ages can wait.
  2. Stage 4 should become one shared arena and one simultaneous 1-vs-3 boss fight. Keep their different demands and fighting styles, three signatures in the fourth assessment box, 小雨's added demand and 阿曦's drinking pause. The existing three sequential victories need to be rewritten, not merely relabelled.
  3. I would start with your N = 3 rule rather than introduce a separate N = 2 restriction now. Tune reach, preparation and recovery so the three styles remain readable together; the enemy count alone does not determine difficulty.
  4. Keep the confirmed finale arrivals: 雅婷 10 s, 婉晴 20 s, 可欣 30 s, 建輝 40 s, 以亮 50 s. Birth order does not require arrival order to change, so no further answer is needed to preserve that schedule.
  - 中文摘要：第四關改為同場一打三；可欣是二姊，婉晴是小雨的妹妹。保留三人分工及醒覺轉折；最終戰援軍仍依原定時間與次序，毋須因出生次序另改。
- **Decision:** (2026-10-31, recorded by Claude) **Decided.** Claude withdraws two suggestions in favour of Codex's: stage 4 starts with your N = 3 (no separate N = 2), and the finale arrivals stay as you set them. Confirmed by all three → [`docs/confirmed.md`](../docs/confirmed.md) Q-02: birth order 以亮 → 雅婷 → 可欣 → 小雨 → 婉晴 (大姊雅婷, 二姊可欣, 妹妹婉晴); names and roles final; distinct fighting styles; stage 4 is one arena and one 1-vs-3 fight keeping the three signatures, 小雨's added demand and the drinking pause; finale arrivals 雅婷 10 s, 婉晴 20 s, 可欣 30 s unchanged; ages later. Nothing open.
  中文：已確定出生次序、稱謂、第四關一打三及最終戰次序不變；無待決事項。
- **Change list:** Codex rewrites stage 4 (S4-01…S4-04) as one fight and corrects the character list, titles, headings and tables, then regenerates the HTML. Claude updates the brief's sisters status at step 3.3.

---

## Q-03 Third ending / 第三結局

**Status:** Decided · **Blocks:** ending production (not Slice A) · **Files:** `design/narrative/story-draft.md` (結局三 and the final-choice section 「真相與選擇」)

**Context.** The draft's third ending, 〈另一份合約〉: 阿曦 declines marriage and joins the family's testing business,
swapping seats yet still under 沈馨芳. The draft keeps a clear confirmation so the player knows what they choose.

**Questions**
1. Keep this ending as written, or change it?
2. The three final choices (marry / leave / take over testing) show no good-or-bad label. Keep that?
3. Are endings short story scenes (dialogue and stills) rather than playable stages? Claude's initial position: yes, cheaper to build.
4. Does the player see all three endings in one run, or must they replay?

- **Vincent:**
1. keep as this
2. yes, it is choice. no good or bad because no one knows.
3. yes
4. must replay.

- **Claude:** (2026-10-31)
  1–3. Agreed. Endings are short dialogue-and-still scenes, with no labels, and the third ending stays as written.
  4. Replay noted. Two small consequences for later (not Slice A): the game needs a small save that remembers which endings were seen, and a full replay is 40–60 minutes for each further ending. An option to consider after the full game exists: after the first clear, allow starting again from the final choice. Not proposed as a decision now.
  - **Proposed decision:** third ending kept; no good/bad labels; endings are story scenes; one ending per run.
  - 中文摘要：同意。日後需記錄已看過的結局；全破後可否直接從最終選擇重玩，留待日後再議。
- **Codex:** (2026-10-31)
  1. Keep the third ending and the three unlabelled choices. Each choice should clearly describe what 阿曦 commits to, while leaving the player to judge it. The current third-ending confirmation already establishes that 沈馨芳 retains authority.
  2. One ending per completed run, with a replay required for another, is explicit. A shortcut back to the final choice would change that rule, so I would not include it by default.
  3. An ending gallery or persistent record is optional, not necessary to honour one ending per run. Do not add saving to Slice A because of this discussion. Later endings can use short dialogue/still scenes as you agreed.
  - 中文摘要：保留第三結局及不標好壞的選項；每次通關只看一個結局，其他結局須重玩。不因此自動加入結局捷徑、圖鑑或存檔系統。
- **Decision:** (2026-10-31, recorded by Claude) **Decided.** Confirmed by all three → [`docs/confirmed.md`](../docs/confirmed.md) Q-03: third ending kept; unlabelled choices; endings as dialogue/still scenes; one ending per run, replay for another; no shortcut, gallery or save added for this. Nothing open.
  中文：結局安排已確定；無待決事項。
- **Change list:** story draft; brief (Story structure)

---

## Q-13 Process and housekeeping / 流程與整理

**Status:** Decided · **Blocks:** nothing · **Files:** `docs/progress.md`, `AGENTS.md`

**Questions**
1. Commits: the folder rearrangement, brief updates and tracker are uncommitted on branch `V2`. Commit them now
   (in one or two commits), or wait? Claude commits only on your instruction.
2. After any draft edit, Codex regenerates the HTML reading copy. Agreed?
3. `discuss/` (this folder) holds open-question sessions; decisions go back into the brief, story discussion or art docs. Agreed?
4. Documents bilingual (English plus Traditional Chinese) or one language? Which for the brief and tracker?
5. Step 7.3 (after both slices): raise CCGS rigor or stay at `minimal`? Parked until then.

- **Vincent:**
1. i will commit myself.
2. agree
3. yes
4. bilingual
5. raise CCGS  rigor

- **Claude:** (2026-10-31)
  1. Noted. I will not commit; I will tell you when a set of changes is ready to commit.
  2–3. Agreed.
  4. Bilingual, noted. To keep the work manageable, I propose: headings, decisions, the brief and the tracker's status lines in both languages; long technical notes in English with a short 中文摘要, as in these comments. I will apply this to documents as they are edited rather than rewriting everything at once.
  5. Raising rigor after both slices, noted for step 7.3. At that point CCGS will require a concept document, art bible, systems map and per-system design documents before more stages are built. This is reasonable for a six-stage game.
  - **Proposed decision:** Vincent commits; Codex regenerates HTML after draft edits; `discuss/` for sessions; bilingual as described in item 4; raise rigor at step 7.3.
  - 中文摘要：你自行提交；文件雙語（標題、決議、狀態用中英；長段技術內容附中文摘要）；兩個切片完成後提升 CCGS 嚴謹度。
- **Codex:** (2026-10-31)
  1. You will handle commits. I will keep regenerating the HTML reading copy whenever the Markdown story changes. These comments change only the discussion file, so no story HTML regeneration is needed here.
  2. Bilingual documents are the requested direction. These comments use English with a Traditional Chinese summary; future decisions and handoffs should carry the same meaning in both languages.
  3. Raising CCGS rigor after both slices is your stated decision. Keep the current minimal workflow until that point; Claude owns the later transition and its document requirements.
  4. The tracker, plan and brief still contain older waiting/undecided statements. Claude's next consolidation should record your explicit answers and delegated decisions, while keeping added suggestions visibly provisional. Q-08 and Q-09 are delegated to Claude; they do not require you to answer the same questions again. This pass leaves other participants' text and the shared decision fields intact.
  - 中文摘要：由你提交；故事修改後重建 HTML；文件雙語。兩個切片後提升嚴謹度。下一步整理已回答及已授權 Claude 決定的事項，避免重複詢問。
- **Decision:** (2026-10-31, recorded by Claude) **Decided.** Confirmed by all three → [`docs/confirmed.md`](../docs/confirmed.md) Q-13: Vincent commits; Codex regenerates the HTML after story edits; `discuss/` for sessions, confirmed decisions in `docs/confirmed.md`; bilingual documents, applied as documents are edited; CCGS `minimal` until both slices are done, rigor raised at step 7.3. Nothing open.
  中文：流程安排已確定；無待決事項。
- **Change list:** `docs/confirmed.md` created; `docs/progress.md` and `docs/plan.md` consolidated with the answered and delegated decisions (Claude, done 2026-10-31).

---

## Q-10 Attack-limit rule (T-07) / 同時進攻人數規則

**Status:** Decided (built in Slice B) · **Blocks:** step 6.2 · **Files:** `design/narrative/story-discussion.md` (T-07)

**Context.** Agreed so far: 1–3 nearby enemies attack at once, 沈馨芳 counts toward the limit. Claude's proposal:
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
1. yes
2. 3
3. guard
4. i don't understand what you mean. enemy will come near to attack player ofcourse player know it.
5. build directly in slice B story.

- **Claude:** (2026-10-31)
  1–3. Noted: tokens, N = 3 in the finale, waiting enemies guard when approached. Stage 4 may use N = 2 (see Q-02 item 6).
  4. **What "telegraph" means:** with up to six enemies around him, several are near at once, and the player needs to see **which one is about to hit, a moment before the hit**. In Kunio-kun this is simply a short wind-up pose (pulling back a fist, lowering a shoulder) lasting about half a second before the attack lands. So the answer can be "a visible wind-up pose for every attack"; no icons or symbols are needed. This is the same rule as 林以亮's wind-ups in Q-08, so it is built once in Slice A.
  5. Built directly in the Slice B story, noted.
  - **Proposed decision:** attack tokens, N = 3 in the finale; approached waiting enemies guard; every enemy attack has a short visible wind-up pose (built in Slice A); no separate prototype.
  - 中文摘要：「預兆」即敵人出手前約半秒的準備動作（例如拉拳、壓低肩膀），讓玩家看出誰快要打過來；毋須額外圖示，Slice A 已一併製作。
- **Codex:** (2026-10-31)
  1. Tokens, a maximum of three simultaneous attackers including 沈馨芳, guarding by approached waiting enemies, and direct implementation in Slice B are clear. A waiting enemy's guard should not deal damage or become an attack that bypasses the limit.
  2. Your expectation is natural: approaching should tell the player an enemy is coming. The extra distinction is whether that nearby enemy is waiting or actually starting a hit. A raised fist or lowered shoulder can communicate that through ordinary animation, without icons or special terminology.
  3. I support testing those preparation poses in Slice A and reusing the approach for groups. The exact duration should follow each move rather than require every attack to pause for half a second. Claude should define whether preparation and recovery occupy an attack slot so overlapping attacks remain consistent with the three-attacker rule.
  - 中文摘要：最多三人進攻，包含母親；等待者防禦但不偷加攻擊。以自然蓄勢動作分辨「靠近」與「即將出手」，實際時長及名額釋放時點由 Claude 在戰鬥中調整。
- **Decision:** (2026-10-31, recorded by Claude) **Decided** (built in Slice B). Claude accepts Codex's point that wind-up length fits each move rather than a fixed half second. Confirmed by all three → [`docs/confirmed.md`](../docs/confirmed.md) Q-10: attack tokens, at most 3 attackers including 沈馨芳; approached waiting enemies guard without damage or extra attacks; telegraph = ordinary wind-up animation, no icons, first tested on 以亮; built directly in Slice B; Claude defines token take/release in the Slice B acceptance criteria. Nothing open.
  中文：同時進攻規則已確定，於 Slice B 製作；無待決事項。
- **Change list:** story discussion T-07; brief

---

## Decision log / 決議紀錄

| ID | Decision | By | Date | Applied? |
|---|---|---|---|---|
| Q-01 | Fifth draft approved as baseline (see [`docs/confirmed.md`](../docs/confirmed.md)) | Vincent + Claude + Codex | 2026-10-31 | Partly: draft unchanged; step 1.3 Complete |
| Q-02 | Sisters' birth order and titles; stage 4 is one 1-vs-3 fight (see [`docs/confirmed.md`](../docs/confirmed.md)) | Vincent + Claude + Codex | 2026-10-31 | No: Codex rewrites stage 4 |
| Q-03 | Third ending kept; unlabelled choices; one ending per run (see [`docs/confirmed.md`](../docs/confirmed.md)) | Vincent + Claude + Codex | 2026-10-31 | Brief at step 3.3 |
| Q-04 | Godot 4.7.2 at C:\Godot, GDScript, Windows (see [`docs/confirmed.md`](../docs/confirmed.md)) | Vincent + Claude + Codex | 2026-10-31 | At /setup-engine |
| Q-05 | 2D depth-lane beat-'em-up, Windows first, iPad possible later; keyboard only; 640×360 base (see [`docs/confirmed.md`](../docs/confirmed.md)) | Vincent + Claude + Codex | 2026-10-31 | Brief and art README after open items |
| Q-06 | Slice A → review → Slice B; Slice A contents and success measure (see [`docs/confirmed.md`](../docs/confirmed.md)) | Vincent + Claude + Codex | 2026-10-31 | Brief at step 3.3 |
| Q-07 | Controls; three selectable faces/skill sets, all named 陳以曦 (see [`docs/confirmed.md`](../docs/confirmed.md)) | Vincent + Claude + Codex | 2026-10-31 | Brief and stories at 3.3–3.5 |
| Q-08 | 林以亮 boss design (delegated to Claude) (see [`docs/confirmed.md`](../docs/confirmed.md)) | Vincent + Claude + Codex | 2026-10-31 | Brief and stories at 3.3–3.5 |
| Q-09 | Retry, reset, water pickup rules (delegated to Claude) (see [`docs/confirmed.md`](../docs/confirmed.md)) | Vincent + Claude + Codex | 2026-10-31 | Brief at step 3.3 |
| Q-10 | Attack tokens, max 3, guard, wind-up telegraphs (see [`docs/confirmed.md`](../docs/confirmed.md)) | Vincent + Claude + Codex | 2026-10-31 | Slice B stories |
| Q-11 | Pixel-art direction and sprite-strip method; likeness agreed; empty folders deleted (pilot review still open) (see [`docs/confirmed.md`](../docs/confirmed.md)) | Vincent + Claude + Codex | 2026-10-31 | Art README after Q-05 resolution |
| Q-12 | Traditional Chinese, string table, Noto Sans TC start, silent Slice A, no voice (see [`docs/confirmed.md`](../docs/confirmed.md)) | Vincent + Claude + Codex | 2026-10-31 | At /setup-engine |
| Q-13 | Process: Vincent commits, bilingual docs, raise rigor at 7.3 (see [`docs/confirmed.md`](../docs/confirmed.md)) | Vincent + Claude + Codex | 2026-10-31 | Recorded |
