local Vide = require "@pkg/vide"

local useTheme = require("@contexts/theme").useTheme
local UI_PRESETS = require "@constants/ui-presets"
local IMAGES = require "@constants/images"
local Hovered = require("@actions").Hovered
local Lerp = require("@utils/number").Lerp
local Shadow = require "@ui/elements/shadow"
local Glow = require "@ui/elements/glow"

local Div = require "@styles/div"
local Frame = require "@styles/frame"
local Padding = require "@styles/padding"
local Rounder = require "@styles/rounder"
local Image = require "@styles/image"
local ToolbarRender = require "@ui/main-panel/toolbar/toolbar-render"

type Source<T> = Vide.Source<T>

local boolean = require("@utils/vide/derivers").boolean
local create = Vide.create
local action = Vide.action
local source = Vide.source
local spring = Vide.spring

local TOOLBAR_SIZE = 34

function ToolbarHiddenSide()
	local theme = useTheme()
	local hovered = source(false)
end

return ToolbarHiddenSide
