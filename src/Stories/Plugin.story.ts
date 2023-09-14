import Roact from "@rbxts/roact";
import Configs from "Plugin/Configs";
import Plugin from "UI/Main/Plugin";

export = function (target: ScreenGui) {
	const NewPlugin = Roact.createElement(Plugin, {
		ExternalControls: {
			setHierarchy: (Hierarchy) => {},
			getHierarchy: () => {
				return Configs.DefaultHierarchy;
			},
			getSettings: () => {
				return identity<PluginSettings["Settings"]>({
					ModuleBindType: "Path",
				});
			},
		},
	});
	const Handler = Roact.mount(NewPlugin, target);
	return () => {
		Roact.unmount(Handler);
	};
};
