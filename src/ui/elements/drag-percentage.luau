local vide = require "@pkg/vide"
local click_detector = require "@ui/styles/click-detector"
local drag_detector = require "@ui/styles/drag-detector"
local actions = require "@utils/vide/actions"

type DragPercentageProps = {
	name: string?,
	hovered: Source<boolean>?,
	dragging: Source<boolean>?,

	axis: Vector2?,
	update: (percentage: Vector2) -> (),
	apply: ((percentage: Vector2) -> ())?,

	native: vide.vTextButton?,
	drag_native: vide.vUIDragDetector?,
}

local function drag_percentage(props: DragPercentageProps)
	local slider_shape = actions.shape_source()

	local function get_percentage(mouse: Vector2)
		local shape = slider_shape()
		local percentage = (mouse - shape.position) / shape.size
		local clamped_percentage = percentage:Max(Vector2.zero):Min(Vector2.one)

		return clamped_percentage
	end

	return click_detector {
		Name = props.name or "drag_percentage",

		actions.absolute_shape(slider_shape),
		props.hovered and actions.hovered(props.hovered) :: any,

		drag_detector {
			DragStyle = Enum.UIDragDetectorDragStyle.Scriptable,
			DragAxis = props.axis or Vector2.new(1, 0),
			DragStart = function(mouse)
				props.update(get_percentage(mouse))
			end,
			DragContinue = function(mouse)
				props.update(get_percentage(mouse))
			end,
			DragEnd = props.apply and function(mouse)
				props.apply(get_percentage(mouse))
			end,

			props.dragging and actions.dragging(props.dragging) :: any,
		},
	}
end

return drag_percentage
