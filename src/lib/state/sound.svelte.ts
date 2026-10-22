import type { PlayOptions, SoundName } from 'cuelume';

const MUTED_KEY = 'sound-muted';
const VOLUME_KEY = 'sound-volume';
// The lightest touch the library offers: every cue plays at this weight
const SUBTLE = { emphasis: 'subtle' } as const;
// Cues are quiet by design: they should be felt more than heard
const DEFAULT_VOLUME = 0.15;
// If the browser never goes idle, load anyway after this long
const IDLE_TIMEOUT_MS = 3000;

type Cuelume = typeof import('cuelume');

// Set once the library has loaded; until then every sound is a no-op
let cuelume: Cuelume | undefined;

export const sound = $state({ muted: false, volume: DEFAULT_VOLUME });

const store = (key: string, value: string) => {
	try {
		localStorage.setItem(key, value);
	} catch (error) {
		console.warn('Could not remember the sound setting', error);
	}
};

const read = (key: string): string | null => {
	try {
		return localStorage.getItem(key);
	} catch (error) {
		console.warn('Could not read the sound setting', error);
		return null;
	}
};

const readVolume = (): number => {
	const volume = Number(read(VOLUME_KEY) ?? DEFAULT_VOLUME);
	return Number.isFinite(volume) && volume >= 0 && volume <= 1 ? volume : DEFAULT_VOLUME;
};

const load = async () => {
	try {
		cuelume = await import('cuelume');
	} catch (error) {
		console.error('Could not load the sound library', error);
		return;
	}

	cuelume.setVolume(sound.volume);
	// The dry, precise material: the closest to an old mechanical keyboard
	cuelume.setTheme('mech');
	cuelume.setEnabled(!sound.muted);
	// Browsers keep audio locked until a gesture; the first press unlocks it
	addEventListener('pointerdown', () => cuelume?.unlock(), { once: true, capture: true });
	// Every link, button and unfocused canvas card clicks. On pointerdown, not click, so it lands with the press
	addEventListener(
		'pointerdown',
		(event) => {
			const target = (event.target as Element).closest(
				'a, button, [role="switch"], [data-press-sound]'
			);
			if (target) cuelume?.play('toggle', SUBTLE);
		},
		{ capture: true }
	);
};

// Hover notes are synthesised here rather than by cuelume, which has no pitch control.
// A major pentatonic scale, so notes played in any order still sound pleasant together.
const NOTE_ROOT_HZ = 440;
const SCALE_SEMITONES = [0, 2, 4, 7, 9];
const NOTE_LEVEL = 0.2;
// Short and dull, like a key bottoming out
const NOTE_SECONDS = 0.06;
const NOTE_ATTACK_SECONDS = 0.003;
const NOTE_LOWPASS_HZ = 1200;
// An exponential ramp cannot reach exactly 0
const SILENCE = 0.0001;

let audioContext: AudioContext | undefined;

// Position 0 is the highest note and every step down the list drops one scale degree
export const playNote = (position: number) => {
	if (sound.muted || sound.volume === 0) return;

	audioContext ??= new AudioContext();
	// Browsers keep audio suspended until the visitor has interacted with the page
	if (audioContext.state === 'suspended') void audioContext.resume();

	const octaves = Math.floor(position / SCALE_SEMITONES.length);
	const semitones = octaves * 12 + SCALE_SEMITONES[position % SCALE_SEMITONES.length];
	const now = audioContext.currentTime;

	const oscillator = audioContext.createOscillator();
	oscillator.type = 'triangle';
	oscillator.frequency.value = NOTE_ROOT_HZ * 2 ** (-semitones / 12);

	const lowpass = audioContext.createBiquadFilter();
	lowpass.frequency.value = NOTE_LOWPASS_HZ;

	const gain = audioContext.createGain();
	gain.gain.setValueAtTime(SILENCE, now);
	gain.gain.exponentialRampToValueAtTime(sound.volume * NOTE_LEVEL, now + NOTE_ATTACK_SECONDS);
	gain.gain.exponentialRampToValueAtTime(SILENCE, now + NOTE_SECONDS);

	oscillator.connect(lowpass).connect(gain).connect(audioContext.destination);
	oscillator.start(now);
	oscillator.stop(now + NOTE_SECONDS);
};

export const playSound = (name: SoundName, options: PlayOptions = SUBTLE) => {
	cuelume?.play(name, options);
};

// Fetches the sound library once the page is idle, so it never holds up the first load
export const loadSound = () => {
	sound.muted = read(MUTED_KEY) === 'true';
	sound.volume = readVolume();

	if ('requestIdleCallback' in window) requestIdleCallback(load, { timeout: IDLE_TIMEOUT_MS });
	else setTimeout(load, IDLE_TIMEOUT_MS / 2);
};

export const toggleMute = async () => {
	sound.muted = !sound.muted;
	store(MUTED_KEY, String(sound.muted));
	cuelume?.setEnabled(!sound.muted);
	if (sound.muted || !cuelume) return;

	// Unmuting is a gesture, so it can unlock audio and confirm itself with a cue
	await cuelume.unlock();
	cuelume.play('toggle', SUBTLE);
};

// Moving the slider is a deliberate ask for sound, so it also unmutes
export const setVolume = (volume: number) => {
	sound.volume = volume;
	store(VOLUME_KEY, String(volume));
	cuelume?.setVolume(volume);
	if (sound.muted) void toggleMute();
};
