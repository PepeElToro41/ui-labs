local vide = require "@pkg/vide"
local div = require "@ui/styles/div"
local utils = require "@utils"
local actions = require "@utils/vide/actions"
local videx = require "@utils/vide/videx"
-- anchor points for wrapping the popup. This is per-axis.
-- these are all 5 possible spots for each axis, 25 in total.
-- -1: Position: 0, AnchorPoint: 1
-- 0: Position: 0, AnchorPoint: 0
-- 0.5: Position: 0.5, AnchorPoint: 0.5
-- 1: Position: 1, AnchorPoint: 1
-- 2: Position: 1, AnchorPoint: 0
export type WrappeablePlaces = { Vector2 }

type PopupHolderProps = {
	Name: string?,
	--- optional GuiObject that represents the visible canvas area where the popup can be.
	--- the overlay_holder context is used as a default automatically
	canvas: Derivable<GuiObject?>?,

	--- what axis is used when calculating what wrapping place gives the most visible area
	--- in case it cant fit entirely in any of available places
	dominant_axis: Derivable<Enum.DominantAxis>,
	--- position where the popup originates, if a GuiObject is provided it will use GuiObject's AbsolutePosition
	anchor_position: Derivable<Vector2 | GuiObject>,
	--- size of the popup origin, this is used for when the popup is wrapped at the center or end of a corner
	--- the popup position when its wrapped at the center would be anchor_position + anchor_size * 0.5
	--- if a GuiObject is provided it will use GuiObject's AbsoluteSize
	anchor_size: Derivable<(Vector2 | GuiObject)?>,

	--- padding that gets added to where the popup originates.
	padding: Derivable<(number | Vector2)?>?,
	--- padding that gets applied inside the popup.
	--- this wont get applied to the top_overlay
	inner_padding: Derivable<(number | Vector2)?>?,
	--- padding that gets applied outside the popup.
	--- this doesnt affect how the popup looks or its position
	--- but it will grow the area that needs to be visible before wrapping
	outer_padding: Derivable<(number | Vector2)?>?,

	--- if true, it will use a scrolling frame when the popup cant fit on the screen
	--- making the rest visible by scrolling
	scrollable: boolean?,

	--- possible places where the popup can be wrapped. They are tested in order of the array and uses the first one that fits.
	--- If it cant fit in any of these places, it will use what had more free space in the dominant_axis
	wrappable_places: WrappeablePlaces,

	--- optional function to derive an extra position to be added to anchor_position dependening on the current wrapped place
	wrap_padding: (() -> Vector2)?,

	--- function that renders the popup children, also receives a reactive value that contains the place the popup is wrapped.
	children: (wrap: Reactive<Vector2>) -> any,

	--- children that get placed on top of the popup, these are outside of the popup frame
	--- so they wont affect AutomaticSize and will not cause the popup to get wrapped if its outside of the canvas
	top_overlay: any,

	--- extra properties that get applied to the popup frame, you cant change: AnchorPoint, Position
	native: vide.vFrame?,
}

function get_anchor_position(position: Vector2 | GuiObject)
	if typeof(position) == "Vector2" then
		return position
	else
		return position.AbsolutePosition
	end
end

function get_anchor_size(size: (Vector2 | GuiObject)?)
	if size then
		if typeof(size) == "Vector2" then
			return size
		else
			return size.AbsoluteSize
		end
	else
		return Vector2.new(0, 0)
	end
end

function get_wrap_anchor_point(wrap: Vector2)
	return Vector2.new(
		(wrap.X > 1 and 0) or (wrap.X < 0 and 1) or wrap.X,
		(wrap.Y > 1 and 0) or (wrap.Y < 0 and 1) or wrap.Y
	)
end

function get_final_anchor_position(
	canvas_shape: actions.GuiShape,
	position: Vector2,
	size: Vector2,
	padding: Vector2 | number,
	wrapped_place: Vector2,
	wrap_padding: ((wrap: Vector2) -> Vector2)?
)
	local anchor_wrap = Vector2.new(math.clamp(wrapped_place.X, 0, 1), math.clamp(wrapped_place.Y, 0, 1))
	local padding_multiplier = Vector2.new(
		(wrapped_place.X > 1 and 1) or (wrapped_place.X < 0 and -1) or 0, ---
		(wrapped_place.Y > 1 and 1) or (wrapped_place.Y < 0 and -1) or 0 ---
	)
	local final_padding = padding_multiplier * padding
	local final = (final_padding + position + anchor_wrap * size) - canvas_shape.position
	if wrap_padding then
		final += wrap_padding(wrapped_place)
	end

	return final
end

local function get_padding_vector(padding: Vector2 | number)
	if typeof(padding) == "number" then
		return Vector2.one * padding
	else
		return padding
	end
end

local function popup_holder(props: PopupHolderProps)
	local canvas = props.canvas
	local padding = props.padding or 0
	local scrollable = utils.nonnil(props.scrollable, true)

	local canvas_shape = vide.source({} :: actions.GuiShape)
	local anchor_pos = vide.source(get_anchor_position(vide.read(props.anchor_position)))
	local anchor_size = vide.source(get_anchor_size(vide.read(props.anchor_size or Vector2.zero)))
	local wrapped_place = vide.source(props.wrappable_places[1])
	local visible_area = vide.source(Vector2.zero)
	local inner_size = vide.source(Vector2.zero)

	local inner_padding = props.inner_padding or 0
	local final_inner_size = function()
		return inner_size() + get_padding_vector(vide.read(inner_padding))
	end

	local outer_padding = props.outer_padding or 0

	vide.effect(function()
		local canvas = vide.read(canvas)
		actions.absolute_shape(canvas_shape).callback(canvas)
	end)

	vide.effect(function()
		local current_pos = vide.read(props.anchor_position) :: GuiObject
		local current_size = vide.read(props.anchor_size) :: GuiObject

		anchor_pos(get_anchor_position(current_pos))
		anchor_size(get_anchor_size(current_size))

		if typeof(current_pos) == "Instance" then
			videx.connect(current_pos:GetPropertyChangedSignal "AbsolutePosition", function()
				anchor_pos(current_pos.AbsolutePosition)
			end)
		end
		if typeof(current_size) == "Instance" then
			videx.connect(current_size:GetPropertyChangedSignal "AbsoluteSize", function()
				anchor_size(current_size.AbsoluteSize)
			end)
		end
	end)

	local final_anchor_position = vide.derive(function()
		local final = get_final_anchor_position(
			canvas_shape(),
			anchor_pos(),
			anchor_size(),
			vide.read(padding),
			wrapped_place(),
			props.wrap_padding
		)
		return UDim2.fromOffset(final.X, final.Y)
	end)

	return div {
		Name = props.Name or "popup",
		Position = final_anchor_position,
		AnchorPoint = function()
			return get_wrap_anchor_point(wrapped_place())
		end,
		Size = function()
			local inner = final_inner_size()
			if visible_area() then
				local cropped = Vector2.min(inner, visible_area() :: any)
				return UDim2.fromOffset(cropped.X, cropped.Y)
			else
				return UDim2.fromOffset(inner.X, inner.Y)
			end
		end,

		div {
			Name = "popup_children",
			videx.show(props.inner_padding, function() end),
		},
		props.top_overlay,
	}
end

return popup_holder
