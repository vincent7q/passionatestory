# Codex Task: 熱血物語-Style Character Sheets

**For:** Codex (art production) · **Requested by:** Vincent · **Written by:** Claude · **Date:** 2026-10-31
**Skill:** `.agents/skills/create-game-assets/SKILL.md` (plus the workspace `imagegen` skill for generation calls)
**Output folder:** `art/source/reference/characters/SP/`
**Status:** Ready for Codex. This file is the whole handoff. Do Part A and Part B together:
start with the shared pilot (§7, Phase 1) and wait for Vincent's approval before the full batch.

| Part | What | Count |
|---|---|---|
| A | Characters designed from Vincent's reference photos | 21 |
| B | Original story-role characters proposed from the storyboard, for Vincent's review | 10 |
| | **Total sheets** | **31** |

## 1. Style decision (Vincent, 2026-10-31)

Vincent has chosen the **熱血物語 (Kunio-kun) SP style** as the style he wants for the game:
chibi grid pixel-art fighters like those in the two style targets below. This answers
Q-11 question 1 in [`open-questions.md`](open-questions.md#q-11-art-direction-and-reference-images--美術方向與參考圖).
Vincent approves the visual target after seeing the pilot sheets (§7). Until then the style is chosen but no
sheet is accepted. The final runtime resolution and sprite size are still set with Q-05 and the
technical frame in `docs/art/README.md`. The sizes in §5 are a working size for this exploration and do not lock them.

The previous smooth-cartoon set in `characters/full_body/` is **superseded** as a style direction.
Do not use it as a style reference.

## 2. Style targets (style only)

| File | Size | Use it for |
|---|---|---|
| `SP/style1.png` | 911×209 | Lineup of about 12 fighters: proportions, fists-up stance, outline weight, face simplification, palette density |
| `SP/style2.png` | 1280×720 | Same character style in a scene (SP remake). Use the **characters only**; ignore the HD background, blur and lighting |

What the style is, in concrete terms:

- **Proportions:** large, squarish head (about 40% of body height, roughly 2.5 heads tall); short
  torso; short, thick limbs; wide planted stance; small blocky feet.
- **Face:** small dot or short-line eyes, strong angled brows that carry the expression, a tiny
  one- to three-pixel mouth, no nose or a one-pixel nose. Square jaw for men; rounder for
  women and children.
- **Outline:** 1-pixel dark outline around the whole silhouette (near-black, warm brown-black), with
  internal lines only where needed (arm against torso, hair against face).
- **Shading:** flat colours with one shadow tone per material, light from top-left. No gradients,
  no dithering noise, no anti-aliasing.
- **Colour:** strong, saturated clothing colours so every character reads at a glance; consistent
  warm skin ramp across the cast.
- **Attitude:** default stance is fists up, chin down, ready to fight.

**Originality:** use the style, not the content. Do not trace or copy sprites from the style targets, and do not
reproduce Kunio, Riki or any other existing character's design, outfit colours, logos or names.

## 3. Part A: characters from reference photos (21)

Turn each photo into one **original game character**. The photos are **references for character
design**, not portraits to reproduce. Keep what makes each person a distinct character at sprite
scale, then stylise strongly:

- **Keep:** hairstyle and hair colour, glasses, apparent age and gender, build (slim, stocky, tall,
  short), face shape as far as it survives at sprite scale, the general feel of the clothing.
- **Do not aim for:** a photographic likeness or recognisable facial detail. The style itself
  simplifies faces to a few pixels; do not add detail to push likeness.
- Where a photo shows only head and shoulders, invent a simple everyday outfit that suits the
  person's age (shirt or T-shirt, trousers or skirt, plain shoes) with one strong, readable main colour.

These characters are not yet mapped to the story cast (Q-11 question 2). Name outputs by source photo only.

**Sources (all 21 to be converted)**, in `art/source/reference/characters/`:

```
aa13  aa15  aa16  edward  ernest  fung18  girl1  girl2  girl3  ken1  kid
leong16  leong18  maggie  qq  rong  sei  so  unknown1  unknown2  vincent2
```

Most are small headshots (about 90–600 px); `girl1` (1536×1024) shows a dress and sandals, so keep those.

**Do not use as sources:**

- `felix.png`, `hilman.png`, `lucian.png`, `rain.png`, `vincent.png` are 1024×1024 cartoon avatars,
  not photos. (`vincent2.png` is the photo of Vincent.) Check this before starting; if any of the
  five is actually a photo, stop and ask Vincent.
- `full_body/`: superseded smooth-cartoon style (see §1).

## 4. Part B: original story-role characters (10, proposals for review)

The named family cast (陳以安, 林小雨, the eight family bosses, 許知夏) will be chosen from the Part A sheets
later, so **do not design the named cast here**. Part B fills the **unnamed roles the storyboard needs** around them:
enemies the player fights, recurring helpers and background people. Design each one from the brief below and the scene it
comes from in `design/narrative/story-draft.md`. No photo is used.

Story constraints that apply to every Part B design:

- The story is a **satirical-realism family comedy**: absurd demands in an everyday voice. Fights are exaggerated
  slapstick; nobody dies. Enemies are **hired adult performers or family staff**, not criminals, so no weapons,
  gang tattoos, blood or menacing masks.
- **Ordinary people on the street are never enemies.** Non-combat characters must not look like fighters at
  first glance; give them a relaxed, non-threatening idle stance instead of fists up (see §5, pose `idle`).
- Each design must read clearly as **different from every Part A character** and from the other Part B ones.
- Enemy roles will appear many times on screen, so build their palettes for **colour-swap variants**: put the
  main clothing colour on its own 2–3-colour ramp so Claude can recolour copies in Godot. Note the swap ramp in `palette.json`.
- These are **design proposals**, not story canon. Vincent reviews them; names and roles may change.

| # | File slug | Role (Chinese) | Story scenes | Game use | Design brief |
|---|---|---|---|---|---|
| 1 | `misc-van-crew` | 黑衣接人組員 | P-02, S1-01, E3-03 | Enemy (prologue, stage 1); returns in ending 3 | Dark suit or dark work jacket, earpiece, neat short hair, sunglasses pushed up. Looks like event security playing "kidnapper": stiff and professional, a little theatrical |
| 2 | `misc-depot-guard` | 物流站制服保全 | S1-01, S1-02 | Basic enemy, stage 1 (家豪's team) | Security uniform and cap, reflective vest, clipboard or name list in a pocket. Sturdy, slightly bored; the "Is this part done yet?" guard |
| 3 | `misc-porter` | 搬運人員 | S1-01, S3-02 | Heavy enemy, stages 1 and 3 | Big, broad warehouse worker: work gloves, apron or overalls, towel on the neck, safety boots. Wider silhouette than the guard; pushes trolleys and crates |
| 4 | `misc-receptionist` | 林家活動接待人員 | S2-01, S2-03, S2-04, S4 | Recurring non-combat NPC who hands out the next address | Event staff blazer, lanyard badge, tablet or clipboard, tidy bun or short hair. Polite fixed smile; the face of the 「合格顧問」 operation |
| 5 | `misc-stylist-staff` | 形象考場活動人員 | S2-02, S2-03 | Enemy, stage 2 (二姑's team) | Fashion assistant in black, measuring tape round the neck, a tall height ruler or garment-rack prop. Fussy, judging posture |
| 6 | `misc-depot-worker` | 工場工人 | S3-02 | Friendly NPC who helps fix the machine; never an enemy | Ordinary mechanic in a worn work shirt, cap, tool belt. Warm and tired, shows that normal hard-working people are not the opponents |
| 7 | `misc-banquet-staff` | 會所宴會服務人員 | S4-01…S4-03, S6 | Enemy and set-dressing, stages 4 and 6 | Waiter or waitress in a vest and bow tie, holding a tray or folding chair. Busy, fast, rushed by the sisters' orders |
| 8 | `misc-guest` | 林家賓客／親戚 | S5-04, S6-01…S6-03 | Background crowd, non-combat; watches the finale | Middle-aged relative in party clothes (qipao-style dress or a jacket with a loud tie), holding a phone to film or a glass. Gossiping, judging look |
| 9 | `misc-colleague` | 主角同事 | P-01 | Prologue NPC at the repair workshop | 阿安's workmate: work overalls tied at the waist, T-shirt, grease mark on a cheek, easy grin. Friendly and teasing |
| 10 | `misc-next-candidate` | 下一位候選人 | E3-03 | Ending 3 NPC: the next young man to be tested | Nervous young man in a brand-new shirt that is a bit stiff, gift box in hand, work marks on the cuffs. Deliberately echoes the protagonist's prologue look without copying him |

## 5. Sheet specification (Parts A and B)

### Sheet layout (per character)

One sheet per character: **8 columns (poses) × 2 rows (views)**.

| Row | View |
|---|---|
| 1 | **Front**: facing the camera, with the slight three-quarter turn seen in `style1.png` |
| 2 | **Side**: profile facing **right** (the game mirrors it for left) |

| Column | Pose | What it must show |
|---|---|---|
| 1 | `idle` | Fists-up ready stance, the style's default. Non-combat Part B roles (4, 6, 8, 9, 10) use a relaxed standing idle with their role prop instead |
| 2 | `walk` | Mid-stride key frame: one leg forward, arms swinging, upright |
| 3 | `angry` | Brows sharply down, gritted teeth or shouting mouth, fists clenched, shoulders raised |
| 4 | `in_love` | Dreamy half-closed eyes or blush pixels, hands together near chest or cheek, slight lean, soft smile |
| 5 | `happy` | Big open smile, eyes closed into arcs, arm raised or fist pump |
| 6 | `running` | Full sprint key frame: strong forward lean, long stride, arms pumping, both feet nearly off the ground |
| 7 | `greedy` | Sly narrow eyes, wide grin, hands rubbing together or grabbing toward the viewer |
| 8 | `sadness` | Head down, drooping shoulders, arms hanging, downturned mouth, optional single tear pixel |

Emotions are carried by **body and face only**. Do not draw floating icons (hearts, anger marks,
sweat drops, coins, text) in the cells. If the game uses emotes, they will be separate overlay assets.
Only `walk` and `running` show motion, and each is a single key frame. Full animation cycles are later production work.
Part B role props (clipboard, tray, ruler, gift box) may be held where they fit the pose; keep them inside the cell.

### Grid and size

| Property | Value |
|---|---|
| Cell size (native) | 64×64 px |
| Sheet size (native) | 512×128 px (8×64 by 2×64) |
| Character height | about 48 px for an adult; children about 40 px; tall or large adults (e.g. `misc-porter`) up to 54 px. Keep relative heights consistent across all 31 |
| Baseline / pivot | Feet rest on **row 60** of each cell; horizontally centred on **x = 32**. Same baseline in every cell and every sheet |
| Margin | At least 1 transparent pixel between the character and every cell edge |
| Alpha | Binary only: every pixel alpha 0 or 255. Transparent background |
| Palette | At most **16 colours per character** including outline and skin. Shared outline colour and skin ramp across all 31 characters |
| Pixel rules | One colour per grid pixel; no anti-aliasing, blur, gradients, half-pixels or mixed pixel sizes |
| Preview copy | Exact ×4 nearest-neighbour enlargement of the native sheet (2048×512). Never edit the preview separately |

### Grid pixel-art production

Image generators do not output true grid pixel art. Treat each generation as a **draft** and enforce the
grid deterministically (see the skill's "True pixel art" path):

1. Generate the draft sheet (or per-view drafts) using the style targets plus the photo (Part A) or the
   role brief (Part B) as inputs.
2. Reduce to the native 64×64-per-cell grid with nearest-neighbour or manual cleanup. Do not use smooth resampling.
3. Quantise to the character palette (≤ 16 colours); snap alpha to 0/255.
4. Clean up by hand or script: stray pixels, broken outlines, uneven eyes, inconsistent cell alignment,
   feet off the baseline.
5. Export native sheet, then produce the ×4 preview from it.

Keep drafts so the work can be traced, but deliver only the cleaned native sheet and its preview as results.

## 6. Files to deliver

All under `art/source/reference/characters/SP/` (leave `style1.png` and `style2.png` untouched):

```
SP/
  README.md                     what this set is, style decision, how it was made, open points
  <name>-sheet.png              native 512×128 sheet
  <name>-sheet-x4.png           ×4 nearest-neighbour preview, 2048×512
  palette.json                  shared outline/skin colours + each character's palette (hex);
                                Part B enemies also list their swap ramp
  prompts.json                  per character: part, source photo or role brief, style inputs,
                                prompts, tool, edit steps
  validation.json               per sheet: checks in §8 with results
  preview.html                  contact sheet of all ×4 sheets in two groups (Part A, Part B);
                                background toggle (light, dark, checker, and a crop of style2.png's
                                street); pose/view label grid; Part B cards show role, scenes and game use
  _drafts/                      raw generations and intermediate files
```

`<name>` is the photo basename for Part A (e.g. `vincent2-sheet.png`) and the slug from §4 for
Part B (e.g. `misc-depot-guard-sheet.png`). Then add two rows to the reference log in
`art/source/reference/README.md`: one for Part A, one for Part B.

Everything under `art/source/reference/characters/` is git-ignored (real-person photos), so these
files stay on this computer only. Mention this in `SP/README.md`. Do not add these sheets to
`docs/art/asset-manifest.json`: they are style and character-design references, not runtime assets.

## 7. Workflow

**Phase 1: Shared pilot (4 sheets).** Three Part A photos chosen for variety (an adult man, an adult woman,
and a child or older person; for example `vincent2`, `girl1`, `kid`, adjust after viewing) plus one Part B
enemy (`misc-depot-guard`). Produce their full sheets, `palette.json`, `validation.json` and
`preview.html`. **Stop and show Vincent.** He approves or gives changes on proportions, face, outline, palette
and the eight emotions. Repeat until approved.

**Phase 2: Remaining 27 (18 Part A + 9 Part B).** Use the approved pilot sheets as the locked style reference
(alongside `style1.png`) in every generation. Work in batches of about 5–6, mixing Part A and Part B, and check
each batch against the pilot contact sheet for drift in head size, outline colour, skin ramp and baseline before
continuing.

**Phase 3: Wrap-up.** Rebuild `preview.html` with all 31, run the §8 checks on every sheet, finish
`SP/README.md` and the reference-log rows, and report to Vincent. For Part B, list any brief you changed
and why, so he can review the roles and the designs together.

## 8. Checks (record in `validation.json`)

For every sheet:

- [ ] Native sheet is exactly 512×128; preview is exactly 2048×512 and equals the native sheet enlarged ×4 by nearest neighbour.
- [ ] All 16 cells are non-empty; no character pixel touches a cell edge.
- [ ] Alpha values are only 0 and 255.
- [ ] Opaque colour count ≤ 16; outline colour and skin ramp match `palette.json`'s shared entries.
- [ ] Lowest opaque pixel of every cell is on row 60; horizontal centre within ±3 px of x = 32 (idle, angry, sadness, in_love, greedy); walk and running may shift for stride.
- [ ] Side row faces right in all eight cells.
- [ ] Character height within the §5 range, consistent between front and side rows.
- [ ] SHA-256 of native and preview files.

Visual checks (by eye on the contact sheet, note any exceptions in `validation.json`):

- [ ] All 31 characters are distinguishable from each other by silhouette and colour at native size.
- [ ] Each of the eight emotions is readable at native size without labels.
- [ ] Front and side rows clearly show the same character (hair, glasses, outfit colours, props).
- [ ] Looks at home next to the characters in `style1.png` at the same scale.
- [ ] Part B: enemy roles read as fighters; non-combat roles (4, 6, 8, 9, 10) do not.
- [ ] Part B: each enemy's swap ramp recolours cleanly (test one alternative colour per enemy in the preview).

## 9. Open points (do not block this task)

- **Real-person likeness (Q-11 question 3):** the Part A characters are stylised designs, not portraits; whether
  people shown agree before any public release is still Vincent's decision.
- **Cast mapping (Q-11 question 2):** which Part A sheet becomes 陳以安, 林小雨, 沈雅芳 and the others is decided
  after this set exists.
- **Part B roles:** proposals only. Vincent decides which roles to keep, rename or drop; the story draft is not changed by this task.
- **Runtime frame (Q-05):** final resolution, sprite height, attack poses and animation frame counts
  are decided with Claude during engine setup and Slice A. These sheets set the style and character
  designs, which the runtime assets will follow.
