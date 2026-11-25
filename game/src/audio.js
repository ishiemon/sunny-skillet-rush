// Sunny Skillet Rush — tiny WebAudio bleeps made in code, no sound files.
// Audio starts only after the player's first click or key, per browser rules.

let context = null;

function tone(freq, duration, type = 'sine', volume = 0.08, delay = 0) {
  try {
    if (!context) context = new (window.AudioContext || window.webkitAudioContext)();
    const at = context.currentTime + delay;
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, at);
    gain.gain.setValueAtTime(volume, at);
    gain.gain.exponentialRampToValueAtTime(0.001, at + duration);
    osc.connect(gain).connect(context.destination);
    osc.start(at);
    osc.stop(at + duration);
  } catch {
    // Sound is a garnish, never a blocker.
  }
}

export function playChop() { tone(520, 0.07, 'triangle', 0.06); }
export function playServe() { tone(660, 0.1, 'sine', 0.08); tone(880, 0.14, 'sine', 0.08, 0.09); }
export function playWrong() { tone(180, 0.16, 'sawtooth', 0.05); }
export function playClick() { tone(440, 0.05, 'triangle', 0.05); }
