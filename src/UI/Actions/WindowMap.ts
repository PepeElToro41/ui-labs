import Roact from "@rbxts/roact";
import Controls from "./Windows/Controls";
import Summary from "./Windows/Summary";

export const ActionWindows = {
	Summary: Summary,
	Controls: Controls,
} as const;

export function CreateWindow<T extends IsActionWindow>(WindowType: T, props: Parameters<ActionWindows[T]>[0]) {
	const WindowElement = ActionWindows[WindowType];
	return {
		WindowType: WindowType,
		//TSX doesn't like the spread operator here, so screw it .-.
		Window: Roact.createElement(WindowElement as never, props as never),
	};
}

declare global {
	type ActionWindows = typeof ActionWindows;
	type IsActionWindow = keyof ActionWindows;
}
