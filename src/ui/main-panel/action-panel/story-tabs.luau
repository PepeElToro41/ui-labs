local action_panel = require "."
local controls_tab = require "./tabs/controls"
local summary_tab = require "./tabs/summary"
local use_story_info = require "./use-story-info"

--- The tabs of the selected story, each one only shows when the story has something for it
local function story_tabs(info: use_story_info.StoryInfo): { action_panel.ActionTab }
	return {
		{
			key = "summary",
			name = "Summary",
			visible = function()
				return info.summary() ~= nil
			end,
			render = function()
				return summary_tab { summary = info.summary }
			end,
		},
		{
			key = "controls",
			name = "Controls",
			visible = info.has_controls,
			render = function()
				return controls_tab { preview = info.preview }
			end,
		},
	}
end

return story_tabs
