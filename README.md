# 熱血物語：見家長 — Meeting the Parents

A browser side-scrolling beat-'em-up in the style of *River City Girls*.

A black van pulls up. Three men take 林小雨. You are knocked flat, and by the time you are on your
feet the van is gone.

Pick one of three heroes and go get her back — across the city at rush hour, up a private mountain
road, and into the estate at the top of it.

You will not understand the title until you finish.

Runs entirely on HTML5 Canvas with no game engine and no build step. A small Node backend records
completed runs to SQLite and serves a leaderboard dashboard.

---

## Contents

- [Running locally](#running-locally)
- [Deploying on Ubuntu 22.04 with Docker](#deploying-on-ubuntu-2204-with-docker) ← the deployment guide
- [Backups](#backups)
- [Updating a running deployment](#updating-a-running-deployment)
- [Behind Nginx with HTTPS](#behind-nginx-with-https-optional)
- [Troubleshooting](#troubleshooting)
- [Controls](#controls) · [Tests](#tests) · [Leaderboard integrity](#leaderboard-integrity-honestly)

---

## Running locally

Requires **Node.js 20 or newer** (verified on 20.17.0 and 22.16.0). No Docker needed for local work.

```bash
git clone https://github.com/vincent7q/passionatestory.git
cd passionatestory
npm install
npm run dev
```

| URL | |
|---|---|
| <http://localhost:8080> | the game |
| <http://localhost:8080/dashboard> | leaderboard + stats |

The game uses ES modules, so it must be served over HTTP — opening `game/index.html` from the
filesystem will not work.

> **Local runs keep no records.** With `DB_PATH` unset the database is `:memory:`, so scores vanish
> when you stop the server. That is deliberate for development. Set `DB_PATH=./records.db` if you
> want them to persist locally.

---

## Deploying on Ubuntu 22.04 with Docker

One container, SQLite on a named volume. Takes about five minutes on a fresh box.

### 1. Install Docker Engine and the Compose plugin

Ubuntu's own `docker.io` package is old and does **not** include `docker compose` (the v2 plugin), so
use Docker's official repository:

```bash
# Remove anything conflicting that may already be present
sudo apt-get remove -y docker docker-engine docker.io containerd runc

sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg

# Docker's official GPG key
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# The repository (jammy = 22.04)
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
https://download.docker.com/linux/ubuntu jammy stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io \
  docker-buildx-plugin docker-compose-plugin
```

Verify — the second command must print v2.x:

```bash
sudo docker --version
sudo docker compose version
```

Optionally run Docker without `sudo` (log out and back in afterwards):

```bash
sudo usermod -aG docker "$USER"
```

> Adding yourself to the `docker` group grants effective root on the host. On a shared machine,
> prefer `sudo docker`.

### 2. Get the code

```bash
sudo apt-get install -y git
git clone https://github.com/vincent7q/passionatestory.git
cd passionatestory
```

### 3. Configure

Compose already sets `DB_PATH`, `PORT` and `NODE_ENV`. The one thing worth changing is the signing
key, and compose picks it up from a `.env` file automatically — no YAML editing:

```bash
printf 'RUN_KEY=%s\n' "$(openssl rand -hex 32)" > .env
chmod 600 .env
```

`.env` is already gitignored. Leave it out and the key falls back to the development default, so
nothing breaks silently — it is simply a key everyone can read in the source.

> Read [Leaderboard integrity](#leaderboard-integrity-honestly) before assuming this key buys more
> than it does. It ships to the browser by necessity, so it raises the effort to forge a score — it
> does not prevent it.

### 4. Build and start

```bash
sudo docker compose up --build -d
```

### 5. Verify

```bash
sudo docker compose ps                 # State should be "running (healthy)"
curl -fsS http://localhost:8080/healthz # {"status":"ok"}
curl -fsS "http://localhost:8080/api/leaderboard?limit=3"
```

The last one is the one that matters: `/healthz` returns a static payload and never reads the
database, so it can report healthy while the store is broken. The leaderboard endpoint actually
queries SQLite, and a fresh install returns 林建國's seeded **71**.

Then open `http://<server-ip>:8080` for the game and `http://<server-ip>:8080/dashboard` for the
board.

### 6. Confirm records survive a recycle

This is hard success criterion **C3**, and it is worth doing once on the real box:

```bash
# Note what is on the board
curl -fsS "http://localhost:8080/api/leaderboard?limit=100" | head -c 400

sudo docker compose down          # stops and removes the container
sudo docker compose up -d         # brings it back

# The same rows must still be there
curl -fsS "http://localhost:8080/api/leaderboard?limit=100" | head -c 400
```

If the board came back empty, `DB_PATH` is not pointing inside the mounted volume — see
[Troubleshooting](#troubleshooting).

### Open the firewall, if `ufw` is active

```bash
sudo ufw allow 8080/tcp     # or 80/443 only, if you put Nginx in front
```

---

## The data, and the one mistake that actually hurts

Records live at **`/data/records.db` inside the container**, backed by the named volume
**`passionatestory_records`**.

**`DB_PATH` must point inside that mount.** Anywhere else puts the database in the container's own
filesystem, where **every redeploy destroys it silently** — you find out when the leaderboard is
empty and there is nothing to recover. `test/server/deploy.test.js` fails if either the compose file
or the Dockerfile ever drifts.

| Command | Records |
|---|---|
| `docker compose down` | **kept** |
| `docker compose down && up --build` | **kept** |
| `docker compose down -v` | **destroyed** — the `-v` removes named volumes |

**Never scale this service.** The store is SQLite, which takes a single writer; a second replica
would corrupt it or silently diverge. There is no `replicas` setting in the compose file and a test
fails if one appears.

---

## Backups

The whole database is one file on a volume. SQLite runs in WAL mode, so copying the file while the
server is writing can capture a torn state — use `sqlite3 .backup`, which is safe on a live database:

```bash
sudo docker compose exec -T game \
  node -e "const D=require('better-sqlite3');const d=new D(process.env.DB_PATH,{readonly:true});d.backup('/data/backup.db').then(()=>d.close())"

sudo docker compose cp game:/data/backup.db "./records-$(date +%F).db"
sudo docker compose exec -T game rm /data/backup.db
```

To restore, stop the stack, copy a backup back in as `/data/records.db`, and start it again.

---

## Updating a running deployment

```bash
cd passionatestory
git pull
sudo docker compose up --build -d
```

Compose recreates the container and reattaches the same volume, so records carry over. Take a backup
first if the release touches `server/migrations/`.

Roll back to a known tag:

```bash
git checkout v0.9-content-complete
sudo docker compose up --build -d
```

---

## Behind Nginx with HTTPS (optional)

Publishing on port 8080 is fine for a LAN or a demo. For anything public, terminate TLS in front.

Bind the app to localhost only, so it is reachable *only* through the proxy — in
`docker-compose.yml`:

```yaml
    ports:
      - "127.0.0.1:8080:8080"
```

Then:

```bash
sudo apt-get install -y nginx
sudo tee /etc/nginx/sites-available/passionatestory > /dev/null <<'CONF'
server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass         http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }
}
CONF

sudo ln -sf /etc/nginx/sites-available/passionatestory /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# Free certificate, and a redirect to HTTPS
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d example.com
```

Remember to close the direct port if you opened it: `sudo ufw delete allow 8080/tcp`.

---

## Troubleshooting

**`docker compose` says `compose` is not a command.** You have Compose v1 from Ubuntu's own
packages. Install `docker-compose-plugin` from Docker's repository (step 1).

**The leaderboard is empty after a redeploy.** `DB_PATH` is not inside the volume. Check both:

```bash
sudo docker compose config | grep -E "DB_PATH|records|/data"
sudo docker compose exec game sh -c 'ls -la /data'
```

`/data/records.db` must exist and `DB_PATH` must be `/data/records.db`. Confirm the volume is real:

```bash
sudo docker volume inspect passionatestory_records
```

**Container restarts in a loop.** Read the logs — a permission error on `/data` is the usual cause,
since the process runs as the unprivileged `node` user:

```bash
sudo docker compose logs --tail=50 game
```

**Port 8080 already in use.** Change the host side only, leaving the container port alone:
`- "9090:8080"`.

**The page loads but nothing renders.** Check the browser console. The game is served as ES modules
with no build step, so a 404 on any module leaves a blank canvas rather than an error dialog.

**`healthy` but the game misbehaves.** Expected: `/healthz` never reads the database. Use
`/api/leaderboard` to prove the store.

---

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

## Environment variables

| Variable | Default | |
|---|---|---|
| `DB_PATH` | `:memory:` | Path to the SQLite file. Compose sets it to `/data/records.db`. Unset, records vanish on restart. |
| `PORT` | `8080` | |
| `NODE_ENV` | — | Compose sets `production`. |
| `RUN_KEY` | `passionatestory-client-key` | HMAC key for run submissions. Override via `.env`; read the note below for what it does and does not buy you. |

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
