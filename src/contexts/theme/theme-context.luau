local themes = require "@constants/themes"
local vide = require "@pkg/vide"
local theme_list = require "@themes/theme-list"
local videx = require "@utils/vide/videx"

local THEME_CONTEXT: vide.Context<Reactive<themes.Theme>> = vide.context(videx.constant(theme_list.default))

return THEME_CONTEXT
