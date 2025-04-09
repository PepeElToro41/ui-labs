local Vide = require "@pkg/vide"

local source = Vide.source
local changed = Vide.changed
local spring = Vide.spring
local effect = Vide.effect
local constant = require("@utils/vide").constant

local StoryPreviews = require "@store/story-previews"
local useTheme = require("@contexts/theme").useTheme
local RemoveExtension = require("@contexts/module-search/utils").RemoveExtension
local CONFIGS = require "@constants/configs"
local IMAGES = require "@constants/images"

local Frame = require "@base/frame"
local Div = require "@base/div"
local Image = require "@base/image"
local Padding = require "@base/padding"
local LeftList = require "@base/list/left"
local Corner = require "@base/corner"
local Text = require "@base/text"

local Shadow = require "@ui/elements/shadow"

type StoryPreview = StoryPreviews.StoryPreview

type PreviewEntryProps = {
	Preview: Reactive<StoryPreview>,
}

function PreviewEntry(props: PreviewEntryProps)
	local theme = useTheme()
	local previewArea = source(0)
	local previewSize = spring(previewArea, 0.2, 1)

	return Div {
		ClipsDescendants = true,
		Size = function()
			return UDim2.new(0, math.round(previewSize()), 1, 0)
		end,

		Frame {
			Size = UDim2.fromScale(0, 1),
			AutomaticSize = Enum.AutomaticSize.X,
			BackgroundColor3 = theme "Emphasis",
			changed("AbsoluteSize", function(size)
				previewArea(size.X)
			end),

			LeftList { Gap = 6, VerticalAlignment = Enum.VerticalAlignment.Center },
			Padding { PaddingX = 10 },
			Corner(),
			Text {
				TextColor3 = theme "TextInverted1",
				Size = UDim2.fromScale(0, 1),
				AutomaticSize = Enum.AutomaticSize.X,
				Text = function()
					local name = props.Preview().Module.Name
					return RemoveExtension(name, CONFIGS.Extensions.Story)
				end,
			},
			Image {
				Image = IMAGES.Close,
				Size = UDim2.fromOffset(12, 12),
				ImageColor3 = theme "TextInverted1",
			},
		},
		Shadow {
			Blur = 0.8,
			Position = Vector2.zero,
			ZIndex = -1,
			Transparency = 0.3,
			Extends = Vector2.new(14, 14),
		},
	}
end

return PreviewEntry
