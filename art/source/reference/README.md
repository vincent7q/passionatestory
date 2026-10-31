# Reference Images

Inspiration for character and visual design. These are **inputs, not game art**:
never copy them directly, and never place them in `assets/`. Codex uses them when
proposing visual targets (see `docs/art/README.md`); no visual style is approved
by adding a reference here.

**Kept local:** images under `characters/` include photos of real people and are
local reference inputs. The generated `characters/SP/` study is explicitly
Git-ignored. The broader photo-folder ignore rule is currently commented out;
keep the source photos local when staging changes. Only this README and
`.gitkeep` are committed. Back up the local references yourself; Git does not.

## How to add a reference

1. Put the image in the matching folder, for example `characters/`.
2. Name it `<character>-<aspect>-<nn>.<ext>`, for example
   `xiaoyu-hairstyle-01.jpg` or `yafang-outfit-02.png`. Use English, lowercase,
   and hyphens.
3. Add one row to the table below.

## Characters

| Character | File prefix |
|---|---|
| 陳以曦 (阿曦) | `yixi` |
| 林小雨 | `xiaoyu` |
| 沈馨芳 | `xinfang` |
| 林建輝 | `jianhui` |
| 林雅婷 | `yating` |
| 林婉晴 | `wanqing` |
| 林可欣 | `kexin` |
| 林以亮 | `yiliang` |
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
| `characters/SP/` Part A (`vincent2`, `girl1`, `aa13`; 3-sheet pilot of 21 planned; `preview.html`) | Not yet assigned | SP-style grid-pixel proportions, photo-inspired hair/glasses/outfit, front/side poses and expressions | Portrait likeness; runtime size and cast mapping are undecided; pilot awaits Vincent's approval | Built-in imagegen + deterministic native-grid/palette cleanup; prompts and checks kept locally | generated design references; user photo collection as inputs; not runtime assets | Codex, 2026-10-31 |
| `characters/SP/` Part B (`misc-depot-guard`; 1-sheet pilot of 10 planned; `preview.html`) | Original unnamed story-role proposal | Adult event/security performer for S1-01/S1-02; isolated uniform palette for colour swaps | Not approved story canon or runtime art; remaining roles await pilot approval | Story handoff + style-only references, built-in imagegen + deterministic grid cleanup; no person photo | generated design proposal, reference only; not runtime assets | Codex, 2026-10-31 |
| `characters/SP/vincent2-action-test*`, `prop-*`, `bg-s1-gate-*`; Action test section in `preview.html` | vincent2 action study and S1-02 environment / 動作及物流站測試 | 14 right-facing poses; separate box/pipe; original 640×360 depot; native/×2/×3 mock frames | Static style/scale test only; not animation cycles or accepted game art; visual notes and approvals pending | Built-in imagegen drafts + deterministic grid/palette cleanup; exact prompts and checks kept locally | generated reference study; Git-ignored outputs, no runtime manifest entries | Codex, 2026-10-31 |
