import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import Tomato from "@/components/Tomato";
import { beep } from "@/lib/beep";
import { useTimerStore } from "@/store/timerStore";

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

	// tick every second; vibrate + double beep when a session just hit zero
	useEffect(() => {
		if (!running) return;
		const id = setInterval(() => {
			const before = useTimerStore.getState().secondsLeft;
			tick();
			const after = useTimerStore.getState().secondsLeft;
			if (before <= 1 && after !== before) {
				const N = (window as unknown as { Native?: { vibrate?: (ms: number) => void } }).Native;
				if (N?.vibrate) N.vibrate(200);
				beep();
				setTimeout(beep, 2000);
			}
		}, 1000);
		return () => clearInterval(id);
	}, [running, tick]);

	// progress ring math: fraction of current mode's total time left
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
			{/* header: mascot + mode + completed count */}
			<section className="flex flex-col items-center gap-2">
				<Tomato className="h-14 w-14 sm:h-16 sm:w-16 drop-shadow" />
				<h1 className="text-[60px] sm:text-[70px] font-semibold capitalize">
					{mode === "longBreak" ? "Long Break" : mode}
				</h1>
				<p className="text-muted-foreground text-lg">Completed: {completed}</p>
			</section>

			<div className="flex flex-col items-center gap-6">
				{/* circular progress + countdown */}
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

				{/* controls */}
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
