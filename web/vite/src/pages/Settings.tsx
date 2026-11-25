import { useEffect, useState } from "react";
import { toast } from "@yusufceng1z/ding-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { applyTheme, getStoredTheme, type ThemeMode } from "@/lib/theme";
import { useTimerStore } from "@/store/timerStore";

// the 4 duration fields - one entry per input row
const fields = [
	{ key: "work", label: "Work (min)" },
	{ key: "break", label: "Break (min)" },
	{ key: "longBreak", label: "Long break (min)" },
	{ key: "sessions", label: "Sessions before long break" },
] as const;

export default function Settings() {
	const { workMin, breakMin, longBreakMin, sessionsBeforeLong, setDurations } = useTimerStore();

	// local form state, seeded from the store; saved on Save click
	const [form, setForm] = useState({
		work: workMin,
		break: breakMin,
		longBreak: longBreakMin,
		sessions: sessionsBeforeLong,
	});
	const [themeMode, setThemeMode] = useState<ThemeMode>(getStoredTheme);

	// apply theme immediately + persist it; re-apply on OS change when mode is system
	useEffect(() => {
		applyTheme(themeMode);
		localStorage.setItem("theme", themeMode);
		const mq = window.matchMedia("(prefers-color-scheme: dark)");
		const handler = () => {
			if (themeMode === "system") applyTheme(themeMode);
		};
		mq.addEventListener("change", handler);
		return () => mq.removeEventListener("change", handler);
	}, [themeMode]);

	return (
		<main className="flex h-full flex-col items-center gap-6 p-6">
			<h1 className="text-3xl font-semibold">Settings</h1>
			<div className="flex w-full max-w-sm flex-col gap-4">
				{/* duration inputs */}
				{fields.map((f) => (
					<div key={f.key} className="flex flex-col gap-1">
						<Label>{f.label}</Label>
						<Input
							type="number"
							value={form[f.key]}
							onChange={(e) => setForm({ ...form, [f.key]: Number(e.target.value) })}
						/>
					</div>
				))}

				<Button
					onClick={() => {
						setDurations(form.work, form.break, form.longBreak, form.sessions);
						toast.success("Saved!");
					}}>
					Save
				</Button>

				{/* theme picker */}
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
						<DropdownMenuContent align="end">
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
