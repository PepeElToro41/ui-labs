local vide = require "@pkg/vide"
local use_world = require "@src/contexts/world/use-world"
local ecs = require "@vendor/ecs"

local function get(world: ecs.World, entity: ecs.Entity?, relation: ecs.Id)
	return if entity then world.target(entity, relation) else nil
end

local function use_target(entity: Derivable<ecs.Entity?>, relation: ecs.Id): Reactive<ecs.Entity?>
	local world = use_world()
	local output = vide.source(nil :: ecs.Entity?)

	vide.effect(function()
		local entity = vide.read(entity) :: ecs.Entity?

		-- hooks on the bare relation never fire for pairs, only the wildcard pair does
		local listen = ecs.pair(relation, ecs.Wildcard)

		vide.cleanup(world.added(listen, function(e)
			if e == entity then
				output(get(world, entity, relation))
			end
		end))
		vide.cleanup(world.removed(listen, function(e)
			if e ~= entity then
				return nil
			end
			return function()
				output(get(world, entity, relation))
			end
		end))

		output(get(world, entity, relation))
	end)

	return output
end

return use_target
