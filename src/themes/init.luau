local Dark = require "./dark"

export type Theme = typeof(Dark) & { ThemeName: string }

local Themes: Map<string, Theme> = {
	Default = Dark :: Theme,
	Dark = Dark :: Theme,
}

for name, theme in Themes do
	-- adding theme name
	theme.ThemeName = name
end

return Themes
