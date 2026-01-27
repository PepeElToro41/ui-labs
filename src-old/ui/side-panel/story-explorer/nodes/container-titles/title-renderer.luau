local IMAGES = require "@constants/images"
local useTheme = require("@contexts/theme").useTheme

local Div = require "@base/div"
local Padding = require "@base/padding"
local LeftList = require "@base/list/left"
local Image = require "@base/image"
local Text = require "@base/text"

type TitleRendererProps = {
	Name: Reactive<string>,
	Expanded: Reactive<boolean>,
	Icon: Instance,
}

function TitleRenderer(props: TitleRendererProps)
	local theme = useTheme()
	local expanded = props.Expanded

	return Div {
		Name = "Display",
		Padding { PaddingX = 2 },
		LeftList { VerticalAlignment = Enum.VerticalAlignment.Center, Gap = 2 },
		Image {
			Size = UDim2.fromOffset(16, 16),
			ImageColor3 = theme "Text1",
			Image = function()
				return expanded() and IMAGES.Expanded or IMAGES.Collapsed
			end,
		},
		props.Icon,
		Text {
			Size = UDim2.new(1, -30, 1, 0),
			TextXAlignment = Enum.TextXAlignment.Left,
			Text = props.Name,
			AutomaticSize = Enum.AutomaticSize.X,
			Padding = 4,
		},
	}
end

return TitleRenderer
