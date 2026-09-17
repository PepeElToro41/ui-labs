local vide = require "@pkg/vide"
local div = require "@ui/styles/div"
local padding = require "@ui/styles/padding"
local scroller = require "@ui/styles/scroller"
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
	--- if not provided, the popup's parent is used as the canvas
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
	--- this wont get applied to the overlay_native
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
	wrap_padding: ((wrap: Vector2) -> Vector2)?,

	--- optional generator for the popup size, receives the size the popup is trying to reach
	--- and returns the size to actually use, meant for animating it (springs, tweens).
	--- wrapping is always computed with the target size, and the popup clips its contents while a generator is used
	size_generator: ((target: Reactive<Vector2>) -> Reactive<Vector2>)?,

	--- function that renders the popup children, also receives a reactive value that contains the place the popup is wrapped.
	children: (wrap: Reactive<Vector2>) -> any,

	-- props and children that get applied to the scroller that holds the popup, this is only relevant if props.scrollable is true
	scroller_native: vide.vScrollingFrame?,

	--- props and children that get applied to the popup overlay, these are outside of the popup frame
	--- so they wont affect AutomaticSize and will not cause the popup to get wrapped if any children is outside of the canvas
	overlay_native: any,

	--- extra properties that get applied to the popup frame, you cant change: AnchorPoint, Position, Size, AutomaticSize
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

local function get_padding_vector(padding: (Vector2 | number)?)
	if padding == nil then
		return Vector2.zero
	elseif typeof(padding) == "number" then
		return Vector2.one * padding
	else
		return padding
	end
end

local function popup_holder(props: PopupHolderProps)
	local anchor_padding = props.padding or 0
	local inner_padding = props.inner_padding or 0
	local outer_padding = props.outer_padding or 0
	local scrollable = utils.nonnil(props.scrollable, true)

	local canvas_shape = actions.shape_source()
	local popup_contents_area = vide.source(Vector2.zero)
	local anchor_pos = vide.source(Vector2.zero)
	local anchor_size = vide.source(Vector2.zero)
	local wrapped_place = vide.source(props.wrappable_places[1])
	local limited_visible_area = vide.source(nil :: Vector2?)
	-- parent of the popup, used as the canvas when props.canvas is not provided
	local popup_parent = vide.source(nil :: GuiObject?)

	-- popup_contents already includes the inner padding in its automatic size
	local popup_area = function(): Vector2
		return popup_contents_area()
	end

	vide.effect(function()
		local canvas = vide.read(props.canvas) or popup_parent()
		if canvas then
			actions.absolute_shape(canvas_shape).callback(canvas)
		end
	end)

	vide.effect(function()
		local area = popup_area()
		local anchor_pos = anchor_pos()
		local anchor_size = anchor_size()
		local canvas_shape = canvas_shape()
		local dominant_axis = vide.read(props.dominant_axis)
		local anchor_padding = vide.read(anchor_padding)
		local canvas_margin = get_padding_vector(vide.read(outer_padding))

		local best_fit: Vector2? = nil
		local best_fit_visible = Vector2.zero

		for _, possible_wrap in props.wrappable_places do
			local position = get_final_anchor_position(
				canvas_shape,
				anchor_pos,
				anchor_size,
				anchor_padding,
				possible_wrap,
				props.wrap_padding
			)
			local anchor = get_wrap_anchor_point(possible_wrap)
			local start_pos = position - (anchor * area)
			local final_pos = start_pos + area

			local cropped_start = Vector2.max(start_pos, canvas_margin)
			local cropped_final = Vector2.min(final_pos, canvas_shape.size - canvas_margin)

			local visible_size = Vector2.max(cropped_final - cropped_start, Vector2.zero)

			if visible_size.X >= area.X and visible_size.Y >= area.Y then
				-- popup is completely visible
				limited_visible_area(nil)
				wrapped_place(possible_wrap)
				return
			else
				--	popup is only partially visible
				if dominant_axis == Enum.DominantAxis.Width then
					if best_fit_visible.X < visible_size.X then
						best_fit = possible_wrap
						best_fit_visible = visible_size
					end
				else
					if best_fit_visible.Y < visible_size.Y then
						best_fit = possible_wrap
						best_fit_visible = visible_size
					end
				end
			end
		end

		if best_fit then
			wrapped_place(best_fit)
			limited_visible_area(best_fit_visible)
		else
			wrapped_place(props.wrappable_places[1])
			limited_visible_area(nil)
		end
	end)

	vide.effect(function()
		local current_pos = vide.read(props.anchor_position)
		local current_size = vide.read(props.anchor_size)

		anchor_pos(get_anchor_position(current_pos))
		anchor_size(get_anchor_size(current_size))

		if typeof(current_pos) == "Instance" then
			local gui = current_pos :: GuiObject
			videx.connect(gui:GetPropertyChangedSignal "AbsolutePosition", function()
				anchor_pos(gui.AbsolutePosition)
			end)
		end
		if typeof(current_size) == "Instance" then
			local gui = current_size :: GuiObject
			videx.connect(gui:GetPropertyChangedSignal "AbsoluteSize", function()
				anchor_size(gui.AbsoluteSize)
			end)
		end
	end)

	local final_anchor_position = vide.derive(function()
		local final = get_final_anchor_position(
			canvas_shape(),
			anchor_pos(),
			anchor_size(),
			vide.read(anchor_padding),
			wrapped_place(),
			props.wrap_padding
		)
		return UDim2.fromOffset(final.X, final.Y)
	end)

	-- size is content driven so it never depends on the holder size,
	-- otherwise shrinking the holder would shrink the contents and cause a feedback loop.
	-- the inner padding lives here, inside the scroller, so strokes and shadows drawn
	-- outside the popup frame are not clipped by it
	local popup_contents = div {
		Name = "popup_contents",
		AnchorPoint = Vector2.new(0, 0),
		Position = UDim2.fromScale(0, 0),
		Size = UDim2.fromOffset(0, 0),
		AutomaticSize = Enum.AutomaticSize.XY,
		vide.changed("AbsoluteSize", popup_contents_area),

		videx.show(props.inner_padding, function()
			return padding {
				paddingx = function()
					return get_padding_vector(vide.read(inner_padding)).X
				end,
				paddingy = function()
					return get_padding_vector(vide.read(inner_padding)).Y
				end,
			}
		end),
		div {
			Name = "popup_frame",
			props.native or {},
			{
				AnchorPoint = Vector2.new(0, 0),
				Position = UDim2.fromScale(0, 0),
				Size = UDim2.fromOffset(0, 0),
				AutomaticSize = Enum.AutomaticSize.XY,
			},
			props.children(wrapped_place),
		},
	}

	-- size the popup is trying to reach: the contents, cropped to what can be visible
	local target_size = function(): Vector2
		local area = popup_area()
		local limited = limited_visible_area()
		if limited then
			area = Vector2.min(area, limited)
		end
		return area
	end
	local popup_size: Reactive<Vector2> = target_size
	if props.size_generator then
		popup_size = props.size_generator(target_size)
	end

	return div {
		Name = props.Name or "popup",
		Position = final_anchor_position,
		AnchorPoint = function()
			return get_wrap_anchor_point(wrapped_place())
		end,
		Size = function()
			local size = popup_size()
			return UDim2.fromOffset(size.X, size.Y)
		end,
		ClipsDescendants = function()
			if props.size_generator then
				return true
			end
			return not scrollable and limited_visible_area() ~= nil
		end,
		vide.action(function(frame: Frame)
			local function update()
				local parent = frame.Parent
				popup_parent(if parent and parent:IsA "GuiObject" then parent else nil)
			end
			videx.connect(frame:GetPropertyChangedSignal "Parent", update)
			update()
		end),

		div {
			Name = "popup_children",
			videx.switch(scrollable) {
				[true] = function()
					return scroller {
						Name = "popup_scroller",
						props.scroller_native or {},
						{
							Size = function()
								if limited_visible_area() then
									return UDim2.new(1, 4, 1, 4)
								else
									return UDim2.fromScale(1, 1)
								end
							end,
							AutomaticCanvasSize = Enum.AutomaticSize.None,
							CanvasSize = function()
								local area = popup_contents_area()
								return UDim2.fromOffset(area.X, area.Y)
							end,
						},
						popup_contents,
					}
				end,
				[false] = function()
					return popup_contents
				end,
			},
		},
		props.overlay_native,
	}
end

return popup_holder
