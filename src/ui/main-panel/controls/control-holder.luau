local UILabs = require "@pkg/ui-labs"
local Vide = require "@pkg/vide"

local create = Vide.create

local useTheme = require("@contexts/theme").useTheme
local Div = require "@base/div"
local LeftList = require "@base/list/left"
local Text = require "@base/text"
local Common = require "./common"

type ControlHolderProps = {
	Control: Common.ControlProps<any, any>,
	ControlRender: Derivable<Instance>,
	Size: Derivable<UDim2>?,
	ZIndex: Derivable<number>?,
}

function ControlHolder(props: ControlHolderProps)
	local theme = useTheme()

	return Div {
		Size = props.Size or UDim2.new(1, 0, 0, 32),
		ZIndex = props.ZIndex,
		LayoutOrder = props.Control.Order,

		LeftList {
			VerticalAlignment = Enum.VerticalAlignment.Top,
		},
		Text {
			Text = props.Control.ControlName,
			TextColor3 = theme "Text2",
			TextSize = 13,
			Size = UDim2.new(0, 170, 0, 32),
			TextXAlignment = Enum.TextXAlignment.Left,
		},
		Div {
			Size = UDim2.fromScale(1, 1),
			create "UIFlexItem" { FlexMode = Enum.UIFlexMode.Fill },
			props.ControlRender,
		},
	}
end

return ControlHolder
