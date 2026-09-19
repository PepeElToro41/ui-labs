local use_popup = require "@contexts/app-render/use-popup"
local vide = require "@pkg/vide"
local border = require "@ui/elements/border"
local color_picker_popup = require "@ui/overlays/color-picker-popup"
local click_detector = require "@ui/styles/click-detector"
local corner = require "@ui/styles/corner"
local frame = require "@ui/styles/frame"
local text = require "@ui/styles/text"
local actions = require "@utils/vide/actions"
local derivers = require "@utils/vide/derivers"

type ColorInputProps = {
	value: Reactive<Color3>,
	apply: (value: Color3) -> (),

	native: vide.vFrame?,
}

local LIGHT_TEXT = Color3.fromRGB(255, 255, 255)
local DARK_TEXT = Color3.fromRGB(20, 20, 20)
-- perceived brightness where the label flips, a bit over the middle since white text stays
-- readable on mid tones for longer than dark text does
local DARK_TEXT_THRESHOLD = 0.6
-- how see-through the black frame is at full hover
local DIM_TRANSPARENCY = 0.75

--- Perceived brightness of a color, 0 to 1. The eye weighs green far more than blue
local function brightness(color: Color3): number
	return color.R * 0.299 + color.G * 0.587 + color.B * 0.114
end

--- A box filled with the color and labelled with its hex, clicking it opens the color picker
local function color_input(props: ColorInputProps)
	local popup = use_popup()

	local box = vide.source(nil :: Frame?)
	local hovered = vide.source(false)

	local label = function()
		return "#" .. string.upper(props.value():ToHex())
	end

	-- follows the box so the hex never blends into it
	local label_color = function()
		return if brightness(props.value()) > DARK_TEXT_THRESHOLD then DARK_TEXT else LIGHT_TEXT
	end

	-- stays dimmed while its picker is open, it shows which box the picker belongs to
	local dimmed = function()
		return hovered() or popup.is_open()
	end
	local dim_alpha = vide.spring(derivers.boolean(dimmed, 1, 0), 0.15, 1)

	-- the contents stop being interactable under a popup, so the leave event never arrives
	vide.effect(function()
		if popup.is_open() then
			hovered(false)
		end
	end)

	local function open_picker()
		local anchor = box()
		if not anchor then
			return
		end
		local start_color = vide.untrack(props.value)
		popup.open(function()
			return color_picker_popup {
				anchor = anchor,
				start_color = start_color,
				update_color = props.apply,
			}
		end)
	end

	return frame {
		Name = "color_input",
		Size = UDim2.fromOffset(90, 28),
		BackgroundColor3 = props.value,
		props.native or {},

		vide.action(box),
		corner { radius = 6 },
		-- neutral on purpose, a colored outline clashes with the color it surrounds
		border { transparency = 0.5 },
		frame {
			Name = "dim",
			-- over the color and under the hex, equal ZIndex siblings have no reliable order
			ZIndex = 1,
			BackgroundColor3 = Color3.new(0, 0, 0),
			BackgroundTransparency = derivers.lerp(dim_alpha, 1, DIM_TRANSPARENCY),

			corner { radius = 6 },
		},
		text {
			Name = "hex",
			ZIndex = 2,
			Text = label,
			TextColor3 = label_color,
			TextSize = 13,
			Size = UDim2.fromScale(1, 1),
		},
		click_detector {
			ZIndex = 3,
			Activated = open_picker,
			actions.hovered(hovered),
		},
	}
end

return color_input
