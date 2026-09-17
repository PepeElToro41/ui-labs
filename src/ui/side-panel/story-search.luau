local IMAGES = require "@constants/images"
local use_filter_search = require "@contexts/filter-search/use-filter-search"
local use_theme = require "@contexts/theme/use-theme"
local vide = require "@pkg/vide"
local themes = require "@themes"
local glow = require "@ui/elements/glow"
local corner = require "@ui/styles/corner"
local div = require "@ui/styles/div"
local flex_fill = require "@ui/styles/flex-fill"
local frame = require "@ui/styles/frame"
local image = require "@ui/styles/image"
local left_list = require "@ui/styles/list/left-list"
local padding = require "@ui/styles/padding"
local text_input = require "@ui/styles/text-input"
local actions = require "@utils/vide/actions"
local derivers = require "@utils/vide/derivers"

local GLOW_EXTENDS = Vector2.new(15, 15)

local function story_search(props: {}?)
	local theme = use_theme()
	local filter = use_filter_search()

	local focused = vide.source(false)
	local focus_alpha = vide.spring(derivers.boolean(focused, 1, 0), 0.3, 1)

	local function on_text_changed(input: string)
		filter(if input == "" then nil else input)
	end

	return div {
		Name = "story_search",
		Size = UDim2.new(1, 0, 0, 27),

		padding {
			paddingx = 2,
		},
		frame {
			Name = "search_input",
			BackgroundColor3 = theme(themes.background2),
			ZIndex = 2,

			padding {
				paddingx = 6,
			},
			corner {
				radius = 8,
			},
			left_list {
				VerticalAlignment = Enum.VerticalAlignment.Center,
				gap = 4,
			},
			vide.create "UIStroke" {
				Thickness = 1,
				Transparency = function()
					return math.lerp(0.8, 0.5, focus_alpha())
				end,
				Color = function()
					return theme().border:Lerp(theme().emphasis, focus_alpha())
				end,
			},
			image {
				Name = "icon",
				Image = IMAGES.search,
				Size = UDim2.fromOffset(14, 14),
				ImageColor3 = function()
					return theme().text2:Lerp(theme().text1, focus_alpha())
				end,
			},
			text_input {
				LayoutOrder = 2,
				TextSize = 13,
				TextXAlignment = Enum.TextXAlignment.Left,
				TextColor3 = theme(themes.text1),
				PlaceholderText = "Search Story...",
				PlaceholderColor3 = theme(themes.text2),
				ClearTextOnFocus = false,
				ClipsDescendants = true,

				actions.focused(focused),
				vide.changed("Text", on_text_changed),
				flex_fill() :: any,
			},
		},
		glow {
			name = "focus_glow",
			extends = GLOW_EXTENDS,
			blur = 0.8,
			color = theme(themes.emphasis),
			transparency = derivers.lerp(focus_alpha, 1, 0),
		},
	}
end

return story_search
