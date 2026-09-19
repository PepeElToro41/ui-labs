local number_input = require "@ui/components/inputs/number-input"
local div = require "@ui/styles/div"
local left_list = require "@ui/styles/list/left-list"
local padding = require "@ui/styles/padding"
local types = require "../types"

local function number_control(props: types.ControlProps<types.NumberControl, number>)
	return div {
		Size = UDim2.new(1, 0, 0, 36),

		padding {
			paddingy = 4,
		},
		left_list {
			VerticalAlignment = Enum.VerticalAlignment.Center,
		},
		number_input {
			value = props.value,
			apply = props.apply,
			drag_handle = props.control.Dragger,
			min = props.control.Min,
			max = props.control.Max,
			step = props.control.Step,
			prefix = props.control.Prefix,
		},
	}
end

return number_control
