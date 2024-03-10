import { FromServiceNames } from "Utils/InstanceUtils";

const Configs = {
	PluginName: "UI Labs",
	SpriteIcon: "rbxassetid://16446176548",
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

	Version: {
		Mayor: 1,
		Minor: 0,
		Fix: 1,
	},

	Extensions: {
		Story: ".story",
		Storybook: ".storybook",
		Settings: ".uilabs", //Not implemented (it probably wont)
	},
};

export default Configs;
