import { FromServiceNames } from "Utils/InstanceUtils";

const Configs = {
	PluginName: "UI Labs",
	SpriteIcon: "rbxassetid://15233183859",
	RootUID: "RootStory",
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
		Settings: ".uilabs", //Not implemented (probably it wont)
	},
};

export = Configs;
