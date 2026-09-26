local PLUGIN_CONTEXT = require "./plugin-context"

local function use_plugin()
	return PLUGIN_CONTEXT()
end

return use_plugin
