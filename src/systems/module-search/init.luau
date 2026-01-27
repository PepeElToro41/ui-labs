local ecs = require "@vendor/ecs"
local CONFIG = require "@constants/config"
local use_system = require "@contexts/scheduler/use-system"
local use_world = require "@contexts/world/use-world"
local vide = require "@pkg/vide"
local c = require "@src/components"

local file_extensions = CONFIG.file_extensions

local module_search = {}

local function match_extension(name: string, extension: string)
	return name:match("%" .. extension .. "$")
end

function search_modules(roots: { Instance })
	local modules: { ModuleScript } = {}

	for _, parent in roots do
		for _, descendant in parent:GetDescendants() do
			if descendant.ClassName ~= "ModuleScript" then
				continue
			end
			table.insert(modules, descendant :: ModuleScript)
		end
	end

	return modules
end

function module_search.remove_extension(name: string, extension: string)
	return name:gsub("%" .. extension .. "$", "")
end

function module_search.match_module_extension(world: ecs.World, entity: ecs.Entity, module: ModuleScript)
	local name = module.Name

	if match_extension(name, file_extensions.story) then
		world.add(entity, ecs.pair(c.r_extension, c.story))
	elseif match_extension(name, file_extensions.storybook) then
		world.add(entity, ecs.pair(c.r_extension, c.storybook))
	elseif match_extension(name, file_extensions.config) then
		world.add(entity, ecs.pair(c.r_extension, c.uilabs_config))
	else
		for id in world.pairs(entity, c.r_extension) do
			world.remove(entity, id)
		end
	end
end

function module_search.system()
	local world = use_world()
	local module_map: Map<ModuleScript, ecs.Entity> = {}

	local on_name_changed: Map<ModuleScript, true> = {}
	local on_descendant_added: Map<ModuleScript, true> = {}
	local on_descendant_removed: { ModuleScript } = {}

	local name_changed_connections: Map<ModuleScript, RBXScriptConnection> = {}

	local function on_module_added(module: ModuleScript)
		local entity = world.entity()
		world.set(entity, c.module_script, module)

		module_map[module] = entity
		module_search.match_module_extension(world, entity, module)

		local changed = module:GetPropertyChangedSignal("Name"):Connect(function()
			on_name_changed[module] = true
		end)
		name_changed_connections[module] = changed
	end

	for _, module in search_modules(CONFIG.story_search) do
		on_module_added(module)
	end

	for _, search in CONFIG.story_search do
		vide.cleanup(search.DescendantAdded:Connect(function(descendant)
			if descendant:IsA "ModuleScript" then
				on_descendant_added[descendant] = true
			end
		end))
		vide.cleanup(search.DescendantRemoving:Connect(function(descendant)
			if descendant:IsA "ModuleScript" then
				on_descendant_added[descendant] = nil
				on_name_changed[descendant] = nil
				table.insert(on_descendant_removed, descendant)
			end
		end))
	end

	return function()
		for module in on_descendant_added do
			on_module_added(module)
		end
		table.clear(on_descendant_added)

		for module in on_name_changed do
			local entity = module_map[module]
			if entity then
				module_search.match_module_extension(world, entity, module)
			end
		end
		table.clear(on_name_changed)

		for _, module in on_descendant_removed do
			local changed = name_changed_connections[module]
			if changed then
				changed:Disconnect()
				name_changed_connections[module] = nil
			end

			local entity = module_map[module]
			if entity then
				world.delete(entity)
				module_map[module] = nil
			end
		end
		table.clear(on_descendant_removed)
	end
end

return module_search
