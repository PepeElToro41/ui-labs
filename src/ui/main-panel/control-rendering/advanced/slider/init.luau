local use_theme = require "@contexts/theme/use-theme"
local themes = require "@themes"
local number_input = require "@ui/components/inputs/number-input"
local slider_input = require "@ui/components/inputs/slider-input"
local div = require "@ui/styles/div"
local flex_fill = require "@ui/styles/flex-fill"
local left_list = require "@ui/styles/list/left-list"
local padding = require "@ui/styles/padding"
local text = require "@ui/styles/text"
local types = require "../types"

local function slider_control(props: types.ControlProps<types.SliderControl, number>)
	local theme = use_theme()

	return div {
		Size = UDim2.new(1, 0, 0, 36),

		left_list {
			gap = 10,
			VerticalAlignment = Enum.VerticalAlignment.Center,
		},
		div {
			Name = "input_holder",
			Size = UDim2.fromScale(0, 1),
			AutomaticSize = Enum.AutomaticSize.X,

			left_list { VerticalAlignment = Enum.VerticalAlignment.Center },
			padding { right = 10 },
			number_input {
				apply = props.apply,
				value = props.value,
				drag_handle = false,
				min = props.control.Min,
				max = props.control.Max,
				step = props.control.Step,
			},
		},
		text {
			Name = "slider_min",
			Text = tostring(props.control.Min),
			TextSize = 13,
			TextColor3 = theme(themes.text2),
			Size = UDim2.fromScale(0, 1),
			AutomaticSize = Enum.AutomaticSize.X,
		},
		slider_input {
			value = props.value,
			update = props.apply,
			apply = props.apply,
			min = props.control.Min,
			max = props.control.Max,
			step = props.control.Step,

			native = {
				Size = UDim2.fromScale(0, 1),
				flex_fill() :: any,
			},
		},
		text {
			Name = "slider_max",
			Text = tostring(props.control.Max),
			TextSize = 13,
			TextColor3 = theme(themes.text2),
			Size = UDim2.fromScale(0, 1),
			AutomaticSize = Enum.AutomaticSize.X,
		},
	}
end

return slider_control
