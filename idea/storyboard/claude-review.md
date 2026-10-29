# Claude's Review of《合格女婿》Story Draft / Claude 對《合格女婿》故事草稿的意見

**Reviewer / 審閱者:** Claude (Godot implementation owner / Godot 開發負責人)
**Date / 日期:** 2026-10-29
**Reviewed / 審閱對象:** `idea/storyboard/idea.md` — active draft only (lines 1–897); archived proposals only skimmed / 僅審閱現行稿（第 1–897 行），歷次提案僅略讀

**Status / 狀態:** Comments for the user's review. Nothing here changes the story, scope, or any project file. / 供你審閱的意見；本文件不改動故事、範圍或任何專案檔案。

[English](#english) · [繁體中文](#zh-hant)

---

<a id="english"></a>

# English

## 1. What works

- **"They passed — then what?" is a real idea.** The certificate whose back reads
  「試用期限：終身」 carries the whole story. Ending 3 is the strongest structural
  choice: the player becomes the 考官, and 沈雅芳 still controls his chair.
- **The foreshadowing is coherent.** The table in the review notes is accurate, and
  the recurring objects (the cup of water, the chair, the wrist chain, the new
  shirt) pay off across all three endings.
- **小雨 is a participant, not a victim.** This avoids "evil family, innocent
  girlfriend" and makes V-01 and V-03 land.
- **林建國 as a mirror is the emotional centre.** His 「不敢把話說完」 is shown
  through behaviour (the shoulder flinch, 「知道了」) rather than explained. Reusing
  that posture in ending 3 is excellent.
- **Each relative tests a different thing** (strength, looks, money, comparison,
  availability, chores), which maps cleanly onto distinct boss designs.

## 2. Story concerns

1. **Tone is undecided.** The brief promises an "exaggerated family comedy". The
   draft reads as a realistic drama about coercive control and money, with
   slapstick fights on top, and ending 1 is quite bleak. Choose one:
   - **Satire:** the mother and the 「合格顧問」 business are plainly absurd, so the
     dark theme lands without preaching.
   - **Drama:** then the cartoon brawling needs a justification.

   On review question 3, I would make 沈雅芳 *more* exaggerated, not less.
   Satire makes the point sharper.
2. **The rescue motive ends at stage 1.** He learns 小雨 is safe at S1-03, so the
   staged-kidnapping reveal at V-01 is mostly confirmation. Dramatic irony can carry
   that, but stages 2–6 then run on "I want an answer", a quieter motivation for an
   action game. The final fight also has no rescue at stake. Either give the fight a
   stronger in-scene stake, or accept the quieter motivation deliberately.
3. **Stages 2–5 repeat one beat:** unfair demand → articulate reply → fight →
   stamp → 「不甘心」. It reads well on the page but can feel mechanical in play.
   The three sisters already have distinct fighting identities (display decoys,
   feints, a commander who also fights). 二姑, 舅舅 and 家豪 need the same.
4. **Gender balance.** Six of the eight bosses are women, plus 小雨, and the one
   "normal" person (知夏) is also a woman. Men are present (家豪, 舅舅, 建國), so
   this is defensible. Check that it reads as "a controlling system", not "women
   exploit men".
5. **Small open question:** 二姑 and 舅舅 do not join the final fight. If that is
   deliberate, one line explaining their absence would stop it looking like an
   oversight.

## 3. Game-design concerns (the final fight)

- **It is a long fight:** phase 1, then a 60-second reinforcement window, then
  phase 2 — potentially 3–5 minutes. Decide on checkpoints: if the player dies in
  phase 2, do they restart the whole fight or only phase 2?
- **Six-on-one needs attack limiting.** The draft already asks to limit
  simultaneous hits. The usual technique is an attack-token system (only 1–2
  enemies attack at once; the rest circle). Plan for it from the start.
- **The fixed timeline is a good choice.** A schedule that pauses with the game and
  does not react to kills is simple to build and to test.
- **The risk is readability, not logic.** Up to six sprites, telegraphed attacks,
  and a boss returning mid-brawl need a clear visual language *before* art is
  commissioned.
- **Balance values are untested.** Reinforcement health, damage and the second bar
  stay open until a prototype exists. Nothing here claims they are balanced.

## 4. Suggested first slice

- **Slice A — S1-02, the 家豪 boss fight.** Matches the brief's "one encounter, one
  opponent". It proves movement, combat feel, the stamp-and-dialogue beat and the
  Godot setup cheaply.
- **Slice B — the S6 final-fight timeline.** This is the signature mechanic and
  the biggest unknown. Prototype it second, with colour-swapped placeholders.
- Do not build all six stages. The brief already says the story request does not
  authorise that.

This is a suggestion; scope remains the user's decision.

## 5. Housekeeping (should be fixed before calling cleanup complete)

Verified against the repository on 2026-10-29. Nothing has been changed.

1. `design/game-brief.md` and `docs/plan.md` point to `discuss/codex_idea.md` and
   `.html`, but `discuss/` is empty. The real files are
   `idea/storyboard/idea.md` and `idea.html`.
2. The original nine files moved to `idea/storyboard/archieve/` (spelling:
   *archieve*). `git status` shows them as deleted from `idea/storyboard/`.
   `idea/storyboard-source.json` and `idea/README.md` still record the old paths, so
   the checksum record no longer matches the tree.
3. The active draft now sits in the folder that `AGENTS.md`, `CLAUDE.md` and
   `design/CLAUDE.md` call historical-only, and the draft itself (line 891) says
   `idea/storyboard/` is kept unchanged. A new reader gets contradictory signals
   about what is authoritative.

**Suggested fix (about five small edits):** move the active draft to `design/`
(for example `design/story-draft.md`); update the paths in the brief and plan;
rename `archieve` to `archive`; update `storyboard-source.json` and
`idea/README.md`. These files are shared with Codex, so I will not edit them
without your instruction.

---

<a id="zh-hant"></a>

# 繁體中文

## 1. 做得好的地方

- **「他終於合格了，然後呢？」是真正的好點子。** 證書背面的「試用期限：終身」
  撐起整個故事。結局三是結構上最強的選擇：玩家自己變成考官，而沈雅芳仍握著他那張椅子。
- **伏筆前後一致。** 審閱筆記中的伏筆表準確，反覆出現的物件（水杯、椅子、手鏈、
  新襯衫）在三個結局中都有回收。
- **小雨是參與者，不是受害者。** 這避開了「惡家庭、無辜女友」的套路，也讓 V-01 與
  V-03 更有力。
- **林建國作為一面鏡子，是情感核心。** 他的「不敢把話說完」透過行為（縮肩、
  「知道了」）呈現，而不是用旁白解釋。結局三重用同一個低頭姿勢，非常出色。
- **每位親屬考驗的東西都不同**（武力、外貌、財力、比較、隨時在、家務），能自然對應
  各自不同的頭目設計。

## 2. 故事方面的疑慮

1. **基調尚未決定。** 企劃簡述承諾的是「誇張的家庭喜劇」，但稿件讀起來更像一齣寫
   控制與金錢的寫實劇，再疊上鬧劇式的打鬥；結局一也相當沉重。請二選一：
   - **諷刺喜劇：** 母親與「合格顧問」生意明顯荒謬，沉重的主題才能不說教地落地。
   - **寫實劇：** 那麼卡通式的打鬥就需要一個說得通的理由。

   Vincent: i prefer 諷刺寫實劇.

   對於審閱問題 3，我建議把沈雅芳寫得**更**誇張，而不是更收斂。諷刺的力道更強。
2. **「救人」的動機在第一關就結束。** 阿安在 S1-03 就知道小雨安全，所以 V-01 揭露
   假綁架時，更多是確認而非震撼。戲劇反諷可以撐住，但第二至六關就只靠「我要一個
   答案」推進，對動作遊戲來說動力較淡；最終戰也沒有「救人」的賭注。要不就為最終戰
   加上更強的場內賭注，要不就刻意接受這種較安靜的動機。
   Vincent: you rise a good question. i would like stage 3 to know it is  a test instead of 救人. im wondering what arrangement will be better. can you share your comment?

3. **第二至第五關重複同一個節奏：** 不合理要求 → 阿安條理回應 → 打鬥 → 蓋章 →
   「不甘心」。讀稿時很順，實際玩起來可能顯得機械。三姊妹已有各自的戰鬥個性
   （展示物誘餌、假動作、邊指揮邊出手）；二姑、舅舅、家豪也需要同樣的區分。
   Vincent: if 阿安 know from stage 3, 4-5 關 more make sense for 不合理要求. 阿安 has no need to 回應 so many times because it not make sense. so, i suggest 
   1-3: 阿安 have doubt and confirm it is not 救人 and confirmed/informed by her family in stage 3.
   4-5: 不合理要求,阿安 becomes more nad more unsatisfied. 

   please share your comments (claude/codex). i will create a topic in discuss folder for discussion between 3 of us.
   
4. **性別比例。** 八位頭目中有六位女性，再加上小雨；而唯一「正常」的人（知夏）
   也是女性。劇中也有男性角色（家豪、舅舅、建國），所以說得過去。但請確認讀者感受到
   的是「一套控制的體系」，而不是「女人壓榨男人」。
   Vincent:  it is logical because final boss told player that families is leading by woman instead of man.  沈雅芳 is the decision maker.

5. **一個小問題：** 二姑與舅舅沒有加入最終戰。如果是刻意安排，補一句交代他們
   缺席的原因，就不會被看成疏漏。
   Vincent: 二姑與舅舅 is relative only. they may not 100% listen to 沈雅芳. 沈雅芳 is the decision maker in her family. all kids and husband need to obey her without any question/doubt.

## 3. 遊戲設計方面的疑慮（最終戰）

- **這是一場很長的戰鬥：** 第一階段，接著 60 秒援軍窗口，再接第二階段，可能長達
  3–5 分鐘。需要決定檢查點：玩家若在第二階段倒下，是整場重來，還是只重打第二階段？
  Vincent: i insist to have 一階段. but, i agree your point, we can redunce 一階段 blood level to reduce timing on 一階段. also, can let player feel 1st boss is very easy to overcome.

- **六打一需要限制同時攻擊。** 稿件已要求限制同時命中。常見做法是「攻擊權杖」系統
  （同一時間只讓 1–2 名敵人進攻，其餘繞圈等待），建議一開始就納入設計。
- Vincent: i agree, 同一時間只讓 1–3 名敵人active進攻 player and  其餘繞圈等待 (but, if player move to  其餘 enemy, enemy still will attack them). we can design nearby 1-3 enemy will attack player. 

**固定時間表是好選擇。** 隨遊戲暫停、不因擊倒人數改變的時程，容易實作，也容易測試。
- **風險在可讀性，不在邏輯。** 最多六個角色同場、攻擊預告、頭目中途返場，都需要在
  **委託美術之前**先有清楚的視覺語言。
- **平衡數值尚未驗證。** 援軍血量、傷害與第二條血量，在有原型之前都維持待定。
  本文件沒有任何「已平衡」的主張。

## 4. 建議的第一個切片

- **切片 A — S1-02，家豪頭目戰。** 符合企劃簡述的「一場遭遇、一名對手」，能以低成本
  驗證移動、戰鬥手感、蓋章加對白的節奏，以及 Godot 的基礎設定。
- **切片 B — 第六關最終戰時程。** 這是招牌機制，也是最大的未知數。建議第二個做，
  用換色的暫代角色即可。
- 不要一次做完六關；企劃簡述已說明，這份故事需求並不授權整套製作。

Vincent: agree

以上只是建議，範圍仍由你決定。

## 5. 檔案整理（建議在宣告「清理完成」之前處理）

已於 2026-10-29 對照專案實際內容確認，目前尚未改動任何檔案。

1. `design/game-brief.md` 與 `docs/plan.md` 指向 `discuss/codex_idea.md` 與
   `.html`，但 `discuss/` 是空的。實際檔案是 `idea/storyboard/idea.md` 與
   `idea.html`。
2. 原本的九個檔案已移到 `idea/storyboard/archieve/`（拼字為 *archieve*）。
   `git status` 顯示它們已從 `idea/storyboard/` 刪除。`idea/storyboard-source.json`
   與 `idea/README.md` 仍記錄舊路徑，所以校驗碼紀錄已與實際目錄不符。
3. 現行稿放進了 `AGENTS.md`、`CLAUDE.md`、`design/CLAUDE.md` 都稱為「僅供歷史參考」的
   資料夾；而稿件自己（第 891 行）又寫著 `idea/storyboard/` 保持原樣。新讀者會收到
   互相矛盾的訊號，不知道哪一份才是正式依據。

**建議修正（約五處小改動）：** 把現行稿移到 `design/`（例如 `design/story-draft.md`）；
更新企劃簡述與計畫中的路徑；把 `archieve` 改為 `archive`；更新
`storyboard-source.json` 與 `idea/README.md`。這些檔案與 Codex 共用，在你下指示之前，
我不會修改。
