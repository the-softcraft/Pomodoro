import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTimerStore } from "@/store/timerStore";

function beep() {
	try {
		const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		osc.connect(gain);
		gain.connect(ctx.destination);
		osc.frequency.value = 880;
		gain.gain.value = 0.3;
		osc.start();
		osc.stop(ctx.currentTime + 0.3);
	} catch {}
}

function Tomato({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 64 64"
			className={className}
			aria-hidden="true">
			<path
				d="M32 18c10 0 18 7 18 17s-8 17-18 17S14 45 14 35s8-17 18-17Z"
				fill="#ef4444"
			/>
			<path
				d="M32 18c3-5 8-7 12-6-2 3-5 5-8 6 4-1 8 0 11 2-4 2-8 2-11 1 2 3 4 6 4 10-4-2-7-5-8-9-1 4-4 7-8 9 0-4 2-7 4-10-3 1-7 1-11-1 3-2 7-3 11-2-3-1-6-3-8-6 4-1 9 1 12 6Z"
				fill="#16a34a"
			/>
			<ellipse
				cx="24"
				cy="30"
				rx="4"
				ry="3"
				fill="#fca5a5"
				opacity="0.6"
			/>
		</svg>
	);
}

export default function Home() {
	const {
		mode,
		secondsLeft,
		running,
		completed,
		workMin,
		breakMin,
		longBreakMin,
		start,
		pause,
		reset,
		tick,
		skip,
	} = useTimerStore();

	useEffect(() => {
		if (!running) return;
		const id = setInterval(() => {
			const before = useTimerStore.getState().secondsLeft;
			tick();
			const after = useTimerStore.getState().secondsLeft;
			if (before <= 1 && after !== before) {
				const N = (window as any).Native;
				if (N?.vibrate) N.vibrate(200);
				beep();
				setTimeout(beep, 2000);
			}
		}, 1000);
		return () => clearInterval(id);
	}, [running]);

	const total = (mode === "work" ? workMin : mode === "break" ? breakMin : longBreakMin) * 60;
	const progress = total ? secondsLeft / total : 0;
	const r = 110;
	const c = 2 * Math.PI * r;
	const offset = c * (1 - progress);

	const m = Math.floor(secondsLeft / 60)
		.toString()
		.padStart(2, "0");
	const s = (secondsLeft % 60).toString().padStart(2, "0");

	return (
		<main className="flex min-h-screen flex-col items-center justify-center gap-6 p-6 ">
			<section className="flex flex-col items-center gap-2">
				<Tomato className="h-14 w-14 sm:h-16 sm:w-16 drop-shadow" />
				<h1 className="text-[60px] sm:text-[70px] font-semibold capitalize">
					{mode === "longBreak" ? "Long Break" : mode}
				</h1>
				<p className="text-muted-foreground text-lg">Completed: {completed}</p>
			</section>

			<div className="flex flex-col items-center gap-6">
				<div className="relative flex items-center justify-center w-64 md:w-80">
					<svg
						viewBox="0 0 260 260"
						className="w-full h-auto -rotate-90">
						<circle
							cx="130"
							cy="130"
							r={r}
							stroke="currentColor"
							strokeWidth="8"
							fill="none"
							className="text-muted"
						/>
						<circle
							cx="130"
							cy="130"
							r={r}
							stroke="currentColor"
							strokeWidth="8"
							fill="none"
							strokeDasharray={c}
							strokeDashoffset={offset}
							strokeLinecap="round"
							className="text-primary transition-all"
						/>
					</svg>
					<div className="absolute text-[40px] sm:text-[50px] font-bold tabular-nums">
						{m}:{s}
					</div>
				</div>
				<div className="flex gap-3">
					{!running ? (
						<Button data-cuelume-tap onClick={start}>Start</Button>
					) : (
						<Button
							data-cuelume-tap
							onClick={pause}
							variant="secondary">
							Pause
						</Button>
					)}
					<Button
						data-cuelume-tap
						onClick={reset}
						variant="outline">
						Reset
					</Button>
					<Button
						data-cuelume-tap
						onClick={skip}
						variant="ghost">
						Skip
					</Button>
				</div>
			</div>
		</main>
	);
}
