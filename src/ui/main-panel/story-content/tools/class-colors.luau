--- The color the tools mark an element with, one per class so that what an element is reads
--- from the marker alone. Anything not listed here is marked as a frame
local CLASS_COLORS: { [string]: Color3 } = {
	Frame = Color3.fromRGB(242, 153, 48),
	CanvasGroup = Color3.fromRGB(242, 153, 48),
	ScrollingFrame = Color3.fromRGB(242, 33, 33),
	TextLabel = Color3.fromRGB(28, 133, 232),
	TextButton = Color3.fromRGB(28, 133, 232),
	TextBox = Color3.fromRGB(97, 71, 242),
	ImageLabel = Color3.fromRGB(38, 227, 84),
	ImageButton = Color3.fromRGB(38, 227, 84),
	VideoFrame = Color3.fromRGB(38, 227, 84),
	ViewportFrame = Color3.fromRGB(38, 227, 84),
}

local class_colors = {
	default = CLASS_COLORS.Frame,
}

function class_colors.of(instance: Instance): Color3
	return CLASS_COLORS[instance.ClassName] or class_colors.default
end

return class_colors
