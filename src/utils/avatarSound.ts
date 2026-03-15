// Synthesize cute Animal Crossing-style character sounds using Web Audio API.
// "Gender" is derived from the seed hash — even = higher pitch, odd = lower pitch.

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function getGender(seed: string): 'high' | 'low' {
  return hashSeed(seed) % 2 === 0 ? 'high' : 'low';
}

export function playAvatarSound(seed: string) {
  const ctx = getAudioContext();
  const gender = getGender(seed);
  const hash = hashSeed(seed);
  const now = ctx.currentTime;

  // Base frequency range depends on gender
  const baseFreq = gender === 'high' ? 380 + (hash % 120) : 180 + (hash % 80);

  // Play 3-4 quick chirpy notes like Animal Crossing
  const noteCount = 3 + (hash % 2);
  const noteDuration = 0.08;
  const gap = 0.04;

  for (let i = 0; i < noteCount; i++) {
    const startTime = now + i * (noteDuration + gap);

    // Each note varies in pitch slightly based on seed
    const freqVariation = ((hash >> (i * 3)) % 60) - 30;
    const freq = baseFreq + freqVariation + (i % 2 === 0 ? 40 : -20);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Use triangle or sine wave for softer, cuter sound
    osc.type = gender === 'high' ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);
    // Slight pitch rise within each note for "bounciness"
    osc.frequency.linearRampToValueAtTime(freq * 1.15, startTime + noteDuration * 0.6);
    osc.frequency.linearRampToValueAtTime(freq * 0.95, startTime + noteDuration);

    // Envelope: quick attack, soft release
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.25, startTime + 0.01);
    gain.gain.linearRampToValueAtTime(0.18, startTime + noteDuration * 0.5);
    gain.gain.linearRampToValueAtTime(0, startTime + noteDuration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + noteDuration + 0.01);
  }
}

export function generateRandomSeed(): string {
  return Math.random().toString(36).substring(2, 10);
}
