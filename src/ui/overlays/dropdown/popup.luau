local popup_holder = require "@ui/holders/popup-holder"
local dropdown = require "@ui/overlays/dropdown"
local popup_reveal = require "@ui/overlays/popup-reveal"

export type DropdownPopupProps = {
	--- absolute position the dropdown originates from, usually the mouse
	position: Derivable<Vector2>,
	--- fixed width of the dropdown, height is content driven
	width: number?,

	--- dropdown children, usually `dropdown/item` and `dropdown/divider`
	children: any?,
}

-- anchored at a point (no anchor size), so 0 and 2 (or 1 and -1) share the same spot.
-- 2 / -1 are used so `padding` gets applied away from the cursor
local WRAPPABLE_PLACES = {
	Vector2.new(2, 2), -- below, to the right of the cursor
	Vector2.new(-1, 2), -- below, to the left of the cursor
	Vector2.new(2, -1), -- above, to the right of the cursor
	Vector2.new(-1, -1), -- above, to the left of the cursor
}

local ANCHOR_PADDING = 2
local CANVAS_PADDING = 4
-- the dropdown border is a stroke drawn outside its frame, the popup clips so it needs room
local STROKE_PADDING = 2
-- same radius as the dropdown frame, the cover sits exactly on top of it
local COVER_CORNER_RADIUS = 6

--- A dropdown positioned by `popup_holder`, meant to be rendered inside the app overlay layer.
--- The canvas is the popup's parent, so the dropdown wraps to stay inside it.
--- Opens with the shared `popup_reveal`: the size springs up while a cover fades out over the items.
local function dropdown_popup(props: DropdownPopupProps)
	local reveal = popup_reveal()

	local popup = popup_holder {
		Name = "dropdown_popup",
		dominant_axis = Enum.DominantAxis.Height,
		anchor_position = props.position,
		anchor_size = nil,
		padding = ANCHOR_PADDING,
		inner_padding = STROKE_PADDING,
		outer_padding = CANVAS_PADDING,
		scrollable = true,
		wrappable_places = WRAPPABLE_PLACES,
		size_generator = reveal.size_generator,

		children = function()
			return dropdown {
				width = props.width,
				children = props.children,
			}
		end,

		overlay_native = {
			reveal.cover {
				inset = STROKE_PADDING,
				radius = COVER_CORNER_RADIUS,
			},
		},
	}

	reveal.start()
	return popup
end

return dropdown_popup
