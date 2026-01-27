local use_world = require "@contexts/world/use-world"
local vide = require "@pkg/vide"
local c = require "@src/components"

local ecs = require "@vendor/ecs"

local storybooks = {}

function storybooks.system()
	local world = use_world()

	-- stylua: ignore
	local q_removed_storybooks = world
		.query(c.storybook_result)
		:without(ecs.pair(c.r_extension, c.storybook))
		:cached()

	local monitor = world.query(c.module_script):with(ecs.pair(c.r_extension, c.storybook)):monitor()
	vide.cleanup(monitor.cleanup)

	monitor.added(function(entity)
		world.add(entity, c.reload_queued)
	end)

	return function()
		for entity in q_removed_storybooks:iter() do
			world.remove(entity, c.storybook_result)
		end
	end
end

return storybooks
