local ResizablePanel = require "@ui/holders/resizable-panel"
local MainPanel = require "@ui/main-panel"
local SidePanel = require "@ui/side-panel"

local Div = require "@styles/div"
local LeftList = require "@styles/list/left"

function UILabs()
	return Div {
		Name = "UILabs",
		LeftList(),
		ResizablePanel {
			Name = "SidePanel",
			PanelSize = 250,
			MinimumSize = 120,
			MaximumSize = 600,
			CollapseThreshold = 50,
			UncollapseThreshold = 60,
			PanelNative = { ZIndex = 2 },

			children = SidePanel(),
		},
		MainPanel(),
	}
end

return UILabs
