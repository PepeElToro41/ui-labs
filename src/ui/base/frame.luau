local Vide = require "@pkg/vide"

function Frame(props: Vide.vFrame)
	return Vide.create "Frame" {
		BackgroundColor3 = Color3.new(1, 1, 1),
		BorderSizePixel = 0,
		Size = UDim2.new(1, 0, 1, 0),
		Position = UDim2.new(0, 0, 0, 0),
		props,
	}
end

return Frame
