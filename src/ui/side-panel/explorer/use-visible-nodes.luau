local use_filter_search = require "@contexts/filter-search/use-filter-search"
local use_world = require "@contexts/world/use-world"
local vide = require "@pkg/vide"
local c = require "@src/components"
local ecs = require "@vendor/ecs"

local STORY_NODE = ecs.pair(c.r_node, c.story)
local CHILD_OF_ANY = ecs.pair(ecs.ChildOf, ecs.Wildcard)

export type VisibleNodes = Reactive<Set<ecs.Entity>?>

--[[
	Derives the explorer nodes that survive the search filter, nil when no filter is active.

	A story is kept when its name contains the filter, and every ancestor of a kept story is
	kept with it, so containers without a matching descendant drop out. Nothing is written to
	the world, the set is recomputed from the filter and the current tree.
]]
local function use_visible_nodes(): VisibleNodes
	local world = use_world()
	local filter = use_filter_search()

	-- bumped whenever the tree changes shape or a node is renamed, so the walk runs again
	local version = vide.source(0)
	local function invalidate()
		version(version() + 1)
	end
	-- removal hooks fire before the entity leaves, so the bump waits until after
	local function invalidate_after()
		return invalidate
	end

	vide.cleanup(world.added(c.node_name, invalidate))
	vide.cleanup(world.changed(c.node_name, invalidate))
	vide.cleanup(world.removed(c.node_name, invalidate_after))
	vide.cleanup(world.added(CHILD_OF_ANY, invalidate))
	vide.cleanup(world.removed(CHILD_OF_ANY, invalidate_after))

	return vide.derive(function(): Set<ecs.Entity>?
		local input = filter()
		if not input then
			return nil
		end
		version()

		local needle = input:lower()
		local visible: Set<ecs.Entity> = {}

		-- non cached queries are only valid on their first iteration, so one is built per walk
		for node, name in world.query(c.node_name):with(STORY_NODE):iter() do
			if not name:lower():find(needle, 1, true) then
				continue
			end
			local current: ecs.Entity? = node
			while current and not visible[current] do
				visible[current] = true
				current = world.parent(current)
			end
		end

		return visible
	end)
end

return use_visible_nodes
