local use_theme = require "@contexts/theme/use-theme"
local vide = require "@pkg/vide"
local interaction_hover = require "@ui/elements/interaction-hover"
local click_detector = require "@ui/styles/click-detector"
local div = require "@ui/styles/div"
local frame = require "@ui/styles/frame"
local padding = require "@ui/styles/padding"
local rounder = require "@ui/styles/rounder"
local actions = require "@utils/vide/actions"
local derivers = require "@utils/vide/derivers"

type BooleanInputProps = {
	apply: (boolean) -> (),
	value: Reactive<boolean>,

	native: vide.vFrame?,
}

local function boolean_input(props: BooleanInputProps)
	local theme = use_theme()
	local hovered = vide.source(false)
	local clicked = vide.source(false)

	local position = vide.spring(derivers.boolean(props.value, 0, 1), 0.15, 1)
	local click_size = vide.spring(derivers.boolean(clicked, 4, 0), 0.15, 1)

	return div {
		Name = "switch_holder",
		Size = UDim2.fromOffset(50, 26),
		props.native or {},

		interaction_hover {
			hovered = hovered,
			extends = 10,
			corner = UDim.new(1, 0),
		},
		frame {
			Name = "switch",
			BackgroundColor3 = function()
				return theme().background1:Lerp(theme().emphasis, position())
			end,

			rounder {},
			padding {
				padding = 4,
			},
			div {
				Name = "handle_holder",
				SizeConstraint = Enum.SizeConstraint.RelativeYY,
				AnchorPoint = function()
					return Vector2.new(position(), 0)
				end,
				Position = function()
					return UDim2.fromScale(position(), 0)
				end,

				frame {
					Name = "handle",
					Position = UDim2.fromScale(0.5, 0.5),
					AnchorPoint = Vector2.new(0.5, 0.5),
					Size = function()
						local size = math.round(click_size() / 2) * 2
						return UDim2.new(1, size, 1, size)
					end,
					BackgroundColor3 = function()
						return theme().background5:Lerp(theme().background2, position())
					end,

					rounder {},
				},
			},
		},
		click_detector {
			Activated = function()
				props.apply(not props.value())
			end,

			actions.hovered(hovered),
			actions.clicked(clicked),
		},
	}
end

return boolean_input
