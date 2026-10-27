# Passionate Story V2

A fresh Godot game project based on the story idea for **熱血物語：見家長**
(*Meeting the Parents*).

The player believes he is rescuing his girlfriend. The hidden truth is a family
test, with a connection to the parents' own history. V2 starts from that premise;
the previous implementation and production decisions are not carried forward.

## Current State

Repository cleanup and collaboration setup are complete. There is no
`project.godot`, production artwork, or game test suite yet. The exact Godot
version and technical setup are the next development decisions.

## Start Here

- [Game brief](design/game-brief.md): the story idea and proposed first slice.
- [Development plan](docs/plan.md): the single project progress tracker.
- [Art guide](docs/art/README.md): specifications, ownership, and handoffs.
- [Asset manifest](docs/art/asset-manifest.json): shared asset status.
- [Story source](idea/README.md): recovered historical storyboard, for reference.
- [Repository guidelines](AGENTS.md): instructions for both assistants.
- [Cleanup record](docs/cleanup-v2.md): recovery and changes made.

## Responsibilities

Claude develops and validates the game in Godot using Claude Code Game Studios
(CCGS) in `minimal` mode. Codex produces and prepares artwork using selected art
skills and image generation. The user approves creative direction and scope.

Start Claude Code from this directory with `claude`, read the brief and plan,
then run `/setup-engine godot`. Do not run game build or test commands until a
project exists and those commands have been documented and verified.

## Tooling & Attribution

`.claude/` and `CCGS Skill Testing Framework/` contain the retained CCGS toolkit;
they are not game content. `.agents/skills/create-game-assets/` contains the
selected asset-production skill. Its own technical examples are not project
requirements. See [tooling provenance](docs/tooling.md).

The existing root [MIT license](LICENSE) preserves the CCGS upstream notice.
The selected art skill carries its Apache-2.0 license and NOTICE. These notices
do not establish licensing or publication rights for future game art; record
asset provenance in the manifest.
