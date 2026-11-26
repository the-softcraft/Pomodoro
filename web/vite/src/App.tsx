import { useEffect } from "react";
import { Outlet } from "react-router";
import { Toaster, toast } from "@yusufceng1z/ding-react";
import { bind } from "cuelume";
import { SsgoiRouteBoundary } from "@ssgoi/react/react-router";

import { SsgoiProvider } from "./SsgoiProvider";
import BottomTabBar from "./components/BottomTabBar";
import { applyTheme, getStoredTheme } from "./lib/theme";

export default function App() {
	// one-time bootstrap: ui sound, toaster sound, saved theme
	useEffect(() => {
		const unbind = bind();
		toast.configure({ sound: true, volume: 0.5 });
		applyTheme(getStoredTheme());
		return () => unbind();
	}, []);

	return (
		<SsgoiProvider>
			<Toaster
				position="top-center"
				theme="system"
			/>
			<div className="relative z-0 min-h-screen overflow-x-clip [@media(max-height:710px)]:pb-30">
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
