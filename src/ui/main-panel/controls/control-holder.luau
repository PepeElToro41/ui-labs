local UILabs = require "@pkg/ui-labs"
local Vide = require "@pkg/vide"

local create = Vide.create

local useTheme = require("@contexts/theme").useTheme
local Div = require "@styles/div"
local Frame = require "@styles/frame"
local LeftList = require "@styles/list/left"
local Text = require "@styles/text"

type ControlHolderProps = {
	ControlName: Derivable<string>,
	ControlRender: Derivable<Instance>,
	ResetControl: () -> (),
	Order: number?,
}

function ControlHolder(props: ControlHolderProps)
	local theme = useTheme()

	return Div {
		Size = UDim2.new(1, 0, 0, 32),

		LeftList {
			VerticalAlignment = Enum.VerticalAlignment.Center,
		},
		Text {
			Text = props.ControlName,
			TextColor3 = theme "Text2",
			TextSize = 13,
			Size = UDim2.new(0, 170, 1, 0),
			TextXAlignment = Enum.TextXAlignment.Left,
		},
		Div {
			create "UIFlexItem" { FlexMode = Enum.UIFlexMode.Fill },
			props.ControlRender,
		},
	}
end

return ControlHolder
