local useTheme = require("@contexts/theme").useTheme

local Frame = require "@base/frame"
local Padding = require "@base/padding"
local TopList = require "@base/list/top"

type StoryControlProps = {
	ControlRender: any,
}

function StoryControl(props: StoryControlProps)
	local theme = useTheme()

	return Frame {
		BackgroundColor3 = theme "Background3",
		Size = UDim2.new(1, 0, 0, 300),
		AnchorPoint = Vector2.new(0, 1),
		Position = UDim2.new(0, 0, 1, 0),

		Padding { PaddingX = 12, PaddingY = 8 },
		TopList { Gap = 8 },

		props.ControlRender,
	} :: any
end

return {
	StoryControl = StoryControl,
}
