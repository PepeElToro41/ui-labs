local Vide = require "@pkg/vide"
local UILabs = require "@pkg/ui-labs"

local Derivers = require "@utils/vide/derivers"
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
local Corner = require "@styles/corner"
local Image = require "@styles/image"
local ToolbarRender = require "@ui/main-panel/toolbar/toolbar-render"

type Source<T> = Vide.Source<T>

local boolean = Derivers.boolean
local create = Vide.create
local source = Vide.source
local spring = Vide.spring

local TOOLBAR_SIZE = 34
local START_SIZE = 28

function ToolbarHiddenCollapse()
	local theme = useTheme()
	local hovered = source(false)
	local toolbarArea = source(0)
	local targetAlpha = spring(boolean(hovered, 1, 0), 0.25, 1)

	local targetSize = function()
		local alpha = targetAlpha()
		local area = toolbarArea()
		local endOffset = UDim2.fromOffset(TOOLBAR_SIZE, area)

		return UDim2.fromOffset(START_SIZE, START_SIZE):Lerp(endOffset, alpha)
	end

	return Div {
		Position = UDim2.fromOffset(6, 4),
		Hovered(hovered),
		Size = targetSize,

		Frame {
			Name = "ToolbarHolder",
			BackgroundColor3 = theme "Background3",
			ClipsDescendants = true,

			Corner { Radius = 10 },
			create "UIStroke" {
				Thickness = 1,
				Enabled = false,
				Color = function()
					local emphasis = theme().Emphasis
					local border = theme().Border
					return border:Lerp(emphasis, targetAlpha())
				end,
				Transparency = 0.5,
			},
			ToolbarRender {
				SizeOutput = toolbarArea,
			},
		},
		Frame {
			Name = "ToolbarCover",
			BackgroundColor3 = theme "Background3",
			BackgroundTransparency = targetAlpha,
			Rounder(),
		},
		Div {
			Size = UDim2.fromOffset(START_SIZE, START_SIZE),

			Image {
				Size = UDim2.fromOffset(18, 18),
				Image = IMAGES.ToolbarLayout,
				ImageTransparency = targetAlpha,
				Position = UDim2.new(0.5, 0, 0.5, 0),
				AnchorPoint = Vector2.new(0.5, 0.5),
			},
		},
		Shadow {
			Blur = 0.8,
			Position = Vector2.zero,
			ZIndex = -1,
			Transparency = 0.3,
			Extends = function()
				return Vector2.new(14, 14):Lerp(Vector2.new(16, 16), targetAlpha())
			end,
		},
	}
end

return ToolbarHiddenCollapse
