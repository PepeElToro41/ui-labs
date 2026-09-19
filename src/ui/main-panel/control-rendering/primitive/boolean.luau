local boolean_input = require "@ui/components/inputs/boolean-input"
local div = require "@ui/styles/div"
local left_list = require "@ui/styles/list/left-list"
local padding = require "@ui/styles/padding"
local types = require "../types"

local function boolean_control(props: types.ControlProps<{}, boolean>)
	return div {
		Size = UDim2.new(1, 0, 0, 36),

		padding {
			paddingy = 4,
		},
		left_list {
			VerticalAlignment = Enum.VerticalAlignment.Center,
		},
		boolean_input {
			apply = props.apply,
			value = props.value,
		},
	}
end

return boolean_control
