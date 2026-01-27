local vide = require "@pkg/vide"

local function scroller(props: vide.vScrollingFrame)
	return vide.create "ScrollingFrame" {
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

return scroller
