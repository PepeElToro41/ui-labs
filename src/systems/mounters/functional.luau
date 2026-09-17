local logging = require "@constants/logging"
local run_protected = require "./run-protected"
local types = require "./types"

local LOG_MESSAGES = logging.LOG_MESSAGES
local STORY_NAME = logging.STORY_NAMES.functional

export type FunctionalStory = (target: Frame) -> (() -> ())?

--- Functional story: the module returns `(target) -> cleanup?`
local functional: types.Mounter<FunctionalStory> = function(props)
	local prefix = `[UI Labs] {props.module:GetFullName()}:`
	local status, value = run_protected(props.result, props.target)

	if status == "error" then
		warn(`{prefix} {string.format(LOG_MESSAGES.FUNCTION_ERROR, STORY_NAME)}\n{value}`)
		return nil
	end
	if status == "yield" then
		warn(`{prefix} {string.format(LOG_MESSAGES.FUNCTION_YIELD, STORY_NAME)} Its cleanup will not be tracked.`)
		return nil
	end

	if value == nil then
		return nil
	end
	if type(value) ~= "function" then
		warn(`{prefix} {STORY_NAME} returned a {typeof(value)}, expected a cleanup function or nothing.`)
		return nil
	end
	return value :: () -> ()
end

return functional
