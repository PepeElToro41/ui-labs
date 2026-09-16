local IMAGES = require "@constants/images"
local use_theme = require "@contexts/theme/use-theme"
local themes = require "@themes"
local div = require "@ui/styles/div"
local image = require "@ui/styles/image"
local left_list = require "@ui/styles/list/left-list"
local padding = require "@ui/styles/padding"
local text = require "@ui/styles/text"

type ContainerTitleProps = {
	name: Reactive<string>,
	expanded: Reactive<boolean>,
	icon: Derivable<string>,
	icon_color: Derivable<Color3>,
}

local function container_title(props: ContainerTitleProps)
	local theme = use_theme()

	return div {
		Name = "display",

		padding {
			paddingx = 2,
		},
		left_list {
			VerticalAlignment = Enum.VerticalAlignment.Center,
			gap = 2,
		},
		image {
			Name = "expand",
			Size = UDim2.fromOffset(16, 16),
			ImageColor3 = theme(themes.text1),
			Image = function()
				return if props.expanded() then IMAGES.expanded else IMAGES.collapsed
			end,
		},
		image {
			Name = "icon",
			Size = UDim2.fromOffset(13, 13),
			Image = props.icon,
			ImageColor3 = props.icon_color,
		},
		text {
			Name = "name",
			Size = UDim2.new(1, -30, 1, 0),
			AutomaticSize = Enum.AutomaticSize.X,
			TextXAlignment = Enum.TextXAlignment.Left,
			Text = props.name,

			padding {
				paddingx = 4,
			},
		},
	}
end

return container_title
