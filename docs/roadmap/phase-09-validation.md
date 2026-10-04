# Phase 9 — Content validation

[← Phase 8](phase-08-level-event.md) · [plan](../plan.md) · next: [Phase 10](phase-10-content.md)

## Goal

One command that finds broken content — and spoiler leaks — before anyone plays it. From here on,
nothing is committed with validator errors.

## Why this phase exists

§26.5: "the validator is especially important for AI-assisted development". Phase 10 is mass
content production; this is the safety net under it. Some checks already exist (the `ContentDB`
load checks from Phase 1, the C1/C2/C3 tests); this phase gathers them into one tool and adds the
rest.

## Deliverables

```text
tools/validators/validate.gd        headless entry point (exit code 0 / 1)
tools/validators/validation_rule.gd base class: check(db) -> Array[Issue]
tools/validators/rules/*.gd         one file per rule
tests/validators/…                  a broken fixture per rule
```

Run with:

```bash
godot --headless --script res://tools/validators/validate.gd
```

Output, one issue per line, so humans and AI agents can act on it:

```text
ERROR data/skills/skill_rapid_punch.tres: animation "rapid_punch" not in animset_felix
WARN  scenes/ui/hud.tscn: Label "Clock" has literal text; use a string key
2 errors, 1 warning
```

The character editor's validation strip (Phase 5) and the skill editor (Phase 6) call the same
rule classes.

## Rules

### From the workflow (§26.5)

| Rule | Catches |
|---|---|
| Missing asset | A texture, sprite frames or sound path that doesn't exist |
| Missing skill / animation | A moveset id with no skill; a skill's clip missing from the animation set; a character missing a required clip for its type |
| Duplicate id | Two files with the same id |
| Id / filename / folder | Filename ≠ id; wrong prefix for the folder |
| Invalid reference | Any id field pointing at nothing, or at the wrong type |
| Invalid parameter | Values out of range: negative HP, active window outside the skill length, depth band of 0… |
| Missing required field | Empty `name_key`, no hitbox on an attack… |
| Circular dependency | Events that wait on each other; status effects that apply each other forever |
| Broken level reference | Waves, props, pickups or events in a level that don't exist |

### Specific to this game

| Rule | Why |
|---|---|
| **C1** — run `ScoreCalculator` on the masher profile with the real `scoring_rules.tres`; must be < 71 | Scoring values are data, so a data edit can break the core promise |
| **C3** — 禮 set-pieces sum to 37 and the cap is 40 | A full column must need at least one help-up |
| **C2a** — no 禮 in any `strings.csv` text outside `eval.*` | The twist |
| **C2b** — no literal player-facing text in `.tscn` files; everything through keys | Otherwise C2a can be bypassed |
| **C2c** — no `eval.*` key used outside the evaluation scenes | The form's strings can't leak elsewhere |
| Every key has `zh_TW` and `en` | Bilingual convention |
| Every dialogue / bark line has a speaker and an existing key | Broken scenes |
| Text nodes only in the UI layer | Chinese text stays crisp (D4) |
| Every `BOSS` has an arena and at least one phase | The old build shipped a boss with no behaviour |

## Steps

- [ ] **9.1** Entry point, `ValidationRule`, output format, exit code.
- [ ] **9.2** Move the Phase 1 loader checks into rules.
- [ ] **9.3** Reference, asset and animation rules.
- [ ] **9.4** Parameter and required-field rules (ranges declared next to each field in its schema
  page).
- [ ] **9.5** Circular dependency and level reference rules.
- [ ] **9.6** C1, C2a–c, C3 and the other game-specific rules.
- [ ] **9.7** A broken fixture per rule in `tests/validators/`.
- [ ] **9.8** Hook the rules into the character and skill editors.
- [ ] **9.9** Record the command in `CLAUDE.md`; decide whether to add a git pre-commit hook that
  runs the validator and tests.

## Done when

Every rule has a fixture that makes it fail with a clear message; the real `data/` passes clean;
and a deliberately broken `.tres` is rejected.

## Risks

| Risk | Mitigation |
|---|---|
| Rules too strict, so people work around them | Errors only for things that break the game or the twist; style issues are warnings |
| Schema docs and rules drift apart | Ranges are written once, next to the field, and the rule reads them |
