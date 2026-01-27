local use_world = require "@contexts/world/use-world"
local ecs = require "@vendor/ecs"
local c = require "@src/components"
local environment = require "@utils/hot-reloading/environment"

local module_loading = {}

function module_loading.reload_module(entity: ecs.Entity, module: ModuleScript)
	local new_environment = environment.create()
	new_environment:load_dependency(module)
end

local SHARED_ENV = ecs.pair(c.r_shared_environment, ecs.Wildcard)

function module_loading.system()
	local world = use_world()

	-- stylua: ignore start
	local q_non_autoreload = world
		.query(c.reload_queued)
		:without(c.auto_reload, SHARED_ENV)
		:cached()

	-- separated to avoid iterator invalidation
	local q_first_reload = world
		.query(c.module_script)
		:with(c.reload_queued)
		:without(c.environment, SHARED_ENV)
		:cached()

	local q_update_reload = world
		.query(c.module_script, c.environment)
		:with(c.reload_queued)
		:without(SHARED_ENV)
		:cached()
	-- stylua: ignore end

	return function()
		for entity in q_non_autoreload:iter() do
			world.remove(entity, c.dependency_changed)
		end

		for entity, module in q_first_reload:iter() do
			module_loading.reload_module(entity, module)
		end

		for entity, module, old_environment in q_update_reload:iter() do
			old_environment:disconnect()
			module_loading.reload_module(entity, module)
		end
	end
end
