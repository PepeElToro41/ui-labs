local logging = require "@constants/logging"
local controls = require "@src/systems/controls"
local create_controls = require "../create-controls"
local run_protected = require "../run-protected"
local types = require "../types"

local LOG_MESSAGES = logging.LOG_MESSAGES
local STORY_NAME = logging.STORY_NAMES.roact

export type RoactStory = {
	roact: any,
	story: (props: { controls: any, target: Frame }) -> any,
	controls: Map<string, unknown>?,
	cleanup: (() -> ())?,
}

--[[
	Roact story: `story(props)` returns the element tree, mounted into the target frame with
	`roact.mount`. The plain control values go in `props.controls`; every control change calls
	the story again and hands the new tree to `roact.update`.
]]

local roact_mounter: types.Mounter<RoactStory> = function(props)
	local prefix = `[UI Labs] {props.module:GetFullName()}:`
	local result = props.result
	local roact = result.roact
	local world = props.world

	create_controls(world, props.entity, result.controls, prefix)

	-- no per-control state, the lookup is only there to filter `observe` to this preview
	local _, by_entity = controls.map_states(world, props.entity, function()
		return true
	end)

	--- Runs the story for the current control values, nil when it failed
	local function build(): any?
		-- TODO: intrinsic `inputListener` prop once the input context exists
		local status, element = run_protected(result.story, {
			controls = controls.values(world, props.entity),
			target = props.target,
		})
		if status == "error" then
			warn(`{prefix} {string.format(LOG_MESSAGES.FUNCTION_ERROR, STORY_NAME)}\n{element}`)
			return nil
		elseif status == "yield" then
			warn(`{prefix} {string.format(LOG_MESSAGES.FUNCTION_YIELD, STORY_NAME)}`)
			return nil
		end
		return element
	end

	local handle: any = nil

	local element = build()
	if element ~= nil then
		local success, mounted = pcall(roact.mount, element, props.target)
		if success then
			handle = mounted
		else
			warn(`{prefix} {STORY_NAME} errored when mounting\n{mounted}`)
		end
	end

	local stop_observing = controls.observe(world, by_entity, function()
		if handle == nil then
			return
		end
		local next_element = build()
		if next_element == nil then
			return
		end
		local success, updated = pcall(roact.update, handle, next_element)
		if success then
			handle = updated
		else
			warn(`{prefix} {STORY_NAME} errored when updating\n{updated}`)
		end
	end)

	return function()
		stop_observing()

		if handle == nil then
			return
		end
		local success, err = pcall(roact.unmount, handle)
		if not success then
			warn(`{prefix} {string.format(LOG_MESSAGES.UNMOUNT_ERROR, STORY_NAME)}\n{err}`)
		end
	end
end

return roact_mounter
