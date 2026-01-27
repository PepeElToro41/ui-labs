local vide = require "@pkg/vide"

type TextProps = vide.vTextLabel & {
	weight: Enum.FontWeight?,
}

local function text(props: TextProps)
	local weight = props.weight or Enum.FontWeight.Medium
	props.weight = nil

	return vide.create "TextLabel" {
		BackgroundTransparency = 1,
		Size = UDim2.fromScale(0, 1),
		FontFace = Font.fromName("GothamSSm", weight),
		TextSize = 14,
		BorderSizePixel = 0,
		props :: vide.vTextLabel,
	}
end

return text
