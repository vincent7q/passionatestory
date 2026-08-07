/**
 * Talking to the server.
 *
 * The client signs its own submission, which means the key ships in this
 * bundle. Anyone reading the JS can forge a signature — see SPEC.md §11.3.
 * The check with teeth lives server-side, on the run token's wall clock.
 *
 * Every call fails soft: a leaderboard that is down must never stop someone
 * finishing a run.
 */

/** Same value as the server's default. Not a secret, and never treated as one. */
export const CLIENT_KEY = 'passionatestory-client-key';

async function hmacHex(key, message) {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    'raw', enc.encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, enc.encode(message));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function signRun(run, key = CLIENT_KEY) {
  return hmacHex(key, JSON.stringify(run));
}

/**
 * Call at the START of a run, not the end. The token carries a server
 * timestamp, and the wall clock between issue and submission is what makes a
 * fabricated duration impossible.
 */
export async function startRunToken() {
  try {
    const res = await fetch('/api/runs/start', { method: 'POST' });
    if (!res.ok) return null;
    return (await res.json()).token;
  } catch {
    return null;
  }
}

export async function submitRun(token, run) {
  if (!token) return { ok: false, reason: 'no token' };
  try {
    const res = await fetch('/api/runs', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ token, run, signature: await signRun(run) }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { ok: false, reason: body.error ?? `http ${res.status}`, details: body.details };
    }
    return { ok: true, ...(await res.json()) };
  } catch (err) {
    return { ok: false, reason: String(err) };
  }
}

export async function fetchLeaderboard({ candidate, difficulty, limit = 20 } = {}) {
  const params = new URLSearchParams();
  if (candidate) params.set('candidate', candidate);
  if (difficulty) params.set('difficulty', difficulty);
  params.set('limit', String(limit));
  try {
    const res = await fetch(`/api/leaderboard?${params}`);
    if (!res.ok) return [];
    return (await res.json()).entries;
  } catch {
    return [];
  }
}
