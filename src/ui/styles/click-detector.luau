local vide = require "@pkg/vide"

local function detector(props: vide.vTextButton)
	return vide.create "TextButton" {
		Name = "Detector",
		BackgroundTransparency = 1,
		TextTransparency = 1,
		Text = "",
		Size = UDim2.fromScale(1, 1),
		Position = UDim2.fromScale(0, 0),
		AutoButtonColor = false,
		props,
	}
end

return detector
