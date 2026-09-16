local use_theme = require "@contexts/theme/use-theme"
local vide = require "@pkg/vide"
local themes = require "@themes"
local divisor = require "@ui/elements/divisor"
local click_detector = require "@ui/styles/click-detector"
local corner = require "@ui/styles/corner"
local div = require "@ui/styles/div"
local frame = require "@ui/styles/frame"
local top_list = require "@ui/styles/list/top-list"
local padding = require "@ui/styles/padding"
local actions = require "@utils/vide/actions"
local derivers = require "@utils/vide/derivers"
local videx = require "@utils/vide/videx"

type ContainerNodeProps = {
	title_render: () -> any,
	is_child: boolean?,
}

function container_node(props: ContainerNodeProps)
	local theme = use_theme()
	local hovered = vide.source(false)
	local expanded = vide.source(false)
	local name = vide.source "name"

	return frame {
		Name = name,
		Size = UDim2.fromScale(1, 0),
		AutomaticSize = Enum.AutomaticSize.Y,
		BackgroundColor3 = theme(themes.background3),
		BackgroundTransparency = derivers.boolean(hovered, 0, 1),

		corner {
			radius = 8,
		},
		top_list {
			gap = 1,
		},
		div {
			Name = "title",
			Size = UDim2.new(1, 0, 0, 27),

			props.title_render,
			divisor {
				visible = not not props.is_child,
				anchor = 0,
				position = UDim2.new(0, -6, 0.5, 0),
				size = UDim.new(0, 6),
				direction = "X",
			},
			click_detector {
				actions.hovered(hovered),
			},
		},
		div {
			Name = "children_holder",
			ClipsDescendants = true,
			Size = UDim2.fromScale(1, 0),
			AutomaticSize = Enum.AutomaticSize.Y,

			divisor {
				direction = "Y",
				position = UDim2.new(0, 9, 0, 0),
				size = UDim.new(1, -13),
				anchor = 0,
			},
			videx.show(expanded, function()
				return div {
					Name = "children",
					Size = UDim2.fromScale(1, 0),
					AutomaticSize = Enum.AutomaticSize.Y,

					top_list {
						gap = 1,
					},
					padding {
						left = 16,
					},
				}
			end),
		},
	}
end

return container_node
