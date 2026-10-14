local use_instance_name = require "@hooks/use-instance-name"
local vide = require "@pkg/vide"
local div = require "@ui/styles/div"
local frame = require "@ui/styles/frame"
local actions = require "@utils/vide/actions"
local badge = require "./badge"
local class_colors = require "./class-colors"
local hit_test = require "./hit-test"

--- Where an element is drawn, as the tools measure it every frame
export type Shape = {
	--- the part of it that is drawn, in absolute space (see `hit-test`)
	window: hit_test.Window,
	--- its full size, which is the one worth reading even when it is partly clipped
	size: Vector2,
}

type MarkerProps = {
	--- the element being marked, nil marks nothing. Its name and its class are read from it,
	--- so this only changes when another element is marked
	element: Reactive<GuiObject?>,
	--- where to draw, updated every frame while an element is marked
	shape: Reactive<Shape?>,
	--- absolute position and size of the overlay the marker draws in. The labels are kept
	--- inside of it, whatever leaves it is clipped away
	view: Reactive<actions.GuiShape>,
}

local FILL_TRANSPARENCY = 0.7
local STROKE_THICKNESS = 1
local BOX_RADIUS = 3
-- the name label is taller than the one of a size, the way it is in the explorer
local NAME_HEIGHT = 20
-- how far into the name label its squared off corners reach. It is the corner radius of a
-- badge, which is also its text padding: any wider and the label would cover its own text
local SQUARED_CORNER = 5
-- an element shorter than this has no room for the name label inside of it
local MIN_INSIDE_HEIGHT = 26
-- gap left between the element and a label placed outside of it
local GAP = 5

type NameLabelProps = {
	name: Reactive<string>,
	color: Reactive<Color3>,
	--- absolute size of the label, the marker places it by it
	size_output: Source<Vector2>,
	AnchorPoint: Reactive<Vector2>,
	Position: Reactive<UDim2>,
}

--- The name of the element, in a label that merges into its top left corner: the two edges it
--- shares with the element are squared off, the corner away from both of them stays rounded
local function name_label(props: NameLabelProps)
	return div {
		Name = "name",
		-- the holder owns the height, so the edges below have nothing to size themselves
		-- against but a fixed number. The badge is what the width comes from
		Size = UDim2.fromOffset(0, NAME_HEIGHT),
		AutomaticSize = Enum.AutomaticSize.X,
		AnchorPoint = props.AnchorPoint,
		Position = props.Position,

		actions.absolute_size(props.size_output),

		badge {
			text = props.name,
			color = props.color,
			Size = UDim2.fromScale(0, 1),
		},
		-- over the rounded corners of the badge, which is all these are for
		frame {
			Name = "left_edge",
			Size = UDim2.new(0, SQUARED_CORNER, 1, 0),
			BackgroundColor3 = props.color,
		},
		frame {
			Name = "top_edge",
			AnchorPoint = Vector2.new(1, 0),
			Position = UDim2.fromScale(1, 0),
			Size = UDim2.new(0, SQUARED_CORNER, 0.5, 0),
			BackgroundColor3 = props.color,
		},
	}
end

--- Marks one element: a box over it in the color of its class, its name at the top left and
--- its size at the bottom right.
---
--- Both labels are placed inside the element or outside of it depending on the room there is
--- for them: the name goes over the element when the element is too small to hold it, the
--- size goes inside when the element sits at the bottom of the view. Neither of them is ever
--- put where the overlay would clip it away
local function marker(props: MarkerProps)
	local name = use_instance_name(props.element)
	--- the labels size themselves to their text, the placement has to know how big they got
	local name_bounds = vide.source(Vector2.zero)
	local size_bounds = vide.source(Vector2.zero)

	local function color(): Color3
		local element = props.element()
		return if element then class_colors.of(element) else class_colors.default
	end

	--- how much of the view is left between one of its edges and the same edge of the element
	local function room(edge: "top" | "bottom"): number
		local shape = props.shape()
		local view = props.view()
		if not shape then
			return 0
		end

		if edge == "top" then
			return shape.window.min.Y - view.position.Y
		end
		return (view.position.Y + view.size.Y) - shape.window.max.Y
	end

	--- the name goes over the element when it does not fit inside of it, which is what a small
	--- element does to it. It stays inside when there is nothing but the view edge over it
	local function name_outside(): boolean
		local shape = props.shape()
		if not shape then
			return false
		end

		local size = hit_test.size(shape.window)
		local fits = size.X >= name_bounds().X and size.Y >= MIN_INSIDE_HEIGHT
		return not fits and room "top" >= name_bounds().Y + GAP
	end

	--- the size goes under the element, and inside of it when the view ends right there
	local function size_outside(): boolean
		return room "bottom" >= size_bounds().Y + GAP
	end

	return div {
		Name = "marker",
		Visible = function()
			return props.shape() ~= nil
		end,
		Position = function()
			local shape = props.shape()
			if not shape then
				return UDim2.fromOffset(0, 0)
			end

			local min = shape.window.min - props.view().position
			return UDim2.fromOffset(min.X, min.Y)
		end,
		Size = function()
			local shape = props.shape()
			if not shape then
				return UDim2.fromOffset(0, 0)
			end

			local size = hit_test.size(shape.window)
			return UDim2.fromOffset(size.X, size.Y)
		end,

		frame {
			Name = "box",
			BackgroundColor3 = color,
			BackgroundTransparency = FILL_TRANSPARENCY,

			vide.create "UICorner" {
				CornerRadius = UDim.new(0, BOX_RADIUS),
			},
			vide.create "UIStroke" {
				Color = color,
				Thickness = STROKE_THICKNESS,
				ApplyStrokeMode = Enum.ApplyStrokeMode.Border,
			},
		},
		name_label {
			name = name,
			color = color,
			size_output = name_bounds,
			AnchorPoint = function()
				return if name_outside() then Vector2.new(0, 1) else Vector2.zero
			end,
			Position = function()
				return if name_outside() then UDim2.fromOffset(0, -GAP) else UDim2.fromOffset(0, 0)
			end,
		},
		badge {
			Name = "size",
			text = function()
				local shape = props.shape()
				if not shape then
					return ""
				end
				return `{math.floor(shape.size.X)} x {math.floor(shape.size.Y)}`
			end,
			color = color,
			AnchorPoint = function()
				return if size_outside() then Vector2.new(1, 0) else Vector2.new(1, 1)
			end,
			Position = function()
				return if size_outside() then UDim2.new(1, 0, 1, GAP) else UDim2.new(1, -GAP, 1, -GAP)
			end,

			actions.absolute_size(size_bounds),
		},
	}
end

return marker
