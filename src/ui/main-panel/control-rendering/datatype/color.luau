local color_input = require "@ui/components/inputs/color-input"
local div = require "@ui/styles/div"
local left_list = require "@ui/styles/list/left-list"
local padding = require "@ui/styles/padding"
local types = require "../types"

local function color_control(props: types.ControlProps<{}, Color3>)
	return div {
		Size = UDim2.new(1, 0, 0, 32),

		padding {
			paddingy = 2,
		},
		left_list {
			VerticalAlignment = Enum.VerticalAlignment.Center,
		},
		color_input {
			value = props.value,
			apply = props.apply,
		},
	}
end

return color_control
