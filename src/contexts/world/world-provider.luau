local ecs = require "@vendor/ecs"

local WORLD_CONTEXT = require "./world-context"

local function world_provider(props: ProviderChildren)
	local world = ecs.world()
	return WORLD_CONTEXT(world, props.children)
end

return world_provider
