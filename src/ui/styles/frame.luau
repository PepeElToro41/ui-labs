local vide = require "@pkg/vide"

local function frame(props: vide.vFrame)
	return vide.create "Frame" {
		BackgroundColor3 = Color3.new(1, 1, 1),
		BorderSizePixel = 0,
		Size = UDim2.new(1, 0, 1, 0),
		Position = UDim2.new(0, 0, 0, 0),
		props,
	}
end

return frame
