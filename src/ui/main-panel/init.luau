local use_theme = require "@contexts/theme/use-theme"
local vide = require "@pkg/vide"
local themes = require "@themes"
local div = require "@ui/styles/div"
local flex_fill = require "@ui/styles/flex-fill"
local frame = require "@ui/styles/frame"
local top_list = require "@ui/styles/list/top-list"
local background = require "@self/background"
local preview_tabs = require "@self/preview-tabs"
local story_content = require "@self/story-content"
local action_panel = require "@self/action-panel"
local story_tabs = require "@self/action-panel/story-tabs"
local use_story_info = require "@self/action-panel/use-story-info"
local resizable_panel = require "@ui/holders/resizable-panel"

local function main_panel(props: {}?)
	local theme = use_theme()

	local story_info = use_story_info()
	-- shared with the resizable panel, dragging it below the threshold collapses it too
	local action_panel_collapsed = vide.source(false)

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

		resizable_panel {
			panel_size = 350,
			handle_axis = "top",
			minimum_size = 110,
			collapse_threshold = 50,
			uncollapse_threshold = 70,
			collapsed = action_panel_collapsed,
			panel_native = {
				AnchorPoint = Vector2.new(0, 1),
				Position = UDim2.fromScale(0, 1),
				-- the resize handle goes with it, a story with nothing to show gets the whole panel
				Visible = story_info.available,
			},

			children = action_panel {
				tabs = story_tabs(story_info),
				closed = function()
					action_panel_collapsed(true)
				end,
			},
		},
	}
end

return main_panel
