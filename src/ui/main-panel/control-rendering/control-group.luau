local IMAGES = require "@constants/images"
local use_theme = require "@contexts/theme/use-theme"
local use_world = require "@contexts/world/use-world"
local vide = require "@pkg/vide"
local c = require "@src/components"
local themes = require "@themes"
local divisor = require "@ui/elements/divisor"
local measured_frame = require "@ui/holders/measured-frame"
local click_detector = require "@ui/styles/click-detector"
local div = require "@ui/styles/div"
local frame = require "@ui/styles/frame"
local image = require "@ui/styles/image"
local left_list = require "@ui/styles/list/left-list"
local top_list = require "@ui/styles/list/top-list"
local padding = require "@ui/styles/padding"
local text = require "@ui/styles/text"
local actions = require "@utils/vide/actions"
local derivers = require "@utils/vide/derivers"
local videx = require "@utils/vide/videx"
local ecs = require "@vendor/ecs"
local columns = require "./columns"
local control_list = require "./control-list"

type ControlGroupProps = {
	entity: ecs.Entity,
	order: Derivable<number>?,
	columns: columns.Columns,
}

local TITLE_HEIGHT = 28
local INDENT = 14
local HIGHLIGHT_TRANSPARENCY = 0.88
local HIGHLIGHT_EDGE = 2

--- A control group as a section of the table: a title that collapses it, then its controls
local function control_group(props: ControlGroupProps)
	local world = use_world()
	local theme = use_theme()
	local entity = props.entity

	local name = world.get(entity, c.control_name) :: string

	local expanded = vide.source(true)
	local hovered = vide.source(false)

	-- hovering the title lights up the frame of its controls, it shows what the group owns
	local highlight_alpha = vide.spring(derivers.boolean(hovered, 1, 0), 0.2, 1)

	local section = div {
		Name = name,
		AutomaticSize = Enum.AutomaticSize.Y,
		Size = UDim2.fromScale(1, 0),
		LayoutOrder = props.order,

		top_list {},
		frame {
			Name = "title",
			Size = UDim2.new(1, 0, 0, TITLE_HEIGHT),
			BackgroundColor3 = theme(themes.background2),
			BackgroundTransparency = derivers.boolean(hovered, 0, 0.4),
			LayoutOrder = 1,

			div {
				Name = "display",

				padding { left = columns.CELL_PADDING - 4 },
				left_list {
					VerticalAlignment = Enum.VerticalAlignment.Center,
					gap = 2,
				},
				image {
					Name = "expand",
					Size = UDim2.fromOffset(16, 16),
					ImageColor3 = theme(themes.text1),
					Image = derivers.boolean(expanded, IMAGES.expanded, IMAGES.collapsed),
					LayoutOrder = 1,
				},
				text {
					Name = "name",
					Text = name,
					TextSize = 13,
					TextXAlignment = Enum.TextXAlignment.Left,
					AutomaticSize = Enum.AutomaticSize.X,
					Size = UDim2.fromScale(0, 1),
					LayoutOrder = 2,
				},
			},
			divisor {
				direction = "X",
				anchor = 0,
				position = UDim2.fromScale(0, 1),
				size = UDim.new(1, 0),
				transparency = 0.85,
			},
			click_detector {
				Activated = function()
					expanded(not expanded())
				end,
				actions.hovered(hovered),
			},
		},
		videx.show(expanded, function()
			-- the controls grow the holder, so it is measured: the highlight needs a frame
			-- without AutomaticSize to fill, and one that the list does not lay out as a row
			return measured_frame {
				outer_children = {
					frame {
						Name = "highlight",
						-- under the rows, see control_holder
						ZIndex = 0,
						BackgroundColor3 = theme(themes.emphasis),
						BackgroundTransparency = derivers.lerp(highlight_alpha, 1, HIGHLIGHT_TRANSPARENCY),
					},
					frame {
						Name = "highlight_edge",
						ZIndex = 0,
						Size = UDim2.new(0, HIGHLIGHT_EDGE, 1, 0),
						BackgroundColor3 = theme(themes.emphasis),
						BackgroundTransparency = derivers.lerp(highlight_alpha, 1, 0),
					},
				} :: Array<Instance>,
				native = {
					Name = "controls",
					AutomaticSize = Enum.AutomaticSize.Y,
					Size = UDim2.fromScale(1, 0),
					LayoutOrder = 2,

					top_list {},
					control_list {
						parent = entity,
						columns = props.columns,
						indent = INDENT,
					},
				},
			}
		end),
	}

	-- vide.values only unparents the rows it drops
	vide.cleanup(section)
	return section
end

return control_group
