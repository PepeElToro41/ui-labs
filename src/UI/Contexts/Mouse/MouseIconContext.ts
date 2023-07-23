import Roact from "@rbxts/roact";

const ContextValue = {
	SetMouseIcon: (index: string, icon: MouseIcon) => {},
	UnsetMouseIcon: (index: string) => {},
};

declare global {
	type IsMouseIconContext = typeof ContextValue;
}

export const MouseIconContext = Roact.createContext<IsMouseIconContext>(ContextValue);
