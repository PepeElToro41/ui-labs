local use_theme = require "@contexts/theme/use-theme"
local use_world = require "@contexts/world/use-world"
local use_query = require "@hooks/use-query"
local vide = require "@pkg/vide"
local c = require "@src/components"
local themes = require "@themes"
local divisor = require "@ui/elements/divisor"
local frame = require "@ui/styles/frame"
local padding = require "@ui/styles/padding"
local scroller = require "@ui/styles/scroller"
local tab_layout = require "@self/layout"
local preview_tab = require "@self/tab"

local function preview_tabs(props: {}?)
	local world = use_world()
	local theme = use_theme()

	local entities = use_query(world.query():with(c.story_preview))

	local layout = tab_layout.create()

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
			AutomaticCanvasSize = Enum.AutomaticSize.None,
			CanvasSize = function()
				return UDim2.fromOffset(layout.total(), 0)
			end,
			ScrollBarThickness = 1,
			ScrollBarImageColor3 = theme(themes.border),

			vide.action(layout.scroller),

			padding {
				top = tab_layout.PADDING_TOP,
				bottom = tab_layout.PADDING_BOTTOM,
			},
			vide.values(entities, function(entity)
				return preview_tab { entity = entity, layout = layout }
			end),
		},
	}
end

return preview_tabs
