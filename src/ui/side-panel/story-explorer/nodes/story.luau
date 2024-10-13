local Vide = require "@pkg/vide"
local useAtom = require("@utils/charm").useAtom
local PreviewsSystem = require("@system/previews")
local PreviewsConsumers = require("@store/story-previews/consume")

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
local derive = Vide.derive

type StoryProps = {
	Node: Reactive<StoryNode>,
	LayoutOrder: Reactive<number>,
	IsChild: boolean?,
}

function Story(props: StoryProps)
	local hovered = source(false)
	local theme = useTheme()
	local name = useNodeName(props.Node)
	local module = function()
		return props.Node().Module
	end

	local rootPreview = useAtom(PreviewsConsumers.RootPreview)

	local isRoot = function()
		local rootPreview = rootPreview()
		if not rootPreview then return false end
		return rootPreview.Module == module()
	end

	local totalPreviews = useAtom(function()
		return PreviewsConsumers.PreviewsAmount(module())
	end, module)
	local textColor = function()
		return isRoot() and theme().TextActive1 or theme().Text1
	end
	local amountsTextColor = function()
		return isRoot() and theme().TextActive3 or theme().Text3
	end

	local function OnStoryClicked()
		PreviewsSystem.ToggleRootStory(props.Node().Module)
	end

	return Div {
		Name = name,
		LayoutOrder = props.LayoutOrder,
		Size = UDim2.new(1, 0, 0, 27),

		Div {
			Name = "Title",

			Padding { Left = 13, Right = 5 },
			Frame {
				Name = "Display",
				BackgroundColor3 = function()
					return isRoot() and theme().Emphasis or theme().Background3
				end,
				BackgroundTransparency = function()
					return (hovered() or isRoot()) and 0 or 1
				end,

				Padding { Left = 8, Right = 7 },
				Corner { Padding = 10 },

				Div {
					LeftList { VerticalAlignment = Enum.VerticalAlignment.Center, Gap = 6 },
					Image {
						Image = IMAGES.Story,
						ImageColor3 = function()
							return isRoot() and theme().TextActive1 or theme().Story
						end,
						Size = UDim2.fromOffset(13, 13),
					},
					Text {
						Size = UDim2.new(1, -35, 1, 0),
						TextXAlignment = Enum.TextXAlignment.Left,
						ClipsDescendants = true,
						Text = name,
						TextColor3 = textColor,
					},
				},
				Text {
					Position = UDim2.new(1, -3, 0.5, 0),
					AnchorPoint = Vector2.new(1, 0.5),
					Size = UDim2.new(0, 5, 1, 0),
					TextSize = 12,
					Text = totalPreviews,
					TextColor3 = amountsTextColor,
					Visible = function()
						return totalPreviews() > 0
					end,
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
			ImageColor3 = theme "Text1",
			Size = UDim2.fromOffset(6, 6),
			Position = UDim2.new(0, 6, 0.5, 0),
			AnchorPoint = Vector2.new(0, 0.5),
			ImageTransparency = 0.8,
		},
		Detector {
			Hovered = hovered,
			MouseButton1Click = OnStoryClicked,
		},
	}
end

return Story
