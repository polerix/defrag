// ─── Procedural HDD audio ──────────────────────────────────────────────────
// defrag98.com's standout feature is real recorded HDD click/grind samples.
// We get the same payoff — audible seeks, a grinding sweep, explosions,
// chomps — without shipping audio assets, by synthesizing everything with
// the Web Audio API. Browsers block audio until a user gesture, so the
// AudioContext is created lazily on first click/keypress (see unlock()).

let ctx = null;
let muted = false;

function unlock() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
}

export function initAudio() {
  document.addEventListener('pointerdown', unlock, { once: true });
  document.addEventListener('keydown', unlock, { once: true });
}

export function isMuted() { return muted; }
export function setMuted(v) { muted = v; }
export function toggleMuted() { muted = !muted; return muted; }

function ready() {
  return ctx && !muted && ctx.state === 'running';
}

// short filtered noise burst — the "click" of a head seek
function noiseBurst({ dur = 0.03, freq = 2200, q = 6, gain = 0.12 } = {}) {
  if (!ready()) return;
  const now = ctx.currentTime;
  const bufSize = Math.ceil(ctx.sampleRate * dur);
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;

  const src = ctx.createBufferSource();
  src.buffer = buf;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = freq;
  filter.Q.value = q;

  const g = ctx.createGain();
  g.gain.setValueAtTime(gain, now);
  g.gain.exponentialRampToValueAtTime(0.001, now + dur);

  src.connect(filter).connect(g).connect(ctx.destination);
  src.start(now);
  src.stop(now + dur + 0.02);
}

function tone({ freq = 440, dur = 0.09, type = 'square', gain = 0.06, slideTo = null } = {}) {
  if (!ready()) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, now + dur);

  const g = ctx.createGain();
  g.gain.setValueAtTime(gain, now);
  g.gain.exponentialRampToValueAtTime(0.001, now + dur);

  osc.connect(g).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + dur + 0.02);
}

// ── Public sound events ─────────────────────────────────────────────────

// HDD seek/write click — fired once per defrag tick
export function playSeek() {
  const freq = 1800 + Math.random() * 1400;
  noiseBurst({ dur: 0.02 + Math.random() * 0.015, freq, q: 8, gain: 0.09 });
}

// Bomb detonation
export function playExplosion() {
  noiseBurst({ dur: 0.35, freq: 300, q: 0.6, gain: 0.22 });
  tone({ freq: 180, dur: 0.4, type: 'sawtooth', gain: 0.14, slideTo: 40 });
}

// ? cell releasing anomalies — whoosh
export function playRelease() {
  noiseBurst({ dur: 0.18, freq: 900, q: 1.2, gain: 0.1 });
}

// Chomper (flag) deployed
export function playDeploy() {
  tone({ freq: 220, dur: 0.08, type: 'square', gain: 0.07, slideTo: 440 });
}

// Pac-Man eats an emoji
export function playChomp() {
  tone({ freq: 520, dur: 0.06, type: 'square', gain: 0.06, slideTo: 220 });
}

// Defrag complete chime
export function playComplete() {
  if (!ready()) return;
  [523, 659, 784, 1047].forEach((freq, i) => {
    setTimeout(() => tone({ freq, dur: 0.22, type: 'triangle', gain: 0.08 }), i * 110);
  });
}

// UI toggle / drive switch click
export function playClick() {
  tone({ freq: 700, dur: 0.03, type: 'square', gain: 0.05 });
}
