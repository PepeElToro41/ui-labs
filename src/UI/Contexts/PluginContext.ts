import Roact from "@rbxts/roact";

export const PluginContext = Roact.createContext({
	PluginObject: identity<typeof plugin | undefined>(undefined),
	DockWidget: identity<DockWidgetPluginGui | undefined>(undefined),
	WarnOnOpen: (warnMsg: string) => {},
	ExternalControls: {
		getHierarchy: () => {
			const test = [] as PluginHierarchy;
			return test;
		},
		setHierarchy: (hierarchy: PluginHierarchy) => {},
	},
});
