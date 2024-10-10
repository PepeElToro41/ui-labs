local Vide = require "@pkg/vide"
local PRESETS = require "@constants/ui-presets"
local useTheme = require("@contexts/theme").useTheme
local boolean = require("@utils/vide/derivers").boolean

local source = Vide.source

local Div = require "@styles/div"
local Frame = require "@styles/frame"
local Rounder = require "@styles/rounder"
local Image = require "@styles/image"
local Detector = require "@styles/detector"

type PanelButtonProps = {
	ButtonIcon: Derivable<string>,
	ButtonSize: number?,

	OnClick: () -> (),
}

function PanelButton(props: PanelButtonProps)
	local theme = useTheme()
	local hovered = source(false)

	return Frame {
		BackgroundTransparency = boolean(hovered, 0, 1),
		BackgroundColor3 = theme "Background4",
		Size = UDim2.fromOffset(26, 26),

		Rounder(),
		Image {
			Image = props.ButtonIcon,
			ImageColor3 = function()
				return (hovered() and theme().Emphasis) or theme().Text1
			end,
			Size = UDim2.fromOffset(props.ButtonSize or 18, props.ButtonSize or 18),
			PRESETS.Centered,
		},
		Detector { Hovered = hovered, MouseButton1Click = props.OnClick },
	}
end

return PanelButton
