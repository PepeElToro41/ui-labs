local Vide = require "@pkg/vide"

local create = Vide.create
local spring = Vide.spring
local source = Vide.source

local useTheme = require("@contexts/theme").useTheme
local derivers = require "@utils/vide/derivers"
local actions = require "@actions"
local PRESETS = require "@constants/ui-presets"

local Div = require "@base/div"
local Frame = require "@base/frame"
local LeftList = require "@base/list/left"
local Padding = require "@base/padding"
local Corner = require "@base/corner"
local Rounder = require "@base/rounder"
local Detector = require "@base/detector"
local InteractionHover = require "@ui/elements/interaction-hover"
local ControlHolder = require "../control-holder"

local Common = require "../common"

function Boolean(props: Common.ControlProps<{}, boolean>)
	local theme = useTheme()
	local hovered = source(false)
	local clicked = source(false)

	local position = spring(derivers.boolean(props.Value, 0, 1), 0.15, 1)
	local clickSize = spring(derivers.boolean(clicked, 4, 0), 0.2, 1)

	return ControlHolder {
		Control = props,
		ControlRender = Div {
			Size = UDim2.new(1, 0, 0, 32),

			LeftList { VerticalAlignment = Enum.VerticalAlignment.Center },
			Div {
				Size = UDim2.fromOffset(50, 26),

				InteractionHover {
					Hovered = hovered,
					Extends = 10,
					Corner = UDim.new(0.5, 0),
				},
				Frame {
					Name = "Switch",
					Size = UDim2.fromScale(1, 1),
					BackgroundColor3 = function()
						return theme().Background1:Lerp(theme().Emphasis, position())
					end,

					Rounder(),
					Padding { Padding = 4 },
					Div {
						SizeConstraint = Enum.SizeConstraint.RelativeYY,
						AnchorPoint = function()
							return Vector2.new(position(), 0)
						end,
						Position = derivers.scale(position, "X"),

						Frame {
							Name = "Handle",
							Size = derivers.offset(clickSize, nil, true, 1),
							BackgroundColor3 = function()
								return theme().Background5:Lerp(theme().Background2, position())
							end,
							PRESETS.Centered,

							Rounder(),
						},
					},
				},
				Detector {
					actions.Hovered(hovered),
					actions.Clicked(clicked),
					Activated = function()
						props.Apply(not props.Value())
					end,
				},
			},
		},
	}
end

return Boolean
