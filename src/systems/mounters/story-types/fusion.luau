local logging = require "@constants/logging"
local controls = require "@src/systems/controls"
local create_controls = require "../create-controls"
local run_protected = require "../run-protected"
local types = require "../types"

local LOG_MESSAGES = logging.LOG_MESSAGES
local STORY_NAME = logging.STORY_NAMES.fusion

export type FusionStory = {
	fusion: any,
	scoped: { any }?,
	story: (props: { controls: any, scope: any, target: Frame }) -> any,
	controls: Map<string, unknown>?,
	cleanup: (() -> ())?,
}

--[[
	Fusion story: `story(props)` gets the controls as Fusion `Value` objects in `props.controls`,
	control entities push their `control_value` into them. Fusion 0.2 and 0.3 are both handled,
	told apart by `fusion.version.minor`:

	- 0.2 has no scopes: `props.scope` is the library itself and the values come from
	  `fusion.Value`. A `scoped` key is ignored with a warning.
	- 0.3 gets a scope built with `fusion.scoped(fusion, ...scoped)`; the values live in it and
	  `doCleanup(scope)` runs on unmount.

	The story may return a cleanup function, or children (an instance or a table of them) that
	are hydrated into the target frame. On 0.3 that hydration goes through its own scope that
	is cleared instead of cleaned, since the target would otherwise be destroyed with the story.
]]

local function is_fusion_2(lib: any): boolean
	local version = lib.version
	return type(version) == "table" and version.minor == 2
end

local fusion_mounter: types.Mounter<FusionStory> = function(props)
	local prefix = `[UI Labs] {props.module:GetFullName()}:`
	local result = props.result
	local lib = result.fusion
	local world = props.world

	local legacy = is_fusion_2(lib)
	if not legacy and type(lib.scoped) ~= "function" then
		warn(`{prefix} unsupported Fusion version, expected 0.2 or a version with "scoped"`)
		return nil
	end
	if legacy and result.scoped ~= nil then
		warn(`{prefix} "scoped" key provided for Fusion 0.2, it will be ignored`)
	end

	-- 0.2 has no scopes, the story gets the library where 0.3 gets a scope
	local scope: any = if legacy then lib else lib.scoped(lib, table.unpack(result.scoped or {}))

	create_controls(world, props.entity, result.controls, prefix)

	local values, by_entity = controls.map_states(world, props.entity, function(_, _, value)
		return if legacy then lib.Value(value) else scope:Value(value)
	end)

	local stop_observing = controls.observe(world, by_entity, function(_, state, value)
		state:set(value)
	end)

	-- TODO: intrinsic `inputListener` prop once the input context exists
	local story_props = {
		controls = values,
		scope = scope,
		target = props.target,
	}

	local status, value = run_protected(result.story, story_props)
	local story_cleanup: (() -> ())? = nil

	if status == "error" then
		warn(`{prefix} {string.format(LOG_MESSAGES.FUNCTION_ERROR, STORY_NAME)}\n{value}`)
	elseif status == "yield" then
		warn(`{prefix} {string.format(LOG_MESSAGES.FUNCTION_YIELD, STORY_NAME)}`)
	elseif type(value) == "function" then
		story_cleanup = value
	elseif value ~= nil then
		-- the story handed back its children instead of parenting them itself
		local hydrated, err = pcall(function()
			if legacy then
				lib.Hydrate(props.target) { [lib.Children] = value }
			else
				-- 0.3 `Hydrate` adds the target to the scope it runs in, and `doCleanup` would
				-- then destroy the frame ui labs owns: hydrate through a throwaway scope and drop it
				local hydrate_scope = lib.scoped(lib)
				hydrate_scope:Hydrate(props.target) { [lib.Children] = value }
				table.clear(hydrate_scope)
			end
		end)
		if not hydrated then
			warn(`{prefix} {STORY_NAME} returned children that could not be hydrated into the target\n{err}`)
		end
	end

	return function()
		-- stop first so a late value write can't reach a destroyed value
		stop_observing()

		if story_cleanup then
			local cleanup_status, err = run_protected(story_cleanup)
			if cleanup_status == "error" then
				warn(`{prefix} {LOG_MESSAGES.CLEANUP_ERROR}\n{err}`)
			elseif cleanup_status == "yield" then
				warn(`{prefix} {string.format(LOG_MESSAGES.FUNCTION_YIELD, "The story cleanup")}`)
			end
		end

		if not legacy then
			local success, err = pcall(lib.doCleanup, scope)
			if not success then
				warn(`{prefix} {string.format(LOG_MESSAGES.UNMOUNT_ERROR, STORY_NAME)}\n{err}`)
			end
		end
	end
end

return fusion_mounter
