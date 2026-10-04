# ComfyUI: local art pipeline

[← art README](README.md) · Other tools: [Gemini](gemini.md) · [Midjourney](midjourney.md) · [Flux](Flux.md)

This file turns the art briefs ([`README.md`](README.md), [`characters.md`](characters.md),
[`enemies.md`](enemies.md), [`backgrounds.md`](backgrounds.md),
[`props-items-ui.md`](props-items-ui.md)) into **ComfyUI workflows** running on your own GPU.
**The briefs stay the source of truth.** If a brief changes, change it there first, then update
this file.

**Prompt text:** ComfyUI runs two families of models, and each reads a different prompt style. To
avoid a fourth copy of every prompt:

| Pipeline | Model family | Take each asset's subject text from |
|---|---|---|
| **A** (§5) | SDXL + pixel-art LoRA | the comma-style **Subject** columns in [`midjourney.md`](midjourney.md) (§5.3, §5.4, §6, §8). Drop the `--` parameters |
| **B** (§6) | Flux (FLUX.1 [dev], Kontext [dev], FLUX.2 [dev]) | the subjects and style blocks in [`Flux.md`](Flux.md) |

This file adds what only ComfyUI can do: **the pose library, the style lock, batch runs, and
cleanup inside the graph.**

---

## 1. What ComfyUI is good for here

| Strong | Weak |
|---|---|
| **The same pose for every character**: a ControlNet pose library (§7) gives every fighter identical keyframes | Setup takes time; you build the graphs yourself |
| **Locking the style** with IP-Adapter (from `docs/styles/2.jpg`) and, later, **your own LoRA** trained on approved art | Needs a capable NVIDIA GPU |
| **Cleanup inside the graph**: nearest-neighbour downscale and palette reduction (no manual step) | Plain SDXL follows long descriptions less well than Gemini or Flux |
| **Batch runs**: hundreds of assets overnight, named by content id | |
| Free after setup, private, repeatable (fixed seeds) | |

**Use ComfyUI for production:** once Gemini, Midjourney or Flux has given you approved sheets and
a look you like, ComfyUI makes the bulk of the pose sprites consistently.

---

## 2. Hardware (rough guide)

| Pipeline | VRAM |
|---|---|
| A: SDXL + LoRA + IP-Adapter + ControlNet | 8 GB works, 12 GB comfortable |
| B: FLUX.1 [dev] / Kontext [dev] (fp8 or GGUF quantised) | 12 GB+ |
| B: FLUX.2 [dev] (large model; quantised versions) | 24 GB+, or offloading to RAM (slow) |

---

## 3. Install

1. **ComfyUI Desktop** for Windows (comfy.org). It includes **ComfyUI-Manager**.
2. **Custom nodes** (Manager → *Custom Nodes Manager*, search by name):

   | Node pack | Gives you |
   |---|---|
   | `ComfyUI_IPAdapter_plus` | IP-Adapter: style and character reference images |
   | `comfyui_controlnet_aux` | Pose (DWPose/OpenPose), lineart and depth preprocessors |
   | `ComfyUI-PixelArt-Detector` | Pixel-grid detection, palette reduction, pixel-perfect downscale |
   | `ComfyUI-RMBG` (or any rembg node) | Background removal, if magenta keying isn't clean |
   | `ComfyUI-GGUF` | Quantised Flux models (pipeline B on smaller GPUs) |

   Node pack names change. If one isn't found, search the Manager for the function.
3. **Models**:

   | File | Folder (`ComfyUI/models/…`) | Pipeline |
   |---|---|---|
   | SDXL base 1.0 (`sd_xl_base_1.0.safetensors`) | `checkpoints/` | A |
   | **Pixel Art XL** LoRA (nerijs, trigger word `pixel art`) | `loras/` | A |
   | IP-Adapter Plus SDXL (`ip-adapter-plus_sdxl_vit-h`) + CLIP-ViT-H-14 | `ipadapter/`, `clip_vision/` | A |
   | ControlNet OpenPose for SDXL (e.g. xinsir `controlnet-openpose-sdxl-1.0`, or a "union" model) | `controlnet/` | A |
   | FLUX.1 [dev] fp8 + FLUX.1 Kontext [dev] (or GGUF), with their text encoders and VAE | `diffusion_models/`, `text_encoders/`, `vae/` | B |
   | FLUX.2 [dev] (optional) | as its model card says | B |

   ComfyUI's **Templates** menu has ready-made Flux, Kontext and FLUX.2 graphs. Start from those.

---

## 4. Folder setup

```
art_work/
  refs/          styles 1.jpg, 2.jpg, faces from docs/images/, approved sheets
  poses/         the pose library (§7): one OpenPose PNG per pose id
  out/raw/       full-size generations
  out/final/     downscaled, quantised, named by content id (copy into assets/art/<type>/)
```

---

## 5. Pipeline A: SDXL + Pixel Art XL (sprites and props)

### 5.1 The sprite graph

```
Load Checkpoint (SDXL base)
  └─ LoraLoader (pixel-art-xl, model 1.0 / clip 1.0)
       ├─ CLIP Text Encode  POSITIVE = STYLE + SUBJECT + POSE      (§5.2)
       ├─ CLIP Text Encode  NEGATIVE                               (§5.2)
       └─ IPAdapter Advanced (image = refs/2.jpg, weight 0.5–0.7, weight type "style transfer")
            └─ Apply ControlNet (OpenPose model, image = poses/<pose>.png, strength 0.6–0.8)
                 └─ KSampler  seed fixed · steps 30 · cfg 6 · dpmpp_2m · karras
                    Empty Latent Image 832×1248
                      └─ VAE Decode
                           ├─ Save Image  prefix "raw/<content id>"
                           └─ Upscale Image (nearest-exact) → 32×48
                                └─ Image Quantize (colors 16, dither none)
                                     ├─ Save Image  prefix "final/<content id>"
                                     └─ Upscale Image (nearest-exact) ×8  → Preview Image
```

- **Keep the magenta background.** After quantising, it becomes one flat palette colour that
  Aseprite or Godot keys out cleanly. Add RMBG only if magenta bleeds into the outline.
- **Facing left?** SDXL often ignores "facing right". Mirror the image (an image-flip node or
  Aseprite). Sprites are symmetrical enough.
- **Character consistency:** add a **second IP-Adapter** with the character's **approved
  sheet** (weight 0.6–0.8, weight type "linear"). This keeps the costume and colours.
- **The pixel-art-xl LoRA's natural pixel size is about 8 px.** If sprites look too coarse or too
  fine, try the PixelArt Detector node's downscale instead of a fixed nearest-exact resize.

### 5.2 Prompts (pipeline A)

**STYLE (sprites)**, the first part of every positive prompt:

```
pixel art, chibi game sprite, kunio-kun river city beat em up style, 2.5 heads tall, big square head, dot eyes, thick black eyebrows, black outline, flat colors, cel shading, 16-bit, full body, standing, side view, facing right, (solid magenta background:1.3), simple background,
```

**SUBJECT**: the comma-style subject from [`midjourney.md`](midjourney.md) (§5.3 cast table,
§5.4 enemies). **POSE**: a pose phrase from the same file (§5.1–5.3).

**NEGATIVE (sprites):**

```
text, letters, words, watermark, signature, logo, blood, gore, wound, gun, knife, sword, realistic, photo, 3d, anime, painterly, gradient, soft shading, blurry, anti-aliasing, extra limbs, extra fingers, cropped feet, floor, ground shadow, multiple characters
```
(Remove `multiple characters` for the cheer pyramid and the men-in-black formation.)

**STYLE (props, items, effects):**

```
pixel art, game item sprite, single object, centered, side view from slightly above, black outline, flat colors, 16-bit, (solid magenta background:1.3), simple background,
```
Props negative: the sprite negative minus `cropped feet`, plus `people, hands`.

### 5.3 Worked example: `character_felix__punch`

- Positive: STYLE + `cheerful young man with round thin black glasses and black messy spiky hair, big open grin, pale blue short-sleeve shirt untucked, dark grey jeans, white sneakers with a red stripe,` + `throwing a straight punch`
- IP-Adapter 1: `refs/2.jpg` (style 0.6) · IP-Adapter 2: `refs/character_felix__sheet.png` (0.7)
- ControlNet: `poses/punch.png` (0.7)
- Size 832×1248 → 32×48 · 16 colours · seed = the one from `character_felix__idle`
- Save prefix: `final/character_felix__punch`

### 5.4 Sizes (pipeline A)

| Asset | Empty Latent | Downscale to |
|---|---|---|
| Standard sprite | 832×1248 | 32×48 |
| 二叔 BAN | 960×1120 | 48×56 |
| Child / toddler | 832×1248 | 24×36 / 16×24 |
| Dog | 1152×864 | 32×24 |
| Cheer pyramid | 960×1280 | 48×64 |
| Portraits | 1024×1024 | 32×32 / 128×128 |
| Props | nearest SDXL size to the prop's ratio (e.g. 1024×1024, 1152×896, 1344×768, 1536×640) | the final size in [`props-items-ui.md`](props-items-ui.md) |

---

## 6. Pipeline B: Flux (backgrounds, edits, states)

### 6.1 Backgrounds

Plain SDXL + Pixel Art XL makes backgrounds too coarse for 480×270. Use **Flux** (or Midjourney,
then clean up here).

```
(ComfyUI Flux template)
  CLIP Text Encode = SUBJECT + STYLE-BG          (both from Flux.md §9 and §4)
  FluxGuidance 3.0
  Empty Latent 1920×1088 (1 screen) · 2880×816 (2 screens)
  KSampler  euler · simple · 24–28 steps · seed fixed
  VAE Decode
    ├─ Save Image  prefix "raw/<bg id>"
    └─ Image Crop → 1920×1080 (or 2880×810)
         └─ Upscale Image (nearest-exact) → 480×270 (or 960×270)
              └─ Image Quantize (colors 48–64, dither none)
                   └─ Save Image  prefix "final/<bg id>"
```

Flux has **no negative prompt**: leave the negative empty (or use a ConditioningZeroOut node). The
Flux.md style blocks phrase everything positively.

**Two-screen backgrounds (alternative):** generate the left screen, then use **Pad Image for
Outpainting** (right 1920 px) + an inpaint graph with the same prompt and seed, then crop and
downscale to 960×270.

**Optional pixel look on Flux:** add a Flux pixel-art LoRA (from Civitai or Hugging Face) at
0.4–0.7. Test it on one background before running a whole stage.

### 6.2 Edits: poses, states, variants (Kontext [dev] or FLUX.2 [dev])

Start from ComfyUI's **Flux Kontext** template:

```
Load Image (the approved sprite / prop / background)
  └─ FluxKontextImageScale → VAE Encode → ReferenceLatent
CLIP Text Encode = an edit template from Flux.md §5, with the pose / state / colour filled in
FluxGuidance 2.5 · KSampler euler · simple · 20–28 steps
  └─ VAE Decode → the same downscale + quantise chain as §5.1 → Save Image "final/<id>"
```

Use it for:
- **Pose sprites** when there's no ControlNet pose for that move (one-off poses like
  `force_fed` or `beard_slip`)
- **Prop states**: `__broken`, `__open`, `__burst`, `__alarm`, `__cold`, `__cleared` …
- **Crowd colour variants** `__b` / `__c` from the finished `__a` images
- **Background variants**: `__night_dark`, `__lanterns_off`, `__no_van`, the 1994 remakes
- **The disguises**: `npc_mom_home` → `boss_lunch_lady`, `npc_dad_home` → `boss_straw_hat`.
  Editing the everyday sheet keeps the face recognisable.

---

## 7. The pose library: the reason to use ComfyUI

Every fighter shares the **standard fighter poses**: `idle`, `walk`, `run`, `punch`, `kick`,
`jump`, `hurt`, `knocked_down`, `dazed`, `get_up`, `bow`, `wave_leave`. Make them **once** as
ControlNet images and reuse them for every character. Then all 30-odd fighters line up
frame-for-frame.

1. **Make the reference poses on one character** (Felix): generate them with Gemini or Flux
   edits, approve them, and clean them up.
2. **Extract the skeletons:** upscale each approved pose ×8 → **DWPose Estimator** (from
   `comfyui_controlnet_aux`) → save to `poses/<pose>.png`.
3. **If DWPose fails on chibi proportions** (big heads confuse it), use either of these:
   - draw the skeleton by hand in an OpenPose editor node, or
   - use the approved Felix pose itself as a **Depth** or **Lineart** control at strength
     0.35–0.5 (it guides the pose without copying Felix's costume).
4. **Big builds:** BAN (48×56) and Hilman need their own wider versions of the poses. The dog
   (32×24) has its own set.
5. **Extras:** add the player-only poses (`help_up`, `pick_up`, `guard`, `carry_suitcase`, …)
   the same way once the three looks are approved.

Name pose files exactly by pose id (`poses/dazed.png`) so a batch script can match them.

---

## 8. Locking the style: train your own LoRA (later)

Once you have **20–40 approved, cleaned-up images** (sprites from several characters, upscaled ×8
nearest), train:

- a **style LoRA** ("this game's sprite look"), and later
- **character LoRAs** for the main cast (the three looks, 林小雨, 林建國, the parents in both
  outfits).

Tools: **AI-Toolkit** (ostris) or **kohya_ss**, both of which train SDXL and Flux LoRAs. Caption
each image with its subject text and a unique trigger word (e.g. `mtpsprite`). After that, the
IP-Adapter and long prompts matter much less, and every new asset comes out on-model.

---

## 9. Batch runs

1. Build and test a graph on one asset.
2. *Workflow → Export (API)* to save it as JSON.
3. A small Python script reads a list of `content id, subject, pose, size`, fills in the prompt,
   pose image, latent size and save prefix, and posts each job to ComfyUI's local API
   (`http://127.0.0.1:8188/prompt`).

Ask Claude to write that script and the asset list (from the briefs) once your graph works.

---

## 10. Rules to check on every output (README §4–5)

- **No text, letters or Chinese characters.** Signs, plaques and papers are blank. The 林 crest
  is a blank circle badge. **勇 and 禮 never appear in any image.**
- **No blood, wounds or real weapons.** Comic objects only. **Nobody looks menacing.**
  **Modest clothing.**
- **No real brands or police insignia.** **Wealth is shown, never written.**
- The same costume and colours in every pose. Feet on the bottom row. Readable at 32×48 and at 4×.
- **Hand-made, never AI:** `ui_title_logo` (熱血物語:見家長). Check `ui_award_seal` and
  `ui_evaluation_form` are completely free of characters.
- Name every file `<content id>__<variant>.png` (README §2.4) and copy it into
  `assets/art/<type>/`.

> **Open question:** the briefs don't say whether cutscene stills showing the candidate need one
> version per look (felix / lucian / hilman). Check before producing them.
