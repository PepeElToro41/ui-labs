local Vide = require "@pkg/vide"
local useTheme = require("@contexts/theme").useTheme

type DivisorProps = {
	Position: UDim2?,
	Anchor: number?,
	Size: UDim?,
	LayoutOrder: number?,
	ZIndex: number?,

	Color: Color3?,
	Transparency: number?,

	Direction: "X" | "Y"?,
	Thickness: number?,
	Visible: boolean?,
}

local function Divisor(props: DivisorProps)
	local theme = useTheme()

	local direction = props.Direction or "X"
	local thickness = props.Thickness or 1
	local anchor = props.Anchor or 0.5
	local size = props.Size or UDim.new(1, 0)

	return Vide.create "Frame" {
		Name = "Divisor",
		AnchorPoint = if direction == "X" then Vector2.new(anchor, 0.5) else Vector2.new(0.5, anchor),
		BackgroundColor3 = props.Color or theme "Border",
		BackgroundTransparency = props.Transparency or 0.8,
		BorderSizePixel = 0,
		LayoutOrder = props.LayoutOrder,
		Position = props.Position or UDim2.fromScale(0.5, 0.5),
		ZIndex = props.ZIndex,
		Visible = if props.Visible == nil then true else props.Visible,
		Size = if props.Direction == "X"
			then UDim2.new(size.Scale, size.Offset, 0, thickness)
			else UDim2.new(0, thickness, size.Scale, size.Offset),
	}
end

return Divisor
