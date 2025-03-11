local Vide = require "@pkg/vide"
local useTheme = require("@contexts/theme").useTheme
local IMAGES = require "@constants/images"
local InputGlow = require "@ui/elements/input-glow"

local create = Vide.create
local source = Vide.source
local action = Vide.action

local Frame = require "@styles/frame"
local Div = require "@styles/div"
local Image = require "@styles/image"
local RightList = require "@styles/list/right"
local Corner = require "@styles/corner"
local Padding = require "@styles/padding"
local Text = require "@styles/text"
local TextInput = require "@styles/text-input"
local Detector = require "@styles/detector"

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
	return Detector {
		Size = UDim2.new(0, 18, 1, 0),

		Image {
			AnchorPoint = Vector2.new(0, 0.5),
			Image = IMAGES.RightArrow,
			Position = UDim2.new(0.5, -3, 0.5, 0),
			Size = UDim2.fromOffset(14, 14),
		},

		Image {
			AnchorPoint = Vector2.new(1, 0.5),
			Image = IMAGES.RightArrow,
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
			RightList { Gap = 4 },
			Corner { Radius = 6 },

			TextInput {
				Text = "1550",
				TextSize = 13,
				Size = UDim2.fromOffset(0, 28),
				AutomaticSize = Enum.AutomaticSize.X,
				GetFocused = focused,

				Padding { Left = 4, Right = -2 },
				create "UISizeConstraint" { MinSize = Vector2.new(1, 0) } :: any,
				action(input) :: any,
			},
			props.Prefix and Text {
				Text = props.Prefix,
				AutomaticSize = Enum.AutomaticSize.X,
				TextColor3 = theme "Text3",
				TextSize = 13,
				FontFace = Font.fromName("Jura", Enum.FontWeight.Medium),
			} or nil,
			props.Dragger and DraggerHandles {} or nil,
		},
	}
end

return NumberEntry
