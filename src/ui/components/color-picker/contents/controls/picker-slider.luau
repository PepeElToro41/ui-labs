local vide = require "@pkg/vide"
local drag_percentage = require "@ui/elements/drag-percentage"
local div = require "@ui/styles/div"
local frame = require "@ui/styles/frame"
local rounder = require "@ui/styles/rounder"
local derivers = require "@utils/vide/derivers"

type BarHandleProps = {
	dragging: Reactive<boolean>,
	get_percentage: Reactive<number>,
	color: Reactive<Color3>,
}

local function bar_handle(props: BarHandleProps)
	local hover_alpha = vide.spring(derivers.boolean(props.dragging, 1, 0), 0.2, 0.8)

	return frame {
		BackgroundColor3 = props.color,
		AnchorPoint = Vector2.new(0.5, 0.5),
		Position = function()
			return UDim2.fromScale(props.get_percentage(), 0.5)
		end,
		Size = function()
			local offset = math.round(math.lerp(10, 14, hover_alpha()) / 2) * 2
			return UDim2.fromOffset(offset, offset)
		end,

		rounder(),
		vide.create "UIStroke" {
			Thickness = 2,
			Color = Color3.new(1, 1, 1),
		},
	}
end

type PickerSliderProps = {
	name: string?,
	get_percentage: Reactive<number>,
	handle_color: Reactive<Color3>,

	background_render: () -> any,
	update_percentage: (number) -> (),
	apply_percentage: ((number) -> ())?,
}

local function picker_slider(props: PickerSliderProps)
	local dragging = vide.source(false)

	return div {
		Name = props.name or "picker_slider",
		Size = UDim2.new(1, 0, 0, 16),

		props.background_render(),
		bar_handle {
			dragging = dragging,
			color = props.handle_color,
			get_percentage = props.get_percentage,
		},
		drag_percentage {
			dragging = dragging,
			update = function(percentage)
				return props.update_percentage(percentage.X)
			end,
			apply = props.apply_percentage and function(percentage)
				return props.apply_percentage(percentage.X)
			end,

			native = {
				Size = UDim2.new(1, 4, 1, 4),
				AnchorPoint = Vector2.new(0, 0.5),
				Position = UDim2.fromScale(0, 0.5),
			},
		},
	}
end

return picker_slider
