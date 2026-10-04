# Phase 1 — Core data architecture

[← Phase 0A](phase-00a-storyboard.md) · [Phase 0B](phase-00b-setup.md) · [plan](../plan.md) · next: [Phase 2](phase-02-character-skill-data.md)

## Goal

The plumbing every piece of content sits on: a base data type, a loader that finds content by id,
a reference convention, a string table, and the documentation rules. No gameplay yet.

## Why this phase exists

§23 asks for content an AI agent can read and change safely: stable ids, clear schemas, explicit
dependencies, predictable locations, validation. All of that is decided here, once, so every later
data type follows the same pattern.

## Deliverables

```text
systems/content/content_data.gd      ContentData (base Resource)
systems/content/content_loader.gd    ContentLoader (plain class: scan + index + errors)
systems/content/content_db.gd        ContentDB (autoload, wraps ContentLoader)
systems/core/event_bus.gd            EventBus (autoload, global gameplay signals)
data/text/strings.csv                every player-facing string, zh_TW + en
docs/schemas/README.md               how schemas are documented
docs/schemas/content_data.md
tests/data/test_content_loader.gd
tests/data/test_strings.gd
tests/fixtures/data/…                small fake content for tests
```

## Design

### `ContentData` — the base of every data type

| Field | Type | Meaning |
|---|---|---|
| `id` | `StringName` | Stable id, `<type>_<name>`. Must equal the filename |
| `name_key` | `String` | Key into `strings.csv` for the display name (never the text itself) |
| `notes` | `String` | Designer notes; never shown to the player |
| `tags` | `PackedStringArray` | Free-form labels for searching and filtering in tools |

Every data type in later phases is `class_name XxxData extends ContentData`.

### `ContentLoader` and `ContentDB`

- `ContentLoader` is a plain class (not a node) so it works in **three places**: the `ContentDB`
  autoload at runtime, unit tests, and the headless validator (Phase 9), where autoloads may not be
  available.
- It walks `res://data/` recursively, loads every `.tres`, and indexes by `id`.
- It records errors instead of stopping at the first one: duplicate id, filename ≠ id, a resource
  that isn't `ContentData`, a file that fails to load.
- API: `get_content(id) -> ContentData` (error if missing), `has(id)`, `all_of_type(script)`,
  `errors() -> Array`.
- **Exported builds store resources differently** from the editor (files can be renamed or
  remapped on export). The loader must handle that; check it on the web build from Phase 0.

### References between content

| What is referenced | How | Example |
|---|---|---|
| Other content (skills, AI profiles, events…) | **By id** (`StringName`), resolved through `ContentDB` | `skill_ids = [&"skill_rapid_punch"]` |
| Assets (textures, sprite frames, audio) | By resource path, with Godot's normal `@export` | `portrait: Texture2D` |
| Data owned by one item only (its stats, its hitbox) | Embedded sub-resource inside the same `.tres` | `stats: StatsData` |

Ids rather than direct links between content keep §23's "explicit dependencies": a validator can
list and check every reference, and renaming a file can't silently break one.

### `EventBus`

One autoload with gameplay signals, so systems don't need references to each other. Scoring, HUD,
audio and the event system listen; combat, items and props emit. Signals are added by the phase
that needs them; Phase 3 adds the combat ones.

### Strings — one table, for C2

- `data/text/strings.csv`, Godot's translation CSV format: `keys,zh_TW,en`.
- **No player-facing text is ever typed into a scene or a script.** Everything goes through a key
  and `tr()`. This is what makes the "禮 never appears early" rule checkable: there is one file to
  scan.
- Key prefixes group strings by where they appear: `ui.`, `name.`, `dlg.`, `bark.`, `eval.`.
  **Only `eval.` keys may contain 禮.**

## Steps

- [ ] **1.1** `ContentData` and `docs/schemas/content_data.md`.
- [ ] **1.2** `ContentLoader` with the error checks above; test fixtures with a good file, a
  duplicate id, a filename/id mismatch, and a broken file.
- [ ] **1.3** `ContentDB` autoload; loads at boot and prints every loader error. Missing ids at
  runtime fail loudly (`push_error` plus an assert in debug builds).
- [ ] **1.4** `EventBus` autoload, empty for now.
- [ ] **1.5** `strings.csv` with the first keys (title, the pause menu entries) and a test that
  fails if **禮** appears in any non-`eval.` key's text — C2's first automated guard.
- [ ] **1.6** `docs/schemas/README.md`: one page per data type, listing each field, its type, its
  meaning, its allowed range, and which PRD/story section it comes from.

## Tests

| Test | Checks |
|---|---|
| `test_content_loader.gd` | Loads fixtures; finds by id; reports duplicate id, filename ≠ id, wrong type, unloadable file; missing-id lookup errors |
| `test_strings.gd` | C2 — no 禮 outside `eval.*`; every key has both `zh_TW` and `en` |

## Done when

A dummy resource dropped into `data/` is found by id with **no code change**, and each kind of
broken file is reported with its path.

## Risks

| Risk | Mitigation |
|---|---|
| Loader works in the editor but not in an exported build | Test on the web build (from Phase 0) |
| Hard-coded text sneaks into scenes later | The Phase 9 validator also scans `.tscn` files for literal text |
