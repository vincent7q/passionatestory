# Narrative — 《合格女婿》

**Status:** in review. Nothing in this folder is an approved V2 requirement until
the user approves it and the decision is applied to `design/game-brief.md`.

| File | Purpose |
|---|---|
| `story-draft.md` | Active story draft: six family tests and three endings (editable source) |
| `story-draft.html` | Reading copy generated from `story-draft.md`; regenerate after source edits |
| `story-discussion.md` | Open topics, positions and the user's decisions (T-01…T-09) |
| `story-review-claude.md` | Claude's review of the draft, with the user's inline answers (dated record) |

The previous project's storyboard is historical only and lives in
`docs/archive/storyboard-v1/`. Do not build from it.

Regenerate the HTML reading copy from the repository root after editing the
Markdown (Python dependencies: `markdown-it-py` and `beautifulsoup4`):

```powershell
python tools/narrative/render_story.py
python tools/narrative/render_story.py --check
```

The renderer uses the existing HTML as the reader shell and replaces story
content from Markdown, retaining its navigation, styling and reading controls.
These are document commands; they do not build or test a game.
