// short 880hz beep via Web Audio - fired when a session hits zero
export function beep() {
	try {
		const Ctor =
			window.AudioContext ||
			(window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
		const ctx = new Ctor();
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		osc.connect(gain);
		gain.connect(ctx.destination);
		osc.frequency.value = 880;
		gain.gain.value = 0.3;
		osc.start();
		osc.stop(ctx.currentTime + 0.3);
	} catch {
		// audio unavailable - stay silent
	}
}
