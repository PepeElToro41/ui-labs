local Extract = require("@utils/vide/props").Extract
local Vide = require "@pkg/vide"
local Hovered = require("@actions").Hovered

local create = Vide.create

type DetectorProps = Vide.vTextButton & {
	Hovered: Vide.Source<boolean>?,
}

function Detector(props: DetectorProps)
	local hovered = Extract(props, "Hovered") :: Vide.Source<boolean>

	local detector = create "TextButton" {
		Name = "Detector",
		BackgroundTransparency = 1,
		TextTransparency = 1,
		Text = "",
		Size = UDim2.fromScale(1, 1),
		Position = UDim2.fromScale(0, 0),
		AutoButtonColor = false,
		props,
	}

	if hovered then Hovered(hovered).callback(detector) end

	return detector
end

return Detector
