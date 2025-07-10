local Common = require "../common"
local NumberInput = require "../common/number-input"

local Div = require "@base/div"
local LeftList = require "@base/list/left"
local ControlHolder = require "../control-holder"

function Number(props: Common.ControlProps<NumberControl, number>)
	return ControlHolder {
		Control = props,

		ControlRender = Div {
			Size = UDim2.new(1, 0, 0, 32),

			LeftList { Gap = 10, VerticalAlignment = Enum.VerticalAlignment.Center },
			NumberInput {
				Value = props.Value,
				Apply = props.Apply,
				Dragger = props.Control.Dragger,
				Prefix = props.Control.Prefix,
			},
		},
	}
end

return Number
