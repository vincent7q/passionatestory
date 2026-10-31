# Full-body cartoon characters

21 individual full-body character illustrations generated on 2026-10-25 with the built-in `image_gen.imagegen` tool.

- **Format:** PNG, RGBA with genuine alpha transparency.
- **Canvas:** 1254 × 1254 pixels per file, preserved at the generator's native output size.
- **Pose:** one standing idle pose per reference photo.
- **Preview:** open [preview.html](preview.html) directly in a browser. Switch backgrounds to review transparency; click a character for its full-size PNG.
- **Prompts and sources:** [prompts.json](prompts.json) records the shared prompt, each character's subject/outfit prompt, exact reference order, and prompt assembly.
- **Validation:** [validation.json](validation.json) records dimensions, alpha range, visible bounds, and SHA-256 hashes for every PNG.

## Source and style

The user moved the reference photos into the parent `images/converted/` folder before generation. Each output retains its current source basename. In particular, `vincent2.png` is generated from the photo named `../vincent2.png`; `../vincent.png` is an existing cartoon style example.

The cartoon references `../felix.png` and `../vincent.png` guide the dark outlines, simplified eyes, rounded shapes and warm colors. The first completed character, `aa13.png`, additionally guides full-body proportions and framing for subsequent outputs. Other supplied cartoon examples and all source photos were preserved.

Where photographs show only the head and shoulders, lower-body clothing and footwear are inferred as simple casual outfits. Girl 1 retains the dress and sandals visible in her full-body reference. Apparent age, hairstyle, glasses and expression guide each conversion.

## Game use

These assets supply static character art. Walking and combat animations, side-facing views, rigging and engine integration are separate production tasks. The generated smooth cartoon style is an art exploration and does not revise the repository's documented pixel-art production pipeline.

All 21 PNGs decode successfully as square RGBA images, include fully transparent and fully opaque pixels, have visible character pixels inside the canvas, and have distinct file hashes. Four files have negligible alpha-1 pixels at the outer edge; the validation report records those values. Generated alpha was preserved without postprocessing.

