local Vide = require "@pkg/vide"

local spring = Vide.spring
local read = Vide.read
local create = Vide.create

local derivers = require "@utils/vide/derivers"
local actions = require "@actions"
local useTheme = require("@contexts/theme").useTheme
local PRESETS = require "@constants/ui-presets"
local Lerp = require("@utils/number").Lerp

local Div = require "@base/div"
local Frame = require "@base/frame"
local Corner = require "@base/corner"

type InteractionHoverProps = {
	Hovered: Derivable<boolean>,
	Clicked: Derivable<boolean>?,
	Extends: Derivable<number>,
	ExtendsClicked: Derivable<number>?,
	ZIndex: number?,
	Corner: UDim,
	[number]: any,
}

function InteractionHover(props: InteractionHoverProps)
	local theme = useTheme()
	local clicked: Derivable<boolean> = props.Clicked or false

	local extends = function()
		if read(clicked) then
			return read(props.ExtendsClicked or props.Extends)
		elseif read(props.Hovered) then
			return read(props.Extends)
		else
			return -1
		end
	end

	local extendsSize = spring(extends, 0.15, 1)
	local clickedExtendsSize = spring(derivers.boolean(clicked, 1, 0), 0.4, 1)

	return Div {
		Name = "InteractionHover",
		ZIndex = props.ZIndex,

		Frame {
			Name = "HoverEffect",
			BackgroundTransparency = 0.85,
			BackgroundColor3 = theme "Border",
			Size = derivers.offset(extendsSize, nil, true, 1),
			PRESETS.Centered,

			create "UICorner" {
				CornerRadius = props.Corner,
			},
		},
		Frame {
			Name = "ClickedEffect",
			BackgroundTransparency = derivers.lerp(clickedExtendsSize, 1, 0.7),
			BackgroundColor3 = theme "Border",
			Size = function()
				local extends = math.round(
					Lerp(-1, read(props.ExtendsClicked or props.Extends), clickedExtendsSize()) / 2
				) * 2
				return UDim2.fromScale(1, 1) + UDim2.fromOffset(extends, extends)
			end,
			PRESETS.Centered,

			create "UICorner" {
				CornerRadius = props.Corner,
			},
		},
	}
end

return InteractionHover
