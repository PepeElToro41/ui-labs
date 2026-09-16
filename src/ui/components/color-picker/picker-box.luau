local vide = require "@pkg/vide"
local drag_percentage = require "@ui/elements/drag-percentage"
local corner = require "@ui/styles/corner"
local div = require "@ui/styles/div"
local frame = require "@ui/styles/frame"
local rounder = require "@ui/styles/rounder"
local derivers = require "@utils/vide/derivers"

type HandleProps = {
	color: Reactive<Color3>,
	dragging: Reactive<boolean>,
	get_coords: Reactive<Vector3>,
}

local function picker_handle(props: HandleProps)
	local size_alpha = vide.spring(derivers.boolean(props.dragging, 1, 0), 0.15, 0.8)

	return frame {
		Name = "picker_handle",
		Size = function()
			local offset = math.round(math.lerp(10, 14, size_alpha()) / 2) * 2
			return UDim2.fromOffset(offset, offset)
		end,
		BackgroundColor3 = props.color,
		AnchorPoint = Vector2.new(0.5, 0.5),
		Position = function()
			local coords = props.get_coords()
			return UDim2.fromScale(coords.Y, coords.Z)
		end,

		rounder(),
		vide.create "UIStroke" {
			Thickness = 2,
			Color = Color3.new(1, 1, 1),
		},
	}
end

type PickerCanvasProps = {
	background_color: Reactive<Color3>,
	corners: boolean,

	native: vide.vFrame?,
}

local function picker_canvas(props: PickerCanvasProps)
	local function render_corner(): any
		if props.corners then
			return corner { radius = 5 }
		else
			return nil
		end
	end

	return div {
		Name = "picker_canvas",
		props.native or {},

		corner { radius = 6 },
		frame {
			Name = "background",
			BackgroundColor3 = props.background_color,
			ZIndex = 0,

			render_corner(),
		},
		frame {
			Name = "white_gradient",
			ZIndex = 1,

			render_corner(),
			vide.create "UIGradient" {
				Transparency = NumberSequence.new {
					NumberSequenceKeypoint.new(0, 1),
					NumberSequenceKeypoint.new(1, 0),
				},
			},
		},
		frame {
			Name = "black_gradient",
			ZIndex = 2,
			BackgroundColor3 = Color3.new(),

			render_corner(),
			vide.create "UIGradient" {
				Rotation = 90,
				Transparency = NumberSequence.new {
					NumberSequenceKeypoint.new(0, 1),
					NumberSequenceKeypoint.new(1, 0),
				},
			},
		},
	}
end

type PickerBoxProps = {
	color: Reactive<Color3>,
	get_coords: Reactive<Vector3>,
	update_coords: (Vector3) -> (),
	apply_coords: ((Vector3) -> ())?,
}

local PICKER_MASK = Vector3.new(1, 0, 0)

local function picker_box(props: PickerBoxProps)
	local hovered = vide.source(false)
	local dragging = vide.source(false)

	local background_color = function()
		return Color3.fromHSV(props.get_coords().X, 1, 1)
	end

	return div {
		Name = "picker_box",
		Size = UDim2.new(1, 0, 0, 120),

		picker_canvas {
			background_color = background_color,
			corners = true,
		},
		div {
			Size = UDim2.fromScale(1, 0.5),
			Position = UDim2.fromScale(0, 1),
			AnchorPoint = Vector2.new(0, 1),
			ClipsDescendants = true,

			picker_canvas {
				background_color = background_color,
				corners = false,
				native = {
					Size = UDim2.fromScale(1, 2),
					AnchorPoint = Vector2.new(0, 1),
					Position = UDim2.fromScale(0, 1),
				},
			},
		},

		picker_handle {
			dragging = dragging,
			get_coords = props.get_coords,
			color = props.color,
		},
		drag_percentage {
			dragging = dragging,
			hovered = hovered,
			axis = Vector2.one,

			update = function(coords)
				local add_coords = Vector3.new(0, coords.X, coords.Y)
				props.update_coords(props.get_coords() * PICKER_MASK + add_coords)
			end,
			apply = props.apply_coords and function(coords)
				local add_coords = Vector3.new(0, coords.X, coords.Y)
				props.apply_coords(props.get_coords() * PICKER_MASK + add_coords)
			end,
		},
	}
end

return picker_box
