local CONFIG = require "@constants/config"
local vide = require "@pkg/vide"
local c = require "@src/components"
local controls = require "@src/systems/controls"
local previews = require "@src/systems/previews"
local hot_reloading = require "@utils/hot-reloading/utils"
local ecs = require "@vendor/ecs"
local capture = require "@self/capture"
local HELP = require "@self/help"

--[[
	Automation api: a plain table of functions over the app's world, meant to be driven from
	outside the plugin (the Studio command bar, or an AI agent through the Studio MCP
	`execute_luau` tool). Studio runs every plugin in one Luau VM, so the table is published as
	is through the `shared` global: `shared.UILabs[widget id]`, one entry per running variant.

	Previews and story nodes are addressed by their entity number, stories also by explorer
	path, module full name or a unique name. Results are plain data (no Instances) except
	for the few functions that return one on purpose (`root`, `module`), so a caller can
	`JSONEncode` the rest. `help()` returns the usage reference.

	Loading and mounting happen across heartbeats, so `wait` polls the preview state. Every
	load is counted as a `generation`, which is how a caller tells a fresh load (mounted or
	errored) from the previous one after changing a source.
]]

local api_module = {}

export type RegisterInfo = {
	id: string,
	variant: string,
}

export type State = "loading" | "mounted" | "error"

export type Status = {
	id: number,
	state: State,
	story: string,
	module: string,
	story_type: c.StoryType?,
	error: string?,
	selected: boolean,
	auto_reload: boolean,
	holder: c.HolderType,
	holders: { viewport: boolean, widget: boolean },
	scale: number,
	order: number,
	generation: number,
	root_path: string?,
	timed_out: boolean?,
}

export type StoryInfo = {
	id: number,
	name: string,
	path: string,
	module: string,
	storybook: string?,
}

export type StorybookInfo = {
	name: string,
	module: string,
}

export type MountOptions = {
	auto_reload: boolean?,
	select: boolean?,
	wait: boolean?,
	timeout: number?,
}

export type WaitOptions = {
	timeout: number?,
	after: number?,
}

export type ReloadOptions = {
	timeout: number?,
	wait: boolean?,
}

export type ControlInfo = {
	type: string,
	value: unknown,
	default: unknown,
	order: number?,
	min: number?,
	max: number?,
	step: number?,
	list: unknown?,
	class_name: string?,
}

export type ControlGroupInfo = {
	group: true,
	controls: Map<string, ControlInfo>,
}

export type ControlsTree = Map<string, ControlInfo | ControlGroupInfo>

-- Each load creates a fresh environment, so counting environments counts the (re)loads. The
-- root seen when the environment changed belongs to the previous load: while it is still the
-- current root, the new load has not been mounted yet
type Tracked = {
	environment: unknown,
	root: Frame?,
	stale_root: Frame?,
	generation: number,
}

local PREFIX = "[UI Labs api]"
local API_VERSION = 1
local DEFAULT_TIMEOUT = 10
local ROOT_NAME = "story" -- the frame the mounters create under the holder

local STORY_NODE = ecs.pair(c.r_node, c.story)
local STORYBOOK_NODE = ecs.pair(c.r_node, c.storybook)
local ANY_NODE = ecs.pair(c.r_node, ecs.Wildcard)
local CHILD_OF_WILDCARD = ecs.pair(ecs.ChildOf, ecs.Wildcard)

-- the Luau type a control value must have, when it is a plain one
local VALUE_TYPES: Map<string, string> = {
	String = "string",
	Number = "number",
	Slider = "number",
	Boolean = "boolean",
	Color3 = "Color3",
}

local function fail(message: string, level: number?): never
	error(`{PREFIX} {message}`, (level or 2) + 1)
end

local function as_number(entity: ecs.Entity): number
	return entity :: any
end

function api_module.create(world: ecs.World, info: RegisterInfo)
	local api = {}

	api.id = info.id
	api.variant = info.variant
	api.version = CONFIG.version
	api.api_version = API_VERSION

	-- per preview bookkeeping, see `track`
	local tracked: Map<ecs.Entity, Tracked> = {}

	--------------------------------------------------------------------- stories

	local function node_label(node: ecs.Entity): string
		local name = world.get(node, c.node_name)
		if name then
			return name
		end
		local instance = world.get(node, c.node_instance)
		if instance then
			return instance.Name
		end
		return "?"
	end

	--- Explorer path of a node, from its storybook (or the unknown root) down
	local function node_path(node: ecs.Entity): string
		local parts: { string } = {}
		local current: ecs.Entity? = node
		while current and world.exists(current) and world.has(current, ANY_NODE) do
			table.insert(parts, 1, node_label(current))
			if not world.has(current, CHILD_OF_WILDCARD) then
				break
			end
			current = world.parent(current)
		end
		return table.concat(parts, "/")
	end

	local function node_storybook(node: ecs.Entity): string?
		local current: ecs.Entity? = node
		while current and world.exists(current) do
			if world.has(current, STORYBOOK_NODE) then
				return world.get(current, c.node_name)
			end
			if not world.has(current, CHILD_OF_WILDCARD) then
				return nil
			end
			current = world.parent(current)
		end
		return nil
	end

	local function node_module(node: ecs.Entity): ModuleScript?
		local story = world.target(node, c.r_module)
		if not story then
			return nil
		end
		return world.get(story, c.module_script)
	end

	local function story_info(node: ecs.Entity, name: string): StoryInfo
		local module = node_module(node)
		return {
			id = as_number(node),
			name = name,
			path = node_path(node),
			module = if module then module:GetFullName() else "",
			storybook = node_storybook(node),
		}
	end

	--- Accepts a node id, a ModuleScript, an explorer path, a module full name, or a unique
	--- story name / path suffix
	local function resolve_story(reference: unknown): ecs.Entity
		if type(reference) == "number" then
			local node = reference :: any
			if world.exists(node) and world.has(node, STORY_NODE) then
				return node
			end
			fail(`story node {reference} does not exist`, 3)
		end

		if typeof(reference) == "Instance" then
			for node in world.query(c.node_name):with(STORY_NODE):iter() do
				if node_module(node) == reference then
					return node
				end
			end
			fail(`{reference:GetFullName()} is not a story known to the explorer`, 3)
		end

		if type(reference) ~= "string" then
			fail("a story must be a node id, an explorer path, a module full name or a ModuleScript", 3)
		end
		local wanted = reference :: string

		local matches: { ecs.Entity } = {}
		local match_paths: { string } = {}
		for node, name in world.query(c.node_name):with(STORY_NODE):iter() do
			local path = node_path(node)
			local module = node_module(node)
			if path == wanted or (module and module:GetFullName() == wanted) then
				return node
			end
			local suffix = "/" .. wanted
			if name == wanted or string.sub(path, -#suffix) == suffix then
				table.insert(matches, node)
				table.insert(match_paths, path)
			end
		end

		if #matches == 1 then
			return matches[1]
		end
		if #matches == 0 then
			fail(`no story matches "{wanted}"`, 3)
		end
		return fail(`"{wanted}" is ambiguous, it matches: {table.concat(match_paths, ", ")}`, 3)
	end

	function api.storybooks(): { StorybookInfo }
		local list: { StorybookInfo } = {}
		for _, module, name in world.query(c.module_script, c.node_name):with(STORYBOOK_NODE):iter() do
			table.insert(list, { name = name, module = module:GetFullName() })
		end
		table.sort(list, function(a, b)
			return a.name < b.name
		end)
		return list
	end

	function api.stories(): { StoryInfo }
		local list: { StoryInfo } = {}
		for node, name in world.query(c.node_name):with(STORY_NODE):iter() do
			table.insert(list, story_info(node, name))
		end
		table.sort(list, function(a, b)
			return a.path < b.path
		end)
		return list
	end

	function api.module(story: unknown): ModuleScript
		local node = resolve_story(story)
		local module = node_module(node)
		if not module then
			fail(`story {node_path(node)} has no module`)
		end
		return module :: ModuleScript
	end

	-------------------------------------------------------------------- previews

	local function resolve_preview(reference: unknown): ecs.Entity
		if type(reference) == "number" then
			local preview = reference :: any
			if world.exists(preview) and world.has(preview, c.story_preview) then
				return preview
			end
		end
		return fail(`preview {tostring(reference)} does not exist`, 3)
	end

	local function root_of(preview: ecs.Entity): Frame?
		local holder = world.get(preview, c.preview_holder)
		if not holder then
			return nil
		end
		return holder:FindFirstChild(ROOT_NAME) :: Frame?
	end

	--- Updates the bookkeeping of `preview` from what the world holds right now
	local function track(preview: ecs.Entity): Tracked
		local entry = tracked[preview]
		if not entry then
			entry = { environment = nil, root = nil, stale_root = nil, generation = 0 }
			tracked[preview] = entry
		end

		local environment = previews.environment(world, preview)
		local root = root_of(preview)

		if environment ~= entry.environment then
			entry.environment = environment
			entry.stale_root = entry.root
			if environment then
				entry.generation += 1
			end
		end
		entry.root = root
		return entry
	end

	local function status_of(preview: ecs.Entity): Status
		local module = world.get(preview, c.module_script)
		local environment = previews.environment(world, preview)
		local err = world.get(preview, c.module_error) or world.get(preview, c.story_error)
		local entry = track(preview)
		local root = entry.root

		-- the environment records the module once its load finished, with a result or an error
		local loaded = environment ~= nil and environment.dependencies[module] ~= nil

		local state: State = if not loaded or previews.reloading(world, preview)
			then "loading"
			elseif err then "error"
			elseif root and root ~= entry.stale_root then "mounted"
			else "loading"

		local node = world.parent(preview)
		local story_type: c.StoryType? = world.get(preview, c.story_type) :: any
		return {
			id = as_number(preview),
			state = state,
			story = if node and world.exists(node) then node_path(node) else "",
			module = if module then module:GetFullName() else "",
			story_type = story_type,
			error = err,
			selected = world.has(preview, c.selected_preview),
			auto_reload = previews.auto_reloading(world, preview),
			holder = previews.holder(world, preview),
			holders = {
				viewport = previews.in_holder(world, preview, "viewport"),
				widget = previews.in_holder(world, preview, "widget"),
			},
			scale = world.get(preview, c.preview_scale) or 1,
			order = world.get(preview, c.preview_order) or 0,
			generation = entry.generation,
			root_path = if root then root:GetFullName() else nil,
		}
	end

	local function wait_for(preview: ecs.Entity, options: WaitOptions?): Status
		local opts: WaitOptions = options or {}
		local deadline = os.clock() + (opts.timeout or DEFAULT_TIMEOUT)
		local after = opts.after

		while true do
			if not world.exists(preview) or not world.has(preview, c.story_preview) then
				fail(`preview {as_number(preview)} was unmounted while waiting`, 3)
			end
			local status = status_of(preview)
			if status.state ~= "loading" and (after == nil or status.generation > after) then
				return status
			end
			if os.clock() >= deadline then
				status.timed_out = true
				return status
			end
			task.wait()
		end
	end

	function api.status(preview: unknown): Status
		return status_of(resolve_preview(preview))
	end

	function api.wait(preview: unknown, options: WaitOptions?): Status
		return wait_for(resolve_preview(preview), options)
	end

	function api.previews(): { Status }
		local list: { Status } = {}
		for preview in world.query():with(c.story_preview):iter() do
			table.insert(list, status_of(preview))
		end
		table.sort(list, function(a, b)
			if a.order ~= b.order then
				return a.order < b.order
			end
			return a.id < b.id
		end)
		return list
	end

	function api.mount(story: unknown, options: MountOptions?): (number, Status)
		local opts: MountOptions = options or {}
		local node = resolve_story(story)

		local preview = previews.mount(world, node)
		if not preview then
			fail(`story {node_path(node)} could not be mounted`)
		end
		local mounted = preview :: ecs.Entity

		if opts.auto_reload == false then
			world.remove(mounted, c.auto_reload)
		end
		if opts.select then
			previews.select(world, mounted)
		end

		local status = if opts.wait == false then status_of(mounted) else wait_for(mounted, { timeout = opts.timeout })
		return as_number(mounted), status
	end

	function api.unmount(preview: unknown)
		previews.unmount(world, resolve_preview(preview))
	end

	function api.unmount_all()
		previews.unmount_all(world)
	end

	function api.select(preview: unknown)
		previews.select(world, resolve_preview(preview))
	end

	function api.root(preview: unknown): Frame?
		return root_of(resolve_preview(preview))
	end

	function api.auto_reload(preview: unknown, enabled: boolean)
		previews.auto_reload(world, resolve_preview(preview), enabled)
	end

	--- Opens or closes one of the places a story is shown in: "viewport" (a ScreenGui under
	--- CoreGui), "widget" (its own dock widget) or "editor" (the app, which also closes the
	--- other two). Several can be open at once and the story shows up in the first of them,
	--- re-parented and never remounted. Without a holder this only reads the active one
	function api.holder(preview: unknown, holder: unknown, shown: unknown): c.HolderType
		local entity = resolve_preview(preview)
		if holder == nil then
			return previews.holder(world, entity)
		end
		if not table.find(previews.HOLDER_TYPES, holder :: any) then
			fail(`holder expects one of {table.concat(previews.HOLDER_TYPES, ", ")}`)
		end
		if shown ~= nil and type(shown) ~= "boolean" then
			fail "holder expects a boolean as its third argument"
		end

		previews.show_in(world, entity, holder :: c.HolderType, shown :: boolean?)
		return previews.holder(world, entity)
	end

	function api.reload(preview: unknown, options: ReloadOptions?): Status
		local entity = resolve_preview(preview)
		local opts: ReloadOptions = options or {}
		local before = status_of(entity).generation

		previews.reload(world, entity)

		if opts.wait == false then
			return status_of(entity)
		end
		return wait_for(entity, { timeout = opts.timeout, after = before })
	end

	function api.zoom(preview: unknown, scale: number)
		if type(scale) ~= "number" then
			fail "zoom expects a number"
		end
		previews.zoom(world, resolve_preview(preview), scale)
	end

	function api.reset_view(preview: unknown)
		local entity = resolve_preview(preview)
		previews.reset_zoom(world, entity)
		previews.reset_position(world, entity)
	end

	-------------------------------------------------------------------- controls

	local function control_info(entity: ecs.Entity): ControlInfo
		local control = world.get(entity, c.control)
		return {
			type = control.Type,
			value = world.get(entity, c.control_value),
			default = control.ControlValue,
			order = control.Order,
			min = control.Min,
			max = control.Max,
			step = control.Step,
			list = control.List,
			class_name = control.ClassName,
		}
	end

	--- Direct control / group children of an entity, by name
	local function control_children(parent: ecs.Entity): Map<string, ecs.Entity>
		local children: Map<string, ecs.Entity> = {}
		for child in world.children(parent) do
			if world.has(child, c.control) or world.has(child, c.control_group) then
				children[world.get(child, c.control_name) :: string] = child
			end
		end
		return children
	end

	function api.controls(preview: unknown): ControlsTree
		local entity = resolve_preview(preview)
		local tree: ControlsTree = {}

		for name, child in control_children(entity) do
			if world.has(child, c.control_group) then
				local group: Map<string, ControlInfo> = {}
				for nested_name, nested in control_children(child) do
					if world.has(nested, c.control) then
						group[nested_name] = control_info(nested)
					end
				end
				tree[name] = { group = true, controls = group } :: ControlGroupInfo
			else
				tree[name] = control_info(child)
			end
		end
		return tree
	end

	--- Finds a control by "name" or "group.name" ("group/name" works too)
	local function resolve_control(preview: ecs.Entity, path: unknown): ecs.Entity
		if type(path) ~= "string" then
			fail('a control path must be a string like "name" or "group.name"', 3)
		end
		local parts = string.split(string.gsub(path :: string, "/", "."), ".")

		local current: ecs.Entity? = preview
		for _, part in parts do
			current = control_children(current :: ecs.Entity)[part]
			if not current then
				fail(`no control "{path}" on preview {as_number(preview)}`, 3)
			end
		end

		local control = current :: ecs.Entity
		if not world.has(control, c.control) then
			fail(`"{path}" is a control group, not a control`, 3)
		end
		return control
	end

	function api.set_control(preview: unknown, path: unknown, value: unknown): unknown
		local entity = resolve_preview(preview)
		local control_entity = resolve_control(entity, path)
		local control = world.get(control_entity, c.control)

		local expected = VALUE_TYPES[control.Type]
		if expected and typeof(value) ~= expected then
			fail(`control "{path}" is a {control.Type}, it takes a {expected} (got {typeof(value)})`)
		end

		world.set(control_entity, c.control_value, value)
		return world.get(control_entity, c.control_value)
	end

	function api.reset_controls(preview: unknown)
		controls.reset(world, resolve_preview(preview))
	end

	------------------------------------------------------------------------- run

	function api.run(preview: unknown, source: unknown, ...: unknown): ...unknown
		local entity = resolve_preview(preview)
		if type(source) ~= "string" then
			fail "run expects the source as a string"
		end

		local environment = previews.environment(world, entity)
		local module = world.get(entity, c.module_script)
		if not environment or not module then
			fail(`preview {as_number(entity)} has no environment yet, wait for it to load`)
		end

		local chunk, compile_error = loadstring(source :: string, `{module.Name}.run`)
		if not chunk then
			fail(`could not compile: {compile_error}`)
		end
		local fn = chunk :: (...unknown) -> ...unknown

		-- the story's environment first, then the extras on top of it
		hot_reloading.set_environment(fn, module, environment)
		local extras = {
			preview = as_number(entity),
			root = root_of(entity),
			module = module,
			controls = controls.values(world, entity),
			uilabs = api,
		}
		setfenv(fn, setmetatable(extras, { __index = getfenv(fn) }) :: any)

		local results = table.pack(pcall(fn, ...))
		if not results[1] then
			fail(`run errored: {results[2]}`)
		end
		return table.unpack(results, 2, results.n)
	end

	--------------------------------------------------------------------- capture

	function api.capture(targets: { unknown }?, options: capture.Options?)
		local entries: { capture.Entry } = {}

		if targets then
			for _, reference in targets do
				local entity = resolve_preview(reference)
				local holder = world.get(entity, c.preview_holder)
				if not holder then
					fail(`preview {as_number(entity)} has no holder yet`)
				end
				table.insert(entries, { id = as_number(entity), holder = holder })
			end
		else
			for _, status in api.previews() do
				local holder = world.get(status.id :: any, c.preview_holder)
				if holder and status.state == "mounted" then
					table.insert(entries, { id = status.id, holder = holder })
				end
			end
		end

		if #entries == 0 then
			fail "nothing to capture, mount a story first"
		end

		local session = capture.begin(entries, options)
		return {
			path = session.path,
			rects = session.rects,
			viewport = { x = session.viewport.X, y = session.viewport.Y },
			scale = session.scale,
			ends_at = session.ends_at,
		}
	end

	function api.capture_end(): boolean
		return capture.finish()
	end

	------------------------------------------------------------------------ misc

	function api.help(): string
		return HELP
	end

	--- Drops the per preview bookkeeping, called by `register` on unmount
	function api._forget(preview: ecs.Entity)
		tracked[preview] = nil
	end

	return api
end

export type Api = typeof(api_module.create(nil :: any, nil :: any))

--- Publishes the api of `world` in `shared.UILabs[info.id]` until the calling vide scope is
--- destroyed. Must run inside a vide scope.
-- selene: allow(global_usage)
function api_module.register(world: ecs.World, info: RegisterInfo): Api
	local api = api_module.create(world, info)

	local registry = shared.UILabs
	if type(registry) ~= "table" then
		registry = {}
		shared.UILabs = registry
	end
	registry[info.id] = api

	vide.cleanup(world.removed(c.story_preview, function(entity)
		api._forget(entity)
	end))

	vide.cleanup(function()
		capture.finish()
		if shared.UILabs == registry and registry[info.id] == api then
			registry[info.id] = nil
		end
	end)

	return api
end

return api_module
