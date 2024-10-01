local Background = require "./background"
local HiddenCollapseToolbar = require "./toolbar/hidden-collapse"

function MainPanel()
	return Background {
		HiddenCollapseToolbar(),
	}
end

return MainPanel
