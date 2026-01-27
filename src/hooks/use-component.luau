local vide = require "@pkg/vide"
local use_world = require "@src/contexts/world/use-world"
local ecs = require "@vendor/ecs"

local function get(world: ecs.World, entity: ecs.Entity?, id: ecs.Component)
	return if entity then world.get(entity, id) else nil
end

function use_component<T>(entity: Derivable<ecs.Entity>, id: ecs.Component<T>): Reactive<T>
	local world = use_world()
	local output = vide.source()

	vide.effect(function()
		local entity = vide.read(entity) :: ecs.Entity
		local listen = ecs.is_pair(id) and world.pair_first(id) or id

		vide.cleanup(world.added(listen, function(entity, _, value)
			if entity == entity then
				output(get(world, entity, id))
			end
		end))
		vide.cleanup(world.changed(listen, function(entity, _, value)
			if entity == entity then
				output(get(world, entity, id))
			end
		end))
		vide.cleanup(world.removed(listen, function(entity, removed)
			if entity ~= entity then
				return nil
			end
			return function()
				output(get(world, entity, id))
			end
		end))

		output(get(world, entity, id))
	end)

	return output
end

return use_component
