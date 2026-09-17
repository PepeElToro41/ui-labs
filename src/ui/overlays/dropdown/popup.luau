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

local SIZE_PERIOD = 0.09
local FADE_PERIOD = 0.2
-- springs crawl through the last bit of progress, so they snap to the goal once this close
local SIZE_SNAP = 0.5
local FADE_SNAP = 0.02

--- Returns the spring value, or the goal once the spring is within `threshold` of it
local function snap<T>(spring: Reactive<T>, goal: Reactive<T>, distance: (T, T) -> number, threshold: number): Reactive<T>
	return function()
		local value = spring()
		local target = goal()
		if distance(value, target) <= threshold then
			return target
		end
		return value
	end
end

local function vector_distance(a: Vector2, b: Vector2)
	return (a - b).Magnitude
end

local function number_distance(a: number, b: number)
	return math.abs(a - b)
end

--- A dropdown positioned by `popup_holder`, meant to be rendered inside the app overlay layer.
--- The canvas is the popup's parent, so the dropdown wraps to stay inside it.
--- On open the size springs from zero and a cover fades out to reveal the items.
local function dropdown_popup(props: DropdownPopupProps)
	local theme = use_theme()

	-- both springs are created with `revealed` false (cover opaque, size zero),
	-- flipping it once the popup exists animates them to their real values
	local revealed = vide.source(false)
	local cover_goal = derivers.boolean(revealed, 1, 0)
	local cover_transparency = snap(vide.spring(cover_goal, FADE_PERIOD, 1), cover_goal, number_distance, FADE_SNAP)

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

		-- springs snap to their goal on creation, so the goal is held at zero until the
		-- spring exists, then released to the real size to animate the growth
		size_generator = function(target)
			local size_goal = function()
				return if revealed() then target() else target() / 2
			end
			return snap(vide.spring(size_goal, SIZE_PERIOD, 0.7), size_goal, vector_distance, SIZE_SNAP)
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

	revealed(true)
	return popup
end

return dropdown_popup
