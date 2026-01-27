local resizable_panel = require "@ui/holders/resizable-panel"
local main_panel = require "./main-panel"
local side_panel = require "./side-panel"
local div = require "@ui/styles/div"
local left_list = require "@ui/styles/list/left-list"

local function ui_labs(props: {}?)
	return div {
		Name = "UILabs",

		left_list {},
		resizable_panel {
			Name = "SidePanel",
			panel_size = 250,
			minimum_size = 90,
			maximum_size = 600,
			collapse_threshold = 40,
			uncollapse_threshold = 50,
			panel_native = {
				ZIndex = 2,
			},

			children = side_panel {},
		},
		main_panel {},
	}
end

return ui_labs
