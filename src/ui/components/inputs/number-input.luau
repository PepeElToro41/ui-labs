local images = require "@constants/images"
local use_theme = require "@contexts/theme/use-theme"
local vide = require "@pkg/vide"

local div = require "@ui/styles/div"
local frame = require "@ui/styles/frame"
local image = require "@ui/styles/image"
local right_list = require "@ui/styles/list/right-list"
local corner = require "@ui/styles/corner"
local padding = require "@ui/styles/padding"
local text = require "@ui/styles/text"
local text_input = require "@ui/styles/text-input"
local click_detector = require "@ui/styles/click-detector"
local actions = require "@utils/vide/actions"
local videx = require "@utils/vide/videx"

function drag_handle(props: {})
	local theme = use_theme()
	local hovered = vide.source(false)
	local clicked = vide.source(false)

	return click_detector {
		Size = UDim2.new(0, 20, 0, 20),

		actions.hovered(hovered),
		actions.clicked(clicked),

		div {
			Size = UDim2.fromOffset(0, 0),
			ZIndex = -1,
		},
		image {
			AnchorPoint = Vector2.new(0, 0.5),
			Image = images.RightArrow,
			ImageColor3 = function()
				if clicked() then
					return theme().text1
				else
					return theme().text2
				end
			end,
			Position = UDim2.new(0.5, -3, 0.5, 0),
			Size = UDim2.fromOffset(14, 14),
		},
		image {
			AnchorPoint = Vector2.new(1, 0.5),
			Image = images.RightArrow,
			ImageColor3 = function()
				if clicked() then
					return theme().text1
				else
					return theme().text2
				end
			end,
			Position = UDim2.new(0.5, 3, 0.5, 0),
			Rotation = 180,
			Size = UDim2.fromOffset(14, 14),
		},
	}
end

type NumberEntryProps = {
	value: Reactive<number>,
	apply: (val: number) -> any,
	drag_handle: boolean?,
	min: number?,
	max: number?,
	step: number?,
	prefix: string?,
	native: vide.vTextButton,
}

local MIN_SIZE = 75

function number_entry(props: NumberEntryProps)
	local theme = use_theme()
	local out_input = vide.source(nil :: TextBox?)
	local focused = vide.source(false)

	return click_detector {
		AutomaticSize = Enum.AutomaticSize.X,
		Size = UDim2.fromOffset(0, 28),
		MouseButton1Click = function()
			local out_input = out_input()
			if out_input then
				out_input:CaptureFocus()
				out_input.SelectionStart = 1
				out_input.CursorPosition = #out_input.Text + 1
			end
		end,
		props.native,

		div {
			Size = UDim2.fromScale(0, 1),
			AutomaticSize = Enum.AutomaticSize.X,
			Position = UDim2.fromScale(0, 0.5),
			AnchorPoint = Vector2.new(0, 0.5),
			BackgroundTransparency = 1,

			vide.create "UIStroke" {
				Thickness = 1,
				Transparency = 0.5,
				Color = function()
					return theme().border:Lerp(theme().emphasis, 0)
				end,
			},
			vide.create "UISizeConstraint" {
				MinSize = Vector2.new(MIN_SIZE, 0),
			},
			corner { Radius = 6 },
			padding {
				left = 4,
				right = props.drag_handle and 6 or 8,
			},
			right_list {
				gap = 4,
				VerticalAlignment = Enum.VerticalAlignment.Center,
			},
			text_input {
				Text = "1550",
				TextSize = 13,
				Size = UDim2.fromOffset(0, 28),
				AutomaticSize = Enum.AutomaticSize.X,
				GetFocused = focused,

				vide.action(out_input),
				vide.create "UISizeConstraint" {
					MinSize = Vector2.new(1, 0),
				},
				padding {
					left = 4,
					right = props.prefix and -2 or 0,
				},
			},
			videx.show(props.prefix, function()
				return text {
					Text = props.prefix,
					AutomaticSize = Enum.AutomaticSize.X,
					TextSize = 13,
					FontFace = Font.fromName("Jura", Enum.FontWeight.Medium),
				}
			end),
			videx.show(props.drag_handle, function()
				return drag_handle {}
			end),
		},
	}
end

return number_entry
