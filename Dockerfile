# 熱血物語：見家長
#
# Deploy target is Ubuntu 22.04. Node 22 is what the suite is currently verified
# on; better-sqlite3 is pinned to ^11.10.0 because 12.x ships no prebuild for
# several of the platforms this has to install on, and falling back to compiling
# needs a toolchain that is not in this image.
#
# THERE IS NO BUILD STEP AND THERE MUST NOT BE ONE. The browser loads the ES
# modules straight off the server (SPEC.md C7), so this image only installs
# dependencies and copies source.
FROM node:22-bookworm-slim

ENV NODE_ENV=production

WORKDIR /app

# Dependencies first, so a source edit does not re-run npm ci on every build.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY server ./server
COPY shared ./shared
COPY game ./game
COPY dashboard ./dashboard

# THE DATABASE MUST NOT LIVE INSIDE THE IMAGE.
#
# This is the deployment mistake that actually hurts: a database file written
# into the container filesystem is destroyed by every redeploy, silently, and
# nobody notices until the leaderboard is empty. /data is a mount point, and
# docker-compose.yml puts a named volume on it.
ENV DB_PATH=/data/records.db
RUN mkdir -p /data && chown -R node:node /data
VOLUME ["/data"]

# Drop root. The process only needs to read /app and write /data.
USER node

ENV PORT=8080
EXPOSE 8080

# No shell form, so signals reach node directly and the container stops cleanly
# rather than waiting out the ten-second kill timeout.
CMD ["node", "server/index.js"]
