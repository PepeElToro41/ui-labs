import Roact from "@rbxts/roact";

export const DescriptorContext = Roact.createContext({
	getMouseDesc: () => {
		return identity<string | undefined>("description");
	},
	setMouseDesc: (index: string, desc: string) => {},
	removeMouseDesc: (index: string) => {},
});
