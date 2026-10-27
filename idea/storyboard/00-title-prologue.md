# 00 — Title, look select, prologue

[← index](README.md) · next: [Stage 1](01-stage1-city.md)

Clock 16:30 → 17:10. All cutscene except P-05, which hands over control.
Level id: `level_prologue` (two small sets: the candidate's home, a street near campus).

---

### T-01 — Title
Type       cutscene (loop) + menu
On screen  A quiet street near campus at dusk, in pixel art. Streetlights flicker on. A black
           van idles at the far end of the street with its headlights off. The title slams in:
           **熱血物語:見家長** / *Meeting the Parents*.
Gameplay   Menu: 開始 Start · 結局 Endings (gallery, shows `endings_seen`) · 設定 Settings.
           Once `unlock_1994` is set: 一九九四 (bonus stage X).
           **No scoring page, no "how to play" page. Nothing explains the clock.**
Audio      `music_title`: guitar riff, 80s beat-'em-up energy.
Clues      The van at the end of the street (only on replay).
Becomes    `event_t_01_title` · `scene_title`

### C-01 — Choose a look
Type       menu
On screen  Three portraits side by side with stat bars (力 / 氣 / speed). On replay, each portrait
           shows its last **total score**, with no breakdown.
Who        `character_felix` · `character_lucian` · `character_hilman`
Gameplay   Pick one. Sets `look`. It is **one candidate**, so the story, parents and dialogue are
           the same for all three; only the name, face and moves change.

| Look | Style | 力 | 氣 | Specials (from PRD §3) |
|---|---|---|---|---|
| FELIX 菲利克斯 | Balanced | 100 | 80 | 連環拳 Rapid Punch · 旋風腿 Tornado Kick · 熱血 Burning Spirit |
| LUCIAN 盧西安 | Speed | 80 | 100 | Dash Strike · Aerial Barrage · Shadow Clone |
| HILMAN 希爾曼 | Power | 140 | 60 | Power Slam · Earthquake Punch · Berserker |

Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_c_01_01 | UI | 選擇你的樣子 | Choose your look |

Becomes    `event_c_01_select` · `scene_select`

---

### P-01 — At home
Type       cutscene
Clock      16:30 (shown on a wall clock; the HUD is not up yet)
Location   `level_prologue` · candidate's home · living room, 1 screen
On screen  A small, warm apartment living room. **Mom** is ironing a pale blue shirt he has never
           seen. **Dad** sits behind a newspaper. On a shelf behind the sofa is a small, dusty
           trophy. The candidate comes out of his room in a T-shirt, bag over his shoulder.
Who        candidate · `npc_mom_home` (his mother, everyday clothes) · `npc_dad_home` (his
           father, everyday clothes)
Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_p_01_01 | 媽媽 | 今天穿這件。 | Wear this one today. |
| dlg_p_01_02 | {name} | 為什麼? | Why? |
| dlg_p_01_03 | 媽媽 | 穿就對了。 | Just wear it. |
| dlg_p_01_04 | 爸爸 | *(lowers the paper, which he never does)* 今天要見小雨? | Seeing 小雨 today? |
| dlg_p_01_05 | {name} | 嗯。 | Yeah. |
| dlg_p_01_06 | 爸爸 | ……加油。 | …Good luck. |

Camera     Wide on the room. A slow push past the shelf on the way out, so the **trophy** reads
           for one second: 「1994 · 第二名」 (second place). Then a close-up of Dad's hand on
           the newspaper: **his knuckles are taped.**
Audio      Quiet room tone. A rice cooker clicks off.
Clues      The shirt; 「加油」; the trophy; taped knuckles. All of them read only on replay.
Becomes    `event_p_01_home` · props `prop_trophy_1994`, `prop_ironing_board`

### P-02 — After class
Type       cutscene
Clock      17:00
Location   `level_prologue` · street near campus · 2 screens (scrolling walk)
On screen  Dusk. He walks 小雨 home in the blue shirt. She is quieter than usual. She notices the
           shirt and almost smiles.
Who        candidate · `npc_cloris`
Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_p_02_01 | 小雨 | 新衣服? | New shirt? |
| dlg_p_02_02 | {name} | 我媽硬要我穿的。 | My mom made me wear it. |
| dlg_p_02_03 | 小雨 | ……嗯。很好看。 | …Mm. It looks good. |
| dlg_p_02_04 | 小雨 | 如果有一天我被抓走了,你會來找我嗎? | If I got taken one day, would you come find me? |
| dlg_p_02_05 | {name} | 誰會抓你啦。 | Who'd want to take you? |

Camera     Two-shot while walking. Hold on 小雨 after dlg_p_02_05: **she doesn't laugh.**
Audio      `music_prologue_soft` (solo guitar).
Clues      She noticed the shirt (she knows his mother chose it).
Becomes    `event_p_02_after_class` · **setup: "would you come find me" → R-02**

### P-03 — The van
Type       cutscene
Clock      17:04
On screen  A black van brakes hard beside them. The side door slides open. Three men in black
           suits and sunglasses step out. One of them **holds the door open for her** (one frame).
           Two take her by the arms. **She doesn't scream.** She looks straight at him as the door
           closes. Through the windscreen: the driver, in a **cap and sunglasses**, a woman's
           silhouette. The candidate sees only "the driver".
Who        `enemy_men_in_black` ×3 · `boss_driver` (silhouette, uncredited) · `npc_cloris`
Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_p_03_01 | {name} | 小雨!! | 小雨!! |
| dlg_p_03_02 | 小雨 | *(says nothing; looks at him)* | |

Camera     Fast cuts and a whip pan, beat-'em-up style. Freeze-frame on her look.
Audio      Music cuts dead. Van door slam. Tyres.
Clues      Door held open; she doesn't scream; the driver is a woman in a cap.
Becomes    `event_p_03_van` · **setup: the driver → S4-04, R-06**

### P-04 — Knocked flat
Type       cutscene
On screen  He charges the nearest man. The man sidesteps, catches his arm, and **lowers him to the
           pavement almost gently**, a hand behind his head so it doesn't hit. His **phone flies
           out of his pocket and the screen shatters.** The man steps over him.
Who        candidate · `enemy_men_in_black` (the leader)
Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_p_04_01 | 黑衣人 | *(muttered)* ……不好意思。 | …Sorry about this. |

Camera     Low angle from the pavement. Close-up of the shattered phone.
Audio      Glass crack SFX `sfx_phone_shatter`.
Scoring    —
Clues      「不好意思」; the careful takedown.
Becomes    `event_p_04_knocked_flat` · **setup: broken phone → he can call no one; E0-06, E1
           (repaired phone)**

### P-05 — The hair clip
Type       cutscene → gameplay handoff
Clock      17:08
On screen  The van is gone and the street is empty. On the ground: **her hair clip** (a small
           white rabbit). He picks it up, closes his fist around it and looks down the road. He
           runs. **The HUD slides in** (力, 氣, 錢 at 0, the clock reads 17:10) and Stage 1
           starts with no loading screen.
Who        candidate
Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_p_05_01 | {name} | ……等我。 | …Wait for me. |

Camera     Close on the clip in his hand, then a pull-out as he sprints off frame right.
Audio      `music_stage1` kicks in on the first step.
Scoring    The clock starts: `clock = 17:10`.
Becomes    `event_p_05_hair_clip` · item `item_hair_clip` (key item, not usable) · **setup: hair clip →
           E1 「我故意掉的。」, E0-05**
