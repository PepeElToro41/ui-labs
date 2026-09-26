local USER_INPUT_CONTEXT = require "./user-input-context"

export type ModifierKeys = {
	ctrl: Reactive<boolean>,
	shift: Reactive<boolean>,
	alt: Reactive<boolean>,
}

--- Whether each modifier key is being held, anywhere in the app
local function use_modifier_keys(): ModifierKeys
	local modifiers = USER_INPUT_CONTEXT().modifiers

	-- read only, the provider owns the sources
	return {
		ctrl = function()
			return modifiers.ctrl()
		end,
		shift = function()
			return modifiers.shift()
		end,
		alt = function()
			return modifiers.alt()
		end,
	}
end

return use_modifier_keys
