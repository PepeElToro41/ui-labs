local use_theme = require "@contexts/theme/use-theme"
local themes = require "@themes"
local div = require "@ui/styles/div"
local flex_fill = require "@ui/styles/flex-fill"
local frame = require "@ui/styles/frame"
local top_list = require "@ui/styles/list/top-list"
local background = require "@self/background"
local preview_tabs = require "@self/preview-tabs"
local story_content = require "@self/story-content"

local function main_panel(props: {}?)
	local theme = use_theme()

	return frame {
		Name = "main_panel",
		BackgroundColor3 = theme(themes.background1),

		flex_fill(),
		background {},
		div {
			Name = "story_panel",

			top_list {},
			preview_tabs {},
			story_content {},
		},
	}
end

return main_panel
