local Vide = require "@pkg/vide"
local UILabs = require "@pkg/ui-labs"
local useTheme = require("@contexts/theme").useTheme
local Branding = require "@ui/side-panel/branding"

local Frame = require "@styles/frame"
local Padding = require "@styles/padding"

local story = UILabs.CreateVideStory({ vide = Vide }, function()
	local theme = useTheme()

	return Frame {
		BackgroundColor3 = theme "Background2",
		Size = UDim2.new(0, 260, 0, 0),
		AutomaticSize = Enum.AutomaticSize.Y,
		Padding { PaddingX = 10, PaddingY = 6 },

		Branding(),
	}
end)

return story
