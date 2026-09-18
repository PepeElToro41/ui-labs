local AppLifecycleObserverService = game:GetService "AppLifecycleObserverService"

local vide = require "@pkg/vide"
local use_theme = require "@contexts/theme/use-theme"
local themes = require "@themes"
local border = require "@ui/elements/border"
local glow = require "@ui/elements/glow"
local corner = require "@ui/styles/corner"
local frame = require "@ui/styles/frame"
local image = require "@ui/styles/image"
local padding = require "@ui/styles/padding"

local IMAGES = require "@constants/images"
local color_decoding = require "@self/color-decoding"
local decoded_input = require "@ui/elements/decoded-input"
local div = require "@ui/styles/div"
local flex_fill = require "@ui/styles/flex-fill"
local left_list = require "@ui/styles/list/left-list"
local text = require "@ui/styles/text"
local actions = require "@utils/vide/actions"
local derivers = require "@utils/vide/derivers"
local videx = require "@utils/vide/videx"

local GLOW_EXTENDS = Vector2.new(15, 15)

type InputDropdownProps = {
	native: vide.vFrame?,
}

local function input_dropdown(props: InputDropdownProps)
	local hovered = vide.source(false)
	local expanded = vide.source(false)
	local theme = use_theme()

	return frame {
		props.native or {},
		BackgroundColor3 = theme(themes.background2),

		border {},
		padding { paddingx = 4 },
		corner { radius = 6 },
		text {
			Size = UDim2.new(1, -15, 1, 0),
			ClipsDescendants = true,
			weight = Enum.FontWeight.Medium,
			TextSize = 14,
			Text = "HEX",
			TextColor3 = theme(themes.text1),
		},
		image {
			Image = IMAGES.expanded,
			Size = UDim2.fromOffset(14, 14),
			Position = UDim2.fromScale(1, 0.5),
			AnchorPoint = Vector2.new(1, 0.5),
		},
	}
end

type ColorInputType = "hex" | "rgb" | "hsv"

type InputBoxProps = {
	color: Reactive<Color3>,
	apply_color: (Color3) -> (),
	input_type: Reactive<ColorInputType>,
}

local function input_box(props: InputBoxProps)
	local theme = use_theme()

	local focused = vide.source(false)
	local focus_alpha = vide.spring(derivers.boolean(focused, 1, 0), 0.3, 1)

	local textbox_native: vide.vTextBox = {
		FontFace = Font.fromName("GothamSSm", Enum.FontWeight.Medium),
		TextSize = 14,
		padding {
			paddingx = 4,
		},
		actions.focused(focused),
	}

	return div {
		flex_fill(),
		frame {
			Name = "input_box",
			Size = UDim2.fromScale(1, 1),
			BackgroundColor3 = theme(themes.background2),
			ZIndex = 2,

			border {
				transparency = derivers.lerp(focus_alpha, 0.7, 0.5),
				color = function()
					return theme().border:Lerp(theme().emphasis, focus_alpha())
				end,
			},
			padding { paddingx = 4 },
			corner { radius = 6 },
			vide.switch(props.input_type) {
				hex = function()
					local input_props: decoded_input.DecodedInputProps<Color3> = {
						parser = color_decoding.parsers.hex,
						decoder = color_decoding.decoders.hex,
						textbox_native = textbox_native,
						value = props.color,
						apply_value = props.apply_color,
					}

					return decoded_input(input_props)
				end,
				rgb = function()
					local input_props: decoded_input.DecodedInputProps<Color3> = {
						parser = color_decoding.parsers.rgb,
						decoder = color_decoding.decoders.rbg,
						textbox_native = textbox_native,
						value = props.color,
						apply_value = props.apply_color,
					}
					return decoded_input(input_props)
				end,
				hsv = function()
					local input_props: decoded_input.DecodedInputProps<Color3> = {
						parser = color_decoding.parsers.hsv,
						decoder = color_decoding.decoders.hsv,
						textbox_native = textbox_native,
						value = props.color,
						apply_value = props.apply_color,
					}
					return decoded_input(input_props)
				end,
			} :: any,
		},
		glow {
			name = "focus_glow",
			extends = GLOW_EXTENDS,
			blur = 0.8,
			color = theme(themes.emphasis),
			transparency = derivers.lerp(focus_alpha, 1, 0),
		},
	}
end

type ColorInputsProps = {
	color: Reactive<Color3>,
	apply_color: (Color3) -> (),
}

local function color_inputs(props: ColorInputsProps)
	local input_type = vide.source("hsv" :: ColorInputType)

	return div {
		Size = UDim2.new(1, 0, 0, 28),

		left_list {
			gap = 6,
			VerticalAlignment = Enum.VerticalAlignment.Center,
		},
		input_dropdown {
			native = {
				Size = UDim2.new(0, 58, 1, 0),
			},
		},
		input_box {
			input_type = input_type :: Reactive<ColorInputType>,
			apply_color = props.apply_color,
			color = props.color,
		},
	}
end

return color_inputs
