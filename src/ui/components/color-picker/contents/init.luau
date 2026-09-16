local color_controls = require "@self/controls"
local color_inputs = require "@self/inputs"
local divisor = require "@ui/elements/divisor"
local div = require "@ui/styles/div"
local top_list = require "@ui/styles/list/top-list"
local padding = require "@ui/styles/padding"

type ColorContentsProps = {
	start_color: Color3,
	color: Reactive<Color3>,

	alpha: Reactive<number>,
	use_alpha: boolean,

	apply_color: (Color3) -> (),
	get_coords: Reactive<Vector3>,
	update_coords: (Vector3) -> (),
	apply_coords: ((Vector3) -> ())?,
}

local function color_contents(props: ColorContentsProps)
	return div {
		AutomaticSize = Enum.AutomaticSize.Y,
		Size = UDim2.fromScale(1, 0),

		top_list {
			HorizontalAlignment = Enum.HorizontalAlignment.Center,
			gap = 8,
		},
		padding {
			padding = 8,
		},
		color_controls {
			start_color = props.start_color,
			color = props.color,
			alpha = props.alpha,
			use_alpha = props.use_alpha,
			get_coords = props.get_coords,
			update_coords = props.update_coords,
			apply_coords = props.apply_coords,
		},
		divisor { direction = "X" },
		color_inputs {
			apply_color = props.apply_color,
			color = props.color,
		},
	}
end

return color_contents
