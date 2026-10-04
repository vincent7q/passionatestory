# Props, items, effects and UI

[← art README](README.md) · Style: README §1 · Rules A1–A9: README §4

Props are **separate images** from backgrounds because they break, move or change state. Draw them
in the **same perspective as the backgrounds** (side view, slightly from above), on a magenta
`#FF00FF` background. Use the **character** style block for small hand-held things and the
**background** style block for big scenery props.

Sizes are final, in game pixels (generate 8–16× larger and downscale with nearest-neighbour).

---

## 1. Props

| Id | Size | States | Description (prompt) |
|---|---|---|---|
| `prop_trophy_1994` | 12×16 | — | *A small, slightly dusty gold trophy cup on a wooden base with a blank plaque.* (Text "1994 · 第二名" added later.) |
| `prop_ironing_board` | 40×24 | — | *An ironing board with an iron and a neatly pressed pale blue button-up shirt laid on it.* |
| `prop_newspaper` | 16×12 | — | *A folded newspaper (blank columns).* |
| `prop_market_stall` | 48×40 | `__intact`, `__broken` | *A Taiwanese street market stall: a wooden table with a small striped awning, baskets of vegetables and snacks.* Broken: *the same stall collapsed comically, the awning hanging, produce scattered, nothing dangerous.* |
| `prop_fruit_crate` | 16×12 | `__intact`, `__broken` | *A wooden crate of oranges.* / *the crate split, oranges rolling.* |
| `prop_showpiece_melon` | 20×16 | `__intact`, `__cracked`, `__broken` | ★ *One enormous, perfect, glossy green-striped watermelon sitting proudly on a small red silk cushion on a wooden counter, a tiny ribbon on its stem.* Cracked: *a crack across it*. Broken: *split open, red flesh and seeds, the cushion askew (cartoon, not gory).* |
| `prop_melon` | 12×10 | `__roll` | *An ordinary green-striped watermelon* (thrown and rolled by 二姑). |
| `prop_durian` | 10×10 | — | *A spiky green durian, cartoon.* |
| `prop_traffic_podium` | 24×16 | — | *A small round white-and-blue traffic police podium.* |
| `prop_club_booth` | 48×40 | `__intact`, `__broken` | *A student club booth: a folding table with a blank cloth banner, flyers, a guitar case.* Broken: *the table folded in on itself, flyers everywhere.* |
| `prop_cheer_card` | 16×10 | — | *A blank white card held up* (text added later). |
| `prop_shared_bike` | 40×24 | — | *An orange city shared bicycle with a basket (generic, no logo).* |
| `prop_folding_desk` | 24×16 | — | *A tiny folding desk with an open workbook, pencils and an eraser.* |
| `prop_tea_table` | 48×24 | — | ★ *A folding table in the middle of a road with a full gongfu tea service: a small clay teapot, a tea tray, tiny cups, a kettle on a small burner, a tiny golden tea tin.* |
| `prop_xiangqi_board` | 24×16 | — | *A wooden Chinese chess (象棋) board with round red and black pieces mid-game.* |
| `prop_xiangqi_piece` | 6×6 | — | *A single round wooden chess piece* (projectile). |
| `prop_teacup` | 6×6 | — | *A tiny white porcelain teacup with steam.* |
| `prop_van` | 96×48 | `__closed`, `__door_open`, `__rear_open`, `__reverse` | ★ *A plain black minivan with tinted windows, no logos, blank number plate* (the 林 plate is added later). Door open: *sliding side door open*. Rear open: *rear door swinging open*. Reverse: *white reversing lights on*. |
| `prop_photo_1994_visor` | 16×12 | — | *A small faded photograph of three young people in 90s clothes outside a garage; one face is covered by a parking ticket.* |
| `prop_supercar` | 80×32 | `__a`, `__b`, `__c`, `__alarm` | *A sleek generic supercar, no brand logos* (a: red, b: white, c: black). Alarm: *the same with flashing hazard lights and doors popped open.* |
| `prop_money_suitcase` | 32×24 | `__closed`, `__open`, `__burst` | ★ *A shiny silver aluminium suitcase.* Open: *the lid open, neatly packed with stacks of banknotes (generic, not real currency).* Burst: *lying open on the ground, stacks spilled, a few notes fluttering in the air.* |
| `prop_seating_chart` | 32×40 | — | *An easel holding a blank board with a round table diagram and blank name cards around it* (names added later). |
| `prop_banner_rolled` | 96×16 | `__rolled`, `__open` | *A long red banner rolled up hanging from ropes* / *unrolled, red with gold border (blank)*. |
| `prop_photo_1994_hall` | 24×20 | — | *A framed, spotlit old photograph: two young men in 90s shirts at a round dinner table, each holding a sheet of paper; one with his back to the camera; a young woman behind them holding a fruit plate.* |
| `prop_soup_trolley` | 32×24 | `__upright`, `__tipping`, `__spilled` | *A kitchen trolley with a huge white porcelain soup tureen.* Tipping: *tilting, soup sloshing*. Spilled: *the tureen on its side, a soup puddle (cartoon).* |
| `prop_vase` | 16×24 | `__intact`, `__broken` | *A tall blue-and-white porcelain vase on a carved wooden pedestal.* Broken: *shards (cartoon) and an empty pedestal.* |
| `prop_dining_table` | 160×64 | `__hot`, `__cold`, `__cleared` | ★ *A large round banquet table for eleven with a white tablecloth, a glass lazy Susan in the centre, many Chinese dishes (fish, soup, dumplings, greens, a roast duck), bowls and chopsticks at each seat.* Cold: *no steam, half-eaten.* Cleared: *bare white tablecloth, one teacup.* |
| `prop_chair_dining` | 16×24 | `__empty`, `__hairnet` | *A carved wooden dining chair.* / *the same with a white hairnet folded on the seat.* |
| `prop_coat_rack` | 16×40 | `__straw_hat` | *A wooden coat rack* / *with a wide straw sun hat hanging on it.* |
| `prop_cap_on_table` | 8×6 | — | *A black baseball cap lying on a white tablecloth.* |
| `prop_lazy_susan_dish` | 12×8 | — | *A flying porcelain serving dish with food (projectile).* |
| `prop_high_chair` | 16×24 | — | *A small wooden child's high chair.* |
| `prop_evaluation_form` | — | — | See UI §4 (drawn in the UI layer). |

---

## 2. Items

| Id | Size | Description (prompt) |
|---|---|---|
| `item_coin` | 8×8 | *A shiny gold coin, slightly spinning* (frames: `__1`–`__4` for a spin). |
| `item_hair_clip` | 8×8 | ★ *A small white rabbit-shaped hair clip* (the key item; also drawn larger, 64×64, for close-up cutscenes: `item_hair_clip__closeup`). |
| `item_lunchbox` | 12×10 | *A round stainless-steel lunchbox (便當) with the lid off, braised pork over rice, a fried egg and greens; a folded note on top.* Also `__closed`. |
| `item_envelope_lin` | 16×12 | *A cream envelope sealed with a red wax-style seal (blank).* |
| `item_note` | 12×12 | *A small handwritten note on lined paper (blank lines).* |
| `item_phone_cracked` | 10×16 | *A smartphone with a badly cracked screen, the screen glowing.* Also `__repaired`. |
| `item_fruit_plate` | 16×10 | *A white plate of neatly cut fruit.* Variants: `__melon` (watermelon slices), `__apples` (apple slices). |
| `item_bill` | 10×12 | *A small paper receipt / bill.* |

---

## 3. Effects (VFX)

Pixel art, on a magenta background, as small animation strips (3–6 frames, left to right).

| Id | Description |
|---|---|
| `vfx_hit_spark` | A white-yellow star-shaped impact burst (comic, like `1.jpg`) |
| `vfx_daze_stars` | **Three small yellow stars circling above a head**, 6 frames, slowing down (the ten-second window) |
| `vfx_dust_puff` | A small grey cloud puff (landing, knockdown) |
| `vfx_sweat_drop` | A single blue sweat drop |
| `vfx_speed_lines` | Horizontal white speed lines |
| `vfx_slipper` | A blue-and-white plastic slipper spinning in flight, with motion arcs (projectile) |
| `vfx_full_name_ring` | **A big expanding shockwave ring** (white-yellow), comic |
| `vfx_shush_aura` | A pale blue ripple circle |
| `vfx_flash_photo` | A white camera-flash burst |
| `vfx_flambe` | A big round orange cartoon flame puff |
| `vfx_card_sparkle` | A gold sparkle trail (a black credit card swipe) |
| `vfx_tea_steam` | Soft white steam curls |
| `vfx_soup_splash` | A cartoon soup splash (orange-brown droplets) |
| `vfx_rain_overlay` | Diagonal rain streaks, transparent, tileable 480×270 |
| `vfx_burning_spirit` | A red-orange flame aura around a body outline (Felix special) |
| `vfx_shadow_clone` | Translucent blue afterimage silhouettes (Lucian special) |
| `vfx_ground_crack` | Ground crack lines and debris (Hilman special) |
| `vfx_question_text` | **An empty speech-bubble-shaped projectile** (the question text is added in the engine) |
| `vfx_money_flutter` | Banknotes fluttering down |
| `vfx_crt_filter` | (for the engine) a reference image of the CRT scanline / VHS look for the 1994 stage |

---

## 4. UI pieces

UI is drawn at **native 1920×1080** (not pixel-scaled), but it should **look pixel-styled to
match** (chunky pixel fonts and frames), like the HUD in `docs/styles/2.jpg`.

| Id | Description |
|---|---|
| `ui_hud_frame` | A black HUD band across the top with space for: the portrait (left), the green 力 bar and the 氣 bar, the 錢 coin counter, and the clock (centre). Layout copies `2.jpg`. **Labels are text in the engine; draw the bars and frames only.** |
| `ui_bar_power` | A green segmented bar (like the HP bar in `2.jpg`) |
| `ui_bar_spirit` | An orange segmented bar (like the SP bar in `2.jpg`) |
| `ui_icon_coin` | A small gold coin icon |
| `ui_award_seal` | ★ **A small red square seal-stamp icon with an abstract swirl mark inside. It must NOT contain any Chinese character** (it appears next to the gold "+2" / "+8" pop) |
| `ui_e_glyph` | A key-cap glyph showing the letter **E** (white key, dark outline), with a gentle bob |
| `ui_bill_popup` | A small paper receipt that slides up (the amount is text in the engine) |
| `ui_dialogue_box` | The black bottom band for dialogue, with a space for the speaker name (like `1.jpg`) |
| `ui_evaluation_form` | ★ **A sheet of cream rice paper with a thin red border, brush-painted lines and boxes (blank)**: a title area at the top, four rows, a total row and two more rows below. **No text at all**; the engine writes it in brush font |
| `ui_red_seal_stamp` | A red circular ink stamp, blank inside (the engine adds 「已領取」 or 「真」) |
| `ui_title_logo` | **The logo 熱血物語:見家長**: chunky, hot-blooded red-and-yellow letters with a black outline and a flame motif, like the classic 熱血物語 logos. **Make this one by hand or in a design tool; AI will get the characters wrong.** |
| `ui_select_portraits` | 3 large portraits (one per look) for the select screen, the same style as the HUD portraits but bigger (128×128) |
| `ui_group_chat` | A phone-screen frame for the group-chat notification and sticker avalanche (blank notification banners, a few generic cartoon "good morning" sticker images: lotus flowers, a sunrise, a teacup, **no text**) |
