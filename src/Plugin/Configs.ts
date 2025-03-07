import { Environment } from "@rbxts/ui-labs";
import { FromServiceNames } from "Utils/InstanceUtils";

const Configs = {
	PluginName: "UI Labs",
	SpriteIcon: "rbxassetid://110765369713957",
	RootPreviewKey: "RootStory",
	PluginSettingsKey: "UILabsSettingsV1",

	DefaultSearch: FromServiceNames([
		"Workspace",
		"ReplicatedFirst",
		"ReplicatedStorage",
		"ServerScriptService",
		"ServerStorage",
		"StarterGui",
		"StarterPlayer"
	]),
	GlobalInjectionKey: Environment.EnvGlobalInjectionKey, //the longer the better

	Version: {
		Mayor: 1,
		Minor: 4,
		Fix: 0
	},

	Extensions: {
		Story: ".story",
		Storybook: ".storybook",
		Settings: ".uilabs" //Not implemented (it probably wont)
	}
};

export default Configs;
