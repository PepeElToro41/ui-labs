local vide = require "@pkg/vide"

type TextInputProps = vide.vTextBox & {
	weight: Enum.FontWeight?,
}

local function text_input(props: TextInputProps)
	local weight = props.weight or Enum.FontWeight.Medium
	props.weight = nil

	local textbox = vide.create "TextBox" {
		Name = "TextInput",
		BackgroundTransparency = 1,
		Size = UDim2.fromScale(1, 1),
		TextColor3 = Color3.new(1, 1, 1),
		FontFace = Font.fromName("GothamSSm", weight),
		Text = "",
		TextSize = 14,
		BorderSizePixel = 0,
		props :: vide.vTextBox,
	}

	return textbox
end

return text_input
