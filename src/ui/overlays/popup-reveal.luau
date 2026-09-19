local use_theme = require "@contexts/theme/use-theme"
local vide = require "@pkg/vide"
local themes = require "@themes"
local corner = require "@ui/styles/corner"
local frame = require "@ui/styles/frame"
local derivers = require "@utils/vide/derivers"

--[[
	The open animation shared by the popups: the size springs up from half of what the popup wants
	to be, while a cover over the contents fades out to reveal them.

	Both springs are created with `revealed` false (cover opaque, size halved). Springs snap to
	their goal on creation, so the goals are held there until the popup exists, `start` then
	releases them to the real values and that is what animates.
]]

export type PopupReveal = {
	--- for `popup_holder.size_generator`
	size_generator: (target: Reactive<Vector2>) -> Reactive<Vector2>,
	--- the frame that fades out over the contents, for `popup_holder.overlay_native`
	cover: (props: CoverProps) -> Instance,
	--- call once the popup was created
	start: () -> (),
}

type CoverProps = {
	--- how far the popup contents sit from the popup edges, the holder's `inner_padding`
	inset: number,
	--- same radius as the frame underneath, the cover sits exactly on top of it
	radius: number,
	--- same color as the frame underneath, background2 without it
	color: Derivable<Color3>?,
}

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

local function popup_reveal(): PopupReveal
	local theme = use_theme()

	local revealed = vide.source(false)
	local cover_goal = derivers.boolean(revealed, 1, 0)
	local cover_transparency = snap(vide.spring(cover_goal, FADE_PERIOD, 0.8), cover_goal, number_distance, FADE_SNAP)

	return {
		size_generator = function(target)
			local size_goal = function()
				return if revealed() then target() else target() / 2
			end
			return snap(vide.spring(size_goal, SIZE_PERIOD, 0.9), size_goal, vector_distance, SIZE_SNAP)
		end,

		cover = function(props)
			return frame {
				Name = "cover",
				AnchorPoint = Vector2.new(0.5, 0.5),
				Position = UDim2.fromScale(0.5, 0.5),
				Size = UDim2.new(1, -props.inset * 2, 1, -props.inset * 2),
				BackgroundColor3 = props.color or theme(themes.background2),
				BackgroundTransparency = cover_transparency,

				corner {
					radius = props.radius,
				},
			}
		end,

		start = function()
			revealed(true)
		end,
	}
end

return popup_reveal
