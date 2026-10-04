# Backgrounds

[← art README](README.md) · Style: README §1.2 · Light by time of day: README §1.4 · Prompt: README §3.2

**Every background: paste the global background block (README §3.2) first, then the Prompt
below.** Size is in screens: 1 screen = **480×270** final (generate at 1920×1080 and downscale 4×);
2 screens = 960×270 (generate at 3840×1080, or as two matching halves).

**Layout rule for every gameplay background** (see the reference `2.jpg`):
- **Top 36 px:** under the black HUD band, so sky or roof edges only.
- **About y = 36–120:** the back wall (buildings, shopfronts, fences, windows).
- **About y = 120–232:** **the walkable floor**, a wide flat strip receding into depth (the
  characters walk up and down it). Keep it clear of big objects. Small decorations sit only along
  the back edge.
- **Bottom 38 px:** under the dialogue band, so a floor edge or kerb only.
- **No people, no characters, no readable text** (signs blank; text added later).

Breakable props (stalls, booths, vases) and big interactive props (the van, the tea table) are
**separate images** (see [`props-items-ui.md`](props-items-ui.md)). Leave a clear space where they
go.

---

## Title and prologue

### `bg_title_street` — Title screen / quiet street near campus · 1 screen · 17:00 golden hour
- **Prompt:** *A quiet residential street near a Taiwanese university at golden hour, long orange
  shadows, low apartment buildings with iron window grilles and potted plants on balconies, a
  row of parked scooters, streetlights just flickering on, an orange-pink sky. At the far end of the
  street, a plain black van is parked with its headlights off. Nostalgic, calm, slightly
  mysterious.*
- **Also used for:** P-02 – P-05 (after class, the van, the hair clip) and PC-01 (Visit #2). Make a
  `__no_van` variant.

### `bg_home_living_room` — The candidate's home · 1 screen · 16:30 warm afternoon
- **Prompt:** *A small, warm, cosy Taiwanese apartment living room in the afternoon, sunlight through
  a window with lace curtains, a worn fabric sofa, a low wooden coffee table, a TV cabinet, a
  wall clock, a rice cooker on a side counter, family photos on the wall, and on a shelf behind the
  sofa a small dusty gold trophy. An ironing board in the middle of the room. Modest, lived-in,
  loving.*
- **Must include:** the shelf with the trophy (`prop_trophy_1994` is a separate prop; leave space),
  the ironing board spot, the sofa.
- **Variant `__night_dark`** (ending E0-04): the same room **at night, lights off**, only a single
  table lamp's warm pool of light by the sofa, everything else in deep blue shadow.

---

## Stage 1 — City (17:10–17:35, sunset)

### `bg_stage1_market_row` — Market Row · 2 screens
- **Prompt:** *A busy Taiwanese traditional market street at sunset, orange-pink sky, the back side
  lined with shopfronts under arcades, colourful vertical neon signs starting to glow, striped
  awnings, hanging lamps, plastic stools, crates and baskets along the shop edges, rows of parked
  scooters, overhead tangles of cables. A wide paved street in front. Lively, warm, slightly
  chaotic.*
- **Leave space** for 2 market stalls on the walkable floor.

### `bg_stage1_junction` — The junction · 1 screen
- **Prompt:** *A big Taiwanese city crossroads at sunset, zebra crossings, traffic lights, tall
  buildings with billboards (blank), a pedestrian overpass in the background, a small round traffic
  police podium in the middle of the junction. Cars and scooters frozen in neat rows at the edges.*
- **Note:** the cars here are part of the background (frozen traffic). Keep them at the back edge
  and sides.

### `bg_stage1_arcade_rain` — Covered arcade in the rain · 2 screens
- **Prompt:** *A long covered pedestrian arcade (騎樓) in a Taiwanese city during heavy rain, grey-blue
  light, the arcade roof covering the back half of the street with gaps where rain pours through,
  wet glossy floor tiles reflecting neon shop lights, closed metal shutters, a few shop signs, rain
  streaks and puddles. Moody but not gloomy.*
- **Must include:** clearly visible **covered zones** (dry, under the roof) and **open gaps** (rain
  pouring), because cover matters in gameplay. Gaps at roughly 1/3 and 2/3 of each screen.
- **Overlay:** `vfx_rain_overlay` (props file) is drawn on top.

### `bg_stage1_loading_bay` — Loading bay · 1 screen (arena)
- **Prompt:** *A loading bay behind a city market at dusk, two big roll-up metal shutters (one on the
  left wall, one on the right), stacked crates and pallets, a hand truck, a puddle, fluorescent
  tube lights flickering on, orange sky above the walls.*

### `bg_stage1_fruit_stall` — The fruit stall · 1 screen (boss arena)
- **Prompt:** *A narrow Taiwanese street at sunset, the end of a market, a fruit stall under a red
  and white striped awning standing at the back-centre of the street, pyramids of watermelons,
  crates of mangoes, guavas, pineapples and lychees, a hanging scale, hanging lamps, a small
  plastic stool. Warm orange light. The stall is proud and carefully kept.*
- **Note:** the stall counter and the showpiece melon are **separate props** (they break). The
  background shows the awning, the surrounding crates and the street.

---

## Stage 2 — Campus at night (17:35–18:00, blue hour)

### `bg_stage2_back_gate` — Campus back gate · 1 screen
- **Prompt:** *The back gate of a Taiwanese university at blue hour, a wide campus road, red-brick
  buildings with warm lit windows, palm trees, a gate with a blank name plaque, a row of orange
  shared bicycles at a docking rack near the gate, streetlights. Deep blue sky.*
- **Variant `__exit`** for the S2-07 exit (the same scene, the bike rack in focus).

### `bg_stage2_sports_field` — Sports field · 2 screens
- **Prompt:** *A university sports field at night under bright white floodlights, an outdoor
  basketball court with hoops at the back, a red running track, bleachers, a chain-link fence,
  deep blue sky with the last light of dusk. Energetic, school-sports atmosphere.*

### `bg_stage2_club_street` — Club street · 2 screens
- **Prompt:** *A campus walkway at night lined with student club booths under strings of warm fairy
  lights, folding tables with blank hand-lettered banners, guitar cases, board-game boxes,
  anime posters (blank), balloons, a tree with lights. Fun, busy, student festival feel.*
- **Leave space** for 4 club booths (separate props) along the back half of the floor.

### `bg_stage2_library` — The library reading room · 1 screen
- **Prompt:** *A silent university library reading room at night, tall wooden bookshelves along the
  back wall, long wooden reading tables with green desk lamps, a librarian's front desk on one
  side, big windows showing a deep blue night sky. Hushed, warm lamp light.*
- **Note:** the student bystanders are separate sprites, seated at the tables.

### `bg_stage2_cafeteria` — The cafeteria · 1 screen (boss arena)
- **Prompt:** *A university student cafeteria closed for the night, rows of empty tables and plastic
  chairs, metal serving counters with steam trays along the back, one counter still lit with a
  warm light and a big steaming soup pot, a menu board (blank), the rest dim blue. Homely,
  slightly comic.*

### `bg_transition_bike_road` — Bike ride to the mountain · 2 screens (scrolling, no combat)
- **Prompt:** *A road leaving the city at dusk, rice fields and small houses on one side, a dark
  green forested mountain rising ahead, power lines, a purple-blue sky with the first stars.
  Simple, made for scrolling past fast.*

---

## Stage 3 — Mountain road (18:00–18:25, dusk to night)

**The whole mountain belongs to the family.** Everything is beautifully kept: manicured, expensive,
quiet. Warm paper lanterns against a purple-blue evening.

### `bg_stage3_lower_gate` — The lower gate · 1 screen
- **Prompt:** *The foot of a private mountain at dusk, an ornate wrought-iron gate standing open
  between stone pillars, a blank stone sign plaque, a smooth private road winding up into lush
  subtropical forest, ferns and banyan trees, purple-blue sky, warm lamps on the pillars.*

### `bg_stage3_dog_run` — The dog run · 1 screen
- **Prompt:** *A manicured lawn beside a private mountain road at dusk, a neat wooden fence, a
  luxurious little dog house like a miniature villa, dog bowls, trimmed hedges, garden lamps.*

### `bg_stage3_pond_path` — Pond path · 2 screens
- **Prompt:** *A Chinese garden path on a mountainside at dusk, a koi pond with stepping stones and
  orange koi, a small arched stone bridge, weeping willows, rocks, rows of paper lanterns along
  the path, some glowing warmly and some still dark. Peaceful and expensive.*
- **Variant `__lanterns_off`** (ending E0-02): the same path at night, all the lanterns dark, cold
  moonlight.

### `bg_stage3_stone_steps` — Stone steps · 2 screens
- **Prompt:** *A long flight of stone steps climbing a forested mountainside at nightfall, stone
  lanterns on both sides, bamboo groves, mist, at the top a small flat landing. The steps climb
  diagonally from lower left to upper right.*
- **Note:** this one is a **diagonal climb**. The walkable area is the staircase.

### `bg_stage3_tea_road` — The tea table road · 1 screen (boss arena)
- **Prompt:** *A wide bend of a private mountain road at nightfall with a breathtaking view: below,
  the whole city glittering with lights under a purple-blue sky; a low stone railing along the
  edge; pine trees; a soft evening mist. Calm, grand, slightly funny emptiness in the middle of the
  road (where a tea table will stand).*
- **Variant `__night`** (ending E0-02): later, darker.

---

## Stage 4 — The garage (18:25–18:40, cold LED)

**Shows wealth big:** a showroom of supercars under the mountain. Glossy, cool, white-blue LED.

### `bg_stage4_ramp_down` — Ramp down · 1 screen
- **Prompt:** *A curving concrete ramp leading down into a luxurious underground garage, sleek
  white LED light strips along the walls, a blank level sign, polished grey concrete, cool
  white-blue light, a faint hum. Modern and expensive.*

### `bg_stage4_showroom` — Showroom row · 2 screens
- **Prompt:** *A luxurious private underground garage lit like a car showroom, a glossy polished
  floor reflecting everything, white LED ceiling panels, rows of parked supercars, a vintage
  luxury limousine, and a motorbike on a rotating display turntable. No brand logos; number plates
  blank. Cool, gleaming, absurdly rich.*
- **Note:** the cars are **background** (they can't break). They line the back edge.

### `bg_stage4_van_bay` — The van bay · 1 screen (boss arena)
- **Prompt:** *The centre bay of a luxurious underground garage, an empty marked parking space in the
  middle (where a van will be), supercars parked on both sides, concrete pillars, bright white
  LED lights, a glossy reflective floor.*

### `bg_stage4_exit_ramp` — The exit ramp: THE CHOICE · 1 screen
- **Prompt:** *A wide concrete exit ramp climbing up and out of a luxurious underground garage,
  viewed from the bottom; at the top, an opening to the night with warm floodlight spilling in and
  a corner turning out of sight; LED strips along the walls; a dramatic, quiet, lonely
  composition.*
- **Note:** **the suitcase sits in the middle of the ramp** (a separate prop). The composition must
  feel like a **decision**: the bright exit at the top, the suitcase in the middle, the player at
  the bottom.

---

## Stage 5 — The estate (18:40–19:00, night outside, gold inside)

**A grand Chinese-modern mansion:** a traditional courtyard layout, red lacquer, carved wood, marble,
gold, but tasteful. Rich warm interior light.

### `bg_stage5_courtyard` — The courtyard · 2 screens
- **Prompt:** *The floodlit front courtyard of a grand Chinese-modern mansion at night, a big marble
  fountain, catering vans with their back doors open, a helipad with a helicopter under a fitted
  cover, a red lacquered main door at the top of wide stone steps, warm golden light from tall
  windows, a large rolled-up banner hanging from ropes between pillars, an easel by the door
  (blank board).*
- **Separate props:** `prop_seating_chart`, `prop_banner_rolled`.

### `bg_stage5_ancestral_hall` — The ancestral hall · 1 screen (+ mid-boss arena)
- **Prompt:** *A long, solemn ancestral hall in a Chinese mansion at night, dark carved wooden
  panels, red lacquer pillars, an altar with incense and candles at the back, rows of framed
  family photographs and painted portraits on the walls, warm candlelight and gold accents.*
- **Separate props:** `npc_waigong_portrait` (the large framed portrait), `prop_photo_1994_hall`
  (a spotlit framed photo).

### `bg_stage5_kitchen` — The kitchen · 1 screen
- **Prompt:** *A huge busy professional kitchen in a mansion, stainless steel counters, roaring gas
  woks with flames, towers of bamboo steamers, warming trays, hanging ladles, steam everywhere,
  a pantry door on one side and a door to the hall on the other (a glimpse of a piano through it).
  Warm, steamy, energetic.*

### `bg_stage5_grand_corridor` — The grand corridor · 2 screens
- **Prompt:** *A long, grand mansion corridor at night, polished marble floor, carved wooden doors
  along the back wall, porcelain vases on pedestals between them, crystal wall lights, a red
  carpet runner, and at the far right end a pair of enormous ornately carved double doors with warm
  light glowing underneath.*
- **Separate props:** `prop_vase` ×4.

### `bg_dining_room` — The dining room · 1 screen (final arena) ★ the most important background
- **Prompt:** *A grand, warm Chinese mansion dining room at night, a large round banquet table for
  eleven in the centre with a white tablecloth and a glass lazy Susan, a chandelier, red and gold
  decor, carved wooden screens, a coat rack by the door, a door to the kitchen on one side, the
  broken-in main doors on the other. Warm golden light, steam rising.*
- **Note:** the table, the chairs, the dishes and the lazy Susan are **separate props** (the fight
  goes around them, and their state changes).
- **Variants:** `__hot` (food steaming) · `__cold` (no steam, some plates half eaten) · `__cleared`
  (bare table, one teacup, a faint sound of washing up from the kitchen: show light from the
  kitchen door).

### `bg_estate_front_steps_morning` — Front steps, morning (ending E0-08) · 1 screen
- **Prompt:** *The front steps and red lacquered door of a grand Chinese-modern mansion in soft early
  morning light, dew, birds, a peaceful quiet courtyard.*

---

## Endings and cutscene stills (full-screen images, 480×270)

These are **single illustrations** for cutscenes, the same pixel style. Characters **may appear** in
these (use the character descriptions). Use the background block plus the description.

| Id | Beat | Description |
|---|---|---|
| `still_g01_arcade_bench` | G-01 Stage 1 | The candidate asleep on a bench under a covered arcade, a towel over his head, rain outside, a folded note beside him |
| `still_g01_nurse_office` | G-01 Stage 2 | Asleep on a school nurse's office bed, an ice pack on his forehead, a note on the side table |
| `still_g01_pavilion` | G-01 Stage 3 | Asleep in a garden pavilion with a blanket over him, a cup of warm steaming tea beside him, lanterns |
| `still_g01_limo` | G-01 Stage 4 | Asleep on the back seat of a limousine, seatbelt fastened, a note on his chest |
| `still_g01_guest_room` | G-01 Stage 5 | Asleep in a luxurious guest bed, house slippers lined up neatly by the bed |
| `still_g02_carried` | G-02 | First-person blurry view of a corridor ceiling with crystal lights passing overhead, hands visible at the edges (being carried) |
| `still_e0_suitcase_table` | E0-07 | A silver suitcase on a small coffee table in a dark living room, a blue-and-white plastic slipper beside it (credits background) |
| `still_e1_family_photo` | E1 credits | Both families around the round dining table, everyone holding up a piece of fruit, laughing |
| `still_e2_montage_park` | E2 credits | A park at dawn: a father and son shadow-boxing side by side; a mother filming with her phone |
| `still_e2_montage_stairs` | E2 credits | Father and son running up long temple stairs at dawn |
| `still_e2_montage_melons` | E2 credits | Father and son carefully carrying watermelons in their arms |
| `bg_1994_market` | X-03 | `bg_stage1_market_row` remade as **1994**: older shop signs (blank), CRT TVs in a shop window, older scooters, a public phone booth. Faded colours |
| `bg_1994_fruit_stall` | X-04 | The same fruit stall as `bg_stage1_fruit_stall`, **newer paint, brighter awning**, 1994 |
| `still_1994_dining` | X-05 | A 1994 dining room photo-like scene: two young men at a round table holding papers, a young waitress with a fruit plate. Slightly faded, warm |
