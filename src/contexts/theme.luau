local Vide = require "@pkg/vide"
local constant = require("@utils/vide").constant

type Source<T> = Vide.Source<T>

local Themes = require "@themes"

local ThemeContext = Vide.context(constant(Themes.Default))

function ThemeProvider(props: ProviderChildren)
	local theme = Vide.source(Themes.Default)

	return ThemeContext(theme, props.children)
end

type ThemeHandle = ((entry: string) -> Color3) & (() -> Themes.Theme)

function useTheme(): ThemeHandle
	local theme = ThemeContext()

	local themeHandle: ThemeHandle = function(entry: string?)
		if entry then
			return function()
				return theme()[entry]
			end
		end

		return theme() :: any
	end :: any

	return themeHandle
end

function useThemeContext()
	return ThemeContext()
end

return table.freeze {
	ThemeProvider = ThemeProvider,
	useTheme = useTheme,
	useThemeContext = useThemeContext,
}
