local Common = require "../common"
local NumberInput = require "../common/number-input"

local Div = require "@base/div"
local LeftList = require "@base/list/left"

type NumberControl = {
	Min: number?,
	Max: number?,
	Step: number?,
	Dragger: boolean,
	Sensitivity: number,
	Prefix: string?,
}

function Number(props: Common.ControlProps<NumberControl, number>)
	return Div {
		LeftList { Gap = 10, VerticalAlignment = Enum.VerticalAlignment.Center },
		NumberInput {
			Value = props.Value,
			Apply = props.Apply,
			Dragger = props.Control.Dragger,
			Prefix = props.Control.Prefix,
		},
	}
end

return Number
