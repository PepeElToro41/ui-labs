local use_theme = require "@contexts/theme/use-theme"
local use_world = require "@contexts/world/use-world"
local use_query = require "@hooks/use-query"
local vide = require "@pkg/vide"
local c = require "@src/components"
local themes = require "@themes"
local divisor = require "@ui/elements/divisor"
local frame = require "@ui/styles/frame"
local left_list = require "@ui/styles/list/left-list"
local padding = require "@ui/styles/padding"
local scroller = require "@ui/styles/scroller"
local preview_tab = require "@self/tab"

--- Horizontal strip with one tab per mounted preview
local function preview_tabs(props: {}?)
	local world = use_world()
	local theme = use_theme()

	-- use_query swap-removes, so the array order is meaningless: tabs sort by preview_order
	local entities = use_query(world.query():with(c.story_preview))

	return frame {
		Name = "preview_tabs",
		Size = UDim2.new(1, 0, 0, 32),
		BackgroundColor3 = theme(themes.background2),
		ZIndex = 2,

		divisor {
			direction = "X",
			anchor = 0,
			position = UDim2.new(0, 0, 1, -1),
			size = UDim.new(1, 0),
			transparency = 0.5,
			zindex = 2,
		},
		scroller {
			Name = "tabs",
			ScrollingDirection = Enum.ScrollingDirection.X,
			AutomaticCanvasSize = Enum.AutomaticSize.X,
			ScrollBarThickness = 1,
			ScrollBarImageColor3 = theme(themes.border),

			left_list {
				VerticalAlignment = Enum.VerticalAlignment.Center,
				gap = 5,
			},
			padding {
				paddingx = 6,
				top = 3,
				bottom = 4,
			},
			vide.values(entities, function(entity)
				return preview_tab { entity = entity }
			end),
		},
	}
end

return preview_tabs
