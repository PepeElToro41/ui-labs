local IMAGES = require "@constants/images"
local use_theme = require "@contexts/theme/use-theme"
local vide = require "@pkg/vide"
local themes = require "@themes"
local popup_holder = require "@ui/holders/popup-holder"
local corner = require "@ui/styles/corner"
local div = require "@ui/styles/div"
local frame = require "@ui/styles/frame"
local image = require "@ui/styles/image"
local padding = require "@ui/styles/padding"
local text = require "@ui/styles/text"
local actions = require "@utils/vide/actions"
local derivers = require "@utils/vide/derivers"

export type WrappeablePlaces = popup_holder.WrappeablePlaces

export type HintPopupProps = {
	--- the frame the hint describes. The hint is placed around it and the arrow points at it,
	--- it never follows the mouse
	target: GuiObject,
	--- where the hint sits around the target, same format as `popup_holder.wrappable_places`.
	--- A single place pins the hint there, a list uses the first place that fits in the canvas
	anchor: (Vector2 | WrappeablePlaces)?,
	--- gap between the target and the tip of the arrow
	padding: Derivable<number>?,

	text: Derivable<string>?,
	--- extra children rendered inside the hint, below the text. They dont take part in the fade in
	children: any?,
}

local DEFAULT_ANCHOR = {
	Vector2.new(0.5, -1), -- above, centered
	Vector2.new(0.5, 2), -- below, centered
	Vector2.new(2, 0.5), -- right, centered
	Vector2.new(-1, 0.5), -- left, centered
}
local DEFAULT_PADDING = 4
local CANVAS_PADDING = 4

local FADE_PERIOD = 0.2

local CORNER_RADIUS = 6
-- the arrow image points upwards: X is its base, Y is how far the tip sticks out
local ARROW_SIZE = Vector2.new(12, 7)
-- the base goes under the hint so no seam shows between them
local ARROW_OVERLAP = 1
local ARROW_LENGTH = ARROW_SIZE.Y - ARROW_OVERLAP
-- how far the arrow center sits outside of the hint
local ARROW_OUTWARD = ARROW_SIZE.Y / 2 - ARROW_OVERLAP
-- on a diagonal the arrow sits on the rounded corner, which is further in than the corner of the hint bounds
local ARROW_OUTWARD_DIAGONAL = (ARROW_OUTWARD - CORNER_RADIUS * (math.sqrt(2) - 1)) / math.sqrt(2)
-- closest the arrow center gets to the end of an edge, keeps its base off the rounded corners
local ARROW_EDGE_INSET = CORNER_RADIUS + ARROW_SIZE.X / 2

--- Where the arrow points on one axis: -1 when the hint comes after the target, 1 when it comes before,
--- 0 when the hint is aligned with the target on this axis
local function arrow_direction(place: number): number
	return (place > 1 and -1) or (place < 0 and 1) or 0
end

--- The holder's inner padding moves the hint frame away from an aligned edge, this moves it back
local function aligned_offset(place: number): number
	return if place == 0 then -ARROW_LENGTH elseif place == 1 then ARROW_LENGTH else 0
end

--- Position of the arrow center on one axis, relative to the hint frame
local function arrow_axis_position(
	direction: number,
	outward: number,
	target_center: number,
	hint_position: number,
	hint_size: number
): UDim
	if direction < 0 then
		return UDim.new(0, -outward)
	elseif direction > 0 then
		return UDim.new(1, outward)
	end

	-- aligned on this axis: slides along the edge to point at the target center
	if hint_size < ARROW_EDGE_INSET * 2 then
		return UDim.new(0.5, 0)
	end
	local along = math.clamp(target_center - hint_position, ARROW_EDGE_INSET, hint_size - ARROW_EDGE_INSET)
	return UDim.new(0, along)
end

--- A hint positioned by `popup_holder` around a target frame, with an arrow pointing at the target.
--- Meant to be shown with `use_overlay`, not `use_popup`: a hint never takes over the app and any amount
--- of them can exist at once. The canvas is the hint's parent, so it wraps to stay inside the overlay layer.
--- The arrow always points from the side the hint was placed at towards the target: a hint placed
--- before the target (place -1, anchor point 1) points towards the positive direction, a hint placed
--- after it (place 2, anchor point 0) points towards the negative one. Both axes combine into a diagonal
--- and a hint placed on top of the target has no arrow.
local function hint_popup(props: HintPopupProps)
	local theme = use_theme()
	local color = theme(themes.background4)

	-- springs snap to their goal on creation, so the hint starts hidden and `shown` is what fades it in
	local shown = vide.source(false)
	local transparency = vide.spring(derivers.boolean(shown, 0, 1), FADE_PERIOD, 1)

	local anchor = props.anchor or DEFAULT_ANCHOR
	local places: popup_holder.WrappeablePlaces = if typeof(anchor) == "Vector2" then { anchor } else anchor

	local wrapped_place = vide.source(places[1])
	local target_shape = actions.shape_source()
	local hint_shape = actions.shape_source()
	actions.absolute_shape(target_shape).callback(props.target)

	local direction = vide.derive(function()
		local wrap = wrapped_place()
		return Vector2.new(arrow_direction(wrap.X), arrow_direction(wrap.Y))
	end)

	local arrow = image {
		Name = "arrow",
		Image = IMAGES.hint_arrow,
		ImageColor3 = color,
		ImageTransparency = transparency,
		AnchorPoint = Vector2.new(0.5, 0.5),
		Size = UDim2.fromOffset(ARROW_SIZE.X, ARROW_SIZE.Y),
		Visible = function()
			return direction() ~= Vector2.zero
		end,
		Rotation = function()
			-- the image points upwards (0, -1), rotation is clockwise
			local pointing = direction()
			return math.deg(math.atan2(pointing.X, -pointing.Y))
		end,
		Position = function()
			local pointing = direction()
			local target = target_shape()
			local hint = hint_shape()

			local diagonal = pointing.X ~= 0 and pointing.Y ~= 0
			local outward = if diagonal then ARROW_OUTWARD_DIAGONAL else ARROW_OUTWARD
			local target_center = target.position + target.size / 2

			return UDim2.new(
				arrow_axis_position(pointing.X, outward, target_center.X, hint.position.X, hint.size.X),
				arrow_axis_position(pointing.Y, outward, target_center.Y, hint.position.Y, hint.size.Y)
			)
		end,
	}

	local popup = popup_holder {
		Name = "hint_popup",
		dominant_axis = Enum.DominantAxis.Height,
		anchor_position = props.target,
		anchor_size = props.target,

		-- the inner padding is the room the arrow takes, so the arrow counts when checking what fits
		-- and the gap left between the target and the arrow tip is exactly the padding
		padding = function()
			return vide.read(props.padding) or DEFAULT_PADDING
		end,
		inner_padding = ARROW_LENGTH,
		wrap_padding = function(wrap: Vector2)
			return Vector2.new(aligned_offset(wrap.X), aligned_offset(wrap.Y))
		end,
		outer_padding = CANVAS_PADDING,
		scrollable = false,
		wrappable_places = places,

		children = function(wrap)
			vide.effect(function()
				wrapped_place(wrap())
			end)

			return frame {
				Name = "hint",
				AutomaticSize = Enum.AutomaticSize.XY,
				Size = UDim2.fromOffset(0, 0),
				BackgroundColor3 = color,
				BackgroundTransparency = transparency,
				actions.absolute_shape(hint_shape),

				corner {
					radius = CORNER_RADIUS,
				},
				padding {
					paddingx = 8,
					paddingy = 5,
				},
				vide.create "UIListLayout" {
					FillDirection = Enum.FillDirection.Vertical,
					SortOrder = Enum.SortOrder.LayoutOrder,
					Padding = UDim.new(0, 4),
				},

				if props.text
					then text {
						Name = "hint_text",
						LayoutOrder = -1,
						AutomaticSize = Enum.AutomaticSize.XY,
						Size = UDim2.fromOffset(0, 0),
						TextSize = 12,
						TextTransparency = transparency,
						TextXAlignment = Enum.TextXAlignment.Left,
						Text = props.text,
					}
					else {},
				props.children or {},
			}
		end,

		-- outside of the hint frame so it doesnt count for its AutomaticSize.
		-- the holder matches the hint frame, so the arrow is positioned relative to it
		overlay_native = {
			div {
				Name = "arrow_holder",
				AnchorPoint = Vector2.new(0.5, 0.5),
				Position = UDim2.fromScale(0.5, 0.5),
				Size = UDim2.new(1, -ARROW_LENGTH * 2, 1, -ARROW_LENGTH * 2),

				arrow,
			},
		},
	}

	shown(true)
	return popup
end

return hint_popup
