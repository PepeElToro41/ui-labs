local UILabs = require "@pkg/ui-labs"
local Vide = require "@pkg/vide"

local create = Vide.create
local source = Vide.source

local Common = require "../common"
local PRESETS = require "@constants/ui-presets"
local useTheme = require("@contexts/theme").useTheme

local Div = require "@styles/div"
local Frame = require "@styles/frame"
local LeftList = require "@styles/list/left"
local Text = require "@styles/text"
local Rounder = require "@styles/rounder"
local Padding = require "@styles/padding"

local NumberInput = require "../common/number-input"

-- TODO: Export this in the utility package
type SliderControl = {
	Min: number,
	Max: number,
	Step: number?,
}

function Slider(props: Common.ControlProps<SliderControl, number>)
	local theme = useTheme()

	return Div {
		LeftList { Gap = 10, VerticalAlignment = Enum.VerticalAlignment.Center },
		Div {
			Size = UDim2.fromScale(0, 1),
			AutomaticSize = Enum.AutomaticSize.X,

			LeftList { VerticalAlignment = Enum.VerticalAlignment.Center },
			Padding { Right = 10 },
			NumberInput {
				Value = props.Value,
				Apply = props.Apply,
				Dragger = true,
			},
		},
		Text {
			Name = "SliderMin",
			Text = tostring(props.Control.Min),
			FontFace = Font.fromName("Jura", Enum.FontWeight.Regular),
			TextSize = 15,
			Size = UDim2.fromScale(0, 1),
			AutomaticSize = Enum.AutomaticSize.X,
		},
		-- SLIDER
		Div {
			Name = "SliderHolder",

			create "UIFlexItem" { FlexMode = Enum.UIFlexMode.Fill },
			Frame {
				Name = "Slider",
				Size = UDim2.new(1, 0, 0, 4),
				BackgroundColor3 = theme "Background4",
				PRESETS.LeftCenter,

				Rounder(),
				Frame {
					Name = "SliderProgress",
					Size = UDim2.new(0.5, 0, 1, 0),
					BackgroundColor3 = theme "Emphasis",

					Rounder(),
					Div {
						Name = "SliderHandle",
						Size = UDim2.fromOffset(14, 14),
						AnchorPoint = Vector2.new(0.5, 0.5),
						Position = UDim2.fromScale(1, 0.5),

						Frame {
							Name = "HandleRender",
							BackgroundColor3 = theme "Emphasis",
							Size = UDim2.fromScale(1, 1),
							Rounder(),
						},
						Frame {
							Name = "HandleHover",
							Size = UDim2.fromOffset(26, 26),
							BackgroundColor3 = Color3.fromRGB(180, 180, 180),
							BackgroundTransparency = 0.9,
							PRESETS.Centered,
							Rounder(),
						},
					},
				},
			},
		},
		--------------------------------------------------------------------------------
		Text {
			Name = "SliderMax",
			Text = tostring(props.Control.Max),
			FontFace = Font.fromName("Jura", Enum.FontWeight.Regular),
			TextSize = 15,
			Size = UDim2.fromScale(0, 1),
			AutomaticSize = Enum.AutomaticSize.X,
		},
	}
end

return Slider
