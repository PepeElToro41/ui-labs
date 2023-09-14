import Roact from "@rbxts/roact";

declare global {
	namespace LibLike {
		type Roact = {
			createElement: typeof Roact.createElement;
			mount: typeof Roact.mount;
			unmount: typeof Roact.unmount;
			update: typeof Roact.update;
		};
		type React = {
			createElement: typeof Roact.createElement;
		};
		type ReactRoblox = {
			createRoot: (container: Instance) => ReactRobloxRoot;
		};
		interface ReactRobloxRoot {
			render: (this: ReactRobloxRoot, element: Roact.Element) => void;
			unmount: (this: ReactRobloxRoot) => void;
		}
	}
	type UseLibType = "Roact" | "React";
	interface UILibsInfo {
		roact: LibLike.Roact;
		react: LibLike.React;
		reactRoblox: LibLike.ReactRoblox;
	}
	type UILibsPartial = Partial<UILibsInfo>;
}
