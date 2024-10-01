local Vide = require "@pkg/vide"

local Div = require "@styles/div"
local Padding = require "@styles/padding"
local TextInput = require "@styles/text-input"
local Frame = require "@styles/frame"
local Image = require "@styles/image"
local Rounder = require "@styles/rounder"
local LeftList = require "@styles/list/left"

local IMAGES = require "@constants/images"
local useTheme = require("@contexts/theme").useTheme
local Lerp = require("@utils/number").Lerp
local Changed = require("@actions").Changed

local source = Vide.source
local spring = Vide.spring
local create = Vide.create

type StorySearchProps = {
	OnFilterChange: (filter: string) -> (),
}

function StorySearch(props: StorySearchProps)
	local theme = useTheme()
	local focused = source(false)
	local focusAlpha = spring(function()
		local asd = if focused() then 1 else 0
		return asd
	end, 0.4)

	return Div {
		Name = "StorySearch",
		Size = UDim2.new(1, 0, 0, 25),
		Padding { PaddingX = 2 },
		Frame {
			Name = "SearchInput",
			BackgroundColor3 = theme "Background2",
			ZIndex = 2,

			Padding { PaddingX = 6 },
			Rounder(),
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
					return theme().TextDisabled:Lerp(theme().Text, focusAlpha())
				end,
			},
			TextInput {
				LayoutOrder = 2,
				TextSize = 13,
				TextXAlignment = Enum.TextXAlignment.Left,
				TextColor3 = theme "Text",
				ClipsDescendants = true,
				PlaceholderText = "Search Story...",
				PlaceholderColor3 = theme "TextDisabled",

				GetFocused = focused,
				Changed("Text", props.OnFilterChange),

				create "UIFlexItem" { FlexMode = Enum.UIFlexMode.Fill },
			},
		},
		Image {
			Name = "Aura",
			AnchorPoint = Vector2.new(0.5, 0.5),
			Position = UDim2.fromScale(0.5, 0.5),
			Size = UDim2.new(1, 12, 1, 12),

			Image = "rbxassetid://12052609860",
			ImageColor3 = theme "Emphasis",
			ImageTransparency = function()
				return Lerp(1, 0.5, focusAlpha())
			end,

			ScaleType = Enum.ScaleType.Slice,
			SliceCenter = Rect.new(300, 300, 300, 300),
		},
	}
end

return StorySearch
