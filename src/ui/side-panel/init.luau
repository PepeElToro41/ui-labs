local filter_search_provider = require "@contexts/filter-search/filter-search-provider"
local use_theme = require "@contexts/theme/use-theme"
local themes = require "@themes"
local frame = require "@ui/styles/frame"
local top_list = require "@ui/styles/list/top-list"
local padding = require "@ui/styles/padding"
local branding = require "@self/branding"
local explorer = require "@self/explorer"
local story_search = require "@self/story-search"

local function side_panel(props: {}?)
	local theme = use_theme()

	return filter_search_provider {
		children = function()
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
				branding {},
				story_search {},
				explorer {},
			}
		end,
	}
end

return side_panel
