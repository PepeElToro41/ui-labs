local Vide = require "@pkg/vide"

local IMAGES = require "@constants/images"
local useNodeName = require("../utils").useNodeName
local useTheme = require("@contexts/theme").useTheme
local Divisor = require "@ui/elements/divisor"

local Div = require "@styles/div"
local Frame = require "@styles/frame"
local Padding = require "@styles/padding"
local LeftList = require "@styles/list/left"
local Text = require "@styles/text"
local Image = require "@styles/image"
local Corner = require "@styles/corner"
local Detector = require "@styles/detector"

local source = Vide.source

type StoryProps = {
	Node: Reactive<StoryNode>,
	LayoutOrder: Reactive<number>,
	IsChild: boolean?,
}

function Story(props: StoryProps)
	local theme = useTheme()
	local hovered = source(false)
	local name = useNodeName(props.Node)

	return Div {
		Name = name,
		LayoutOrder = props.LayoutOrder,
		Size = UDim2.new(1, 0, 0, 25),

		Div {
			Name = "Title",

			Padding { Left = 15, Right = 5 },
			Frame {
				Name = "Display",
				BackgroundColor3 = theme "Background3",
				BackgroundTransparency = function()
					return hovered() and 0 or 1
				end,

				Padding { PaddingX = 6 },
				Corner { Radius = 6 },
				LeftList { VerticalAlignment = Enum.VerticalAlignment.Center, Gap = 6 },
				Image {
					Image = IMAGES.Story,
					ImageColor3 = theme "Story",
					Size = UDim2.fromOffset(13, 13),
				},
				Text {
					Size = UDim2.new(1, -19, 1, 0),
					TextXAlignment = Enum.TextXAlignment.Left,
					Text = name,
					AutomaticSize = Enum.AutomaticSize.X,
				},
			},
		},
		Divisor {
			Direction = "X",
			Visible = not not props.IsChild,
			Anchor = 0,
			Position = UDim2.new(0, -6, 0.5, 0),
			Size = UDim.new(0, 6),
		},
		Image {
			Image = IMAGES.Dot,
			ImageColor3 = theme "Text",
			Size = UDim2.fromOffset(6, 6),
			Position = UDim2.new(0, 8, 0.5, 0),
			AnchorPoint = Vector2.new(0, 0.5),
			ImageTransparency = 0.8,
		},
		Detector {
			Hovered = hovered,
		},
	}
end

return Story
