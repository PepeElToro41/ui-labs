local Vide = require "@pkg/vide"
local Extract = require("@utils/vide/props").Extract
local Padding = require "./padding"
local useTheme = require("@contexts/theme").useTheme

type TextProps = Vide.vTextLabel & {
	Weight: Enum.FontWeight?,
	Padding: number?,
}

function Text(props: TextProps)
	local theme = useTheme()

	local weight = Extract(props, "Weight") or Enum.FontWeight.Medium
	local padding = Extract(props, "Padding")

	local paddingAdd = (padding and Padding { PaddingX = padding }) or nil

	return Vide.create "TextLabel" {
		BackgroundTransparency = 1,
		Size = UDim2.fromScale(0, 1),
		TextColor3 = theme "Text1",
		FontFace = Font.fromName("GothamSSm", weight),
		TextSize = 14,
		BorderSizePixel = 0,
		props :: Vide.vTextLabel,
		paddingAdd,
	}
end

return Text
