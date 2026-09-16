local vide = require "@pkg/vide"
local use_world = require "@src/contexts/world/use-world"
local ecs = require "@vendor/ecs"

local function has(world: ecs.World, entity: ecs.Entity?, tag: ecs.Id)
	return if entity then world.has(entity, tag) else false
end

local function use_tag(entity: Derivable<ecs.Entity>, tag: ecs.Id): Reactive<boolean>
	local world = use_world()
	local output = vide.source(false)

	vide.effect(function()
		local entity = vide.read(entity) :: ecs.Entity

		vide.cleanup(world.added(tag, function(e)
			if e == entity then
				output(has(world, entity, tag))
			end
		end))
		vide.cleanup(world.removed(tag, function(e)
			if e ~= entity then
				return nil
			end
			return function()
				output(has(world, entity, tag))
			end
		end))

		output(has(world, entity, tag))
	end)

	return output
end

return use_tag
