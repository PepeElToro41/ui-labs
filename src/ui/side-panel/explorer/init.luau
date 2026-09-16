local use_theme = require "@contexts/theme/use-theme"
local use_world = require "@contexts/world/use-world"
local use_query = require "@hooks/use-query"
local vide = require "@pkg/vide"
local c = require "@src/components"
local themes = require "@themes"
local divisor = require "@ui/elements/divisor"
local div = require "@ui/styles/div"
local flex_fill = require "@ui/styles/flex-fill"
local top_list = require "@ui/styles/list/top-list"
local padding = require "@ui/styles/padding"
local scroller = require "@ui/styles/scroller"
local text = require "@ui/styles/text"
local container_node = require "@self/nodes/container"

local function explorer(props: {}?)
	local world = use_world()
	local theme = use_theme()

	local storybooks = use_query(world.query(c.storybook_node))
	local unknown = use_query(world.query(c.unknown_node))

	return div {
		Name = "explorer",
		Size = UDim2.fromScale(1, 1),

		flex_fill(),
		top_list {
			gap = 6,
			HorizontalAlignment = Enum.HorizontalAlignment.Center,
		},
		text {
			Name = "header",
			Text = "Story Explorer",
			TextSize = 14,
			Size = UDim2.new(1, 0, 0, 25),
			TextXAlignment = Enum.TextXAlignment.Left,

			padding {
				padding = 4,
			},
		},
		divisor {
			direction = "X",
			size = UDim.new(1, -10),
		},
		div {
			Name = "story_scroller",
			Size = UDim2.new(1, -6, 0, 0),

			flex_fill(),
			scroller {
				Size = UDim2.new(1, 6, 1, 0),
				ScrollBarImageColor3 = theme(themes.border),

				top_list {
					gap = 1,
				},
				padding {
					bottom = 5,
				},
				vide.values(storybooks, function(entity)
					return container_node { entity = entity }
				end),
				vide.values(unknown, function(entity)
					return container_node { entity = entity }
				end),
			},
		},
	}
end

return explorer
