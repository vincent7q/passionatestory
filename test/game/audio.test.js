import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  SFX, MUSIC, SCALES, STINGER_CUE, STAGE_CUES,
  noteToFreq, scaleNote, stepDuration, stepVoice, cueForStage,
  createAudio, resumeAudio, setMuted, toggleMute,
  playSfx, playMusic, stopMusic, playStinger,
} from '../../game/js/audio.js';

/**
 * T86. docs/PRD.md §11 — everything synthesised, no asset files.
 *
 * What is worth testing is not whether it sounds good. It is that the tables
 * are coherent, that the sequencer picks the right note, that muting is
 * actually silent, and that a browser with no Web Audio at all cannot stop
 * someone finishing a run.
 */

// ── Notes ────────────────────────────────────────────────────────────────────

test('A4 is 440Hz and octaves double', () => {
  assert.equal(Math.round(noteToFreq(69)), 440);
  assert.equal(Math.round(noteToFreq(81)), 880);
  assert.equal(Math.round(noteToFreq(57)), 220);
});

test('scale degrees climb, and wrap into the next octave', () => {
  const scale = 'minor';
  const notes = [0, 1, 2, 3, 4, 5, 6, 7].map((d) => scaleNote(60, scale, d));
  for (let i = 1; i < notes.length; i += 1) {
    assert.ok(notes[i] > notes[i - 1], `degree ${i} did not rise`);
  }
  // Seven degrees in the minor scale, so degree 7 is the octave.
  assert.equal(notes[7], 60 + 12);
});

test('a negative degree still resolves rather than producing NaN', () => {
  assert.ok(Number.isFinite(scaleNote(60, 'minor', -1)));
  assert.ok(scaleNote(60, 'minor', -1) < 60);
});

test('an unknown scale falls back rather than throwing', () => {
  assert.ok(Number.isFinite(scaleNote(60, 'lydian-dominant-bebop', 3)));
});

// ── The tables ───────────────────────────────────────────────────────────────

test('every sound effect is fully specified', () => {
  for (const [name, s] of Object.entries(SFX)) {
    for (const key of ['type', 'from', 'to', 'dur', 'gain']) {
      assert.ok(s[key] !== undefined, `${name} has no ${key}`);
    }
    assert.ok(s.dur > 0 && s.dur < 2, `${name} lasts ${s.dur}s`);
    assert.ok(s.gain > 0 && s.gain <= 0.4, `${name} gain ${s.gain} is out of range`);
  }
});

test('every music cue is fully specified and has at least one layer', () => {
  for (const [name, cue] of Object.entries(MUSIC)) {
    assert.ok(cue.bpm > 0 && cue.bpm < 240, `${name} bpm ${cue.bpm}`);
    assert.ok(SCALES[cue.scale], `${name} uses unknown scale ${cue.scale}`);
    assert.ok(cue.layers.length >= 1, `${name} has no layers`);
    for (const l of cue.layers) {
      assert.ok(l.steps.length > 0, `${name}/${l.id} has an empty pattern`);
      assert.ok(l.gain > 0 && l.gain <= 0.4, `${name}/${l.id} gain ${l.gain}`);
    }
  }
});

test('every cue named in PRD §11 exists', () => {
  for (const name of ['title', 'stage_city', 'stage_forest', 'stage_castle',
    'boss', 'boss_final_phase2', 'reveal']) {
    assert.ok(MUSIC[name], `§11 names "${name}" and it is missing`);
  }
  assert.ok(STINGER_CUE, '「那個是真的。」 has no sting');
});

/**
 * PRD §11: "林建國 phase 2 — everything drops out but a single drum."
 *
 * The loudest moment in the game is the quietest. Adding a bassline back is the
 * obvious well-meant edit, and it would throw the moment away, so the single
 * layer is pinned here rather than left to a comment.
 */
test('林建國 phase 2 is one layer, and it is a drum', () => {
  const cue = MUSIC.boss_final_phase2;
  assert.equal(cue.layers.length, 1, 'something was added back; the drop is the point');
  assert.equal(cue.layers[0].type, 'noise', 'the one thing left should read as a drum');
});

test('phase 2 is barer than the boss cue it interrupts', () => {
  assert.ok(MUSIC.boss_final_phase2.layers.length < MUSIC.boss.layers.length);
});

/** Stage 2 is "sparse, guqin over drums" — mostly silence between the notes. */
test('the forest cue is genuinely sparse', () => {
  const cue = MUSIC.stage_forest;
  const total = cue.layers.reduce((n, l) => n + l.steps.length, 0);
  const sounding = cue.layers.reduce((n, l) => n + l.steps.filter((s) => s !== -1).length, 0);
  assert.ok(sounding / total <= 0.5, `${sounding}/${total} steps sound — that is not sparse`);
});

test('the city is more urgent than the mountain', () => {
  assert.ok(MUSIC.stage_city.bpm > MUSIC.stage_forest.bpm);
});

test('every stage has a cue, and it exists', () => {
  for (const id of ['city', 'forest', 'castle']) {
    assert.ok(MUSIC[cueForStage(id)], `${id} maps to a missing cue`);
  }
  assert.equal(Object.keys(STAGE_CUES).length, 3);
});

test('an unknown stage still returns a real cue rather than undefined', () => {
  assert.ok(MUSIC[cueForStage('nowhere')]);
});

/**
 * SPOILER DISCIPLINE. The help-up award pops as a bare gold +3 with no label and
 * the design depends on a player reading it as a minor bonus. A triumphant
 * sting would tell them it is the real scoring, eleven minutes before they are
 * meant to know there is any.
 */
test('helping someone up is not louder than hitting them', () => {
  assert.ok(SFX.help_up.gain <= SFX.heavy.gain,
    'the restraint award out-shouts combat and gives the game away');
});

test('helping someone up is not a long fanfare', () => {
  assert.ok(SFX.help_up.dur <= 0.25, 'that is a fanfare, and it announces the hidden column');
});

// ── The sequencer ────────────────────────────────────────────────────────────

test('a step duration is a quaver at the cue tempo', () => {
  assert.ok(Math.abs(stepDuration(120) - 0.25) < 1e-9);
  assert.ok(stepDuration(60) > stepDuration(180));
});

test('a rest produces no voice', () => {
  const cue = { root: 60, scale: 'minor' };
  const layer = { type: 'square', gain: 0.1, steps: [-1, 0] };
  assert.equal(stepVoice(cue, layer, 0), null);
  assert.ok(stepVoice(cue, layer, 1));
});

test('patterns loop rather than running off the end', () => {
  const cue = { root: 60, scale: 'minor' };
  const layer = { type: 'square', gain: 0.1, steps: [0, 4] };
  assert.deepEqual(stepVoice(cue, layer, 0), stepVoice(cue, layer, 2));
  assert.deepEqual(stepVoice(cue, layer, 1), stepVoice(cue, layer, 3));
});

test('a noise layer is a drum, not a pitch', () => {
  const v = stepVoice({ root: 60, scale: 'minor' }, { type: 'noise', gain: 0.1, steps: [1] }, 0);
  assert.equal(v.type, 'noise');
});

test('the octave offset raises the note by exactly an octave', () => {
  const cue = { root: 60, scale: 'minor' };
  const low = stepVoice(cue, { type: 'square', gain: 0.1, steps: [0] }, 0);
  const high = stepVoice(cue, { type: 'square', gain: 0.1, octave: 1, steps: [0] }, 0);
  assert.ok(Math.abs(high.freq / low.freq - 2) < 1e-9);
});

test('every cue produces at least one real voice across a bar', () => {
  for (const [name, cue] of Object.entries(MUSIC)) {
    let heard = 0;
    for (let step = 0; step < 8; step += 1) {
      for (const l of cue.layers) if (stepVoice(cue, l, step)) heard += 1;
    }
    assert.ok(heard > 0, `${name} is eight steps of silence`);
  }
});

// ── Failing soft ─────────────────────────────────────────────────────────────

/** A browser with no Web Audio must not stop anyone finishing a run. */
const noAudioWindow = () => ({ setInterval: () => 1, clearInterval: () => {} });

test('no Web Audio at all is survivable', () => {
  const a = createAudio();
  const win = noAudioWindow();
  assert.doesNotThrow(() => {
    assert.equal(resumeAudio(a, win), false);
    assert.equal(playSfx(a, 'light', win), false);
    assert.equal(playStinger(a, win), false);
    playMusic(a, 'title', win);
    stopMusic(a, win);
  });
});

test('an unknown sound or cue is ignored rather than thrown on', () => {
  const a = createAudio();
  const win = noAudioWindow();
  assert.equal(playSfx(a, 'no_such_sound', win), false);
  assert.equal(playMusic(a, 'no_such_cue', win), false);
});

test('nothing is constructed at module load — a context needs a user gesture', () => {
  const a = createAudio();
  assert.equal(a.ctx, null, 'an AudioContext built before a gesture starts suspended forever');
});

test('muted is silent, and unmutes again', () => {
  const a = createAudio({ muted: true });
  assert.equal(playSfx(a, 'light', noAudioWindow()), false);
  assert.equal(toggleMute(a), false);
  assert.equal(a.muted, false);
  assert.equal(setMuted(a, true), true);
});

// ── The music transport ──────────────────────────────────────────────────────

/** A window whose timers are manual, so the sequencer can be stepped. */
function fakeWin() {
  const win = {
    ticks: [],
    setInterval(fn) { win.ticks.push(fn); return win.ticks.length; },
    clearInterval() { win.ticks = []; },
  };
  return win;
}

test('asking for the cue already playing does not restart the bar', () => {
  const a = createAudio();
  const win = fakeWin();
  playMusic(a, 'title', win);
  a.step = 5;
  assert.equal(playMusic(a, 'title', win), false, 'the bar restarted');
  assert.equal(a.step, 5);
});

test('a different cue replaces the one playing and starts from the top', () => {
  const a = createAudio();
  const win = fakeWin();
  playMusic(a, 'boss', win);
  a.step = 6;
  playMusic(a, 'boss_final_phase2', win);
  assert.equal(a.cue, 'boss_final_phase2');
  assert.equal(a.step, 0, 'he stood up mid-bar and the drum came in late');
});

test('stopping clears the cue and its timer', () => {
  const a = createAudio();
  const win = fakeWin();
  playMusic(a, 'title', win);
  stopMusic(a, win);
  assert.equal(a.cue, null);
  assert.equal(a.timer, null);
});
