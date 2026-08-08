# 熱血物語：見家長 — Meeting the Parents

A browser side-scrolling beat-'em-up in the style of *River City Girls*.

A black van pulls up. Three men take 林小雨. You are knocked flat, and by the time you are on your
feet the van is gone.

Pick one of three heroes and go get her back — across the city at rush hour, up a private mountain
road, and into the estate at the top of it.

You will not understand the title until you finish.

Runs entirely on HTML5 Canvas with no game engine and no build step. A small Node backend records
completed runs to SQLite and serves a leaderboard dashboard.

## Requirements

- **Node.js 20 or newer.** Verified on 20.17.0 and 22.16.0.
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
| M | Mute |
| ` | Frame-time overlay |

On a phone a touch pad appears instead — d-pad on the left, buttons on the right. It shows up only
when the device's primary pointer is actually a finger, so a laptop with a touchscreen keeps its
whole screen.

Knock someone down and they'll sit there dazed for about ten seconds before getting up and wandering
off. You can do something about that, if you can spare the time.

You almost certainly cannot spare the time.

## Tests

```bash
npm test
```

> Run it through `npm test`, not `node --test test/`. The latter discovers **zero** tests on Node 22
> and reports a single module-not-found, which looks exactly like a broken checkout. See `SPEC.md`
> §12 for why the script is the shape it is.

## Deployment

Targets Ubuntu 22.04 with Docker. **One container, and it must never be replicated** — the store is
SQLite, which takes a single writer.

```bash
docker compose up --build -d
```

Records live at `/data/records.db`, backed by the named volume `passionatestory_records`. They
survive `docker compose down`; they do **not** survive `docker compose down -v`.

**The database must stay on that volume.** A `DB_PATH` pointing anywhere else puts it inside the
image, where every redeploy destroys it silently — you find out when the leaderboard is empty.
`test/server/deploy.test.js` fails if the compose file or the Dockerfile ever drifts.

### Environment

| Variable | Default | |
|---|---|---|
| `DB_PATH` | `:memory:` | Path to the SQLite file. **Set this in production.** An unset value means records vanish on restart. |
| `PORT` | `8080` | |
| `RUN_KEY` | a dev default | HMAC key for run submissions. Change it in production — but read the note below about what that does and does not buy you. |

## Leaderboard integrity, honestly

Submissions are signed and the server recomputes every score from the raw run rather than trusting
what the client sends, so an inflated total in a payload is simply ignored.

**It is not tamper-proof, and it cannot be.** The client has to sign its own submission, so the HMAC
key ships in the browser bundle — anyone reading the JavaScript can forge a signature, and changing
`RUN_KEY` only means they have to look again.

The check with real teeth is the run token's wall-clock floor: `POST /api/runs/start` issues a signed
server timestamp, and a run claiming fifteen minutes that started thirty seconds ago is rejected.
That cannot be backdated from the client.

Together this stops `curl` and casual tampering. It does not stop someone determined. Full prevention
needs server-side replay validation, which is deliberately out of scope — so **don't describe this
leaderboard as tamper-proof.**

## Layout

```
docs/       story.md — the story bible; PRD.md — mechanics spec; HUD reference screenshots
shared/     scoring + validation, imported by BOTH the game and the server
game/       the client: canvas renderer, entities, stages, UI, audio, touch
server/     Fastify API, SQLite access, migrations
dashboard/  leaderboard page
test/       the suite; helpers/ holds the stub DOM that lets main.js be tested
```

`shared/` is fetched by the browser over HTTP *and* imported by Node, so it must stay free of
Node-only APIs — scoring exists exactly once and the client cannot drift from the server.

See `CLAUDE.md` for architecture notes, `SPEC.md` for engineering contracts, and `progress.md` for
where the work actually stands.

> ⚠️ **Contributors: `docs/story.md`, `docs/PRD.md`, and `CLAUDE.md` all spoil the ending.**
> You need them to work on this. Play it first if you'd rather not know.
>
> The twist is carried almost entirely by what the interface does and does not say, so read
> **CLAUDE.md → Spoiler discipline** before touching any HUD or UI string. It is the easiest thing
> in this project to break by accident.
