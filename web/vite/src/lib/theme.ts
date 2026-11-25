export type ThemeMode = "light" | "dark" | "system";

export function getStoredTheme(): ThemeMode {
	const saved = localStorage.getItem("theme");
	return saved === "light" || saved === "dark" || saved === "system" ? saved : "system";
}

export function applyTheme(mode: ThemeMode) {
	const isDark =
		mode === "dark" ||
		(mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
	document.documentElement.classList.toggle("dark", isDark);
}
