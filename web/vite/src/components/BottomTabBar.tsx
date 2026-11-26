import { NavLink } from "react-router";
import homeIcon from "../assets/icons/home.svg";
import settingsIcon from "../assets/icons/settings.svg";
import { cn } from "cn";

const tabs = [
	{ to: "/", label: "Home", icon: homeIcon },
	{ to: "/settings", label: "Settings", icon: settingsIcon },
];

export default function BottomTabBar() {
	return (
		<nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-2 rounded-2xl border bg-background/80 backdrop-blur px-4 py-3 shadow-lg">
			{tabs.map((t) => (
				<NavLink
					key={t.to}
					to={t.to}
					className={({ isActive }) =>
						`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition ${
							isActive ? "bg-primary  text-black" : "text-muted-foreground"
						}`
					}>
					{({ isActive }) => (
						<>
							<img
								src={t.icon}
								alt={t.label}
								className={cn("h-5 w-5", isActive ? "brightness-0 invert" : "dark:invert")}
							/>
						</>
					)}
				</NavLink>
			))}
		</nav>
	);
}
