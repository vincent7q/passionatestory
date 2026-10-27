# 02 — Stage 2: Campus at night 「校園」

[← Stage 1](01-stage1-city.md) · [index](README.md) · next: [Stage 3](03-stage3-mountain.md)

| | |
|---|---|
| Level id | `level_stage2_campus` |
| Clock | 17:35 → 18:00 (par 25 game-min) |
| The family's question | Is he the same person at school as he is at home? |
| Length | 6 screens of play + boss arena |
| Music | `music_stage2` (synth-pop with a school-bell motif) · boss `music_boss_mom` |
| Enemies | `enemy_basketball_player`, `enemy_cheerleader`, `enemy_club_recruiter`, `enemy_library_auntie` |
| Boss | `boss_lunch_lady` (**his mother**, disguised) |
| Breakables that bill | `prop_club_booth` (bill 40 each) |
| 勇 moments | Help-ups; **never hitting the Lunch Lady while she's down** (part of the whole-run +6) |
| Clue level | **Obvious to the player** (the Lunch Lady). The candidate notices nothing |

### Enemy sheet (stage 2)

| Id | Look | Behaviour | Reason to like him | Defeat line |
|---|---|---|---|---|
| `enemy_basketball_player` | Jersey no. 7, headband | Ranged: chest-pass volley (3 balls), then a dunk leap onto his position | "Saw him play 3-on-3 once. Decent." | 「好球。」 *Nice shot.* |
| `enemy_cheerleader` | Pom-poms; always spawns in **threes** | Group: 2 s to build a **human pyramid**, which then collapses along one lane. Interrupt it by hitting any one of them | "He always claps at games." | 「……加油!」 *Go, go!* (weakly) |
| `enemy_club_recruiter` | Lanyard, clipboard, stack of flyers | Grab: stuffs flyers into his hands. **Stun 1.5 s** (mash any button to break free faster) | "We need members like him." | *(fans himself with flyers)* 「考慮一下。」 *Think about it.* |
| `enemy_library_auntie` | Cardigan, reading glasses on a chain | **Support only, never attacks.** Every 8 s: 「噓——」, an aura that blocks his specials and mutes the music for 3 s | "He returns books on time." | *(whispers)* 「……謝謝。」 *…Thank you.* |

---

### S2-01 — Back gate
Type       cutscene (short) → gameplay
Clock      17:35
Location   section 1 · 1 screen
On screen  His own university after dark. The van cuts through the campus road and its
           tail-lights disappear past the sports field. Lights are still on everywhere: every club is
           still in.
Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_s2_01_01 | {name} | 我們學校?! | My school?! |

Becomes    `event_s2_01_back_gate`

### S2-02 — Sports field
Type       gameplay
Location   section 2 · 2 screens
Who        `enemy_basketball_player` ×3 · `enemy_cheerleader` ×3 (one pyramid)
Gameplay   Floodlit courts and a running track. Basketballs bounce across the lanes. The cheer
           pyramid collapses along the lane he's standing in unless he interrupts it.
Clues      The cheer squad's routine spells out a banner card that briefly reads **「加油 {name}」**
           *(Go {name})* before they collapse. He reads it as mockery.
Becomes    `event_s2_02_sports_field`

### S2-03 — Club street
Type       gameplay
Location   section 3 · 2 screens
On screen  A row of club booths under strings of lights: guitar club, anime club, board-game
           club, and a booth with a hand-lettered banner, 「家政社」 (home economics club).
Who        `enemy_club_recruiter` ×4 (2 waves) · `enemy_basketball_player` ×1
Gameplay   `prop_club_booth` ×4. Breaking one bills 40 coins (the club president hands over a
           receipt, very apologetically).
Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_s2_03_01 | 社團招生 | 來參加我們社團! | Join our club! |
| dlg_s2_03_02 | 社長 *(bill)* | 不好意思……這是收據。 | Sorry… here's the receipt. |

Becomes    `event_s2_03_club_street`

### S2-04 — The library
Type       gameplay
Location   section 4 · 1 screen
On screen  A silent reading room. Students at long tables, heads down. They are **bystanders:
           attacks pass through them and they never react**, except to turn a page.
Who        `enemy_library_auntie` ×1 (behind the desk) · `enemy_club_recruiter` ×2 · `enemy_cheerleader` ×3
Gameplay   The 「噓——」 aura covers the whole room. While it's active his specials are greyed out
           and **the music and footsteps go completely silent** (a comic silent-movie fight).
           Defeating the auntie ends the aura.
Audio      `music_stage2` drops out every 8 s for 3 s.
Becomes    `event_s2_04_library`

### S2-05 — The cafeteria
Type       cutscene
Clock      ~17:52
Location   section 5 · boss arena, 1 screen
On screen  The student cafeteria, closed for the night except for one lit counter. Behind it, a
           **lunch lady** in a white apron, sleeve covers, a **hairnet** and a **surgical mask**.
           She is stirring a pot. A **plastic slipper** sits on the counter beside her. She looks up
           at him for a long second. **It is his mother.** He has no idea.
Who        `boss_lunch_lady`
Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_s2_05_01 | 便當阿姨 | ……來了喔。 | …So you're here. |
| dlg_s2_05_02 | {name} | 阿姨,讓開,我在找人! | Ma'am, move, I'm looking for someone! |
| dlg_s2_05_03 | 便當阿姨 | *(picks up the slipper)* 先吃飯。 | Eat first. |

Camera     Arena locks. Zoom on the slipper as she picks it up.
Audio      `music_boss_mom` (a TV-drama brass sting, then a fast comic march).
Clues      Her voice. 「先吃飯」. The slipper. (The player knows. He doesn't.)
Becomes    `event_s2_05_lunch_lady_intro`

### S2-06 — Boss: the Lunch Lady (his mother)
Type       boss
Who        `boss_lunch_lady`
Gameplay

| Move | Phase | Effect |
|---|---|---|
| 拖鞋飛彈 Flying Slipper | 1, 2 | **Homing, unblockable**, curves to follow him. Dodge by jumping at the last moment. A *thwack* SFX; knockdown |
| 「外套穿好!」 *Zip your jacket!* | 1, 2 | Grab: zips his shirt/jacket to the chin. `status_too_warm`: −20% move speed for 6 s |
| 「吃飽沒?」 *Have you eaten?* | 1, 2 | Unblockable grab: **force-feeds him.** Restores 15% 力 but holds him for **2 s while the clock runs** |
| 「房間整理了沒?」 *Did you clean your room?* | 2 (< 60%) | A ranged question projectile; stun 1 s |
| **全名攻擊 The Full Name** | at 30%, then every 25 s | She draws a breath (1 s telegraph, the screen darkens), then **shouts his full name syllable by syllable.** Each syllable is a huge on-screen character and a shockwave ring (3 rings). Being caught by any ring is a knockdown |

- `{fullname}` per look: FELIX → 「陳・菲・利・克・斯!」, LUCIAN → 「陳・盧・西・安!」, HILMAN →
  「陳・希・爾・曼!」.
- **If he hits her while she is down:** she doesn't react except to look at him, silent, for 1.5 s
  (input locked, music ducks). `hit_downed` −3 and `flag_hit_mom = true`. It's the quietest moment
  in the game.

Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_s2_06_01 | 便當阿姨 | 外套穿好! | Zip your jacket! |
| dlg_s2_06_02 | 便當阿姨 | 吃飽沒? | Have you eaten? |
| dlg_s2_06_03 | 便當阿姨 | 房間整理了沒? | Did you clean your room? |
| dlg_s2_06_04 | 便當阿姨 | {fullname} | (his full name) |
| dlg_s2_06_05 | {name} *(after the full name)* | ……為什麼她知道我的全名?! | …How does she know my full name?! |
| dlg_s2_06_06 | {name} | ……學校的阿姨都這麼兇嗎?! | …Are all school lunch ladies this scary?! |

Camera     Locked. Screen shake on each Full Name syllable.
Audio      `sfx_slipper_whoosh`, `sfx_slipper_thwack`, `vo_full_name_*` per look.
Scoring    Help-up allowed (+2). `hit_downed` applies.
Clues      Everything she says. dlg_s2_06_05 is the closest he ever comes, and he still doesn't
           get it.
Becomes    `event_s2_06_lunch_lady_fight` · `boss_lunch_lady` · `ai_boss_lunch_lady` · skills
           `skill_mom_slipper`, `skill_mom_zip_jacket`, `skill_mom_force_feed`,
           `skill_mom_room_question`, `skill_mom_full_name` · status `status_too_warm`

### S2-07 — Outcome and exit
Type       cutscene → transition
Variants

| Case | What happens |
|---|---|
| **Helped up** | She stands, **straightens his collar** without a word, presses a **lunchbox** into his hands (his favourite: braised pork rice), and leaves through the kitchen door. `flag_lunchbox_taken`. Using the lunchbox restores 50% 力 |
| **Not helped (window expired)** | She gets up on her own, puts the lunchbox on the counter and leaves. He can still pick it up (E) |
| **Hit while down** | As above, but the lunchbox has no note |

Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_s2_07_01 | (note on the lunchbox) | 趁熱吃。 | Eat it while it's hot. |
| dlg_s2_07_02 | {name} | ……這阿姨人真好。 | …What a nice lady. |

Exit       Through the window he sees the van leave by the campus back gate, heading for the
           mountain road. At the gate is a row of shared bikes. **As he reaches them, one unlocks
           itself with a beep.** He takes it. Transition: a short side-scrolling bike ride at
           dusk (no combat, ~6 s) to the foot of a mountain.
Clues      The bike unlocks itself (someone did it remotely).
Becomes    `event_s2_07_lunch_lady_outcome` · item `item_lunchbox` · `event_s2_07_bike_ride` ·
           **setup: lunchbox note → G-01 notes, R-09**
