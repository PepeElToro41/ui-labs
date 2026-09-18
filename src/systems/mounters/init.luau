local logging = require "@constants/logging"
local use_world = require "@contexts/world/use-world"
local vide = require "@pkg/vide"
local c = require "@src/components"
local controls = require "@src/systems/controls"
local ecs = require "@vendor/ecs"
local functional = require "@self/functional"
local run_protected = require "@self/run-protected"
local types = require "@self/types"
local vide_mounter = require "@self/vide"

--[[
	Story mounters: executes a preview's story into its holder frame.

	A preview is mountable once it carries `module_result`, `story_type` (set by the previews
	system) and `preview_holder` (set by the story_holder ui). Every mount gets its own root
	frame under the holder, handed to the story as `target`, so a remount starts from a clean
	frame and the ui-owned holder is never touched by story code.

	Table stories may declare `controls`: they are converted and turned into control entities
	under the preview before the mounter runs (see systems/controls), and deleted again on
	unmount after their values were recorded in `control_recovery` for the next mount.

	`story_type` is re-set every time the module result changes, which re-queues the preview in
	the changed query: the old mount is cleaned up before the new result is mounted, same tick.

	Unmounting happens synchronously in the `preview_holder` / `story_type` removed hooks. Those
	fire before the entity leaves its archetype (and before the monitors that tear the holder ui
	down on `world.delete`), so the story cleanup always runs while its frame is still alive.
	World writes on the preview are not allowed inside those hooks, so `unmount` returns them as
	a closure the hook hands back to the ecs, which runs it once the removal completed.
]]

local mounters = {}

export type MounterProps<T> = types.MounterProps<T>
export type Mounter<T> = types.Mounter<T>

local LOG_MESSAGES = logging.LOG_MESSAGES

local MOUNTERS: { [c.StoryType]: Mounter<any> } = {
	Functional = functional,
	Vide = vide_mounter,
}

type Mounted = {
	cleanup: (() -> ())?, -- returned by the mounter
	story_cleanup: (() -> ())?, -- the story table's `cleanup` key
	root: Frame,
}

local function create_root(holder: Frame): Frame
	local root = Instance.new "Frame"
	root.Name = "story"
	root.Size = UDim2.fromScale(1, 1)
	root.BackgroundTransparency = 1
	root.BorderSizePixel = 0
	root.Parent = holder
	return root
end

local function run_cleanup(prefix: string, cleanup: () -> ())
	local status, err = run_protected(cleanup)
	if status == "error" then
		warn(`{prefix} {LOG_MESSAGES.CLEANUP_ERROR}\n{err}`)
	elseif status == "yield" then
		warn(`{prefix} {string.format(LOG_MESSAGES.FUNCTION_YIELD, "The story cleanup")}`)
	end
end

function mounters.system()
	local world = use_world()
	local mounted: Map<ecs.Entity, Mounted> = {}

	--- Tears the mount down. Returns the world writes (recovery snapshot, control entities)
	--- as a closure, so removed hooks can defer them past the removal in progress.
	local function unmount(entity: ecs.Entity): (() -> ())?
		local record = mounted[entity]
		if not record then
			return nil
		end
		mounted[entity] = nil

		local module = if world.exists(entity) then world.get(entity, c.module_script) else nil
		local prefix = `[UI Labs] {if module then module:GetFullName() else "story"}:`

		if record.cleanup then
			run_cleanup(prefix, record.cleanup)
		else
			warn(`{prefix} {LOG_MESSAGES.NO_CLEANUP}`)
		end
		if record.story_cleanup then
			run_cleanup(prefix, record.story_cleanup)
		end

		record.root:Destroy()

		-- a dying preview already lost its controls to the ChildOf cascade
		if not world.exists(entity) or world.deleting(entity) then
			return nil
		end

		return function()
			if not world.exists(entity) then
				return
			end
			if world.has(entity, c.keep_controls) then
				local snapshot = controls.snapshot(world, entity)
				if next(snapshot) then
					world.set(entity, c.control_recovery, snapshot)
				else
					world.remove(entity, c.control_recovery)
				end
			else
				world.remove(entity, c.control_recovery)
			end
			controls.destroy(world, entity)
		end
	end

	local function finish_unmount(entity: ecs.Entity)
		local finish = unmount(entity)
		if finish then
			finish()
		end
	end

	local function mount(
		entity: ecs.Entity,
		module: ModuleScript,
		result: unknown,
		story_type: c.StoryType,
		holder: Frame
	)
		local mounter = MOUNTERS[story_type]
		if not mounter then
			warn(`[UI Labs] {module:GetFullName()}: {story_type} stories are not supported yet`)
			return
		end

		local story = if type(result) == "table" then result :: any else nil

		local root = create_root(holder)
		local cleanup = mounter {
			world = world,
			entity = entity,
			module = module,
			result = result,
			target = root,
		}
		-- stored even without a cleanup so the root and the controls go away on unmount
		mounted[entity] = {
			cleanup = cleanup,
			story_cleanup = if story and type(story.cleanup) == "function" then story.cleanup else nil,
			root = root,
		}
	end

	-- stylua: ignore start
	-- fires when a preview becomes mountable and every time its result / type / holder is replaced
	local q_mount = world
		.query(
			c.module_script,
			c.module_result,
			c.story_type,
			c.preview_holder
		)
		:with(c.story_preview)
		:changed()
	-- stylua: ignore end

	vide.cleanup(q_mount.cleanup)

	vide.cleanup(world.removed(c.preview_holder, function(entity)
		return unmount(entity)
	end))
	vide.cleanup(world.removed(c.story_type, function(entity)
		return unmount(entity)
	end))
	vide.cleanup(function()
		local entities: { ecs.Entity } = {}
		for entity in mounted do
			table.insert(entities, entity)
		end
		for _, entity in entities do
			finish_unmount(entity)
		end
	end)

	return function()
		for entity, module, result, story_type, holder in q_mount.iter() do
			finish_unmount(entity)
			if not world.exists(entity) then
				continue
			end

			mount(entity, module, result, story_type :: c.StoryType, holder)
		end
	end
end

return mounters
