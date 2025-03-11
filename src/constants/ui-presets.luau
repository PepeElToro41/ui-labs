local UI_PRESETS = {
	Centered = {
		AnchorPoint = Vector2.new(0.5, 0.5),
		Position = UDim2.fromScale(0.5, 0.5),
	} :: any,
	LeftCenter = {
		AnchorPoint = Vector2.new(0, 0.5),
		Position = UDim2.fromScale(0, 0.5),
	} :: any,
	RightCenter = {
		AnchorPoint = Vector2.new(1, 0.5),
		Position = UDim2.fromScale(1, 0.5),
	} :: any,

	BottomLeft = {
		AnchorPoint = Vector2.new(0, 1),
		Position = UDim2.fromScale(0, 1),
	} :: any,
	BottomRight = {
		AnchorPoint = Vector2.new(1, 1),
		Position = UDim2.fromScale(1, 1),
	} :: any,
	TopRight = {
		AnchorPoint = Vector2.new(1, 0),
		Position = UDim2.fromScale(1, 0),
	} :: any,
}

return UI_PRESETS
