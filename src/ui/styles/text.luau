local vide = require "@pkg/vide"

local function text(props: vide.vTextLabel)
	return vide.create "TextLabel" {
		BackgroundTransparency = 1,
		Size = UDim2.fromScale(0, 1),
		FontFace = Font.fromName("GothamSSm", Enum.FontWeight.Medium),
		TextSize = 14,
		BorderSizePixel = 0,
		props,
	}
end

return text
