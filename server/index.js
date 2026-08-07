import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { openDatabase } from './db.js';
import { registerRunRoutes } from './routes/runs.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

/**
 * Build the app without listening, so tests can drive it via inject().
 * Callers that actually want a socket call listen() themselves.
 */
export async function buildServer(opts = {}) {
  const app = Fastify({ logger: opts.logger ?? false });

  // The game is the site root.
  await app.register(fastifyStatic, {
    root: join(ROOT, 'game'),
    prefix: '/',
  });

  // shared/ is served so the BROWSER can import the very modules Node imports.
  // Scoring then exists exactly once; the client cannot drift from the server.
  await app.register(fastifyStatic, {
    root: join(ROOT, 'shared'),
    prefix: '/shared/',
    decorateReply: false,
  });

  await app.register(fastifyStatic, {
    root: join(ROOT, 'dashboard'),
    prefix: '/dashboard/',
    decorateReply: false,
  });

  // Tests pass ':memory:'. Production passes a path on a MOUNTED VOLUME —
  // inside the image, every redeploy silently wipes all records.
  const db = opts.db ?? openDatabase(opts.dbPath ?? process.env.DB_PATH ?? ':memory:');
  app.decorate('db', db);
  app.addHook('onClose', () => db.close());

  registerRunRoutes(app, db);

  app.get('/healthz', async () => ({ status: 'ok' }));

  return app;
}

// Only bind a port when executed directly — never when imported by a test.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const app = await buildServer({ logger: true });
  const port = Number(process.env.PORT ?? 8080);
  await app.listen({ port, host: '0.0.0.0' });
}
