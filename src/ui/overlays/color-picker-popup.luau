local color_picker = require "@ui/components/color-picker"
local popup_holder = require "@ui/holders/popup-holder"
local popup_reveal = require "@ui/overlays/popup-reveal"

export type ColorPickerPopupProps = {
	--- what the picker opens next to, usually the color box that was clicked
	anchor: GuiObject,
	start_color: Color3,
	--- called with every change, the picker has no confirm step
	update_color: (color: Color3) -> (),
}

-- order matters: first place that fits entirely inside the canvas wins
local WRAPPABLE_PLACES = {
	Vector2.new(0, 2), -- below, aligned to the left edge of the anchor
	Vector2.new(0, -1), -- above, aligned to the left edge of the anchor
	Vector2.new(2, 0), -- right, aligned to the top edge of the anchor
	Vector2.new(-1, 0), -- left, aligned to the top edge of the anchor
	Vector2.new(1, 2), -- below, aligned to the right edge of the anchor
	Vector2.new(1, -1), -- above, aligned to the right edge of the anchor
}

-- visible gap between the anchor and the picker frame
local ANCHOR_GAP = 8
local CANVAS_PADDING = 4

local HANDLE_ROOM = 10
local COVER_CORNER_RADIUS = 8


local function aligned_offset(place: number): number
	return if place == 0 then -HANDLE_ROOM elseif place == 1 then HANDLE_ROOM else 0
end

--- Opens with the same reveal as the dropdown
local function color_picker_popup(props: ColorPickerPopupProps)
	local reveal = popup_reveal()

	local popup = popup_holder {
		Name = "color_picker_popup",
		dominant_axis = Enum.DominantAxis.Height,
		anchor_position = props.anchor,
		anchor_size = props.anchor,

		padding = ANCHOR_GAP - HANDLE_ROOM,
		inner_padding = HANDLE_ROOM,
		wrap_padding = function(wrap: Vector2)
			return Vector2.new(aligned_offset(wrap.X), aligned_offset(wrap.Y))
		end,
		outer_padding = CANVAS_PADDING,
		-- the picker is dragged, a scroller under it would fight for the input
		scrollable = false,
		wrappable_places = WRAPPABLE_PLACES,
		size_generator = reveal.size_generator,

		children = function()
			return color_picker {
				start_color = props.start_color,
				update_color = props.update_color,
			}
		end,

		overlay_native = {
			reveal.cover {
				inset = HANDLE_ROOM,
				radius = COVER_CORNER_RADIUS,
			},
		},
	}

	reveal.start()
	return popup
end

return color_picker_popup
