local default = require "@self/default"
local types = require "@self/types"

export type Theme = types.Theme

-- temporal till type functions work
local function GET_THEME_ENUM(base: Theme): Theme
	local theme_enum = {} :: { [any]: any }
	for key in base do
		theme_enum[key] = key
	end
	return theme_enum
end

local THEME_ENUM = GET_THEME_ENUM(default)
return THEME_ENUM
