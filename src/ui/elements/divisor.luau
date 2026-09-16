local use_theme = require "@contexts/theme/use-theme"
local themes = require "@themes"
local frame = require "@ui/styles/frame"
local utils = require "@utils"

type DivisorProps = {
	position: UDim2?,
	anchor: number?,
	size: UDim?,
	order: number?,
	zindex: number?,

	color: Color3?,
	transparency: number?,

	direction: "X" | "Y"?,
	thickness: number?,
	visible: Derivable<boolean?>?,
}

local function divisor(props: DivisorProps)
	local theme = use_theme()

	local direction = props.direction or "X"
	local thickness = props.thickness or 1
	local anchor = props.anchor or 0.5
	local size = props.size or UDim.new(1, 0)

	return frame {
		Name = "divisor",
		AnchorPoint = function()
			if direction == "X" then
				return Vector2.new(anchor, 0.5)
			else
				return Vector2.new(0.5, anchor)
			end
		end,
		BackgroundColor3 = props.color or theme(themes.border),
		BackgroundTransparency = props.transparency or 0.8,
		BorderSizePixel = 0,
		LayoutOrder = props.order,
		Position = props.position or UDim2.fromScale(0.5, 0.5),
		ZIndex = props.zindex,
		Visible = utils.nonnil(props.visible, true),
		Size = if props.direction == "X"
			then UDim2.new(size.Scale, size.Offset, 0, thickness)
			else UDim2.new(0, thickness, size.Scale, size.Offset),
	}
end

return divisor
