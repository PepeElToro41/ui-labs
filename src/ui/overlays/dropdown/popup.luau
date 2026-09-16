local use_theme = require "@contexts/theme/use-theme"
local vide = require "@pkg/vide"
local themes = require "@themes"
local popup_holder = require "@ui/holders/popup-holder"
local dropdown = require "@ui/overlays/dropdown"
local corner = require "@ui/styles/corner"
local frame = require "@ui/styles/frame"
local derivers = require "@utils/vide/derivers"

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

local SIZE_PERIOD = 0.15
local FADE_PERIOD = 0.2

--- A dropdown positioned by `popup_holder`, meant to be rendered inside the app overlay layer.
--- The canvas is the popup's parent, so the dropdown wraps to stay inside it.
--- On open the size springs from zero and a cover fades out to reveal the items.
local function dropdown_popup(props: DropdownPopupProps)
	local theme = use_theme()

	-- the spring starts at the cover being opaque, revealing right after creation animates it
	local revealed = vide.source(false)
	local cover_transparency = vide.spring(derivers.boolean(revealed, 1, 0), FADE_PERIOD, 1)
	revealed(true)

	return popup_holder {
		Name = "dropdown_popup",
		dominant_axis = Enum.DominantAxis.Height,
		anchor_position = props.position,
		anchor_size = nil,
		padding = ANCHOR_PADDING,
		inner_padding = STROKE_PADDING,
		outer_padding = CANVAS_PADDING,
		scrollable = true,
		wrappable_places = WRAPPABLE_PLACES,

		-- the contents start unmeasured (zero), so the spring grows from nothing to the real size
		size_generator = function(target)
			return vide.spring(target, SIZE_PERIOD, 1)
		end,

		children = function()
			return dropdown {
				width = props.width,
				children = props.children,
			}
		end,

		overlay_native = {
			frame {
				Name = "cover",
				AnchorPoint = Vector2.new(0.5, 0.5),
				Position = UDim2.fromScale(0.5, 0.5),
				Size = UDim2.new(1, -STROKE_PADDING * 2, 1, -STROKE_PADDING * 2),
				BackgroundColor3 = theme(themes.background2),
				BackgroundTransparency = cover_transparency,

				corner {
					radius = COVER_CORNER_RADIUS,
				},
			},
		},
	}
end

return dropdown_popup
