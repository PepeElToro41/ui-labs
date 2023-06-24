import Roact from "@rbxts/roact";

export const PluginContext = Roact.createContext({
	pluginMouse: identity<PluginMouse | Mouse | undefined>(undefined),
	ExternalControls: {
		getHierarchy: () => {
			const test = [] as PluginHierarchy;
			return test;
		},
		setHierarchy: (hierarchy: PluginHierarchy) => {},
	},
});
