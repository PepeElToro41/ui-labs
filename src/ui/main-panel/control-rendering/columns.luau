local use_theme = require "@contexts/theme/use-theme"
local vide = require "@pkg/vide"
local themes = require "@themes"
local divisor = require "@ui/elements/divisor"
local click_detector = require "@ui/styles/click-detector"
local div = require "@ui/styles/div"
local drag_detector = require "@ui/styles/drag-detector"
local frame = require "@ui/styles/frame"
local right_list = require "@ui/styles/list/right-list"
local padding = require "@ui/styles/padding"
local text = require "@ui/styles/text"
local actions = require "@utils/vide/actions"

--[[
	The controls table has two columns, name and control, split by one draggable divider.

	The state is shared: the header, the divider and every row read `name_width`, so dragging the
	divider resizes the whole table at once. The owner can keep it alive across tables to make the
	width survive a story change.
]]

export type Columns = {
	--- width of the name column, already clamped to what the table can fit
	name_width: Reactive<number>,
	--- the width the divider was dragged to, unclamped so it comes back when the table grows again
	wanted_width: Source<number>,
	--- reported by the table, the control column never gets squeezed below its minimum
	table_width: Source<number>,
	--- reported by the header, the divider stays clear of the buttons at its end
	actions_width: Source<number>,
}

local DEFAULT_NAME_WIDTH = 170
local MIN_NAME_WIDTH = 80
local MIN_CONTROL_WIDTH = 140

local HEADER_HEIGHT = 30
local CELL_PADDING = 12
local HANDLE_THICKNESS = 8

local columns = {
	HEADER_HEIGHT = HEADER_HEIGHT,
	CELL_PADDING = CELL_PADDING,
}

function columns.create(): Columns
	local wanted_width = vide.source(DEFAULT_NAME_WIDTH)
	local table_width = vide.source(0)
	local actions_width = vide.source(0)

	local function maximum()
		local control_width = math.max(MIN_CONTROL_WIDTH, actions_width())
		return math.max(MIN_NAME_WIDTH, table_width() - control_width)
	end

	return {
		name_width = function()
			return math.clamp(wanted_width(), MIN_NAME_WIDTH, maximum())
		end,
		wanted_width = wanted_width,
		table_width = table_width,
		actions_width = actions_width,
	}
end

type ColumnsProps = {
	columns: Columns,
}

type HeaderProps = ColumnsProps & {
	--- buttons for the end of the header, as children of a right aligned horizontal list
	actions: any?,
}

function columns.header(props: HeaderProps)
	local theme = use_theme()
	local name_width = props.columns.name_width

	local actions_size = vide.source(Vector2.zero)
	vide.effect(function()
		props.columns.actions_width(actions_size().X)
	end)

	local function title(name: string, label: string, native: vide.vTextLabel)
		return text {
			Name = name,
			Text = label,
			TextColor3 = theme(themes.text3),
			TextSize = 12,
			TextXAlignment = Enum.TextXAlignment.Left,
			TextTruncate = Enum.TextTruncate.AtEnd,

			padding { paddingx = CELL_PADDING },
			native :: any,
		}
	end

	return frame {
		Name = "header",
		Size = UDim2.new(1, 0, 0, HEADER_HEIGHT),
		BackgroundColor3 = theme(themes.background2),

		title("name", "Name", {
			Size = function()
				return UDim2.new(0, name_width(), 1, 0)
			end,
		}),
		title("control", "Control", {
			Position = function()
				return UDim2.fromOffset(name_width(), 0)
			end,
			Size = function()
				return UDim2.new(1, -name_width(), 1, 0)
			end,
		}),
		-- opaque, it covers the end of the control title instead of sharing the space with it
		frame {
			Name = "actions",
			AnchorPoint = Vector2.new(1, 0),
			Position = UDim2.fromScale(1, 0),
			AutomaticSize = Enum.AutomaticSize.X,
			Size = UDim2.fromScale(0, 1),
			BackgroundColor3 = theme(themes.background2),
			ZIndex = 2,

			actions.absolute_size(actions_size),
			padding { left = CELL_PADDING, right = 8 },
			right_list {
				VerticalAlignment = Enum.VerticalAlignment.Center,
				gap = 6,
			},
			props.actions or {},
		},
		divisor {
			direction = "X",
			anchor = 0,
			position = UDim2.new(0, 0, 1, -1),
			size = UDim.new(1, 0),
			transparency = 0.8,
			zindex = 3,
		},
	}
end

--- The line between the columns, it covers the full height of whatever it is parented to
function columns.divider(props: ColumnsProps)
	local theme = use_theme()
	local name_width = props.columns.name_width
	local wanted_width = props.columns.wanted_width

	local hovered = vide.source(false)
	local dragging = vide.source(false)
	local active = function()
		return hovered() or dragging()
	end

	-- delta based, the mouse is never converted to the table space
	local press_x = 0
	local base_width = 0

	local function on_drag_start(mouse: Vector2)
		press_x = mouse.X
		-- from the clamped width, so a divider stuck at a limit moves as soon as the mouse does
		base_width = vide.untrack(name_width)
	end

	local function on_drag_continue(mouse: Vector2)
		wanted_width(base_width + mouse.X - press_x)
	end

	local function on_drag_end()
		-- keeps what was reachable, the overshoot would make the next resize of the table jump
		wanted_width(vide.untrack(name_width))
	end

	return div {
		Name = "column_divider",
		Size = UDim2.fromScale(0, 1),
		Position = function()
			return UDim2.fromOffset(name_width(), 0)
		end,
		ZIndex = 3,

		frame {
			Name = "line",
			AnchorPoint = Vector2.new(0.5, 0),
			Size = function()
				return UDim2.new(0, if dragging() then 2 else 1, 1, 0)
			end,
			BackgroundColor3 = function()
				return theme()[if active() then themes.emphasis else themes.border]
			end,
			BackgroundTransparency = function()
				return if active() then 0 else 0.8
			end,
		},
		click_detector {
			Name = "handle",
			AnchorPoint = Vector2.new(0.5, 0),
			Size = UDim2.new(0, HANDLE_THICKNESS, 1, 0),

			actions.hovered(hovered),
			drag_detector {
				DragStyle = Enum.UIDragDetectorDragStyle.Scriptable,
				DragAxis = Vector2.new(1, 0),
				DragStart = on_drag_start,
				DragContinue = on_drag_continue,
				DragEnd = on_drag_end,

				actions.dragging(dragging),
			},
		},
	}
end

return columns
