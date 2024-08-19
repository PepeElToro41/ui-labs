import { FromServiceNames } from "Utils/InstanceUtils";

const Configs = {
	PluginName: "UI Labs",
	SpriteIcon: "rbxassetid://18717235646",
	RootPreviewKey: "RootStory",
	DefaultSearch: FromServiceNames([
		"Workspace",
		"ReplicatedFirst",
		"ReplicatedStorage",
		"ServerScriptService",
		"ServerStorage",
		"StarterGui",
		"StarterPlayer",
	]),
	GlobalInjectionKey: "__hotreload_env_global_injection__", //the longer the better

	Version: {
		Mayor: 1,
		Minor: 2,
		Fix: 1,
	},

	Extensions: {
		Story: ".story",
		Storybook: ".storybook",
		Settings: ".uilabs", //Not implemented (it probably wont)
	},
};

export default Configs;
