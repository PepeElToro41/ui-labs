local use_theme = require "@contexts/theme/use-theme"
local vide = require "@pkg/vide"
local themes = require "@themes"
local div = require "@ui/styles/div"
local frame = require "@ui/styles/frame"
local derivers = require "@utils/vide/derivers"

type InteractionHoverProps = {
	hovered: Derivable<boolean>,
	clicked: Derivable<boolean>?,
	extends: Derivable<number>,
	extends_clicked: Derivable<number>?,
	hide_unactive: boolean?,
	animation_period: number?,
	clicked_color: Color3?,
	corner: UDim | number,

	ZIndex: number?,
	[number]: any,
}

function InteractionHover(props: InteractionHoverProps)
	local theme = use_theme()
	local clicked: Derivable<boolean> = props.clicked or false
	local corner = props.corner
	if type(corner) == "number" then
		corner = UDim.new(0, corner)
	end

	local extends = function()
		if vide.read(clicked) then
			return vide.read(props.extends_clicked or props.extends)
		elseif vide.read(props.hovered) then
			return vide.read(props.extends)
		else
			return -1
		end
	end

	local extends_size = vide.spring(extends, 0.15, 1)
	local clicked_extends_size = vide.spring(derivers.boolean(clicked, 1, 0), props.animation_period or 0.4, 1)

	return div {
		Name = "InteractionHover",
		ZIndex = props.ZIndex,
		Visible = function()
			if props.hide_unactive then
				if extends_size() <= 0 then
					return false
				else
					return true
				end
			else
				return true
			end
		end,

		frame {
			Name = "HoverEffect",
			BackgroundTransparency = 0.85,
			BackgroundColor3 = theme(themes.border),
			Size = function()
				local size = math.round(extends_size() / 2) * 2
				return UDim2.new(1, size, 1, size)
			end,
			AnchorPoint = Vector2.new(0.5, 0.5),
			Position = UDim2.fromScale(0.5, 0.5),

			vide.create "UICorner" {
				CornerRadius = corner :: UDim,
			},
		},
		frame {
			Name = "ClickedEffect",
			BackgroundTransparency = derivers.lerp(clicked_extends_size, 1, 0.7),
			BackgroundColor3 = props.clicked_color or theme(themes.border),
			Position = UDim2.fromScale(0.5, 0.5),
			AnchorPoint = Vector2.new(0.5, 0.5),
			Size = function()
				local extends = vide.read(props.extends_clicked or props.extends)
				local even_extends = math.round(math.lerp(-1, extends, clicked_extends_size()) / 2) * 2
				return UDim2.new(1, even_extends, 1, even_extends)
			end,

			vide.create "UICorner" {
				CornerRadius = corner :: UDim,
			},
		},
	}
end

return InteractionHover
