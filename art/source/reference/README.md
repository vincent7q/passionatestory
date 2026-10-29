# Reference Images

Inspiration for character and visual design. These are **inputs, not game art**:
never copy them directly, and never place them in `assets/`. Codex uses them when
proposing visual targets (see `docs/art/README.md`); no visual style is approved
by adding a reference here.

**Kept local:** images under `characters/` are listed in `.gitignore` because
they include photos of real people. Only this README and `.gitkeep` are
committed. Back them up yourself; Git does not.

## How to add a reference

1. Put the image in the matching folder, for example `characters/`.
2. Name it `<character>-<aspect>-<nn>.<ext>`, for example
   `xiaoyu-hairstyle-01.jpg` or `yafang-outfit-02.png`. Use English, lowercase,
   and hyphens.
3. Add one row to the table below.

## Characters

| Character | File prefix |
|---|---|
| 陳以安 (阿安) | `yian` |
| 林小雨 | `xiaoyu` |
| 沈雅芳 | `yafang` |
| 林建國 | `jianguo` |
| 林雅婷 | `yating` |
| 林婉晴 | `wanqing` |
| 林可欣 | `kexin` |
| 林家豪 | `jiahao` |
| 二姑 | `ergu` |
| 舅舅 | `jiujiu` |
| Other (name it in the row) | `misc` |

## Reference log

**Take from it:** what you like, such as face shape, posture, outfit, colour or mood.
**Ignore:** what should not be copied.
**Source:** where it came from (your own photo or sketch, a URL, a book).
**Rights:** `own`, `licensed`, or `web, reference only`.

| File | Character | Take from it | Ignore | Source | Rights | Added |
|---|---|---|---|---|---|---|
| `characters/*.png` (26 files: photos and cartoon examples) | Not yet assigned | Face, hairstyle, glasses, apparent age | Identity: do not reproduce real people | User's collection | reference only, not for direct use | Vincent, 2026-10-29 |
| `characters/full_body/` (21 PNGs + `prompts.json`, `validation.json`, `preview.html`) | Not yet assigned | Full-body cartoon exploration made from the photos | Not an approved V2 style; its README mentions the old pixel-art pipeline and old `images/converted/` paths | Generated 2026-10-25 (old project) | reference only, not for direct use | Vincent, 2026-10-29 |
