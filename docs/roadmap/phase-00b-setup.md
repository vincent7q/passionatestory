# Phase 0B — Project setup

[← plan](../plan.md) · design track: [Phase 0A](phase-00a-storyboard.md) · next: [Phase 1](phase-01-core-data.md)

## Goal

An empty Godot project that runs at 1920×1080 with the pixel world scaled correctly, tests that run
from the command line, and a web build that loads.

## Why this phase exists

Testing, scaling and web export are cheapest to get right in an empty project. This part is
independent of the storyboard work in Phase 0A and can run in parallel with it; Phase 1 needs both.

## Deliverables

```text
project.godot
.gitignore  .gitattributes
assets/  data/  scenes/  systems/  tools/  tests/      (from §25, with .gitkeep)
addons/gut/                                           (test framework)
scenes/main/main.tscn                                 (boot scene: scaling test pattern)
systems/core/world_viewport.gd                        (integer-scaled 480×270 world)
tests/test_smoke.gd
export_presets.cfg                                    (Web preset)
```

## Steps

### B1 Install Godot — S
- [ ] Download Godot 4 latest stable, **standard** build (not .NET) for Windows, plus the matching
  **export templates** (needed for the web build in B6).
- [ ] Put it at a fixed path and make `godot` callable from a terminal. On Windows, point it at the
  `…_console.exe` variant so headless runs print to the terminal.
- [ ] Check: `godot --version` prints the version. Record the exact version in `CLAUDE.md`. Every
  contributor uses the same minor version, because `.tres`/`.tscn` files change format between
  versions.

### B2 Create the project — S
- [ ] `project.godot` at the repo root, project name 熱血物語:見家長.
- [ ] Folders from §25: `assets/ data/ scenes/ systems/ tools/ tests/` (`docs/` already exists).
  Subfolders are created as phases need them, not up front.
- [ ] `.gitignore`: `.godot/` (the import cache) and export output folders. **The `.import` files
  beside assets are committed** — they hold import settings.
- [ ] `.gitattributes`: `* text=auto eol=lf` — Godot writes LF; this stops the CRLF warnings seen
  in this repo.
- [ ] Check: the project opens in the editor without errors and `git status` shows no `.godot/`.

### B3 Display: 1920×1080 with a 480×270 pixel world — M
Project settings:

| Setting | Value | Why |
|---|---|---|
| `display/window/size/viewport_width × height` | 1920 × 1080 | Base UI resolution (D4) |
| `display/window/stretch/mode` | `canvas_items` | UI scales smoothly to any window |
| `display/window/stretch/aspect` | `keep` | 16:9, letterboxed |
| `rendering/textures/canvas_textures/default_texture_filter` | Nearest | Crisp pixel art |
| `rendering/2d/snap/snap_2d_transforms_to_pixel` | on | No half-pixel shimmer in the world |
| `physics/common/physics_ticks_per_second` | 60 | The fixed gameplay tick (PRD §12) |

Scene structure:

```text
Main (Node)
├── WorldViewportContainer (SubViewportContainer, texture filter: nearest)
│   └── WorldViewport (SubViewport, 480×270)      ← all gameplay lives here
│       └── World (Node2D, y_sort_enabled)
└── UI (CanvasLayer)                              ← HUD, dialogue, menus, at 1920×1080
```

- [ ] `world_viewport.gd`: on every window resize, pick the **largest whole-number scale** that
  fits (`floor(min(win_w / 480, win_h / 270))`, minimum 1), size and centre the container, and
  letterbox the rest. 1080p → 4×, 1440p → 5×, 4K → 8×.
- [ ] `main.tscn` draws a 480×270 test pattern (1-px checkerboard, a 32×48 box, the edges marked)
  in the world, and a line of Traditional Chinese text in the UI layer.
- [ ] Check: at 1920×1080 the checkerboard is exactly 4 screen px per square with no blur; resizing
  the window keeps it sharp; the Chinese text is crisp.

### B4 Input map — S
Actions named by **intent**, not by key, so touch controls (Phase 10) map onto the same names.
PRD §4:

| Action | Key | Action | Key |
|---|---|---|---|
| `move_left` / `move_right` | ← → | `special` | C |
| `move_up` / `move_down` (depth) | ↑ ↓ | `guard` | Shift (hold) |
| `jump` | Space | `interact` | E |
| `attack_light` | Z | `call_ally` | Q |
| `attack_heavy` | X | `pause` | Enter |

- [ ] Add the actions in project settings. Gamepad bindings can come later.
- [ ] Check: a debug label in `main.tscn` shows which actions are held.

### B5 Test framework — S
- [ ] Install GUT into `addons/gut/` and enable the plugin.
- [ ] `tests/test_smoke.gd` (extends `GutTest`) with one passing test.
- [ ] Record these commands in `CLAUDE.md`:

```bash
# all tests
godot --headless -s addons/gut/gut_cmdln.gd -gdir=res://tests -ginclude_subdirs -gexit
# one file
godot --headless -s addons/gut/gut_cmdln.gd -gtest=res://tests/test_smoke.gd -gexit
# one test by name
godot --headless -s addons/gut/gut_cmdln.gd -gdir=res://tests -ginclude_subdirs -gunit_test_name=test_smoke -gexit
```

- [ ] Check: the command exits with code 0 when tests pass and non-zero when one is broken on
  purpose.

### B6 Web export smoke test — S
- [ ] Add a **Web** export preset with thread support **off**, so the page does not need special
  cross-origin headers to run.
- [ ] Export `main.tscn` and open it from a local web server in Chrome; then on a phone if
  possible.
- [ ] Check: the test pattern loads and scales. Note the load time and download size in this page,
  as a baseline.

### B7 Close the phase — S
- [ ] `CLAUDE.md`: Godot version, run and test commands, D1–D5.
- [ ] Commit. Tick Phase 0B in the plan.

## Done when

- The project runs and the 480×270 world shows at exactly 4× in a 1920×1080 window.
- The smoke test passes headless, and a broken test makes the command fail.
- A web build loads in Chrome.

## Risks

| Risk | Mitigation |
|---|---|
| Godot minor versions change file formats | Pin one version in `CLAUDE.md` (B1) |
| Web export problems found late | Tested on an empty project here (B6) |

## Open questions

- None blocking. D6/D7 can be confirmed any time before Phase 10.
