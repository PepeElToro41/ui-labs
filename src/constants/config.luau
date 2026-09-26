local BUILD = require "@constants/build"
local instances = require "@utils/instances"

local CONFIG = {
	plugin_name = "UI Labs",
	plugin_logo = "rbxassetid://18717235646",
	story_search = instances.from_service_names {
		"Workspace",
		"ReplicatedFirst",
		"ReplicatedStorage",
		"ServerScriptService",
		"ServerStorage",
		"StarterGui",
		"StarterPlayer",
	},
	global_injection_key = "__hotreload_env_global_injection__",

	-- generated into the build file by CI, see scripts/build-info.luau
	version = BUILD.version,

	file_extensions = {
		story = ".story",
		storybook = ".storybook",
		config = ".uilabs",
	},
}

return CONFIG
