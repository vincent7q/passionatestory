# 熱血物語：見家長 — Meeting the Parents

A browser side-scrolling beat-'em-up in the style of *River City Girls*.

A black van pulls up. Three men take 林小雨. You are knocked flat, and by the time you are on your
feet the van is gone.

Pick one of three heroes and go get her back — across the city at rush hour, up a private mountain
road, and into the estate at the top of it. You have until six o'clock.

You will not understand the title until you finish.

Runs entirely on HTML5 Canvas with no game engine and no build step. A small Node backend records
completed runs to SQLite and serves a leaderboard dashboard.

## Requirements

- Node.js 22 or newer
- Docker + Docker Compose (deployment only)

## Running locally

```bash
npm install
npm run dev
```

Then open:

| URL | |
|---|---|
| <http://localhost:8080> | the game |
| <http://localhost:8080/dashboard> | leaderboard + stats |

The game uses ES modules, so it must be served over HTTP — opening `game/index.html` directly from
the filesystem will not work.

## Controls

| Key | Action |
|---|---|
| ← → ↑ ↓ | Move (↑/↓ move in depth) |
| Space | Jump |
| Z | Light attack |
| X | Heavy attack |
| C | Special (costs 氣) |
| Shift | Guard — parry on the frame of impact |
| **E** | Context action — the prompt tells you when |
| Q | Call an ally |
| Enter | Pause |

Knock someone down and they'll sit there dazed for about ten seconds before getting up and wandering
off. You can do something about that, if you can spare the time.

You almost certainly cannot spare the time.

## Tests

```bash
npm test
```

## Deployment

Targets Ubuntu 22.04 with Docker. One container; SQLite persists on a named volume.

```bash
docker compose up --build -d
```

Set `SCORE_SECRET` in the environment before deploying — the default is for local development only.

Player records live at `/data/records.db` inside the container, backed by the `gamedata` volume.
They survive `docker compose down`; they do **not** survive `docker compose down -v`.

## Layout

```
docs/       story.md — the story bible; PRD.md — mechanics spec; HUD reference screenshots
shared/     scoring + validation, imported by BOTH the game and the server
game/       the client: canvas renderer, entities, stages, UI
server/     Fastify API, SQLite access, migrations
dashboard/  leaderboard page
```

See `CLAUDE.md` for architecture notes.

> ⚠️ **Contributors: `docs/story.md`, `docs/PRD.md`, and `CLAUDE.md` all spoil the ending.**
> You need them to work on this. Play it first if you'd rather not know.
>
> The twist is carried almost entirely by what the interface does and does not say, so read
> **CLAUDE.md → Spoiler discipline** before touching any HUD or UI string. It is the easiest thing
> in this project to break by accident.
