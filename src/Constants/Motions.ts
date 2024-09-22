import { SpringOptions } from "@rbxts/ripple";

const SpringsOptions = {
	AppearFast: {
		mass: 1,
		damping: 0.8,
		frequency: 0.5,
	},
} satisfies Record<string, SpringOptions>;

export { SpringsOptions };
