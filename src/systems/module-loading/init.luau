local use_world = require "@contexts/world/use-world"
local vide = require "@pkg/vide"
local c = require "@src/components"
local environment = require "@utils/hot-reloading/environment"
local ecs = require "@vendor/ecs"

local module_loading = {}

type Loaded = {
	environment: environment.Environment,
	connection: { Disconnect: (self: any) -> () },
}

local SHARED_ENV = ecs.pair(c.r_shared_environment, ecs.Wildcard)

function module_loading.system()
	local world = use_world()

	local loaded: Map<ecs.Entity, Loaded> = {}
	local source_changed: Map<ecs.Entity, true> = {}

	local function unload(entity: ecs.Entity)
		local record = loaded[entity]
		if not record then
			return
		end
		loaded[entity] = nil
		record.connection:Disconnect()
		record.environment:disconnect()
	end

	local function load(entity: ecs.Entity, module: ModuleScript)
		unload(entity)

		local env = environment.create()
		local connection = env.on_dependency_changed:Connect(function()
			source_changed[entity] = true
		end)
		loaded[entity] = { environment = env, connection = connection }

		local success, result = pcall(env.load_dependency, env, module)
		world.set(entity, c.environment, env)

		if success then
			world.remove(entity, c.module_error)
			world.set(entity, c.module_result, result)
		else
			warn(`[UI Labs] failed to load {module:GetFullName()}: {result}`)
			world.remove(entity, c.module_result)
			world.set(entity, c.module_error, tostring(result))
		end

		world.remove(entity, c.reload_queued)
	end

	-- stylua: ignore
	local q_reload = world
		.query(c.module_script)
		:with(c.reload_queued)
		:without(SHARED_ENV)
		:cached()

	vide.cleanup(world.removed(c.environment, function(entity)
		unload(entity)
	end))
	vide.cleanup(function()
		for entity in loaded do
			unload(entity)
		end
	end)

	return function()
		for entity in source_changed do
			if world.exists(entity) and world.has(entity, c.auto_reload) then
				world.add(entity, c.reload_queued)
			end
		end
		table.clear(source_changed)

		local pending: { { entity: ecs.Entity, module: ModuleScript } } = {}
		for entity, module in q_reload:iter() do
			table.insert(pending, { entity = entity, module = module })
		end
		for _, entry in pending do
			load(entry.entity, entry.module)
		end

		-- TODO: cascade reload_queued flag from parent to shared environments
		-- TODO: reload shared environments traversing downwards
	end
end

return module_loading
