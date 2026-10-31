# Confirmed Decisions / 已確認決議

**Source / 來源：** [`discuss/open-questions.md`](../discuss/open-questions.md), sessions Q-01…Q-13
**Recorded / 記錄日期：** 2026-10-31 by Claude
**Rule / 規則：** An item appears here only when Vincent answered it (or delegated it) and Claude and
Codex both agreed in their comments. Items still waiting for Vincent stay in the session's
**Decision → Open** list in `discuss/open-questions.md`.
只有 Vincent 已回答（或授權決定），而 Claude 與 Codex 在評論中都同意的事項才列於此。仍待 Vincent 決定的事項留在 `discuss/open-questions.md` 各場次的「Open」清單。

Numbers such as timings, health and frame counts are **tuning targets**, confirmed as a starting point and
adjusted after play. 時間、血量、格數等數值屬**調整目標**，試玩後可修改。

Where a decision changes another document, the **Apply** line names the file, the owner and when.

---

## Story / 故事

### Q-01 Fifth draft / 第五稿
- The fifth story draft is the approved baseline (2026-10-31). Later edits stay possible.
  第五稿為已批准的故事基準，日後仍可修改。
- Father 林建輝: plain-spoken in private, cannot raise his head in public.
  父親林建輝：私下說話坦白，人前抬不起頭。
- Mother 沈馨芳: selfish, believes she is 100% right, looks down on poor men, so she needs the whole family to obey her. Her contempt is shown concretely (his income, repair work, ability to provide), not by being louder.
  母親沈馨芳：自私、深信自己完全正確、看不起窮男人，因此要全家聽她的話；以具體言語（收入、修理工作、能否供養）表現輕視，而非越來越大聲。
- 陳以曦 still loves 小雨 and believes she loves him; he wakes up gradually, test by test. Codex checked that the draft already shows this (S1-04, S2-04, S3-04, S4-03, stage 5). The stage 4 rewrite must keep 小雨's added demand and the 「我先喝完」 moment.
  主角仍愛小雨、相信她也愛他，經一關一關的考驗逐步醒覺；草稿已有鋪排，第四關改寫時須保留小雨主動加碼及「我先喝完」。
- 阿曦 judges 小雨 by her own participation and responses; her family explains her but does not decide his view (Codex's framing, Vincent agreed 2026-10-31).
  主角根據小雨本人的參與及回應作判斷；家庭背景只作解釋，不是定論。
- **Apply:** no draft change needed. Step 1.3 complete.

### Q-02 The three sisters / 三姊妹
- Birth order: 以亮 → 雅婷 → 可欣 → 小雨 → 婉晴. Titles: 大姊雅婷, 二姊可欣, 妹妹婉晴 (小雨's younger sister). The group is still called 三姊妹. Ages can wait.
  出生次序：以亮 → 雅婷 → 可欣 → 小雨 → 婉晴。稱謂：大姊雅婷、二姊可欣、妹妹婉晴（小雨的妹妹）。仍統稱三姊妹；年齡稍後再定。
- Names 雅婷, 婉晴, 可欣 are final. Roles kept: 雅婷 comparison, 婉晴 always on call, 可欣 chores and cheerfulness.
  三人名字確定；角色分工不變：雅婷比較、婉晴隨叫隨到、可欣家務與強顏歡笑。
- Each sister fights in a clearly different style.
  三人打法明顯不同。
- **Stage 4 is one arena and one fight: 陳以曦 against all three sisters at once.** Keep their different demands, the three signatures in the fourth assessment box, 小雨's added demand and the drinking pause. Still eight family bosses in six stages.
  **第四關為同一場地、一打三的單場戰鬥。** 保留三人各自要求、第四格三個簽記、小雨加碼及喝水停頓；仍為六關八位家族頭目。
- Stage 4 starts with the same attack limit as the finale (3) and is tuned through reach, wind-up and recovery.
  第四關同樣以最多三人同時進攻開始，透過距離、蓄勢及收招時間調整難度。
- Finale arrivals unchanged: 雅婷 10 s, 婉晴 20 s, 可欣 30 s, 建輝 40 s, 以亮 50 s.
  最終戰援軍時間與次序不變。
- **Apply:** Codex rewrites stage 4 (S4-01…S4-04) as one fight, corrects the character list, titles, headings and tables, then regenerates the HTML. Claude updates the brief's status line at step 3.3.

### Q-03 Endings / 結局
- Keep the third ending 〈另一份合約〉 as written. The three final choices carry no good/bad label.
  保留第三結局；三個最終選擇不標示好壞。
- Endings are short dialogue-and-still scenes, not playable stages.
  結局為短對白及靜止畫面，非可玩關卡。
- One ending per completed run; seeing another needs a replay. No shortcut to the final choice, ending gallery or save system is added because of this.
  每次通關只看一個結局，其他結局須重玩；不因此加入捷徑、圖鑑或存檔。
- **Apply:** brief Story structure line at step 3.3 (Claude).

---

## Engine and form / 引擎與遊戲形式

### Q-04 Godot / Godot
- Godot **4.7.2 stable**, installed at `C:\Godot` (`Godot_v4.7.2-stable_win64.exe`, `_console.exe`). Verified by Claude and Codex: `--version` → `4.7.2.stable.official.ed1daf0bf`.
  使用 Godot 4.7.2 stable，安裝於 C:\Godot，已由 Claude 及 Codex 驗證版本。
- Language: GDScript. Development on Windows.
  使用 GDScript，在 Windows 開發。
- **Apply:** `/setup-engine godot` (Claude) writes `project.yaml`, `docs/engine-reference/godot/VERSION.md` and the run command in `AGENTS.md`. Step 2.1 complete.

### Q-05 Game form / 遊戲形式
- 2D, side-scrolling beat-'em-up with depth lanes (players walk up and down).
  2D 橫向清版動作，可上下移動的縱深走道。
- Windows PC desktop build first.
  先做 Windows 桌面版。
- iPad/tablet later is possible: Godot exports to iOS, which needs macOS + Xcode (and an Apple Developer account to publish), its own touch controls and device testing. The Windows build keeps that door open: all controls go through input actions, HUD and text stay readable at tablet size, layout handles 4:3 as well as 16:9.
  日後可輸出 iPad：需 Mac、Xcode（發佈需 Apple 開發者帳號）、觸控操作及實機測試；Windows 版先預留：操作經 input actions、介面在平板尺寸可讀、版面兼容 4:3 及 16:9。
- Codex's pilot sheet sizes (48 px adults, 64×64 cells) do not set the runtime resolution or sprite size by themselves.
  試作圖尺寸不自動決定遊戲解像度或角色尺寸。
- Input: **keyboard only** (no gamepad). All controls still go through Godot input actions so touch can be added for iPad later.
  只支援鍵盤（不支援手掣）；操作仍經 input actions，日後可加觸控。
- Base resolution: **640×360**, integer-scaled (×2 = 1280×720, ×3 = 1920×1080).
  基準解像度 640×360，整數倍放大。
- **Apply:** `/setup-engine` and `project.godot` display settings (Claude); `docs/art/README.md` technical frame (step 2.4).

---

## Slice A / 第一切片

### Q-06 Scope / 範圍
- Build order: Slice A (S1-02, 林以亮 boss fight) → Vincent's review → Slice B (final-fight timeline). The full campaign stays out of scope.
  先做 Slice A（以亮頭目戰），你檢討後才做 Slice B；完整六關不在此範圍。
- Inside Slice A: HUD (health, lives, **anger meter**), dialogue box and the stamp beat, plain game-over screen, and a **small character selector** (the only exception to "no menus").
  Slice A 包括：血量、命數及怒氣顯示，對白及蓋章，簡單遊戲結束畫面，以及簡單選角畫面（唯一例外的選單）。
- Outside Slice A: title screen, menus, settings, pause, saving, the S1-01 corridor fights (boss fight only, with a short walk-in).
  不包括：標題、選單、設定、暫停、存檔、S1-01 走廊戰。
- Success: Vincent finds it fun enough. Claude's playtest questions (walk-in to stamp without help; hits feel like they land; 以亮's attacks readable; fair losses; want to replay) are prompts, not a pass line. Test one fighter first, then all three, before Slice A is called complete.
  合格標準：你覺得夠好玩。試玩問題只作輔助，非硬性合格線；先試一個角色，三個都試過才算完成。
- **Apply:** brief MVP list, Out of scope, Build order and Success measure at step 3.3 (Claude). Step 3.2 decided.

### Q-07 Player controls / 主角操作
- Movement: 8 directions on the depth lanes, with jump.
  八方向移動，可跳。
- Four actions: **Jump**, **Attack** (hand or leg depending on the fighter; swings an equipped weapon), **Pick/throw** (pick up an item → throw it; pick up a weapon → use a limited number of times → throw it), **絕招** (needs a full anger meter).
  四個動作：跳、攻擊（拳或腳視角色而定；持武器時揮動武器）、拾取／投擲（拾物 → 投擲；拾武器 → 有限次數使用 → 投擲）、絕招（怒氣滿才可用）。
- Exactly **three selectable characters, all named 陳以曦** (same story role); only the face and skills differ: health, hand/leg attacks, reach, power and 絕招, with clearly different silhouettes and rhythm (Vincent confirmed 2026-10-31).
  只有三個可選角色，全部同名陳以曦；只是樣貌及招式不同（血量、拳腳、攻擊距離、力量、絕招），外形與節奏亦明顯有別。
- Order of work: build the shared controls with one fighter first; the other two follow as their own stories, each with its own animation, timing, effects and playtest (not just data), and their own art requests.
  先以一個角色完成共用操作；其餘兩個各自成為獨立工作項目，需另做動畫、時機、效果、試玩及美術需求。
- Proposals kept **provisional** and tuned in play: 3-hit combo, jump attack, anger gain, weapon durability (about 5 hits), no dodge/block (jumping and lane changes are the defence), light hits flinch and heavy hits knock down.
  三連擊、跳躍攻擊、怒氣累積方式、武器耐用（約 5 次）、不設閃避或格擋、受擊反應等屬暫定，試玩時調整。
- **Apply:** brief MVP bullets and story acceptance criteria at steps 3.3 and 3.5 (Claude).

### Q-08 林以亮 boss / 以亮頭目
Delegated to Claude by Vincent; Codex agreed with its fit to S1-02 and added adjustments, all accepted.
由你授權 Claude 設計；Codex 同意並補充調整，已全部採納。
- Attacks, each with its own readable wind-up pose: (a) shoulder charge along his lane, dazed if he hits a wall or crate; (b) corner pin when the player backs into an edge or corner, with a **forgiving** escape (not very fast button mashing); (c) two-handed slam, off balance afterwards; (d) taunt when the player keeps away, which is itself an opening for thrown items.
  四招各有清楚蓄勢動作：肩撞衝刺（撞牆或箱會暈）、困角擠壓（掙脫要寬鬆）、雙手重砸（之後失衡）、嘲諷（玩家可趁機擲物）。
- Main way to win: hit him while dazed or off balance for extra damage and knockdown.
  主要取勝方法：趁他暈眩或失衡時攻擊，傷害更高並可擊倒。
- One health bar, no phases; charges more often below 40% health. About 60–90 s for a first-time player, easier than the finale.
  一條血、不分階段；低於 40% 時更常衝撞；新手約 60–90 秒，比最終戰容易。
- Arena props: two or three boxes and cones to throw, one pipe as a weapon.
  場內道具：兩三個箱及雪糕筒可擲，一支水管作武器。
- Victory: damage and hostile props stop first, then the dialogue and stamp play automatically; skippable on retry.
  勝利時先停止所有傷害及敵方道具，再自動播放對白及蓋章；重試時可略過。
- Placeholder build shows preparation, direction and recovery with markers and pose changes, so readability is tested before sprites exist. Timings stay tuning targets.
  佔位版以標記及姿勢變化顯示蓄勢、方向與收招，在正式美術前先測試可讀性。
- S1-02 prose changes only if the fight changes the dramatic action.
  除非戰鬥改變了劇情動作，否則不改 S1-02 文字。
- **Apply:** brief and Slice A stories at steps 3.1–3.5 (Claude). Step 3.1 decided for 以亮.

### Q-09 Lives, health, retry / 生命、血量、重試
Delegated to Claude by Vincent; Codex agreed and added reset rules, all accepted.
由你授權 Claude 決定；Codex 同意並補充重置規則，已全部採納。
- Losing a life restarts the **same encounter** at full health. Earlier cleared encounters stay cleared until game over.
  失去一命後以滿血重打同一場戰鬥；之前已過的戰鬥在遊戲結束前保持已過。
- A retry restores a consistent encounter state: enemies, props, healing items and weapon uses; the anger meter is emptied. In Slice B, restarting the final encounter also resets both of 沈馨芳's health bars and the reinforcement timeline (stated in Slice B acceptance criteria).
  重試會重置敵人、道具、回血物品及武器次數，怒氣歸零；最終戰重試時，母親兩條血及援軍時間表亦重置。
- No continues or extra lives in Slice A and Slice B. T-06 stays: 3 lives for the run, game over restarts from stage 1. The three-life rule is assessed after playtesting, without silently adding continues.
  兩個切片均不設接關或額外生命；維持三命及遊戲結束返回第一關，試玩後再評估，不會暗中加入接關。
- Full health at the start of each stage; a **cup of water** pickup restores part of the bar; no slow regeneration. Combat pickups are separate from scripted drinking scenes, and the mother's refusal to let 建輝 offer water keeps its meaning.
  每關開始回滿血；場內「一杯水」回復部分血量；不設自動回血。戰鬥拾取與劇情喝水分開，母親不准建輝遞水的意義不變。
- Full six-stage run: about 40–60 minutes, an untested target.
  完整六關約 40–60 分鐘，屬未測試目標。
- Already-seen dialogue can be skipped on retry.
  重試時可略過看過的對白。
- **Apply:** brief "Player goal & fail state" at step 3.3 (Claude).

### Q-12 Language, text, audio / 語言、文字、音訊
- Traditional Chinese only for the first release.
  首個版本只用繁體中文。
- All text, including interface labels and ending choices, lives in a string table from the start.
  所有文字（包括介面及結局選項）一開始便放入字串表。
- Font: start with **Noto Sans TC** (Vincent accepted it). A pixel font may be compared in a Slice A screenshot, judged on real dialogue, names, punctuation and HUD numbers at game and tablet sizes; it is not a prerequisite.
  字型先用 Noto Sans TC；可在 Slice A 截圖中比較像素字型，以實際對白、名字、標點及數字判斷，但非必要條件。
- Slice A is silent. Hit feedback is reviewed again when sound is added. No voice acting.
  Slice A 無聲；加入音效後再檢討打擊感；不設配音。
- **Apply:** `project.yaml` / `AGENTS.md` at engine setup (Claude).

### Q-10 Attack limit (Slice B) / 同時進攻人數（Slice B）
- Attack tokens: at most **3** enemies attack at once, 沈馨芳 included.
  攻擊名額制：最多三人同時進攻，包括母親。
- A waiting enemy that the player approaches **guards**; the guard deals no damage and never becomes an attack outside the limit.
  玩家接近等待中的敵人時，敵人會防禦；防禦不造成傷害，也不會變成額外攻擊。
- "Telegraph" means ordinary wind-up animation (a raised fist, a lowered shoulder) that shows which nearby enemy is actually starting a hit. No icons. Duration fits each move; it is first tested on 以亮 in Slice A.
  「預兆」即自然的蓄勢動作，讓玩家分辨誰真正要出手；不用圖示；時長按招式而定，先在 Slice A 以亮身上測試。
- Built directly in the Slice B story, no separate prototype. Claude defines when a token is taken and released (wind-up and recovery) in the Slice B acceptance criteria.
  直接在 Slice B 製作，不另做原型；名額何時佔用及釋放由 Claude 在驗收條件中定義。
- **Apply:** Slice B stories (step 6.1–6.3, Claude); story discussion T-07 points here.

---

## Art / 美術

### Q-11 Art direction / 美術方向
- Wanted style: 熱血物語 (Kunio-kun SP) grid pixel art, per `art/source/reference/characters/SP/style1.png` and `style2.png`. The visual target is approved only after Vincent reviews the pilot sheets.
  目標風格：熱血物語 SP 格狀像素風；試作圖經你審閱後才算批准視覺目標。
- Production art requests start after Slice A plays with placeholders.
  Slice A 以佔位圖可玩後才開始正式美術需求。
- Reference-to-cast mapping is delegated to Claude: proposed from the full set after the Phase 2 sheets.
  參考圖與角色的對應由 Claude 負責，待第二批圖完成後提出。
- Production method: frame-by-frame pixel sprite strips. Dimensions, facing, frame counts and playback speed stay **provisional** until one player fighter and 以亮 are checked at game scale; start with a short movement/attack/hurt sample before the full list. Every layout records an explicit ground anchor/offset, so wider attack frames (for example 96×64) do not shift the character. The state list covers all three fighters and the held-item/weapon states actually built.
  製作方法：逐格像素圖條。尺寸、方向、格數及速度暫定，先以一個主角及以亮在遊戲尺寸中檢查，並先做移動、攻擊、受擊小樣本；每種圖格記錄明確的地面錨點，避免較寬的攻擊格令角色移位；動作清單涵蓋三個角色及實際製作的持物／武器狀態。
- Real-person likeness: the people in the reference photos are Vincent's family and friends and have agreed; the characters are stylised cartoon/pixel designs, not portraits (Vincent, 2026-10-31).
  參考照片中的人物均為家人朋友並已同意；角色為卡通像素化設計，並非肖像。
- The empty `docs/concept_images/` folders were deleted on 2026-10-31.
  空的 `docs/concept_images/` 資料夾已於 2026-10-31 刪除。
- **Still open (Vincent):** review Codex's four pilot sheets; this gates the other 27.
- **Apply:** `docs/art/README.md` technical frame (640×360) at step 2.4; asset requests at step 5.3.

---

## Process / 流程

### Q-13 Housekeeping / 流程與整理
- Vincent makes all commits; Claude and Codex do not commit.
  由你自行提交；Claude 與 Codex 不提交。
- Codex regenerates the HTML reading copy whenever the Markdown story changes.
  故事 Markdown 有改動時，Codex 重建 HTML 閱讀版。
- `discuss/` holds open sessions; confirmed decisions are recorded here and applied to the brief, story or art documents.
  `discuss/` 放討論場次；確認後記錄於本檔，再套用到相關文件。
- Documents are bilingual: headings, decisions, handoffs and status carry the same meaning in English and Traditional Chinese; long technical notes may be English with a 中文摘要. Applied to documents as they are edited.
  文件雙語：標題、決議、交接及狀態中英同義；長段技術內容可用英文附中文摘要；於日後編輯時逐步套用。
- Stay at CCGS `minimal` until both slices are done; at step 7.3, raise CCGS rigor (Claude handles the transition and its required documents).
  兩個切片完成前維持 minimal；步驟 7.3 時提升 CCGS 嚴謹度，由 Claude 處理。
