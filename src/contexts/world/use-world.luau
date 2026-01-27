local WORLD_CONTEXT = require "./world-context"

local function use_world()
	return WORLD_CONTEXT()
end

return use_world
