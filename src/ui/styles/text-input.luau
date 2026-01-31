local vide = require "@pkg/vide"

local function text_input(props: vide.vTextBox)
	return vide.create "TextBox" {
		Name = "TextInput",
		BackgroundTransparency = 1,
		Size = UDim2.fromScale(1, 1),
		TextColor3 = Color3.new(1, 1, 1),
		Text = "",
		TextSize = 14,
		BorderSizePixel = 0,
		props,
	}
end

return text_input
