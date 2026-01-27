local vide = require "@pkg/vide"

local function image(props: vide.vImageLabel)
	return vide.create "ImageLabel" {
		Size = UDim2.new(1, 0, 1, 0),
		BorderSizePixel = 0,
		BackgroundTransparency = 1,
		props,
	}
end

return image
