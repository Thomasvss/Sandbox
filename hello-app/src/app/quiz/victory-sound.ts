// A short rising chime: C, E, G, then a high C.
const NOTES = [523.25, 659.25, 783.99, 1046.5];
const NOTE_GAP_SECONDS = 0.09;
const NOTE_LENGTH_SECONDS = 0.32;
const VOLUME = 0.16;

let audioContext: AudioContext | null = null;

/** Plays the chime. It must be called from a click, because browsers block sound before one. */
export function playVictorySound(): void {
  audioContext ??= new AudioContext();
  const context = audioContext;
  void context.resume();

  NOTES.forEach((frequency, index) => {
    const start = context.currentTime + index * NOTE_GAP_SECONDS;
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = 'triangle';
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(VOLUME, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + NOTE_LENGTH_SECONDS);

    oscillator.connect(gain).connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + NOTE_LENGTH_SECONDS);
  });
}
