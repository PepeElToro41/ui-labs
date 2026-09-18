local use_world = require "@contexts/world/use-world"
local vide = require "@pkg/vide"
local c = require "@src/components"
local ecs = require "@vendor/ecs"
local check_story = require "@self/check-story"

--[[
	Story previews: one entity per mounted story.

	A preview carries `story_preview`, `ChildOf(story node entity)`, its own copy of the story
	`module_script` plus `auto_reload` / `reload_queued`, so module_loading requires the module
	on the preview itself, in its own environment. The same story can therefore be open several
	times at once, and story module entities are never required directly. Deleting the preview
	drops its environment through module_loading's removed hook.

	Previews sit under the explorer node (not the story module) so queries can walk `ChildOf`
	up through the node to its folders and storybook. The node is deleted with its module
	through `r_module`, and `ChildOf` cascades that delete into the preview.

	`quick_mounted` marks the single preview a plain click on a story node swaps.
	`selected_preview` marks the active tab. `preview_order` is kept contiguous by the system,
	`move` reorders tabs and keeps that invariant itself.
	`story_type` / `story_error` are derived from the preview's `module_result`.

	Non-cached queries are only correct on their first iteration, so every helper builds a
	fresh one and collects entities with `:iter()` before writing.
]]

local previews = {}

export type StoryType = c.StoryType

type Ordered = { entity: ecs.Entity, order: number }

local function compare_ordered(a: Ordered, b: Ordered)
	if a.order ~= b.order then
		return a.order < b.order
	end
	return (a.entity :: any) < (b.entity :: any)
end

local function collect_ordered(world: ecs.World): { Ordered }
	local ordered: { Ordered } = {}
	for entity, order in world.query(c.preview_order):with(c.story_preview):iter() do
		table.insert(ordered, { entity = entity, order = order })
	end
	table.sort(ordered, compare_ordered)
	return ordered
end

local function max_order(world: ecs.World): number
	local max = 0
	for _, order in world.query(c.preview_order):with(c.story_preview):iter() do
		if order > max then
			max = order
		end
	end
	return max
end

--- Makes `preview` the active tab
function previews.select(world: ecs.World, preview: ecs.Entity)
	local current: { ecs.Entity } = {}
	for entity in world.query():with(c.selected_preview):iter() do
		table.insert(current, entity)
	end

	for _, entity in current do
		if entity ~= preview then
			world.remove(entity, c.selected_preview)
		end
	end
	if world.exists(preview) and not world.has(preview, c.selected_preview) then
		world.add(preview, c.selected_preview)
	end
end

--- Selects the last tab when nothing is selected
local function reselect(world: ecs.World)
	if world.query(c.selected_preview):empty() then
		local ordered = collect_ordered(world)
		local last = ordered[#ordered]
		if last then
			previews.select(world, last.entity)
		end
	end
end

--- Resolves the story module behind an explorer node
local function node_module(world: ecs.World, node: ecs.Entity): ModuleScript?
	if not world.exists(node) then
		return nil
	end

	local story = world.target(node, c.r_module)
	if not story then
		return nil
	end
	return world.get(story, c.module_script)
end

local function create_preview(world: ecs.World, node: ecs.Entity, order: number, quick: boolean): ecs.Entity?
	local module = node_module(world, node)
	if not module then
		return nil
	end

	local preview = world.entity()
	world.set(preview, c.preview_order, order)
	world.set(preview, c.module_script, module)
	world.add(preview, ecs.pair(ecs.ChildOf, node))

	if quick then
		world.add(preview, c.quick_mounted)
	end

	world.add(preview, c.auto_reload)
	world.add(preview, c.reload_queued)
	world.add(preview, c.keep_controls)
	world.add(preview, c.story_preview)

	-- a new tab only takes focus when no tab is active, so opening more previews never
	-- steals the one the user is looking at
	if world.query(c.selected_preview):empty() then
		previews.select(world, preview)
	end
	return preview
end

--- Plain click on a story node: swaps the quick preview to `node`, or closes it when it
--- already shows that node. The new preview keeps the old tab slot.
function previews.quick_mount(world: ecs.World, node: ecs.Entity): ecs.Entity?
	local quick = world.query():with(c.story_preview, c.quick_mounted):first()
	if quick then
		-- read before deleting, the target is gone once the entity left its archetype
		local current = world.parent(quick)
		local order = world.get(quick, c.preview_order) or max_order(world) + 1
		world.delete(quick)

		if current == node then
			reselect(world)
			return nil
		end
		return create_preview(world, node, order, true)
	end

	return create_preview(world, node, max_order(world) + 1, true)
end

--- Opens `node` in a new tab that a plain click never replaces
function previews.mount(world: ecs.World, node: ecs.Entity): ecs.Entity?
	return create_preview(world, node, max_order(world) + 1, false)
end

function previews.unmount(world: ecs.World, preview: ecs.Entity)
	if world.exists(preview) then
		world.delete(preview)
	end
	reselect(world)
end

--- Forces a reload of `preview`: module_loading drops its environment and requires the story
--- again, the new result then remounts it (same as auto reload, without a source change)
function previews.reload(world: ecs.World, preview: ecs.Entity)
	if not world.exists(preview) or not world.has(preview, c.story_preview) then
		return
	end
	if not world.has(preview, c.reload_queued) then
		world.add(preview, c.reload_queued)
	end
end

--- Moves `preview` to tab slot `index` (clamped). Orders stay contiguous 1..n so quick_mount
--- slot reuse and reselect keep working. Does not touch the system's dirty flag.
function previews.move(world: ecs.World, preview: ecs.Entity, index: number)
	if not world.exists(preview) or not world.has(preview, c.story_preview) then
		return
	end

	local ordered = collect_ordered(world)
	local from: number? = nil
	for position, entry in ordered do
		if entry.entity == preview then
			from = position
			break
		end
	end
	if not from then
		return
	end

	local entry = table.remove(ordered, from) :: Ordered
	table.insert(ordered, math.clamp(index, 1, #ordered + 1), entry)

	for position, moved in ordered do
		if moved.order ~= position then
			world.set(moved.entity, c.preview_order, position)
		end
	end
end

function previews.system()
	local world = use_world()
	local dirty = false

	local function mark_dirty()
		dirty = true
	end

	-- stylua: ignore start
	local q_previews = world
		.query(c.preview_order)
		:with(c.story_preview)
		:cached()

	-- fires when the module result is first produced and every time it is replaced
	local q_result_changed = world
		.query(c.module_script, c.module_result)
		:with(c.story_preview)
		:changed()

	-- previews that lost their result (load error, or not loaded yet)
	local q_unloaded = world
		.query()
		:with(c.story_preview)
		:without(c.module_result)
		:cached()
	-- stylua: ignore end

	vide.cleanup(function()
		q_previews:cleanup()
		q_result_changed.cleanup()
		q_unloaded:cleanup()
	end)

	local monitor = q_previews:monitor()
	monitor.added(mark_dirty)
	monitor.removed(mark_dirty)

	vide.cleanup(monitor.cleanup)
	vide.cleanup(world.removed(c.selected_preview, mark_dirty))

	return function()
		local stale: { ecs.Entity } = {}
		for entity in q_unloaded:iter() do
			if world.has(entity, c.story_type) or world.has(entity, c.story_error) then
				table.insert(stale, entity)
			end
		end
		for _, entity in stale do
			world.remove(entity, c.story_type)
			world.remove(entity, c.story_error)
		end

		for entity, module, result in q_result_changed.iter() do
			local story_type, err = check_story(result)
			if story_type then
				world.set(entity, c.story_type, story_type)
				world.remove(entity, c.story_error)
			else
				warn(`[UI Labs] {module:GetFullName()}: {err}`)
				world.set(entity, c.story_error, err :: string)
				world.remove(entity, c.story_type)
			end
		end

		if dirty then
			dirty = false

			local ordered: { Ordered } = {}
			for entity, order in q_previews:iter() do
				table.insert(ordered, { entity = entity, order = order })
			end
			table.sort(ordered, compare_ordered)
			for index, entry in ordered do
				if entry.order ~= index then
					world.set(entry.entity, c.preview_order, index)
				end
			end

			reselect(world)
		end
	end
end

return previews
