local Vide = require "@pkg/vide"
local UILabs = require "@pkg/ui-labs"

local ResizablePanel = require "@ui/holders/resizable-panel"

local story = UILabs.CreateVideStory({ vide = Vide }, function(props)
	return Vide.create "Frame" {
		Name = "Holder",
		Size = UDim2.fromOffset(0, 200),
		AnchorPoint = Vector2.new(0.5, 0.5),
		Position = UDim2.fromScale(0.5, 0.5),

		ResizablePanel {
			PanelSize = 250,
			MinimumSize = 100,
			MaximumSize = 500,
			CollapseThreshold = 30,
			UncollapseThreshold = 80,
			ContentsNative = {
				BackgroundColor3 = Color3.fromRGB(109, 109, 139),
			},
			HandleAxis = "Left",
		},
	}
end)

return story
