import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@yusufceng1z/ding-react";
import { useTimerStore } from "@/store/timerStore";

export default function Settings() {
	const { workMin, breakMin, longBreakMin, sessionsBeforeLong, setDurations } = useTimerStore();
	const [w, setW] = useState(workMin);
	const [b, setB] = useState(breakMin);
	const [l, setL] = useState(longBreakMin);
	const [n, setN] = useState(sessionsBeforeLong);
	const [themeMode, setThemeMode] = useState<"light" | "dark" | "system">(() => {
		const saved = localStorage.getItem("theme");
		if (saved === "light" || saved === "dark" || saved === "system") return saved;
		return "system";
	});

	useEffect(() => {
		const apply = () => {
			const isDark =
				themeMode === "dark" ||
				(themeMode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
			document.documentElement.classList.toggle("dark", isDark);
		};
		apply();
		localStorage.setItem("theme", themeMode);
		const mq = window.matchMedia("(prefers-color-scheme: dark)");
		const handler = () => {
			if (themeMode === "system") apply();
		};
		mq.addEventListener("change", handler);
		return () => mq.removeEventListener("change", handler);
	}, [themeMode]);

	return (
		<main className="flex h-full flex-col items-center gap-6 p-6">
			<h1 className="text-3xl font-semibold">Settings</h1>
			<div className="flex w-full max-w-sm flex-col gap-4">
				<div className="flex flex-col gap-1">
					<Label>Work (min)</Label>
					<Input
						type="number"
						value={w}
						onChange={(e) => setW(Number(e.target.value))}
					/>
				</div>
				<div className="flex flex-col gap-1">
					<Label>Break (min)</Label>
					<Input
						type="number"
						value={b}
						onChange={(e) => setB(Number(e.target.value))}
					/>
				</div>
				<div className="flex flex-col gap-1">
					<Label>Long break (min)</Label>
					<Input
						type="number"
						value={l}
						onChange={(e) => setL(Number(e.target.value))}
					/>
				</div>
				<div className="flex flex-col gap-1">
					<Label>Sessions before long break</Label>
					<Input
						type="number"
						value={n}
						onChange={(e) => setN(Number(e.target.value))}
					/>
				</div>
				<Button
					onClick={() => {
						setDurations(w, b, l, n);
						toast.success("Saved!");
					}}>
					Save
				</Button>
				<div className="flex items-center justify-between ">
					<Label>Theme</Label>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								className="w-32 capitalize">
								{themeMode}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="end"
							className="">
							<DropdownMenuItem onClick={() => setThemeMode("system")}>
								System
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setThemeMode("dark")}>Dark</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setThemeMode("light")}>
								Light
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</main>
	);
}
