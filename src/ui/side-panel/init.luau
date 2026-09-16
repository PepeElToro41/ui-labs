local use_theme = require "@contexts/theme/use-theme"
local themes = require "@themes"
local frame = require "@ui/styles/frame"
local top_list = require "@ui/styles/list/top-list"
local padding = require "@ui/styles/padding"
local explorer = require "@self/explorer"

local function side_panel(props: {}?)
	local theme = use_theme()

	return frame {
		Name = "side_panel",
		Size = UDim2.fromScale(1, 1),
		BackgroundColor3 = theme(themes.background2),
		ClipsDescendants = true,

		top_list {
			HorizontalAlignment = Enum.HorizontalAlignment.Center,
			gap = 10,
		},
		padding {
			paddingx = 10,
			paddingy = 6,
		},
		explorer {},
	}
end

return side_panel
