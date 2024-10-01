local Vide = require "@pkg/vide"

local useFilter = require("@ui/side-panel/filtering").useFilter
local useStoryNodes = require("@contexts/story-nodes").useStoryNodes
local FilterNodes = require("@ui/side-panel/filtering").FilterNodes
local useTheme = require("@contexts/theme").useTheme
local Divisor = require "@ui/elements/divisor"
local StorybookNodes = require "./storybook-nodes"

local Div = require "@styles/div"
local TopList = require "@styles/list/top"
local Text = require "@styles/text"
local Scroller = require "@styles/scroller"

local create = Vide.create
local derive = Vide.derive

type StoryExplorerProps = {}

function StoryExplorer(props: StoryExplorerProps)
	local theme = useTheme()
	local nodes = useStoryNodes()
	local filter = useFilter()

	local filteredNodes = derive(function()
		local filter: string? = filter()
		if filter then return FilterNodes(nodes(), filter) end
		return nodes()
	end)

	return Div {
		Name = "StoryExplorer",
		Size = UDim2.fromScale(1, 1),

		create "UIFlexItem" { FlexMode = Enum.UIFlexMode.Fill },
		TopList { Gap = 6, HorizontalAlignment = Enum.HorizontalAlignment.Center },
		Text {
			Text = "Story Explorer",
			TextSize = 14,
			Size = UDim2.new(1, 0, 0, 25),
			TextColor3 = theme "Text",
			TextXAlignment = Enum.TextXAlignment.Left,
			Padding = 4,
		},
		Divisor { Direction = "X", Size = UDim.new(1, -10) },
		Div {
			Name = "StoryScroller",
			Size = UDim2.new(1, -6, 0, 0),

			create "UIFlexItem" { FlexMode = Enum.UIFlexMode.Fill },
			Scroller {
				Size = UDim2.new(1, 6, 1, 0),
				ScrollBarImageColor3 = theme "Border",

				TopList { Gap = 1 },
				StorybookNodes {
					Nodes = function()
						return filteredNodes().Storybooks
					end,
				},
			},
		},
	}
end

return StoryExplorer
