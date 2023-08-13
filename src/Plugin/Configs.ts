import { FromServiceNames } from "Utils/InstanceUtils";

const Configs = {
	PluginName: "UI Labs",
	SpriteIcon: "rbxassetid://14105481154",
	DefaultSearch: FromServiceNames([
		"Workspace",
		"ReplicatedFirst",
		"ReplicatedStorage",
		"ServerScriptService",
		"ServerStorage",
		"StarterGui",
		"StarterPlayer",
	]),

	Extensions: {
		Story: ".story",
		Storybook: ".storybook",
		Settings: ".uilabs", //Not implemented yet
	},
};

export = Configs;
