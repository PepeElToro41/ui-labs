local themes = require "@constants/themes"
local vide = require "@pkg/vide"

local THEME_CONTEXT = vide.context() :: vide.Context<themes.Theme>

return THEME_CONTEXT
