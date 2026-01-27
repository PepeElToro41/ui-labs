local Vide = require "@pkg/vide"
local useTheme = require("@contexts/theme").useTheme
local IMAGES = require "@constants/images"
local PRESETS = require "@constants/ui-presets"
local InputGlow = require "@ui/elements/input-glow"
local InteractionHover = require "@ui/elements/interaction-hover"
local actions = require "@actions"

local create = Vide.create
local source = Vide.source
local action = Vide.action

local Div = require "@base/div"
local Frame = require "@base/frame"
local Image = require "@base/image"
local RightList = require "@base/list/right"
local Corner = require "@base/corner"
local Padding = require "@base/padding"
local Text = require "@base/text"
local TextInput = require "@base/text-input"
local Detector = require "@base/detector"

type NumberEntryProps = {
	Value: Reactive<number>,
	Apply: (val: number) -> any,
	Dragger: boolean?,
	Min: number?,
	Max: number?,
	Step: number?,
	Prefix: string?,
}

function DraggerHandles(props: {})
	local theme = useTheme()
	local hovered = source(false)
	local clicked = source(false)

	return Detector {
		Size = UDim2.new(0, 20, 0, 20),
		actions.Hovered(hovered),
		actions.Clicked(clicked),

		Div {
			Size = UDim2.fromOffset(0, 0),
			PRESETS.Centered,
			ZIndex = -1,

			InteractionHover {
				Hovered = hovered,
				Clicked = clicked,
				ClickedAnimPeriod = 0.2,
				Extends = 20,
				ExtendsClicked = 20,
				IgnoreUnactive = true,
				Corner = UDim.new(0.5, 0),
			},
		},

		Image {
			AnchorPoint = Vector2.new(0, 0.5),
			Image = IMAGES.RightArrow,
			ImageColor3 = function()
				if clicked() then
					return theme().Text1
				else
					return theme().Text2
				end
			end,
			Position = UDim2.new(0.5, -3, 0.5, 0),
			Size = UDim2.fromOffset(14, 14),
		},

		Image {
			AnchorPoint = Vector2.new(1, 0.5),
			Image = IMAGES.RightArrow,
			ImageColor3 = function()
				if clicked() then
					return theme().Text1
				else
					return theme().Text2
				end
			end,
			Position = UDim2.new(0.5, 3, 0.5, 0),
			Rotation = 180,
			Size = UDim2.fromOffset(14, 14),
		},
	}
end

local MIN_SIZE = 75

function NumberEntry(props: NumberEntryProps)
	local theme = useTheme()
	local input = source(nil :: TextBox?)
	local focused = source(false)
	local focusAlpha = InputGlow.useFocusAlpha(focused)

	return Detector {
		AutomaticSize = Enum.AutomaticSize.X,
		Size = UDim2.fromOffset(0, 28),
		MouseButton1Click = function()
			local input = input()
			if input then
				input:CaptureFocus()
				input.SelectionStart = 1
				input.CursorPosition = #input.Text + 1
			end
		end,

		Frame {
			Size = UDim2.fromScale(0, 1),
			AutomaticSize = Enum.AutomaticSize.X,
			Position = UDim2.fromScale(0, 0.5),
			AnchorPoint = Vector2.new(0, 0.5),
			BackgroundTransparency = 1,

			create "UIStroke" {
				Thickness = 1,
				Color = function()
					return theme().Border:Lerp(theme().Emphasis, focusAlpha())
				end,
				Transparency = 0.5,
			},
			create "UISizeConstraint" { MinSize = Vector2.new(MIN_SIZE, 0) },
			Padding { Left = 4, Right = props.Dragger and 6 or 8 },
			RightList { Gap = 4, VerticalAlignment = Enum.VerticalAlignment.Center },
			Corner { Radius = 6 },

			TextInput {
				Text = "1550",
				TextSize = 13,
				Size = UDim2.fromOffset(0, 28),
				AutomaticSize = Enum.AutomaticSize.X,
				GetFocused = focused,

				Padding { Left = 4, Right = props.Prefix and -2 or 0 },
				create "UISizeConstraint" { MinSize = Vector2.new(1, 0) } :: any,
				action(input) :: any,
			},
			props.Prefix and Text {
				Text = props.Prefix,
				AutomaticSize = Enum.AutomaticSize.X,
				TextColor3 = theme "Text3",
				TextSize = 13,
				FontFace = Font.fromName("Jura", Enum.FontWeight.Medium),
			},
			props.Dragger and DraggerHandles {} or nil,
		},
	}
end

return NumberEntry
