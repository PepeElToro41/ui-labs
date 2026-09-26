local logging = require "@constants/logging"
local controls = require "@src/systems/controls"
local create_controls = require "../create-controls"
local run_protected = require "../run-protected"
local types = require "../types"

local LOG_MESSAGES = logging.LOG_MESSAGES
local STORY_NAME = logging.STORY_NAMES.react

export type ReactStory = {
	react: any,
	reactRoblox: any,
	renderer: ("deferred" | "legacy")?,
	story: (props: { controls: any, target: Frame }) -> any,
	controls: Map<string, unknown>?,
	cleanup: (() -> ())?,
}

--[[
	React story: `story` is used as a component, rendered into a ReactRoblox root on the target
	frame with the plain control values in `props.controls`. Every control change re-renders the
	root with the new values, React reconciles the rest.

	`renderer` picks `createRoot` (deferred, the default) or `createLegacyRoot`.
]]

local function create_root(react_roblox: any, renderer: string?, target: Frame, prefix: string): any
	if renderer == "legacy" then
		if type(react_roblox.createLegacyRoot) == "function" then
			return react_roblox.createLegacyRoot(target)
		end
		warn(`{prefix} the legacy renderer requires "createLegacyRoot" in ReactRoblox, using createRoot instead`)
	end
	return react_roblox.createRoot(target)
end

local react_mounter: types.Mounter<ReactStory> = function(props)
	local prefix = `[UI Labs] {props.module:GetFullName()}:`
	local result = props.result
	local react = result.react
	local world = props.world

	local created, root = pcall(create_root, result.reactRoblox, result.renderer, props.target, prefix)
	if not created then
		warn(`{prefix} {STORY_NAME} could not create its ReactRoblox root\n{root}`)
		return nil
	end

	create_controls(world, props.entity, result.controls, prefix)

	-- no per-control state, the lookup is only there to filter `observe` to this preview
	local _, by_entity = controls.map_states(world, props.entity, function()
		return true
	end)

	local function render()
		-- TODO: intrinsic `inputListener` prop once the input context exists
		local element = react.createElement(result.story, {
			controls = controls.values(world, props.entity),
			target = props.target,
		})
		local status, err = run_protected(function()
			return root:render(element)
		end)
		if status == "error" then
			warn(`{prefix} {string.format(LOG_MESSAGES.FUNCTION_ERROR, STORY_NAME)}\n{err}`)
		end
	end

	local stop_observing = controls.observe(world, by_entity, function()
		render()
	end)

	render()

	return function()
		stop_observing()

		local success, err = pcall(function()
			root:unmount()
		end)
		if not success then
			warn(`{prefix} {string.format(LOG_MESSAGES.UNMOUNT_ERROR, STORY_NAME)}\n{err}`)
		end
	end
end

return react_mounter
