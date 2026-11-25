import { useEffect } from "react";
import { Outlet } from "react-router";
import { Toaster, toast } from "@yusufceng1z/ding-react";
import { bind } from "cuelume";
import { SsgoiRouteBoundary } from "@ssgoi/react/react-router";
import { SsgoiProvider } from "./SsgoiProvider";
import BottomTabBar from "./components/BottomTabBar";

export default function App() {
	useEffect(() => {
		const unbind = bind();
		toast.configure({ sound: true, volume: 0.5 });
		const saved = localStorage.getItem("theme") || "system";
		const apply = () => {
			const isDark =
				saved === "dark" ||
				(saved === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
			document.documentElement.classList.toggle("dark", isDark);
		};
		apply();
		return () => unbind();
	}, []);

	return (
		<SsgoiProvider>
			<Toaster
				position="top-center"
				theme="system"
			/>
			<div className="relative z-0 min-h-screen overflow-x-clip pb-30">
				<SsgoiRouteBoundary>
					<div className="bg-background h-screen">
						<Outlet />
					</div>
				</SsgoiRouteBoundary>
			</div>
			<BottomTabBar />
		</SsgoiProvider>
	);
}
