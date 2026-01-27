local vide = require "@pkg/vide"
local ecs = require "@vendor/ecs"

local function use_query(query: Derivable<ecs.Query<any>?>): Reactive<Array<ecs.Entity>>
	local entities: Array<ecs.Entity> = {}
	local entity_map: Map<ecs.Entity, number> = {}

	local output = vide.source(entities)

	vide.effect(function()
		local query = vide.read(query) :: ecs.Query<any>

		table.clear(entities)
		table.clear(entity_map)

		if not query then
			output(entities)
		end

		local monitor = query:monitor()
		monitor.added(function(entity)
			table.insert(entities, entity)
			entity_map[entity] = #entities
			output(entities)
		end)
		monitor.removed(function(entity)
			local index = entity_map[entity]
			entity_map[entity] = nil

			local latest = table.remove(entities)
			if not latest then
				output(entities)
				return
			end
			if latest == entity then
				output(entities)
				return
			end
			entities[index] = latest
			entity_map[latest] = index
			output(entities)
		end)

		for entity in query:iter() do
			table.insert(entities, entity)
			entity_map[entity] = #entities
		end

		vide.cleanup(monitor.cleanup)
	end)

	return output
end

return use_query
