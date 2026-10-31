# Codex Task: SP Action-Pose and Background Style Test / 動作姿勢及背景風格測試

**For:** Codex (art production) · **Requested by:** Vincent · **Written by:** Claude · **Date:** 2026-10-31
**Skill:** `.agents/skills/create-game-assets/SKILL.md` (plus the workspace `imagegen` skill for generation calls)
**Output folder:** `art/source/reference/characters/SP/` (same git-ignored folder as the pilot)
**Parent handoff:** [`codex-sp-character-sheets.md`](codex-sp-character-sheets.md) · **Decisions used:** [`docs/confirmed.md`](../docs/confirmed.md) Q-05, Q-07, Q-11
**Status / 狀態:** Complete for review / 測試已完成，待審閱。
All 14 poses, two separate props, original depot background layers and native/×2/×3 game-scale mocks are ready.
Open [the local preview](../art/source/reference/characters/SP/preview.html), Action test section.
Pixel/export checks and desktop/mobile preview checks pass. Visual notes record the subtle rear-hand separation in two-handed poses.
Phase 2 (the other 27 sheets) waits for Vincent's review of the pilot **and** this test; background direction also awaits approval.
十四動作、兩道具、原創物流站背景及遊戲尺寸預覽均已完成，技術與瀏覽器檢查通過；雙手姿勢的後手較含蓄，已記錄於視覺筆記。其餘27張及背景方向待你決定。

中文摘要：Vincent 審閱試作圖後，同意先替 `vincent2` 做一張動作姿勢測試圖（跑、跳、拳、側踢、拾取、投擲、受擊、倒地等），在遊戲實際尺寸下檢查風格在動作中是否仍然清楚，再決定是否開始其餘 27 張。另外按 S1-02 物流站閘門生成一張 640×360 原創像素背景，用來在真實遊戲畫面中測試角色。兩者都是風格測試，不是正式動畫或遊戲素材。

## 1. Why this test / 目的

The four pilot sheets show each character's look and eight emotions, standing or walking. The game is a
beat-'em-up: the player characters spend most of their time punching, kicking, jumping and throwing.
Large heads, glasses and short limbs can read well in a still pose and poorly mid-kick.

This test answers one question before 27 more sheets are made: **does the pilot style still read clearly in
fighting poses at the real game scale?** If it does not (for example limbs too short to show a kick, or the
head hiding the arm), the style is adjusted in the pilot first, so Phase 2 inherits the fix.

This is a **style test**, not production art. It does not create animation cycles, runtime exports or
manifest entries. Production animation follows the rules in `docs/confirmed.md` Q-11 after Slice A plays
with placeholders.

## 2. Fixed inputs / 已確定條件

| Item | Value | Source |
|---|---|---|
| Character | `vincent2` only, matching its approved-for-review pilot sheet exactly (hair, glasses, mint shirt, teal trousers, palette) | Pilot |
| Game base resolution | **640×360**, integer-scaled ×2 (1280×720) and ×3 (1920×1080) | Q-05 |
| Character height | About 48 px standing, as in the pilot | Pilot |
| View | **Side view facing right only.** The game mirrors for left; gameplay never uses the front view | Q-11 |
| Player moves | 8-direction walk, jump, hand or leg attacks, pick up / carry / throw items, limited-use weapon, 絕招 | Q-07 |
| Style rules | Same as the parent handoff §2 and §5: 1-px warm dark outline, flat colours with one shadow tone, ≤ 16 colours, shared outline and skin ramp, binary alpha, no anti-aliasing | Parent §2, §5 |

## 3. Poses to draw / 要畫的姿勢

One key pose each (a single frame, not a cycle), side view facing right:

| # | Pose id | 中文 | What it must show |
|---|---|---|---|
| 1 | `ready` | 備戰 | Copy of the pilot's side `idle`, unchanged. It is the scale and identity reference for the row |
| 2 | `run` | 跑 | Full sprint, strong forward lean (may reuse the pilot's side `running`, cleaned to this layout) |
| 3 | `jump` | 跳 | Airborne, knees tucked, arms up for balance; feet about 10 px above the ground line |
| 4 | `punch` | 出拳 | Straight jab: front arm fully extended at head height, rear fist guarding, weight forward |
| 5 | `punch_finisher` | 重拳收招 | Combo finisher: big hook or uppercut, whole body rotated into it, clearly stronger than #4 |
| 6 | `side_kick` | 側踢 | Leg extended straight forward at hip height, body leaning back to balance; the kick must read as a leg, not an arm |
| 7 | `jump_kick` | 跳踢 | Airborne flying kick, one leg extended forward-down |
| 8 | `pick_up` | 拾取 | Crouched, both hands reaching down to the ground in front |
| 9 | `carry` | 舉起 | Holding a box over his head with both arms, standing |
| 10 | `throw` | 投擲 | Arms swung forward and down after release, body leaning forward; no item in hand |
| 11 | `weapon_swing` | 揮動武器 | Swinging a metal pipe forward with both hands, pipe at the end of the swing |
| 12 | `hurt` | 受擊 | Recoiling backwards: head snapped back, eyes squeezed, arms flung out |
| 13 | `knockdown` | 倒地 | Lying flat on his back on the ground line, limbs loose |
| 14 | `special` | 絕招 | One powerful 絕招 key pose (for example a charged two-fist strike or a spinning kick). Body and face only; **no** glow, lines, sparks or text. Effects are separate assets later |

Draw the box in #9 and the pipe in #11 as part of the character cell. Also deliver the two props on their own
(§4), since the game handles them as separate objects when they are on the ground or flying.

## 4. Layout and files / 版面與檔案

Attacks reach further than 64 px, so this sheet uses wider cells. Every grounded pose keeps the same ground
anchor, so switching poses never shifts the character.

| Property | Value |
|---|---|
| Cell size (native) | **96×64 px** |
| Sheet (native) | One row of 14 cells: **1344×64 px** |
| Ground anchor | **(32, 60)** in every cell: the standing feet sit on row 60, centred on x = 32. The extra width is in front of him (x 64–95) for punches, kicks, weapon and throw |
| Airborne poses (#3, #7) | Draw at the height he would be in the air; record each cell's feet offset from row 60 in `validation.json` |
| Knockdown (#13) | Body lies on row 60, extending forward from about x = 16; record its bounds |
| Margin | At least 1 transparent pixel to every cell edge |
| Props | `prop-box.png` and `prop-pipe.png`, each **32×32**, object resting on row 28, centred; ≤ 8 colours using the shared outline |

Files to add in `art/source/reference/characters/SP/`:

```
vincent2-action-test.png        native 1344×64
vincent2-action-test-x4.png     ×4 nearest-neighbour preview, 5376×256
prop-box.png, prop-pipe.png     native 32×32 props (+ -x4 previews)
bg-s1-gate-back.png             640×360 back layer (§5)
bg-s1-gate-floor.png            640×360 floor layer (§5)
bg-s1-gate-composite.png        640×360 combined, plus -x2 and -x3 previews
```

Update the existing files rather than creating new ones: add entries to `prompts.json`, `palette.json`
(confirm the action sheet uses the same 16-colour `vincent2` palette) and `validation.json`, and a short
section to `SP/README.md`. Keep raw generations in `_drafts/`.

Use the same grid pixel-art process as the parent handoff §5: generate drafts, reduce to the native grid with
nearest neighbour, quantise to the `vincent2` palette, snap alpha, clean up by hand or script.

## 5. Background test: S1-02 depot gate / 背景測試：S1-02 物流站閘門

Added at Vincent's request (2026-10-31). Generate one **original** background in the same style, for the
Slice A arena, so the characters are judged against a real game background instead of a crop of `style2.png`.
Like the character test, this is a **style test**, not a production background.

**Location (from `design/narrative/story-draft.md` S1-01, S1-02):** the back of a logistics depot behind a
shopping street, at the last gate. A lowered roll-up steel shutter or metal gate in the back wall (the exit
以亮 guards); loading-bay walls; stacked cargo crates and pallets, a hand trolley, traffic cones; painted floor
lines. Late afternoon or early evening, ordinary and slightly shabby, not menacing. No people in the background.

**Use the style, not the content:** follow `style2.png` for the level of detail, flat colour shading, outline
treatment and palette density of an SP-style street, but design the place yourself. Do not copy its buildings,
signs or layout. Any signage uses invented, readable Traditional Chinese (for example 「物流站」「卸貨區」「閘門開關」);
no real company names or logos.

**Game layout requirements (these matter more than detail):**

| Property | Value |
|---|---|
| Native size | **640×360 px**, true grid pixel art, same pixel rules as the characters (no anti-aliasing, gradients or smoothing) |
| Layers | Two separate PNGs: `bg-s1-gate-back.png` (back wall, gate, sky or ceiling; fully opaque) and `bg-s1-gate-floor.png` (the walkable floor, fully opaque). Also deliver a combined `bg-s1-gate-composite.png` |
| Walkable floor band | The floor where characters walk up and down (depth lanes) covers about the **lower 40%** of the screen, from about y = 210 to y = 355. Keep it flat, readable and uncluttered so fighters stand out; floor lines may suggest depth |
| Back wall | Upper part, about y = 0 to 210, with the gate centred or slightly right of centre |
| Props | Crates, pallets, trolley and cones are painted only at the **back edge** of the floor or against the wall. The breakable box and pipe that the player uses are the separate sprites from §4, not part of the background |
| Contrast | Background colours slightly lower in saturation and contrast than the characters, so fighters always read in front. No near-black areas behind where characters stand, because their outline is dark |
| Palette | At most **32 colours** for the whole background; record it in `palette.json` under a `backgrounds` key. Outline colour may reuse the shared dark outline |
| Width | One screen wide only (640). A scrolling stage strip is later production work |

Record the background's prompts in `prompts.json` and its checks in `validation.json` (§7).

## 6. Game-scale preview / 遊戲尺寸預覽

This is the most important part of the deliverable. Add an **"Action test"** section to `preview.html` with:

1. **A mock game frame at exactly 640×360 native pixels**, using the composite S1-02 background from §5.
   Place on it, standing on the floor band at different depths: several `vincent2` action poses spread
   across the frame, two or three `misc-depot-guard` side idles as opponents, and one box and pipe prop on the
   floor, so the scale and readability of a real fight are visible. Also show the same frame once with the
   `style2.png` street crop, for comparison.
2. Show that frame at **×2 and ×3** with nearest-neighbour scaling (`image-rendering: pixelated`), as it will
   look at 1280×720 and 1920×1080.
3. The 14 poses labelled with their ids and Chinese names at ×1, ×2 and ×4.

Do not use smoothing anywhere in the preview.

## 7. Checks (record in `validation.json`) / 檢查

- [ ] Native sheet exactly 1344×64; ×4 preview exactly 5376×256 and equal to the native sheet enlarged by nearest neighbour.
- [ ] 14 non-empty cells; no pixel touches a cell edge.
- [ ] Alpha only 0 and 255.
- [ ] Opaque colours ≤ 16 and identical to the `vincent2` pilot palette (plus box and pipe colours only where they appear in #9 and #11, recorded).
- [ ] Grounded poses: lowest opaque pixel on row 60, body centred near x = 32. Airborne and knockdown offsets recorded.
- [ ] Every cell faces right.
- [ ] Props: 32×32, binary alpha, ≤ 8 colours, shared outline.
- [ ] Background: each PNG exactly 640×360, fully opaque, ≤ 32 colours in total, no anti-aliasing; composite equals back + floor layers.
- [ ] SHA-256 of every native and preview file.

Visual checks (by eye at ×1 and ×2 in the mock frame; write honest notes, including failures):

- [ ] It is the same character as the pilot in every pose (hair, glasses, shirt and trouser colours).
- [ ] `punch`, `punch_finisher`, `side_kick` and `jump_kick` can be told apart at ×1 without labels.
- [ ] The extended arm or leg is clearly visible and not hidden by the head.
- [ ] `hurt` and `knockdown` read immediately as being hit.
- [ ] He is readable next to the guards at 640×360 and does not look too small or too large for a six-against-one fight.
- [ ] Background: the walkable floor band is clear; fighters stand out at every depth; the gate reads as the exit; it looks like the same game as `style2.png` without copying it; signage is original.
- [ ] If any of these fail, say what pilot proportion would fix it (for example "head 10% smaller", "limbs 2 px longer").

## 8. Stop and show Vincent / 完成後交 Vincent 審閱

When the test is done, **stop** and report to Vincent with the preview link and your visual notes. He decides
one of:

- **Approve** the pilot style as it is → Phase 2 of the parent handoff starts. Vincent also says whether the background direction is approved as the target for Slice A art.
- **Adjust** the pilot proportions first (based on §6 notes) → re-run the four pilot sheets and this test, then review again.

Do not start Phase 2, other characters' action poses, animation cycles, other stage backgrounds, scrolling
strips, runtime exports in `assets/`, or entries in `docs/art/asset-manifest.json` as part of this task.
