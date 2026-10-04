# Art briefs — for AI image generation

These files describe **every image the game needs** so that an AI image tool (or a human artist)
can produce it consistently. The content comes from the final storyboard (`docs/storyboard/`).

| File | Contents |
|---|---|
| `README.md` (this file) | The style, technical specs, the prompt recipe, naming, the do-not list, the review checklist |
| [`characters.md`](characters.md) | Playable looks, the Lin family, his parents (and their disguises), NPCs, 1994 versions |
| [`enemies.md`](enemies.md) | All 18 enemy types (+ 1994 extras) |
| [`backgrounds.md`](backgrounds.md) | Every location, section by section, with time of day and lighting |
| [`props-items-ui.md`](props-items-ui.md) | Props, items, effects (VFX) and UI pieces |

**Per-tool prompt guides.** The same briefs, rewritten as paste-ready prompts for one tool each.
The briefs above stay the source of truth; update them first, then the guides.

| File | Tool | Best for |
|---|---|---|
| [`gemini.md`](gemini.md) | Google Gemini (Nano Banana) | Character sheets, pose sprites from a sheet, prop states, colour variants, UI |
| [`midjourney.md`](midjourney.md) | Midjourney V7 | Backgrounds and cutscene stills, concept exploration |
| [`Flux.md`](Flux.md) | Flux (FLUX.2, Kontext) | Exact palette colours (hex), precise costumes, edits, API scripting |
| [`ComfyUi.md`](ComfyUi.md) | ComfyUI (local SDXL / Flux) | Bulk production: a shared pose library, a locked style, cleanup inside the graph |

**How to use an entry:** paste the **global style block** (§3) first, then the entry's
**Prompt** text, then the **negative prompt** (§3.3). The prompts are in English because image
models follow English best. Chinese names are given for the team.

---

## 1. The look: 熱血物語 style

Reference: `docs/styles/1.jpg`, `docs/styles/2.jpg` (the modern 熱血物語 / *Kunio-kun* look).
**Give these two images to the AI as style references whenever the tool allows it.**

### 1.1 Characters: chunky retro sprites

- **Proportions:** chibi, about **2.5 heads tall**. A big, blocky, slightly square head; a short
  compact body; short thick limbs; big mitten-like fists; big shoes.
- **Faces:** very simple. Small black dot or short-dash eyes, **thick black eyebrows** that carry
  the expression, a small nose (one pixel or none), and a short line mouth (an open "D" shape when
  shouting or laughing). The look is expressive and comic, never realistic.
- **Outline:** a **solid 1-pixel dark outline** around the whole character (very dark brown-black
  `#1A1018`, not pure black), plus dark lines between major shapes (hair/face, arms/body).
- **Colour:** **flat cel colours**. Each material gets **one base colour + one shadow tone**
  (+ an optional single highlight pixel on hair). No gradients, no soft shading, no texture noise.
  Saturated, readable colours like an NES/SNES palette.
- **Pose language:** stiff, bold, readable silhouettes. A fighting stance is fists up and knees
  slightly bent. The joke is in the pose.
- **Side view:** gameplay sprites face **right** in a **3/4 side view** (body slightly turned
  toward the camera), like the hero in `2.jpg`.

### 1.2 Backgrounds: detailed pixel dioramas

- **Much more detailed than the characters.** Pixel art with fine detail: roof tiles, window
  frames, signs, cracks, plants, cables. See the tiled roofs and street in `2.jpg`.
- **Camera:** a side-scrolling beat-'em-up view. We look **side-on, slightly from above (about
  25–30°)**. The **ground is a wide walkable strip** that recedes into the picture (the "depth" the
  characters walk up and down), with walls, buildings and shopfronts along the back edge.
- **Depth:** the far background (sky, distant city) is **softly blurred** (tilt-shift /
  depth-of-field) and lower in contrast. The walkable floor and back wall are sharp.
- **Lighting:** cinematic. Soft bloom on lights, cool shadows, warm practical lights (shop signs,
  lanterns). The mood comes from the time of day (§1.4).
- **Setting:** **Taiwan** (Taipei-like): arcades (騎樓), scooters, vertical neon shop signs, iron
  window grilles (鐵窗), rooftop water tanks, a night market, a metro-style city, subtropical
  mountains, a Chinese-garden mansion.

### 1.3 Tone

A **family comedy for teenagers**, playable by kids. Bright, warm and funny, never grim.
**Cartoon violence only:** no blood, no injuries, no real weapons. Defeated people sit down with
**stars circling their heads** and rub them.

### 1.4 Time of day: the colour script

The whole game happens between 16:30 and 19:00, so the light changes stage by stage. **Keep
to this so the stages flow together.**

| Part | Clock | Light |
|---|---|---|
| Prologue (home) | 16:30 | Warm afternoon sun through a window, cosy |
| Prologue (street) / title | 17:00 | Golden hour, long shadows, orange sky |
| Stage 1 City | 17:10–17:35 | Sunset orange-pink sky, neon starting to glow. The covered arcade: **heavy rain**, grey-blue, wet reflections |
| Stage 2 Campus | 17:35–18:00 | **Blue hour**: deep blue sky, floodlights and warm windows |
| Stage 3 Mountain | 18:00–18:25 | Dusk turning to night, purple-blue, warm paper lanterns, the city lights below |
| Stage 4 Garage | 18:25–18:40 | Underground: **cold white LED showroom light**, glossy reflective floor |
| Stage 5 Estate | 18:40–19:00 | Night outside (floodlights); inside **rich warm gold** light |
| Dining room | 19:00 | Warm chandelier light, steam from food |
| 1994 bonus | 1994 | Same as Stage 1 but with a **CRT / VHS filter**, faded colours, 16-colour feel |

---

## 2. Technical specs

The game world is **480×270 pixels**, shown at **4×** on a 1920×1080 screen. Everything in the
world is pixel art at that scale. The HUD and text are drawn separately and **are not part of
these images.**

### 2.1 Sizes (final, in game pixels)

| Asset | Final size | Notes |
|---|---|---|
| Standard character sprite | **32×48** canvas | The body fills about 28×44; feet on the bottom row |
| Big character (二叔 BAN) | 48×56 | |
| Child (小樂) | 24×36 | |
| Toddler | 16×24 | |
| Dog | 32×24 | |
| Background, one screen | **480×270** | Sections are 1–2 screens wide (480 or 960 × 270) |
| Props | as listed per prop | |
| HUD portrait | 32×32 | Head-and-shoulders, the same style as the sprites |
| Concept / character sheet | 1536×1024 (any size) | **Not pixel art**: a clean reference sheet used to keep sprites on-model |

**HUD bands:** like the reference, a black HUD band covers the **top 36 px** and a dialogue band
covers the **bottom 38 px** of the screen. Backgrounds still fill the full 480×270, but **keep
important things (doors, signs, the walkable floor) between y = 36 and y = 232.**

### 2.2 How to get clean pixel art out of an AI

Most AI tools cannot draw a true 32×48 sprite directly. Do this:

1. Generate **big**: a sprite at 512×768 (16× scale), a background at 1920×1080 (4× scale), on a
   **flat solid background** for sprites (pure magenta `#FF00FF` or pure green `#00FF00`, so it can
   be removed).
2. Ask for "**pixel art, each pixel a crisp square block, no anti-aliasing**".
3. Downscale with **nearest-neighbour** to the final size (sprites ÷16, backgrounds ÷4).
4. Clean up in a pixel editor (Aseprite, Pixelorama): fix the outline, reduce to a small palette,
   remove stray pixels.

### 2.3 Deliverables per character

| # | Deliverable | Use |
|---|---|---|
| 1 | **Character sheet:** front, 3/4 side and back view, plus 3 expressions, on a plain background | Keeps every later image on-model |
| 2 | **Key sprite:** idle pose, facing right, 32×48 | The first in-game sprite |
| 3 | **Pose sprites:** each pose in the entry's *Poses* list, one image each, the same size | Animation keyframes (an animator in-betweens them later) |

AI images will not match frame-to-frame perfectly. Use them as **keyframes and references**, and
expect a cleanup pass.

### 2.4 File naming

`<content id>__<variant>.png`, lowercase, no spaces. The content id is the storyboard id, so
**the art and the game data share one name.**

```
character_felix__sheet.png
character_felix__idle.png
character_felix__punch.png
boss_lunch_lady__slipper_throw.png
bg_stage1_market_row.png
prop_showpiece_melon__broken.png
```

Save under `assets/art/<type>/` (characters, enemies, bosses, npcs, backgrounds, props, items, ui, vfx).

---

## 3. The prompt recipe

### 3.1 Global style block: characters (paste first)

> Pixel art game sprite in the style of the modern Kunio-kun / River City (熱血物語) beat-'em-up
> games. Chibi proportions, about 2.5 heads tall, big blocky square head, short thick limbs, big
> fists and shoes. Very simple face: small black dot eyes, thick black eyebrows, tiny line mouth.
> Solid 1-pixel dark brown-black outline. Flat cel colours, one shadow tone per colour, no
> gradients, no anti-aliasing, crisp square pixels. Bold, readable silhouette. 3/4 side view facing
> right, full body, standing on the bottom edge. Plain solid magenta (#FF00FF) background. Funny,
> family-friendly, 16-bit retro.

### 3.2 Global style block: backgrounds (paste first)

> Detailed pixel art background for a side-scrolling beat-'em-up game in the style of the modern
> Kunio-kun / River City (熱血物語) games. Side view from slightly above (about 25–30 degrees). A
> wide walkable ground strip across the lower half that recedes into depth, with buildings or walls
> along the back. Rich pixel detail, crisp square pixels, no anti-aliasing on edges. The far
> background is softly blurred (tilt-shift depth of field). Cinematic lighting with gentle bloom.
> Set in Taiwan. 16:9, no characters, no people, no text, no logos.

### 3.3 Negative prompt (paste last, or use the tool's "avoid" field)

> blood, gore, injury, realistic weapons, guns, knives, smoking, alcohol bottles in focus,
> realistic proportions, anime, 3D render, painterly, soft shading, gradients, blurry character,
> anti-aliased edges, watermark, signature, text, letters, logo, brand names, trademarks, real
> police insignia, extra limbs, extra fingers, cropped feet

### 3.4 Text in images

AI tools draw Chinese characters badly. **Ask for blank signs, blank paper and blank banners**,
and add the text afterwards in an editor or in the engine. Any entry that needs text lists it under
**Text (added later)**.

---

## 4. Rules every image must follow

| # | Rule | Why |
|---|---|---|
| A1 | **No blood, no wounds, no realistic weapons.** Comic objects only (briefcases, slippers, melons, woks, textbooks) | Cartoon violence; playable by kids |
| A2 | **No real brands, logos or trademarks**: cars, delivery companies, shared bikes, universities, credit cards, designer bags. Use generic designs in the colours given | Legal |
| A3 | **No real police insignia.** A generic traffic-police look | Legal |
| A4 | **The 林 family crest** (a small 林 character in a circle) appears on staff uniforms, number plates, dog tags and plush toys. **Draw a small blank circle badge** where it goes; the 林 is added later | Consistency; AI text is unreliable |
| A5 | **The characters 勇 and 禮 must never appear in any image** except the evaluation form, whose text is added in the engine | The game's twist depends on it |
| A6 | **Wealth is shown big, never written**: supercars, a private mountain, marble, gold, a helipad. No price tags, no "$$$" signs | Story rule |
| A7 | **Nobody looks scary.** Enemies are polite, comic people at work. Expressions are determined, flustered or apologetic, never menacing | Story rule: every enemy likes him |
| A8 | **Modest clothing** for everyone (cheerleaders included) | Family game |
| A9 | Characters wear **the same costume in every pose**, and the same colours as their sheet | Consistency |

## 5. Review checklist (before accepting an image)

- [ ] Matches the reference style (chunky chibi sprite / detailed diorama background)
- [ ] The right proportions (about 2.5 heads), outline and flat colours
- [ ] Faces right; the feet sit on the bottom edge; the background can be keyed out
- [ ] Colours match the character sheet
- [ ] No text, logos, brands, blood or weapons; no 勇 / 禮
- [ ] Readable at final size (view it at 32×48 and at 4×)

## 6. Assumptions to confirm

Questions to check with the owner are listed in the reply that introduced these files. The art
assumes:

1. **The setting is Taiwan** (Taipei-like city, a northern Taiwan mountain).
2. **The hero wears the pale blue shirt his mother ironed** (P-01) all night, in all three looks.
   The looks differ in build, hair, face, trousers and shoes.
3. **The HUD and dialogue bands** match the reference (top 36 px, bottom 38 px).
4. AI images are **keyframes**, not finished animation; a pixel cleanup pass follows.
