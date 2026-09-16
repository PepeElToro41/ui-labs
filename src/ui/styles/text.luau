local themes = require "@themes"
local use_theme = require "@contexts/theme/use-theme"
local vide = require "@pkg/vide"

type TextProps = vide.vTextLabel & {
	weight: Enum.FontWeight?,
}

local function text(props: TextProps)
	local theme = use_theme()

	local weight = props.weight
	props.weight = nil

	return vide.create "TextLabel" {
		BackgroundTransparency = 1,
		Size = UDim2.fromScale(0, 1),
		TextColor3 = theme(themes.text1),
		FontFace = Font.fromName("GothamSSm", weight or Enum.FontWeight.Medium),
		TextSize = 14,
		BorderSizePixel = 0,
		props,
	}
end

return text
