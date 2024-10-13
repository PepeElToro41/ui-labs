local Vide = require "@pkg/vide"
local useTheme = require("@contexts/theme").useTheme
local IMAGES = require "@constants/images"

local Image = require "@styles/image"
local Frame = require "@styles/frame"
local Corner = require "@styles/corner"
local Detector = require "@styles/detector"
local Div = require "@styles/div"

local boolean = require("@utils/vide/derivers").boolean

local source = Vide.source
local spring = Vide.spring
local show = Vide.show
local read = Vide.read

type ToolbarButtonProps = {
	Image: string,
	Active: Derivable<boolean>?,
	Expand: boolean?,
}

function ToolbarButton(props: ToolbarButtonProps)
	local theme = useTheme()
	local hovered = source(false)
	local transparency = spring(boolean(hovered, 0, 1), 0.25, 1)

	return Frame {
		Size = UDim2.new(0, 30, 0, 30),
		BackgroundTransparency = transparency,
		BackgroundColor3 = theme "Background4",

		Corner(),
		Image {
			Image = props.Image,
			Size = UDim2.fromOffset(18, 18),
			ImageColor3 = function()
				if props.Active then
					local active = read(props.Active)
					return active and theme().Emphasis or theme().Text1
				else
					return theme().Text1
				end
			end,
			Position = UDim2.fromScale(0.5, 0.5),
			AnchorPoint = Vector2.new(0.5, 0.5),
		},
		show(function()
			return not not props.Expand
		end, function()
			return Div {
				Size = UDim2.fromScale(1, 1),

				Image {
					Image = IMAGES.Corner,
					Position = UDim2.new(1, 0, 1, 0),
					ImageTransparency = 0.5,
					Size = UDim2.fromOffset(7, 7),
					AnchorPoint = Vector2.new(1, 1),
				},
			}
		end),
		Detector { Hovered = hovered },
	}
end

return ToolbarButton
