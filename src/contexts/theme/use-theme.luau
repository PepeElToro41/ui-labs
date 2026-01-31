local themes = require "@themes"
local THEME_CONTEXT = require "./theme-context"

export type ThemeHandle = (<T>(entry: T) -> T) & (() -> themes.Theme)

local function use_theme(key: string?)
	local theme = THEME_CONTEXT()

	local deriver = function(entry: string?): any
		if entry then
			return function()
				return theme()[entry]
			end
		end
		return theme()
	end

	return deriver :: ThemeHandle
end

return use_theme
