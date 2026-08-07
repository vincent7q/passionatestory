/**
 * Run tokens and signatures.
 *
 * BE HONEST ABOUT WHAT THIS DOES. The client has to sign its own submission,
 * so the HMAC key ships in the client bundle and anyone reading the JS can
 * forge a signature.
 *
 * The check with real teeth is the token's WALL-CLOCK FLOOR: a run claiming
 * fifteen minutes that started thirty seconds ago is rejected, and that cannot
 * be backdated. This stops curl and casual tampering. It does not stop a
 * determined person. Full prevention needs server-side replay validation,
 * which is deliberately out of scope.
 *
 * DO NOT DESCRIBE THE LEADERBOARD AS TAMPER-PROOF. See SPEC.md §11.3.
 */

import { createHmac, timingSafeEqual, randomUUID } from 'node:crypto';

/** Ships in the client bundle. Not a secret, and never treated as one. */
export const CLIENT_KEY = process.env.RUN_KEY ?? 'passionatestory-client-key';

/** A token older than this is stale — nobody plays for two hours. */
export const TOKEN_TTL_MS = 2 * 60 * 60 * 1000;

export function sign(payload, key = CLIENT_KEY) {
  return createHmac('sha256', key).update(payload).digest('hex');
}

export function issueToken(now = Date.now()) {
  const body = `${randomUUID()}.${now}`;
  return { token: `${body}.${sign(body)}`, issuedAt: now };
}

function safeEqual(a, b) {
  const ba = Buffer.from(a, 'utf8');
  const bb = Buffer.from(b, 'utf8');
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

/**
 * @returns {{ok: boolean, issuedAt?: number, reason?: string}}
 */
export function verifyToken(token, now = Date.now()) {
  if (typeof token !== 'string') return { ok: false, reason: 'token missing' };

  const parts = token.split('.');
  if (parts.length !== 3) return { ok: false, reason: 'token malformed' };

  const [id, issuedRaw, mac] = parts;
  const body = `${id}.${issuedRaw}`;
  if (!safeEqual(sign(body), mac)) return { ok: false, reason: 'token signature invalid' };

  const issuedAt = Number(issuedRaw);
  if (!Number.isFinite(issuedAt)) return { ok: false, reason: 'token timestamp invalid' };
  if (issuedAt > now + 5000) return { ok: false, reason: 'token issued in the future' };
  if (now - issuedAt > TOKEN_TTL_MS) return { ok: false, reason: 'token expired' };

  return { ok: true, issuedAt };
}

export function signRun(run, key = CLIENT_KEY) {
  return sign(JSON.stringify(run), key);
}

export function verifyRunSignature(run, signature, key = CLIENT_KEY) {
  if (typeof signature !== 'string') return false;
  try {
    return safeEqual(signRun(run, key), signature);
  } catch {
    return false;
  }
}
