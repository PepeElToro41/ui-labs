local FromServiceNames = require("@utils/instance").FromServiceNames

local CONFIGS = {
	PluginName = "UI Labs",
	SpriteIcon = "rbxassetid://18717235646",
	RootPreviewKey = "RootStory",
	FileSearch = FromServiceNames {
		"Workspace",
		"ReplicatedFirst",
		"ReplicatedStorage",
		"ServerScriptService",
		"ServerStorage",
		"StarterGui",
		"StarterPlayer",
	},
	GlobalInjectionKey = "__hotreload_env_global_injection__", --the longer the better

	Version = { -- this might be automated with scripts or ci/cd
		Mayor = 2,
		Minor = 0,
		Fix = 0,
	},

	Extensions = {
		Story = ".story",
		Storybook = ".storybook",
		ConfigFile = ".uilabs", -- not implemented yet
	},
}

return CONFIGS
