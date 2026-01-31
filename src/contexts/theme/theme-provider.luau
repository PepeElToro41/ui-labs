local vide = require "@pkg/vide"
local theme_list = require "@themes/theme-list"
local THEME_CONTEXT = require "./theme-context"

local function theme_provider(props: ProviderChildren)
	local theme = vide.source(theme_list.default)
	return THEME_CONTEXT(theme, props.children)
end

return theme_provider
