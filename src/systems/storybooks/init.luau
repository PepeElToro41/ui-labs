local use_world = require "@contexts/world/use-world"
local vide = require "@pkg/vide"
local c = require "@src/components"
local ecs = require "@vendor/ecs"

local storybooks = {}

local STORYBOOK = ecs.pair(c.r_extension, c.storybook)

local function validate_storybook(result: unknown): Storybook?
	if type(result) ~= "table" then
		return nil
	end
	local roots = (result :: any).storyRoots
	if type(roots) ~= "table" then
		return nil
	end
	for _, root in roots do
		if typeof(root) ~= "Instance" then
			return nil
		end
	end
	return result :: any
end

function storybooks.system()
	local world = use_world()

	-- stylua: ignore start
	local q_removed_storybooks = world
		.query(c.storybook_result)
		:without(STORYBOOK)
		:cached()

	-- fires when the module result is first produced and every time it is replaced
	local q_result_changed = world
		.query(c.module_script, c.module_result)
		:with(STORYBOOK)
		:changed()
	-- stylua: ignore end
	vide.cleanup(q_result_changed.cleanup)

	local monitor = world.query(c.module_script):with(STORYBOOK):monitor()
	vide.cleanup(monitor.cleanup)

	monitor.added(function(entity)
		world.add(entity, c.auto_reload)
		world.add(entity, c.reload_queued)
	end)

	-- the result goes away on a load error; the storybook must follow
	local result_removed: Map<ecs.Entity, true> = {}
	vide.cleanup(world.removed(c.module_result, function(entity)
		result_removed[entity] = true
	end))

	return function()
		local stale: { ecs.Entity } = {}
		for entity in q_removed_storybooks:iter() do
			table.insert(stale, entity)
		end
		for _, entity in stale do
			world.remove(entity, c.storybook_result)
		end

		for entity in result_removed do
			if world.exists(entity) then
				world.remove(entity, c.storybook_result)
			end
		end
		table.clear(result_removed)

		local changed: { { entity: ecs.Entity, module: ModuleScript, result: unknown } } = {}
		for entity, module, result in q_result_changed do
			table.insert(changed, { entity = entity, module = module, result = result })
		end
		for _, entry in changed do
			local storybook = validate_storybook(entry.result)
			if storybook then
				world.set(entry.entity, c.storybook_result, storybook)
			else
				warn(`[UI Labs] {entry.module:GetFullName()} is not a valid storybook (expected a table with storyRoots)`)
				world.remove(entry.entity, c.storybook_result)
			end
		end
	end
end

return storybooks
