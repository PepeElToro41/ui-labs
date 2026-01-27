local Vide = require "@pkg/vide"
local UILabs = require "@pkg/ui-labs"

local App = require "@ui/app"
local Div = require "@base/div"

local SidePanel = require "@ui/side-panel"

local story = UILabs.CreateVideStory({ vide = Vide }, function(props)
	return Div {
		Size = UDim2.new(0, 250, 1, 0),

		SidePanel(),
	} :: any
end)

return story
