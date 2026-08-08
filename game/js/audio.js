/**
 * Audio, synthesised. No asset files exist — docs/PRD.md §11.
 *
 * Everything a test can check is pure and lives at the top: the note maths, the
 * cue tables, and which notes a pattern fires on a given step. The Web Audio
 * calls at the bottom are a thin shell over that, so the interesting parts are
 * not trapped behind an AudioContext that Node does not have.
 *
 * That split is the same seam as game/js/assets.js: game code asks for a cue by
 * name and never learns how the sound is made, so real audio files can replace
 * the synthesis later without touching a caller.
 *
 * IT MUST NEVER BREAK THE GAME. Web Audio can be missing, blocked, or refused
 * until a user gesture, and none of that may stop someone finishing a run — so
 * every entry point here is guarded and returns quietly rather than throwing.
 */

// ── Pure: notes ──────────────────────────────────────────────────────────────

/** MIDI note number → Hz. 69 is A4 = 440. */
export const noteToFreq = (n) => 440 * (2 ** ((n - 69) / 12));

/**
 * Scales. Stage 2 is 「沙沙」 sparse guqin over drums, so it gets a pentatonic —
 * the interval pattern is doing the cultural work, not an instrument sample.
 */
export const SCALES = {
  minor: [0, 2, 3, 5, 7, 8, 10],
  pentatonic: [0, 2, 4, 7, 9],
};

/** Degree within a scale → MIDI note, wrapping into higher octaves. */
export function scaleNote(root, scale, degree) {
  const steps = SCALES[scale] ?? SCALES.minor;
  const octave = Math.floor(degree / steps.length);
  const index = ((degree % steps.length) + steps.length) % steps.length;
  return root + steps[index] + octave * 12;
}

// ── Pure: sound effects ──────────────────────────────────────────────────────

/**
 * One table, so a sound can be retuned without reading any code.
 *
 * `type` is the oscillator; `noise` swaps it for filtered white noise, which is
 * what makes an impact read as an impact rather than a beep.
 */
export const SFX = {
  light: { type: 'square', from: 320, to: 180, dur: 0.07, gain: 0.16 },
  heavy: { type: 'square', from: 220, to: 90, dur: 0.14, gain: 0.24, noise: 0.5 },
  guard: { type: 'triangle', from: 700, to: 620, dur: 0.06, gain: 0.14 },
  parry: { type: 'triangle', from: 1200, to: 1500, dur: 0.10, gain: 0.20 },
  jump: { type: 'sine', from: 300, to: 620, dur: 0.10, gain: 0.12 },
  land: { type: 'sine', from: 180, to: 80, dur: 0.08, gain: 0.10 },
  knockdown: { type: 'sawtooth', from: 200, to: 60, dur: 0.24, gain: 0.20, noise: 0.6 },
  hurt: { type: 'sawtooth', from: 260, to: 160, dur: 0.10, gain: 0.16 },
  money: { type: 'square', from: 880, to: 1320, dur: 0.09, gain: 0.13 },
  prop_break: { type: 'sawtooth', from: 160, to: 70, dur: 0.20, gain: 0.18, noise: 0.85 },
  menu_move: { type: 'square', from: 440, to: 440, dur: 0.04, gain: 0.10 },
  menu_confirm: { type: 'square', from: 660, to: 990, dur: 0.10, gain: 0.13 },

  /**
   * Helping someone up. Warm, small, and DELIBERATELY NOT A FANFARE.
   *
   * The award already pops on screen as a bare gold +3 with no label, and the
   * whole design depends on a player reading that as a minor bonus. A triumphant
   * sting here would tell them it is the real scoring, which the game must never
   * do before the form. It is a little warmer than a coin and nothing more.
   */
  help_up: { type: 'triangle', from: 660, to: 880, dur: 0.16, gain: 0.14 },

  /** 二叔's teacup. It should sound like hospitality, because it is. */
  tea: { type: 'sine', from: 990, to: 1180, dur: 0.18, gain: 0.10 },
  bow: { type: 'sine', from: 420, to: 300, dur: 0.22, gain: 0.10 },

  /** The whole room reacts. The only time anyone does, all evening. */
  gasp: { type: 'sine', from: 520, to: 300, dur: 0.45, gain: 0.22, noise: 0.35 },
};

// ── Pure: music ──────────────────────────────────────────────────────────────

/**
 * Cues, per docs/PRD.md §11.
 *
 * A cue is layers of step patterns. `-1` is a rest; anything else is a degree in
 * the cue's scale. Layers exist so a cue can lose all but one of them, which is
 * the entire point of `boss_final_phase2`.
 */
export const MUSIC = {
  title: {
    bpm: 100, root: 45, scale: 'minor',
    layers: [
      { id: 'bass', type: 'triangle', gain: 0.10, steps: [0, -1, 4, -1, 2, -1, 4, -1] },
      { id: 'lead', type: 'square', gain: 0.06, octave: 2, steps: [7, -1, -1, 6, -1, 4, -1, -1] },
    ],
  },

  /** Urgent city funk. He is chasing a van and losing. */
  stage_city: {
    bpm: 132, root: 45, scale: 'minor',
    layers: [
      { id: 'bass', type: 'sawtooth', gain: 0.11, steps: [0, 0, -1, 3, -1, 0, 2, -1] },
      { id: 'chord', type: 'square', gain: 0.05, octave: 2, steps: [-1, 7, -1, -1, 6, -1, -1, 4] },
      { id: 'hat', type: 'noise', gain: 0.05, steps: [1, -1, 1, -1, 1, -1, 1, 1] },
    ],
  },

  /** Sparse. Guqin over drums, and mostly silence between them. */
  stage_forest: {
    bpm: 88, root: 50, scale: 'pentatonic',
    layers: [
      { id: 'drum', type: 'noise', gain: 0.08, steps: [1, -1, -1, -1, 1, -1, -1, -1] },
      { id: 'guqin', type: 'triangle', gain: 0.07, octave: 1, steps: [4, -1, -1, 2, -1, -1, 0, -1] },
    ],
  },

  /** Strings, tense. The house knows he is coming. */
  stage_castle: {
    bpm: 108, root: 43, scale: 'minor',
    layers: [
      { id: 'low', type: 'sawtooth', gain: 0.09, steps: [0, -1, 0, -1, -1, 1, -1, -1] },
      { id: 'strings', type: 'triangle', gain: 0.07, octave: 2, steps: [4, 4, -1, 5, -1, 4, -1, 2] },
    ],
  },

  /** Driving. */
  boss: {
    bpm: 146, root: 41, scale: 'minor',
    layers: [
      { id: 'bass', type: 'sawtooth', gain: 0.12, steps: [0, 0, 3, 0, -1, 0, 3, 4] },
      { id: 'lead', type: 'square', gain: 0.06, octave: 2, steps: [7, -1, 6, -1, 7, -1, 9, -1] },
      { id: 'hat', type: 'noise', gain: 0.05, steps: [1, 1, 1, 1, 1, 1, 1, 1] },
    ],
  },

  /**
   * 林建國 stands up. EVERYTHING DROPS OUT BUT A SINGLE DRUM.
   *
   * PRD §11 names this specifically and it is the loudest thing in the game by
   * being the quietest. One layer, and that is not an oversight — a test asserts
   * it, because "add a bassline back" is the obvious well-meant edit that would
   * throw the moment away.
   */
  boss_final_phase2: {
    bpm: 96, root: 36, scale: 'minor',
    layers: [
      { id: 'drum', type: 'noise', gain: 0.15, steps: [1, -1, -1, -1, 1, -1, -1, -1] },
    ],
  },

  /** The reveal. Warm, and it should hurt a little. */
  reveal: {
    bpm: 72, root: 48, scale: 'minor',
    layers: [
      { id: 'pad', type: 'triangle', gain: 0.09, steps: [0, -1, -1, -1, 4, -1, -1, -1] },
      { id: 'melody', type: 'sine', gain: 0.07, octave: 1, steps: [-1, -1, 7, -1, -1, 6, -1, 4] },
    ],
  },
};

/** 「那個是真的。」 One sting, and then nothing. */
export const STINGER_CUE = { type: 'sawtooth', from: 140, to: 55, dur: 0.9, gain: 0.28, noise: 0.3 };

/** Seconds per step. Patterns are eight steps to the bar, so a step is a quaver. */
export const stepDuration = (bpm) => 60 / bpm / 2;

/**
 * What a layer plays on a given step. Pure, so the sequencer is testable
 * without an audio clock.
 *
 * @returns {null|{freq:number,type:string,gain:number}}
 */
export function stepVoice(cue, layer, step) {
  const degree = layer.steps[((step % layer.steps.length) + layer.steps.length) % layer.steps.length];
  if (degree === -1) return null;
  if (layer.type === 'noise') return { freq: 0, type: 'noise', gain: layer.gain };
  const note = scaleNote(cue.root, cue.scale, degree) + 12 * (layer.octave ?? 0);
  return { freq: noteToFreq(note), type: layer.type, gain: layer.gain };
}

/** Which cue a stage should be playing. Named so main.js carries no table. */
export const STAGE_CUES = { city: 'stage_city', forest: 'stage_forest', castle: 'stage_castle' };

export function cueForStage(stageId) {
  return STAGE_CUES[stageId] ?? 'stage_city';
}

// ── The browser shell ────────────────────────────────────────────────────────

/**
 * State only. No AudioContext is constructed here: browsers refuse to start one
 * before a user gesture, and constructing it at module load leaves a suspended
 * context that never recovers. `resume` is called from the first real input.
 */
export function createAudio({ muted = false } = {}) {
  return { ctx: null, master: null, muted, cue: null, step: 0, timer: null, failed: false };
}

function ensureContext(audio, win = globalThis) {
  if (audio.ctx || audio.failed) return audio.ctx;
  const Ctor = win.AudioContext ?? win.webkitAudioContext;
  if (!Ctor) { audio.failed = true; return null; }
  try {
    audio.ctx = new Ctor();
    audio.master = audio.ctx.createGain();
    audio.master.gain.value = audio.muted ? 0 : 1;
    audio.master.connect(audio.ctx.destination);
  } catch {
    // No audio is a bad evening, not a broken game.
    audio.failed = true;
  }
  return audio.ctx;
}

/** Call from the first user gesture. Safe to call repeatedly. */
export function resumeAudio(audio, win = globalThis) {
  const ctx = ensureContext(audio, win);
  if (ctx?.state === 'suspended') ctx.resume?.();
  return !!ctx;
}

export function setMuted(audio, muted) {
  audio.muted = muted;
  if (audio.master) audio.master.gain.value = muted ? 0 : 1;
  return audio.muted;
}

export const toggleMute = (audio) => setMuted(audio, !audio.muted);

/** One short voice: oscillator or noise, through its own envelope. */
function voice(audio, { type, from, to, dur, gain, noise = 0 }, when = 0) {
  const ctx = audio.ctx;
  if (!ctx) return;
  const t = ctx.currentTime + when;
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(Math.max(0.0001, gain), t + 0.008);
  env.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  env.connect(audio.master);

  if (type === 'noise' || noise > 0) {
    const frames = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < frames; i += 1) data[i] = (Math.random() * 2 - 1);
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const ng = ctx.createGain();
    ng.gain.value = type === 'noise' ? 1 : noise;
    src.connect(ng); ng.connect(env);
    src.start(t); src.stop(t + dur);
    if (type === 'noise') return;
  }

  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(from, t);
  if (to !== from) osc.frequency.exponentialRampToValueAtTime(Math.max(1, to), t + dur);
  osc.connect(env);
  osc.start(t); osc.stop(t + dur);
}

export function playSfx(audio, name, win = globalThis) {
  const spec = SFX[name];
  if (!spec || audio.muted) return false;
  if (!ensureContext(audio, win)) return false;
  try { voice(audio, spec); } catch { return false; }
  return true;
}

/** 「那個是真的。」 */
export function playStinger(audio, win = globalThis) {
  if (audio.muted || !ensureContext(audio, win)) return false;
  try { voice(audio, STINGER_CUE); } catch { return false; }
  return true;
}

/**
 * Start a cue. Re-requesting the cue already playing is ignored, so calling
 * this every frame from a state update is safe and will not restart the bar.
 */
export function playMusic(audio, cueName, win = globalThis) {
  if (audio.cue === cueName) return false;
  const cue = MUSIC[cueName];
  if (!cue) return false;
  stopMusic(audio);
  audio.cue = cueName;
  audio.step = 0;
  if (!ensureContext(audio, win)) return false;

  const tick = () => {
    if (audio.cue !== cueName) return;
    if (!audio.muted) {
      for (const layer of cue.layers) {
        const v = stepVoice(cue, layer, audio.step);
        if (!v) continue;
        try {
          voice(audio, v.type === 'noise'
            ? { type: 'noise', from: 0, to: 0, dur: 0.06, gain: v.gain }
            : { type: v.type, from: v.freq, to: v.freq, dur: stepDuration(cue.bpm) * 0.9, gain: v.gain });
        } catch { /* a dropped note is not worth stopping the music for */ }
      }
    }
    audio.step += 1;
  };

  tick();
  audio.timer = win.setInterval?.(tick, stepDuration(cue.bpm) * 1000) ?? null;
  return true;
}

export function stopMusic(audio, win = globalThis) {
  if (audio.timer !== null) win.clearInterval?.(audio.timer);
  audio.timer = null;
  audio.cue = null;
  audio.step = 0;
  return audio;
}
