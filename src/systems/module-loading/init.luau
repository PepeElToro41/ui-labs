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

	-- only root modules (no `r_shared_environment` pair) own an environment
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

	local function apply_result(entity: ecs.Entity, module: ModuleScript, success: boolean, result: any)
		if success then
			world.remove(entity, c.module_error)
			world.set(entity, c.module_result, result)
		else
			warn(`[UI Labs] failed to load {module:GetFullName()}: {result}`)
			world.remove(entity, c.module_result)
			world.set(entity, c.module_error, tostring(result))
		end
	end

	local function load_async(entity: ecs.Entity, module: ModuleScript, env: environment.Environment)
		task.spawn(function()
			local success, result = pcall(env.load_dependency, env, module)

			if not env.connected or not world.exists(entity) then
				return
			end
			if world.get(entity, c.module_script) ~= module then
				return
			end
			apply_result(entity, module, success, result)
		end)
	end

	-- creates a fresh environment and sets it synchronously so the cascade
	-- query below sees it in the same frame; `reload_queued` is left in place
	-- until the cascade ran
	local function load_root(entity: ecs.Entity, module: ModuleScript)
		unload(entity)

		local env = environment.create()
		local connection = env.on_dependency_changed:Connect(function()
			source_changed[entity] = true
		end)
		loaded[entity] = { environment = env, connection = connection }

		world.set(entity, c.environment, env)
		load_async(entity, module, env)
	end

	local function load_shared(entity: ecs.Entity, module: ModuleScript, env: environment.Environment)
		load_async(entity, module, env)
	end

	-- stylua: ignore start
	local q_reload = world
		.query(c.module_script)
		:with(c.reload_queued)
		:without(SHARED_ENV)
		:cached()

	local q_shared = world
		.query_build()
		:term(c.module_script)
		:term(c.environment):up(c.r_shared_environment)
		:with(c.reload_queued):up(c.r_shared_environment):self()
		:build()
		:cached()

	-- stylua: ignore end
	vide.cleanup(function()
		q_reload:cleanup()
		q_shared:cleanup()
	end)

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

		local pending_roots: { { entity: ecs.Entity, module: ModuleScript } } = {}
		for entity, module in q_reload:iter() do
			table.insert(pending_roots, { entity = entity, module = module })
		end
		for _, entry in pending_roots do
			load_root(entry.entity, entry.module)
		end

		local pending_shared: Array<{ entity: ecs.Entity, module: ModuleScript, env: environment.Environment }> = {}
		for entity, module, env in q_shared:iter() do
			table.insert(pending_shared, {
				entity = entity,
				module = module,
				env = env,
			})
		end

		for _, entry in pending_shared do
			load_shared(entry.entity, entry.module, entry.env :: environment.Environment)
		end
		for _, entry in pending_roots do
			world.remove(entry.entity, c.reload_queued)
		end
		for _, entry in pending_shared do
			world.remove(entry.entity, c.reload_queued)
		end
	end
end

return module_loading
