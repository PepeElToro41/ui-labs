local Vide = require "@pkg/vide"
local Extract = require("@utils/vide/props").Extract
local Padding = require "./padding"

local cleanup = Vide.cleanup

type TextInputProps = Vide.vTextBox & {
	Weight: Enum.FontWeight?,
	Padding: number?,
	GetFocused: Vide.Source<boolean>?,
}

function TextInput(props: TextInputProps)
	local weight = Extract(props, "Weight") or Enum.FontWeight.Medium
	local getFocused = Extract(props, "GetFocused")
	local padding = Extract(props, "Padding")

	local paddingAdd = (padding and Padding { PaddingX = padding }) or nil

	local textbox = Vide.create "TextBox" {
		Name = "TextInput",
		BackgroundTransparency = 1,
		Size = UDim2.fromScale(1, 1),
		TextColor3 = Color3.new(1, 1, 1),
		FontFace = Font.fromName("GothamSSm", weight),
		Text = "",
		TextSize = 14,
		BorderSizePixel = 0,
		props :: Vide.vTextBox,
		paddingAdd,
	}

	if getFocused then
		cleanup(textbox.Focused:Connect(function()
			getFocused(true)
		end))
		cleanup(textbox.FocusLost:Connect(function()
			getFocused(false)
		end))
	end

	return textbox
end

return TextInput
