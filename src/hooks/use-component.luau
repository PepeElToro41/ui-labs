local vide = require "@pkg/vide"
local use_world = require "@src/contexts/world/use-world"
local ecs = require "@vendor/ecs"

local function get(world: ecs.World, entity: ecs.Entity, id: ecs.Component)
	if not world.exists(entity) then
		return nil
	end
	return world.get(entity, id)
end

function use_component<T>(entity: Derivable<ecs.Entity>, id: ecs.Component<T>): Reactive<T>
	local world = use_world()
	local output = vide.source()

	vide.effect(function()
		local entity = vide.read(entity) :: ecs.Entity
		if not entity then
			output(nil)
			return
		end

		local live = true
		vide.cleanup(function()
			live = false
		end)

		local listen = ecs.is_pair(id) and world.pair_first(id) or id

		vide.cleanup(world.added(listen, function(e)
			if e == entity then
				output(get(world, entity, id))
			end
		end))
		vide.cleanup(world.changed(listen, function(e)
			if e == entity then
				output(get(world, entity, id))
			end
		end))
		vide.cleanup(world.removed(listen, function(e)
			if e ~= entity then
				return nil
			end
			return function()
				if live then
					output(get(world, entity, id))
				end
			end
		end))

		output(get(world, entity, id))
	end)

	return output
end

return use_component
