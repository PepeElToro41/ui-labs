local use_theme = require "@contexts/theme/use-theme"
local vide = require "@pkg/vide"
local themes = require "@themes"
local divisor = require "@ui/elements/divisor"
local measured_frame = require "@ui/holders/measured-frame"
local div = require "@ui/styles/div"
local flex_fill = require "@ui/styles/flex-fill"
local frame = require "@ui/styles/frame"
local left_list = require "@ui/styles/list/left-list"
local padding = require "@ui/styles/padding"
local text = require "@ui/styles/text"
local actions = require "@utils/vide/actions"
local columns = require "./columns"

type ControlHolderProps = {
	name: Derivable<string>,
	order: Derivable<number>?,
	columns: columns.Columns,
	--- pushes the name to the right, the columns stay aligned with the rest of the table
	indent: number?,
	--- the control renderer, it decides its own height
	children: any,
}

local ROW_HEIGHT = 32

--- A row of the controls table: the name of the control, then the control
local function control_holder(props: ControlHolderProps)
	local theme = use_theme()
	local name_width = props.columns.name_width
	local indent = props.indent or 0

	local hovered = vide.source(false)
	local hover_alpha = vide.spring(function()
		return if hovered() then 1 else 0
	end, 0.15, 1)

	-- the row grows with its control, so it is measured: the highlight and the separator need a
	-- holder without AutomaticSize to fill
	return measured_frame {
		outer_children = {
			frame {
				Name = "hover",
				-- under the measured frame, equal ZIndex siblings have no reliable order and the
				-- highlight would wash out the control
				ZIndex = 0,
				BackgroundColor3 = theme(themes.background4),
				BackgroundTransparency = function()
					return 1 - hover_alpha() * 0.5
				end,
			},
			divisor {
				direction = "X",
				anchor = 0,
				position = UDim2.fromScale(0, 1),
				size = UDim.new(1, 0),
				transparency = 1,
			},
		} :: Array<Instance>,
		outer_native = {
			-- frames see the mouse without taking the clicks from the control
			actions.hovered(hovered) :: any,
		},
		native = {
			Name = props.name,
			AutomaticSize = Enum.AutomaticSize.Y,
			Size = UDim2.fromScale(1, 0),
			LayoutOrder = props.order,

			left_list {
				VerticalAlignment = Enum.VerticalAlignment.Top,
			},
			text {
				Name = "name",
				Text = props.name,
				TextColor3 = theme(themes.text2),
				TextSize = 13,
				TextXAlignment = Enum.TextXAlignment.Left,
				TextTruncate = Enum.TextTruncate.AtEnd,
				Size = function()
					return UDim2.fromOffset(name_width(), ROW_HEIGHT)
				end,
				LayoutOrder = 1,

				padding {
					left = columns.CELL_PADDING + indent,
					right = columns.CELL_PADDING,
				},
			},
			div {
				Name = "control",
				AutomaticSize = Enum.AutomaticSize.Y,
				Size = UDim2.fromScale(0, 0),
				LayoutOrder = 2,

				flex_fill(),
				padding { paddingx = columns.CELL_PADDING },
				props.children,
			},
		},
	}
end

return control_holder
