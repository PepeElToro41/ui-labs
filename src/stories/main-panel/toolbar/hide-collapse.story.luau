local Vide = require "@pkg/vide"
local UILabs = require "@pkg/ui-labs"

local Frame = require "@styles/frame"
local Div = require "@styles/div"
local Padding = require "@styles/padding"
local Background = require "@ui/main-panel/background"
local HiddenCollapseToolbar = require "@ui/main-panel/toolbar/hidden-collapse"

Vide.strict = true

local story = UILabs.CreateVideStory({ vide = Vide }, function()
	return Div {
		Background(),
		HiddenCollapseToolbar(),
	}
end)

return story
