local logging = require "@constants/logging"
local controls = require "@src/systems/controls"
local run_protected = require "./run-protected"
local types = require "./types"

local LOG_MESSAGES = logging.LOG_MESSAGES
local STORY_NAME = logging.STORY_NAMES.vide

export type VideStory = {
	vide: any,
	story: (props: { controls: any, target: Frame }) -> any,
	controls: Map<string, unknown>?,
	cleanup: (() -> ())?,
}

--[[
	Vide story: `story(props)` runs inside `vide.mount` of the story's own vide instance, with
	`props.controls` mirroring the controls table as sources. Control entities push their
	`control_value` into those sources, the story is never re-run.
]]
local vide_mounter: types.Mounter<VideStory> = function(props)
	local prefix = `[UI Labs] {props.module:GetFullName()}:`
	local lib = props.result.vide
	local world = props.world

	-- the sources live in their own root so they can outlive a story that errored
	local destroy_sources, sources, by_entity = lib.root(function()
		return controls.map_states(world, props.entity, function(_, _, value)
			return lib.source(value)
		end)
	end)

	local stop_observing = controls.observe(world, by_entity, function(_, source, value)
		source(value)
	end)

	-- TODO: intrinsic `inputListener` prop once the input context exists
	local story_props = {
		controls = sources,
		target = props.target,
	}

	local unmount = lib.mount(function()
		local status, value = run_protected(props.result.story, story_props)
		if status == "error" then
			warn(`{prefix} {string.format(LOG_MESSAGES.FUNCTION_ERROR, STORY_NAME)}\n{value}`)
			return nil
		elseif status == "yield" then
			warn(`{prefix} {string.format(LOG_MESSAGES.FUNCTION_YIELD, STORY_NAME)}`)
			return nil
		end
		return value
	end, props.target)

	return function()
		-- stop first so a late value write can't reach a destroyed source
		stop_observing()

		local success, err = pcall(unmount)
		if not success then
			warn(`{prefix} {string.format(LOG_MESSAGES.UNMOUNT_ERROR, STORY_NAME)}\n{err}`)
		end
		destroy_sources()
	end
end

return vide_mounter
