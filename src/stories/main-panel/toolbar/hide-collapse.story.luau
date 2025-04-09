local Vide = require "@pkg/vide"
local UILabs = require "@pkg/ui-labs"

local Frame = require "@base/frame"
local Div = require "@base/div"
local Padding = require "@base/padding"
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
