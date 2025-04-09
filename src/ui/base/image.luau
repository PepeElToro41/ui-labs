local Vide = require "@pkg/vide"

function Image(props: Vide.vImageLabel)
	return Vide.create "ImageLabel" {
		Size = UDim2.new(1, 0, 1, 0),
		BorderSizePixel = 0,
		BackgroundTransparency = 1,
		props,
	}
end

return Image
