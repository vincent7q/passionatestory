# 04 — Stage 4: The garage 「司機」 *(The Driver)*

[← Stage 3](03-stage3-mountain.md) · [index](README.md) · next: [Stage 5](05-stage5-estate.md)

| | |
|---|---|
| Level id | `level_stage4_garage` |
| Clock | 18:25 → 18:40 (par 15 game-min) |
| The family's questions | Can he give her a future? **Given the choice, money or her?** |
| Length | 4 screens of play + boss arena + the ramp |
| Music | `music_stage4` (slick bass, car-alarm stabs) · boss `music_boss_driver` (spy-thriller surf guitar) · choice `music_choice` (a single held note and a heartbeat) |
| Enemies | `enemy_valet`, `enemy_mechanic`, `enemy_chauffeur`, elite `enemy_men_in_black` ×3 |
| Boss | `boss_driver` (林媽媽) |
| Breakables | **None.** Luxury cars cannot break; hitting one sets off its alarm (no bill) |
| 勇 moments | Help-ups · **walking past the suitcase (+8)** |
| Clue level | **Very absurd** |

### Enemy sheet (stage 4)

| Id | Look | Behaviour | Reason to like him | Defeat line |
|---|---|---|---|---|
| `enemy_valet` | Red waistcoat, a huge key ring | Fast melee: key-ring whip (mid range) | "He'd never scratch a car." | 「您的車鑰匙。」 *Your keys, sir.* |
| `enemy_mechanic` | Overalls with **林**, wrench | Slow heavy: wrench overhead, a ground slam that hits two lanes | "Good hands." | 「保養好了。」 *Serviced and ready.* |
| `enemy_chauffeur` | Grey uniform, peaked cap, umbrella | Defensive: umbrella opens as a shield, then a poke | "Opens doors for ladies, I hear." | 「請慢走。」 *Mind your step.* |
| `enemy_men_in_black` (elite) | The three from the van. Suits, sunglasses | **Trio formation.** One grabs, one strikes, one blocks the escape lane. They rotate roles | "He came. They always hope they come." | 「……不好意思。」 *…Sorry.* |

---

### S4-01 — Ramp down
Type       gameplay
Clock      18:25
Location   section 1 · 1 screen (descending)
On screen  A curving ramp lit in white LED strips, a sign **「B1 · 林」**, the hum of ventilation.
Who        `enemy_valet` ×3
Becomes    `event_s4_01_ramp_down`

### S4-02 — Showroom row
Type       gameplay
Location   section 2 · 2 screens
On screen  An underground garage lit like a car showroom: supercars, a vintage Rolls, a
           motorbike on a turntable, **every number plate starting with 林**. Polished floor that
           reflects everything.
Who        `enemy_mechanic` ×2 · `enemy_chauffeur` ×2 · `enemy_valet` ×2
Gameplay   Cars are solid scenery. Hitting one sets off its alarm (`sfx_car_alarm`, a comic chorus
           if several go off). No damage, no bill.
Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_s4_02_01 | {name} | 這些……都是贓車吧! | These… must all be stolen! |

Clues      林 plates; the scale of it. He concludes they're a car-theft ring.
Becomes    `event_s4_02_showroom`

### S4-03 — The three men in black
Type       gameplay (arena)
Location   section 3 · 1 screen, locked
On screen  The three men from the prologue step out from behind a pillar in formation. Same suits,
           same sunglasses.
Who        `enemy_men_in_black` ×3
Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_s4_03_01 | {name} | 又是你們! | You again! |
| dlg_s4_03_02 | 黑衣人 | 又見面了。……不好意思。 | We meet again. …Sorry about this. |

Gameplay   An elite fight. Defeated, they sit in a neat row. Each can be helped up (+2 each).
Becomes    `event_s4_03_men_in_black`

### S4-04 — The Driver
Type       cutscene
Clock      ~18:33
Location   section 4 · boss arena, 1 screen
On screen  In the centre bay, the **black van**, engine running, side door shut. The driver's door
           opens. A woman in a **cap and sunglasses** and a long coat steps down. She closes the
           door behind her and pulls on driving gloves, finger by finger. **She says nothing.**
           (This is 林媽媽. He has never met her.)
           For one frame, as the door closes, the camera catches a **photo tucked into the sun
           visor: three young people outside this garage, dated 1994.** One face is hidden behind
           a parking ticket.
Who        `boss_driver`
Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_s4_04_01 | {name} | 小雨在車上對不對?!放她出來! | 小雨's in the van, isn't she?! Let her go! |
| dlg_s4_04_02 | 司機 | *(says nothing; adjusts a glove)* | |

Camera     Arena locks. Slow push-in on the gloves.
Audio      `music_boss_driver`.
Clues      The cap and sunglasses from P-03; the 1994 photo.
Becomes    `event_s4_04_driver_intro` · prop `prop_photo_1994_visor`

### S4-05 — Boss: the Driver
Type       boss
Who        `boss_driver` · `prop_van` (part of the arena)
Gameplay

| Move | Phase | Effect |
|---|---|---|
| 刷卡 Card Swipe | 1, 2 | A very fast horizontal slash with a black card; short range; a gold sparkle trail |
| 名牌購物袋 Designer Bags | 1, 2 | Two heavy shopping bags swung in a wide arc that hits two lanes; knockdown |
| 遙控鑰匙 Key Fob | 1, 2 | She clicks a fob: **every car in the arena flashes and its doors pop open**, becoming temporary walls for 4 s. Alarms blare |
| 倒車 Reverse | 2 (< 50%) | She jumps into the van and **reverses across the arena** along one lane (warning beeps; jump or change lane), then gets out again |
| 「月薪多少?」「存款呢?」 *Salary? Savings?* | 2 | Ranged text projectiles: the questions fly at him as big characters. **He hears them as ransom negotiation** |

Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_s4_05_01 | 司機 | 月薪多少? | What's your monthly salary? |
| dlg_s4_05_02 | 司機 | 存款呢? | And your savings? |
| dlg_s4_05_03 | {name} | 要贖金是嗎?!我……我會想辦法! | You want ransom?! I… I'll find a way! |

Camera     Locked.
Scoring    Help-up allowed (+2, `flag_driver_helped_up`). `hit_downed` applies.
Clues      Her questions. (He reads them as ransom.)
Becomes    `event_s4_05_driver_fight` · `boss_driver` · `ai_boss_driver` · skills
           `skill_driver_card_swipe`, `skill_driver_bags`, `skill_driver_key_fob`,
           `skill_driver_reverse`, `skill_driver_questions`

### S4-06 — The escape, and the suitcase
Type       cutscene
Clock      paused
On screen
1. The Driver's HP reaches 0. She sits down dazed (stars). **The normal ten-second window runs in
   full: he can help her up or not.** The suitcase does not exist yet.
2. When the window resolves (helped up, or 10 s pass), she stands, straightens her cap, and
   **without a word climbs back into the van.**
   - If he helped her up: she pauses with one hand on the door and gives him the smallest nod.
3. The van screeches out of its bay and **roars up the exit ramp**, which climbs toward the
   estate's courtyard.
4. Halfway up the ramp, the van's **rear door swings open**. A **silver suitcase** tumbles out,
   bounces twice down the ramp and **bursts open** in the middle of the ramp. **Stacks of cash**
   spill out and a few notes flutter in the air.
5. The van reaches the top and its tail-lights turn the corner toward the house. The engine sound
   starts to fade.
6. **Autosave checkpoint `checkpoint_s4_choice`** (silent, no icon).

Who        `boss_driver` · `prop_van` · `prop_money_suitcase`
Dialogue   none (no one speaks; this is deliberate)
Camera     Follows the van up the ramp, then **settles on the open suitcase**, with the candidate
           at the bottom of the frame and the ramp-top exit at the top. The suitcase is **in the
           middle of the ramp, at least a quarter screen from where the Driver sat**, so a player
           pressing E for the help-up can never grab it by accident.
Audio      Van screech; the suitcase thud; paper flutter. Then `music_choice`: one held note and a
           heartbeat.
Clues      He reads it as the gang's ransom money, lost in the getaway. In truth 林媽媽 kicked it
           out on purpose (R-06).
Becomes    `event_s4_06_escape_suitcase` · prop `prop_money_suitcase` · checkpoint
           `checkpoint_s4_choice`

### S4-07 — THE CHOICE
Type       choice (in gameplay; no menu, no text)
Clock      **running** (the choice costs time like everything else)
Location   section 5 · the exit ramp, 1 screen
On screen  The ramp. The open suitcase full of cash in the middle. Above, at the top, the corner
           where the van disappeared, and its fading engine sound.
Gameplay
- Control returns. **No prompt, no text, no timer.**
- Standing next to the suitcase shows the **same bare E glyph** used all game for helping people
  up, accepting tea and bowing. **This is the only time E is a trap.**
- **Press E on the suitcase → `flag_took_money = true` → E0** ([06](06-reveal-endings.md#e0--一百萬-one-million)).
  The pick-up is **final**. He needs both hands to lift it and can't fight or run. See E0-01.
- **Walk or run past the suitcase to the ramp top** (trigger line at the top of the screen) →
  `brave_walked_past_money` +8 (gold `+8` pop, no label) → S4-08.
- Standing still does nothing except let the clock run.
- Attacking the suitcase is a no-op (it just rocks; a few notes flutter).

Dialogue   none
Camera     Static, the whole ramp in frame.
Audio      `music_choice` loops. If he walks past, `music_stage4` slams back in on the trigger
           line.
Scoring    +8 勇 for walking past.
Rules ✓    Nobody offers anything and nobody says anything, so he never suspects. The money "is the
           gang's" in his mind. Wealth is shown, not said.
Becomes    `event_s4_07_choice` · trigger `trg_s4_ramp_top` · **setup: the suitcase → R-06
           「箱子是我踢下去的。」, E0**

### S4-08 — Up the ramp
Type       transition
On screen  He sprints past the money without looking back, up the ramp and around the corner,
           into floodlight. Fade to Stage 5.
Dialogue
| id | speaker | zh-TW | en |
|---|---|---|---|
| dlg_s4_08_01 | {name} | 錢等一下再說! | The money can wait! |

Becomes    `event_s4_08_up_the_ramp`
