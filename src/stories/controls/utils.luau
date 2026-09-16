local use_theme = require "@contexts/theme/use-theme"
local themes = require "@themes"
local frame = require "@ui/styles/frame"
local top_list = require "@ui/styles/list/top-list"
local padding = require "@ui/styles/padding"

type StoryControlProps = {
	-- the control renderers to place inside the panel
	controls: any,
}

-- mimics the controls panel at the bottom of the main panel, so control
-- stories are rendered in the same environment they will be used in
local function story_control(props: StoryControlProps)
	local theme = use_theme()

	return frame {
		Name = "story_control",
		BackgroundColor3 = theme(themes.background3),
		Size = UDim2.new(1, 0, 0, 300),
		AnchorPoint = Vector2.new(0, 1),
		Position = UDim2.fromScale(0, 1),

		padding { paddingx = 12, paddingy = 8 },
		top_list { gap = 8 },

		props.controls,
	}
end

return {
	story_control = story_control,
}
