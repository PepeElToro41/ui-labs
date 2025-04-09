local Vide = require "@pkg/vide"
local create = Vide.create

function Detector(props: Vide.vTextButton)
	local detector = create "TextButton" {
		Name = "Detector",
		BackgroundTransparency = 1,
		TextTransparency = 1,
		Text = "",
		Size = UDim2.fromScale(1, 1),
		Position = UDim2.fromScale(0, 0),
		AutoButtonColor = false,
		props,
	}
	return detector
end

return Detector
