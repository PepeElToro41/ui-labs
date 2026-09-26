local USER_INPUT_CONTEXT = require "./user-input-context"

local function use_user_input(): USER_INPUT_CONTEXT.UserInput
	return USER_INPUT_CONTEXT()
end

return use_user_input
