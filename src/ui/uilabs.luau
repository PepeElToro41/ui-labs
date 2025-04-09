local ResizablePanel = require "@ui/holders/resizable-panel"
local MainPanel = require "@ui/main-panel"
local SidePanel = require "@ui/side-panel"

local Div = require "@base/div"
local LeftList = require "@base/list/left"

function UILabs()
	return Div {
		Name = "UILabs",
		LeftList(),
		ResizablePanel {
			Name = "SidePanel",
			PanelSize = 250,
			MinimumSize = 90,
			MaximumSize = 600,
			CollapseThreshold = 40,
			UncollapseThreshold = 50,
			PanelNative = { ZIndex = 2 },

			children = SidePanel(),
		},
		MainPanel(),
	}
end

return UILabs
