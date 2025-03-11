local Vide = require "@pkg/vide"

function Scroller(props: Vide.vScrollingFrame)
	return Vide.create "ScrollingFrame" {
		Name = "Scroller",
		BackgroundTransparency = 1,
		Size = UDim2.new(1, 0, 1, 0),
		Position = UDim2.new(0, 0, 0, 0),
		BorderSizePixel = 0,
		ScrollBarThickness = 2,
		CanvasSize = UDim2.fromScale(0, 0),
		AutomaticCanvasSize = Enum.AutomaticSize.Y,
		props,
	}
end

return Scroller
