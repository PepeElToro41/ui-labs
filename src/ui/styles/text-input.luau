local vide = require "@pkg/vide"

type TextInputProps = vide.vTextBox & {
	weight: Enum.FontWeight?,
}

local function text_input(props: TextInputProps)
	local weight = props.weight
	props.weight = nil

	return vide.create "TextBox" {
		Name = "TextInput",
		BackgroundTransparency = 1,
		Size = UDim2.fromScale(1, 1),
		TextColor3 = Color3.new(1, 1, 1),
		FontFace = Font.fromName("GothamSSm", weight or Enum.FontWeight.Medium),
		Text = "",
		TextSize = 14,
		BorderSizePixel = 0,
		props,
	}
end

return text_input
