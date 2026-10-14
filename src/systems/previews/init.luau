local Selection = game:GetService "Selection"
local StarterGui = game:GetService "StarterGui"

local use_world = require "@contexts/world/use-world"
local vide = require "@pkg/vide"
local c = require "@src/components"
local environment = require "@utils/hot-reloading/environment"
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

	A preview mounted with `mount_shared` instead carries `(r_shared_environment, owner)` and
	no environment of its own: module_loading requires its story in the environment of the
	preview it points at, so both see the same module instances, and the reload of that
	environment reloads every preview sharing it. Mounting one never reloads the owner, and
	`reload` / `auto_reload` on it act on that owner: it has no code of its own to re-read.

	`quick_mounted` marks the single preview a plain click on a story node swaps.
	`selected_preview` marks the active tab. `preview_order` is kept contiguous by the system,
	`move` reorders tabs and keeps that invariant itself.
	`story_type` / `story_error` are derived from the preview's `module_result`.
	`preview_scale` / `preview_offset` are the zoom and position of the mounted story, the
	story_holder ui applies them to the holder frame.
	`measure_tool` / `select_tool` / `outline_marker` enable the story tools drawn over the
	story of the preview, see ui/main-panel/story-content/tools.
	`hidden` hides the frame the story is mounted in, wherever it is being shown. The story
	itself is left alone, it keeps running while nothing of it is drawn.
	`in_viewport` / `in_widget` open the holders of the same name next to the editor slot every
	preview has. Any of them can be open at once, the story is parented into the first one that
	is (viewport, then widget, then editor) and the others stay open and empty. Opening and
	closing them only moves the frame, the story keeps running untouched.

	Non-cached queries are only correct on their first iteration, so every helper builds a
	fresh one and collects entities with `:iter()` before writing.
]]

local previews = {}

export type StoryType = c.StoryType

-- the frame the mounters create under the preview holder, the story renders inside it
local ROOT_NAME = "story"

local SHARED_ENV = ecs.pair(c.r_shared_environment, ecs.Wildcard)

previews.MIN_SCALE = 0.1
previews.MAX_SCALE = 10
-- every place a story can be shown in, and the tag that opens it. The editor is the slot the
-- story panel keeps for each preview, it has no tag because it is always there
local HOLDER_TYPES: { c.HolderType } = { "editor", "viewport", "widget" }
local HOLDER_TAGS: { [c.HolderType]: ecs.Id } = {
	viewport = c.in_viewport,
	widget = c.in_widget,
}

previews.HOLDER_TYPES = HOLDER_TYPES

-- every tool that can be used over a mounted story, and the tag that enables it
local TOOL_TYPES: { c.ToolType } = { "measure", "select", "outlines" }
local TOOL_TAGS: { [c.ToolType]: ecs.Id } = {
	measure = c.measure_tool,
	select = c.select_tool,
	outlines = c.outline_marker,
}

previews.TOOL_TYPES = TOOL_TYPES

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

--- The preview that owns the environment `preview` loads in: itself, or the one it shares.
--- Chains are flattened, so a shared preview always points at an owner that loads its own
local function environment_owner(world: ecs.World, preview: ecs.Entity): ecs.Entity
	local owner = preview
	while true do
		local source = world.target(owner, c.r_shared_environment)
		if not source or not world.exists(source) then
			return owner
		end
		owner = source
	end
end

local function create_preview(
	world: ecs.World,
	node: ecs.Entity,
	order: number,
	quick: boolean,
	shared: ecs.Entity?
): ecs.Entity?
	local module = node_module(world, node)
	if not module then
		return nil
	end

	local preview = world.entity()
	world.set(preview, c.preview_order, order)
	world.set(preview, c.module_script, module)
	world.set(preview, c.preview_scale, 1)
	world.set(preview, c.preview_offset, Vector2.zero)
	world.add(preview, ecs.pair(ecs.ChildOf, node))

	if shared then
		world.add(preview, ecs.pair(c.r_shared_environment, environment_owner(world, shared)))
	end
	if quick then
		world.add(preview, c.quick_mounted)
	end

	-- a shared preview reloads with its owner, so its own flag only starts to count once that
	-- owner is unmounted and it loads an environment of its own
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

--- Opens `node` in a new tab that loads its story in the environment of `source` instead of
--- one of its own: both stories then require the same module instances, and reloading that
--- environment reloads both. `source` is left alone, mounting this never reloads it
function previews.mount_shared(world: ecs.World, node: ecs.Entity, source: ecs.Entity): ecs.Entity?
	if not world.exists(source) or not world.has(source, c.story_preview) then
		return nil
	end
	return create_preview(world, node, max_order(world) + 1, false, source)
end

--- The environment the story of `preview` was loaded in, the one it shares when it has no
--- environment of its own. Nil until that environment started loading, typed like
--- `world.get` so callers keep checking it themselves
function previews.environment(world: ecs.World, preview: ecs.Entity): environment.Environment
	if not world.exists(preview) then
		return nil :: any
	end
	return world.get(environment_owner(world, preview), c.environment)
end

function previews.unmount(world: ecs.World, preview: ecs.Entity)
	if world.exists(preview) then
		world.delete(preview)
	end
	reselect(world)
end

function previews.unmount_all(world: ecs.World) 
	for _, entity in world.query(c.story_preview):entities() do
		world.delete(entity)
	end
end

function previews.unmount_node(world: ecs.World, node: ecs.Entity)
	for _, entity in world.query(c.story_preview, ecs.pair(ecs.ChildOf, node)):entities() do
		world.delete(entity)
	end
end

--- Forces a reload of `preview`: module_loading drops its environment and requires the story
--- again, the new result then remounts it (same as auto reload, without a source change).
--- A preview sharing an environment has no code of its own to re-read, the owner of that
--- environment is queued instead, which reloads every preview sharing it
function previews.reload(world: ecs.World, preview: ecs.Entity)
	if not world.exists(preview) or not world.has(preview, c.story_preview) then
		return
	end

	local owner = environment_owner(world, preview)
	if not world.has(owner, c.reload_queued) then
		world.add(owner, c.reload_queued)
	end
end

--- Whether `preview` is waiting for a load to finish: its own, or the one of the environment
--- it shares, which replaces the code of every preview in it
function previews.reloading(world: ecs.World, preview: ecs.Entity): boolean
	if not world.exists(preview) then
		return false
	end
	return world.has(preview, c.reload_queued) or world.has(environment_owner(world, preview), c.reload_queued)
end

--- Whether `preview` reloads itself when the source of its story changes. A preview sharing
--- an environment reloads with it, so the flag of the owner is the one that answers
function previews.auto_reloading(world: ecs.World, preview: ecs.Entity): boolean
	return world.exists(preview) and world.has(environment_owner(world, preview), c.auto_reload)
end

--- Turns auto reload on or off for `preview`. With it off the preview keeps the code it was
--- loaded with until something asks for a reload, see `previews.reload`. A preview sharing an
--- environment cannot be frozen on its own, the flag goes on the owner of that environment
--- and freezes every preview sharing it
function previews.auto_reload(world: ecs.World, preview: ecs.Entity, enabled: boolean?)
	if not world.exists(preview) or not world.has(preview, c.story_preview) then
		return
	end

	local owner = environment_owner(world, preview)
	if enabled ~= false then
		if not world.has(owner, c.auto_reload) then
			world.add(owner, c.auto_reload)
		end
	else
		world.remove(owner, c.auto_reload)
	end
end

--- Turns auto reload on for `preview` when it is off, and off when it is on
function previews.toggle_auto_reload(world: ecs.World, preview: ecs.Entity)
	previews.auto_reload(world, preview, not previews.auto_reloading(world, preview))
end

--- Zooms the story of `preview` to `scale` (clamped). The story scales from its top left corner,
--- so with a `pivot` (relative to where the holders live) the offset is moved to keep the
--- point of the story under it in place.
function previews.zoom(world: ecs.World, preview: ecs.Entity, scale: number, pivot: Vector2?)
	if not world.exists(preview) or not world.has(preview, c.story_preview) then
		return
	end

	local current = world.get(preview, c.preview_scale) or 1
	local target = math.clamp(scale, previews.MIN_SCALE, previews.MAX_SCALE)
	if target == current then
		return
	end

	if pivot then
		local offset = world.get(preview, c.preview_offset) or Vector2.zero
		world.set(preview, c.preview_offset, pivot - (pivot - offset) * (target / current))
	end
	world.set(preview, c.preview_scale, target)
end

--- Moves the story of `preview` to `offset`, in pixels from its original position
function previews.set_offset(world: ecs.World, preview: ecs.Entity, offset: Vector2)
	if not world.exists(preview) or not world.has(preview, c.story_preview) then
		return
	end
	world.set(preview, c.preview_offset, offset)
end

--- Puts the story of `preview` back at its original zoom
function previews.reset_zoom(world: ecs.World, preview: ecs.Entity)
	if not world.exists(preview) or not world.has(preview, c.story_preview) then
		return
	end
	world.set(preview, c.preview_scale, 1)
end

--- Which of the open holders shows the story: the viewport wins over the widget, which wins
--- over the editor. The editor is always there, so there is always an answer
function previews.active_holder(in_viewport: boolean, in_widget: boolean): c.HolderType
	return if in_viewport then "viewport" elseif in_widget then "widget" else "editor"
end

--- Where the story of `preview` is parented right now
function previews.holder(world: ecs.World, preview: ecs.Entity): c.HolderType
	if not world.exists(preview) then
		return "editor"
	end
	return previews.active_holder(world.has(preview, c.in_viewport), world.has(preview, c.in_widget))
end

--- Whether `preview` has that holder open. The editor slot is always open
function previews.in_holder(world: ecs.World, preview: ecs.Entity, holder: c.HolderType): boolean
	local tag = HOLDER_TAGS[holder]
	if not tag then
		return holder == "editor"
	end
	return world.exists(preview) and world.has(preview, tag)
end

--- Opens or closes one of the holders of `preview`. Opening the editor closes the holders
--- that come before it, closing it does nothing: its slot is always there. The story is only
--- re-parented by this, never unmounted nor reloaded
function previews.show_in(world: ecs.World, preview: ecs.Entity, holder: c.HolderType, shown: boolean?)
	if not world.exists(preview) or not world.has(preview, c.story_preview) then
		return
	end

	local show = shown ~= false
	local tag = HOLDER_TAGS[holder]

	if not tag then
		if holder == "editor" and show then
			for _, other in HOLDER_TAGS do
				world.remove(preview, other)
			end
		end
		return
	end

	if show then
		if not world.has(preview, tag) then
			world.add(preview, tag)
		end
	else
		world.remove(preview, tag)
	end
end

--- Opens the holder of `preview` when it is closed, and closes it when it is open
function previews.toggle_holder(world: ecs.World, preview: ecs.Entity, holder: c.HolderType)
	previews.show_in(world, preview, holder, not previews.in_holder(world, preview, holder))
end

--- Whether the story of `preview` is hidden
function previews.is_hidden(world: ecs.World, preview: ecs.Entity): boolean
	return world.exists(preview) and world.has(preview, c.hidden)
end

--- Hides or shows the story of `preview`. The frame it is mounted in is the one made
--- invisible, so it is hidden in every holder it could be shown in and the story keeps
--- running untouched
function previews.set_hidden(world: ecs.World, preview: ecs.Entity, hidden: boolean?)
	if not world.exists(preview) or not world.has(preview, c.story_preview) then
		return
	end

	if hidden ~= false then
		if not world.has(preview, c.hidden) then
			world.add(preview, c.hidden)
		end
	else
		world.remove(preview, c.hidden)
	end
end

--- Hides the story of `preview` when it is shown, and shows it when it is hidden
function previews.toggle_hidden(world: ecs.World, preview: ecs.Entity)
	previews.set_hidden(world, preview, not previews.is_hidden(world, preview))
end

--- Whether `tool` is enabled over the story of `preview`
function previews.using_tool(world: ecs.World, preview: ecs.Entity, tool: c.ToolType): boolean
	local tag = TOOL_TAGS[tool]
	return tag ~= nil and world.exists(preview) and world.has(preview, tag)
end

--- Enables or disables one of the tools over the story of `preview`. Tools are only drawn
--- while the story is in the editor, enabling one of them never moves it there
function previews.use_tool(world: ecs.World, preview: ecs.Entity, tool: c.ToolType, used: boolean?)
	if not world.exists(preview) or not world.has(preview, c.story_preview) then
		return
	end

	local tag = TOOL_TAGS[tool]
	if not tag then
		return
	end

	if used ~= false then
		if not world.has(preview, tag) then
			world.add(preview, tag)
		end
	else
		world.remove(preview, tag)
	end
end

--- Enables the tool over the story of `preview` when it is off, and disables it when it is on
function previews.toggle_tool(world: ecs.World, preview: ecs.Entity, tool: c.ToolType)
	previews.use_tool(world, preview, tool, not previews.using_tool(world, preview, tool))
end

--- Puts the story of `preview` back at its original position
function previews.reset_position(world: ecs.World, preview: ecs.Entity)
	if not world.exists(preview) or not world.has(preview, c.story_preview) then
		return
	end
	world.set(preview, c.preview_offset, Vector2.zero)
end

--- The frame the story of `preview` is mounted in, nil while nothing is mounted
function previews.story_root(world: ecs.World, preview: ecs.Entity): Frame?
	if not world.exists(preview) then
		return nil
	end
	local holder = world.get(preview, c.preview_holder)
	if not holder then
		return nil
	end
	return holder:FindFirstChild(ROOT_NAME) :: Frame?
end

--- Display name of the story `preview` was mounted from, as the explorer shows it
local function story_name(world: ecs.World, preview: ecs.Entity, holder: Frame): string
	local node = world.parent(preview)
	local name = if node and world.exists(node) then world.get(node, c.node_name) else nil
	-- the story panel names the holder after the story too, it is there to fall back on
	return name or holder.Name
end

--- Copies the mounted story of `preview` into a ScreenGui named after the story, under
--- StarterGui, and selects it. The copy is dead: no story code runs in it and nothing of it
--- is reloaded, so it can be edited and saved with the place. Returns nil when the preview
--- has no story mounted right now
function previews.snapshot(world: ecs.World, preview: ecs.Entity): ScreenGui?
	local root = previews.story_root(world, preview)
	if not root then
		return nil
	end
	local holder = root.Parent :: Frame

	local gui = Instance.new "ScreenGui"
	gui.Name = story_name(world, preview, holder)
	-- mounted the way the viewport holder shows a story, so the copy is drawn as it was
	gui.IgnoreGuiInset = true
	gui.ResetOnSpawn = false
	gui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling

	-- descendants the story marked non archivable are left out, same as any copy of it
	local clone = root:Clone()
	clone.Parent = gui
	gui.Parent = StarterGui

	Selection:Set { gui }
	return gui
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

	-- previews whose shared owner was unmounted: the environment went away with it, so they
	-- are queued to load one of their own. A preview waiting for its first load still has
	-- `reload_queued`, so only orphans match
	local q_orphaned = world
		.query()
		:with(c.story_preview)
		:without(c.environment, SHARED_ENV, c.reload_queued)
		:cached()
	-- stylua: ignore end

	vide.cleanup(function()
		q_previews:cleanup()
		q_result_changed.cleanup()
		q_unloaded:cleanup()
		q_orphaned:cleanup()
	end)

	local monitor = q_previews:monitor()
	monitor.added(mark_dirty)
	monitor.removed(mark_dirty)

	vide.cleanup(monitor.cleanup)
	vide.cleanup(world.removed(c.selected_preview, mark_dirty))

	return function()
		local orphaned: { ecs.Entity } = {}
		for entity in q_orphaned:iter() do
			table.insert(orphaned, entity)
		end
		for _, entity in orphaned do
			world.add(entity, c.reload_queued)
		end

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
