import Roact from "@rbxts/roact";

const ContextValue = {
	setMouseIcon: (index: string, icon: MouseIcon) => {},
	unsetMouseIcon: (index: string) => {},
};

declare global {
	type IsMouseIconContext = typeof ContextValue;
}

export const MouseIconContext = Roact.createContext<IsMouseIconContext>(ContextValue);
