local Vide = require "@pkg/vide"

local Div = require "@styles/div"
local Padding = require "@styles/padding"
local TextInput = require "@styles/text-input"
local Frame = require "@styles/frame"
local Image = require "@styles/image"
local Corner = require "@styles/corner"
local LeftList = require "@styles/list/left"
local InputGlow = require "@ui/elements/input-glow"

local IMAGES = require "@constants/images"
local useTheme = require("@contexts/theme").useTheme
local Changed = require("@actions").Changed

local source = Vide.source
local create = Vide.create

type StorySearchProps = {
	OnFilterChange: (filter: string) -> (),
}

function StorySearch(props: StorySearchProps)
	local theme = useTheme()
	local focused = source(false)
	local focusAlpha = InputGlow.useFocusAlpha(focused)

	return Div {
		Name = "StorySearch",
		Size = UDim2.new(1, 0, 0, 25),
		Padding { PaddingX = 2 },
		Frame {
			Name = "SearchInput",
			BackgroundColor3 = theme "Background2",
			ZIndex = 2,

			Padding { PaddingX = 6 },
			Corner { Radius = 8 },
			LeftList { VerticalAlignment = Enum.VerticalAlignment.Center, Gap = 4 },
			create "UIStroke" {
				Thickness = 1,
				Color = function()
					return theme().Border:Lerp(theme().Emphasis, focusAlpha())
				end,
				Transparency = 0.5,
			},
			Image {
				Image = IMAGES.Search,
				Size = UDim2.fromOffset(14, 14),
				ImageColor3 = function()
					return theme().Text2:Lerp(theme().Text1, focusAlpha())
				end,
			},
			TextInput {
				LayoutOrder = 2,
				TextSize = 13,
				TextXAlignment = Enum.TextXAlignment.Left,
				TextColor3 = theme "Text1",
				ClipsDescendants = true,
				PlaceholderText = "Search Story...",
				PlaceholderColor3 = theme "Text2",

				GetFocused = focused,
				Changed("Text", props.OnFilterChange),
				create "UIFlexItem" { FlexMode = Enum.UIFlexMode.Fill },
			},
		},
		InputGlow.InputGlow {
			Focused = focused,
		},
	}
end

return StorySearch
