local string_input = require "@ui/components/inputs/string-input"
local div = require "@ui/styles/div"
local padding = require "@ui/styles/padding"
local types = require "../types"

local function string_control(props: types.ControlProps<types.StringControl, string>)
	return div {
		Size = UDim2.fromScale(1, 0),
		AutomaticSize = Enum.AutomaticSize.Y,

		padding {
			paddingy = 4,
		},
		string_input {
			value = props.value,
			apply = props.apply,
			multiline = props.control.MultiLine,
			filters = props.control.Filters,
		},
	}
end

return string_control
