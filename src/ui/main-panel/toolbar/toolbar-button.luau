local Vide = require "@pkg/vide"

local useTheme = require("@contexts/theme").useTheme
local Image = require "@styles/image"
local Frame = require "@styles/frame"
local Rounder = require "@styles/rounder"
local Detector = require "@styles/detector"

local boolean = require("@utils/vide/derivers").boolean
local source = Vide.source
local spring = Vide.spring

type ToolbarButtonProps = {
	Image: string,
}

function ToolbarButton(props: ToolbarButtonProps)
	local theme = useTheme()
	local hovered = source(false)
	local transparency = spring(boolean(hovered, 0, 1), 0.25, 1)

	return Frame {
		Size = UDim2.new(0, 30, 0, 30),
		BackgroundTransparency = transparency,
		BackgroundColor3 = theme "Background3",

		Rounder(),
		Image {
			Image = props.Image,
			Size = UDim2.fromOffset(20, 20),
			Position = UDim2.fromScale(0.5, 0.5),
			AnchorPoint = Vector2.new(0.5, 0.5),
			ImageColor3 = theme "Text",
		},
		Detector { Hovered = hovered },
	}
end

return ToolbarButton
