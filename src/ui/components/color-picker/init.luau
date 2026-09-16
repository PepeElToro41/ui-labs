local use_theme = require "@contexts/theme/use-theme"
local vide = require "@pkg/vide"
local color_contents = require "@self/contents"
local picker_box = require "@self/picker-box"
local themes = require "@themes"
local border = require "@ui/elements/border"
local corner = require "@ui/styles/corner"
local frame = require "@ui/styles/frame"
local top_list = require "@ui/styles/list/top-list"

type ColorPickerProps = {
	start_color: Color3,
	update_color: (color: Color3) -> (),
	apply_color: ((color: Color3) -> ())?,
}

local INPUT_TYPES = {
	RGB = 1,
	HEX = 2,
	HSV = 3,
}

local function coords_from_color(color: Color3)
	local h, s, v = color:ToHSV()
	return Vector3.new(h, s, v)
end

function color_picker(props: ColorPickerProps)
	local theme = use_theme()
	local input_type = vide.source(INPUT_TYPES.RGB)
	local coords = vide.source(coords_from_color(props.start_color))

	local color = function()
		local coords = coords()
		return Color3.fromHSV(coords.X, 1 - coords.Y, 1 - coords.Z)
	end

	local function apply_color(color: Color3)
		local h, s, v = color:ToHSV()
		coords(Vector3.new(h, 1 - s, 1 - v))
	end

	return frame {
		BackgroundColor3 = theme(themes.background2),
		Size = UDim2.fromOffset(178, 0),
		AutomaticSize = Enum.AutomaticSize.Y,

		top_list {},
		border {},
		corner {
			radius = 8,
		},
		picker_box {
			get_coords = coords,
			update_coords = coords,
			apply_coords = coords,
			color = color,
		},
		color_contents {
			start_color = props.start_color,
			color = color,
			apply_color = apply_color,

			alpha = function()
				return 1
			end,
			use_alpha = false,

			get_coords = coords,
			update_coords = coords,
			apply_coords = coords,
		},
	}
end

return color_picker
