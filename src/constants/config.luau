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

	version = { -- this might be automated eventually
		mayor = 2,
		minor = 0,
		fix = 0,
	},

	file_extensions = {
		story = ".story",
		storybook = ".storybook",
		config = ".uilabs",
	},
}

return CONFIG
