local IMAGES = require "@constants/images"
local use_theme = require "@contexts/theme/use-theme"
local themes = require "@themes"
local search_input = require "@ui/components/inputs/search-input"
local icon_button = require "@ui/elements/icon-button"
local corner = require "@ui/styles/corner"
local div = require "@ui/styles/div"
local frame = require "@ui/styles/frame"
local padding = require "@ui/styles/padding"
local text = require "@ui/styles/text"

type TitleBarProps = {
	--- called with what is typed in the search, an empty string when it is cleared
	searched: (input: string) -> (),
	closed: () -> (),
	corner_radius: number,
	order: number?,
}

local BAR_HEIGHT = 42
local CLOSE_SIZE = 18
-- lines the search up with the settings, past the category list
local SEARCH_OFFSET = 190
local SEARCH_SIZE = Vector2.new(350, 26)

local function title_bar(props: TitleBarProps)
	local theme = use_theme()
	local background = theme(themes.background3)

	return frame {
		Name = "title_bar",
		Size = UDim2.new(1, 0, 0, BAR_HEIGHT),
		BackgroundColor3 = background,
		LayoutOrder = props.order,
		-- the search glow goes over the panels below
		ZIndex = 2,

		corner { radius = props.corner_radius },
		-- only the top corners are an edge of the settings panel, this squares the bottom ones
		frame {
			Name = "bottom_squarer",
			AnchorPoint = Vector2.new(0, 1),
			Position = UDim2.fromScale(0, 1),
			Size = UDim2.new(1, 0, 0, props.corner_radius),
			BackgroundColor3 = background,
		},
		div {
			Name = "contents",

			padding { paddingx = 15 },
			text {
				Name = "title",
				Text = "Settings",
				TextSize = 18,
				weight = Enum.FontWeight.Bold,
				AutomaticSize = Enum.AutomaticSize.X,
			},
			search_input {
				placeholder = "Search Settings...",
				background = background,
				changed = props.searched,
				native = {
					Name = "settings_search",
					AnchorPoint = Vector2.new(0, 0.5),
					Position = UDim2.new(0, SEARCH_OFFSET, 0.5, 0),
					Size = UDim2.fromOffset(SEARCH_SIZE.X, SEARCH_SIZE.Y),
				},
			},
			div {
				Name = "close_holder",
				AnchorPoint = Vector2.new(1, 0.5),
				Position = UDim2.fromScale(1, 0.5),
				Size = UDim2.fromOffset(CLOSE_SIZE, CLOSE_SIZE),

				icon_button {
					name = "close_button",
					icon = IMAGES.close,
					size = CLOSE_SIZE,
					icon_size = CLOSE_SIZE,
					activated = props.closed,
				},
			},
		},
	}
end

return title_bar
