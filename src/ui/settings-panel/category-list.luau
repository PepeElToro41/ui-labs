local use_theme = require "@contexts/theme/use-theme"
local themes = require "@themes"
local corner = require "@ui/styles/corner"
local div = require "@ui/styles/div"
local frame = require "@ui/styles/frame"
local top_list = require "@ui/styles/list/top-list"
local padding = require "@ui/styles/padding"
local category_button = require "./category-button"
local settings_config = require "./settings-config"

type CategoryListProps = {
	categories: { settings_config.Category },
	--- key of the category being shown
	active: Reactive<string>,
	--- settings listed for each category key, the ones that match while searching
	counts: Reactive<{ [string]: number }>,
	searching: Reactive<boolean>,
	corner_radius: number,
	order: number?,
	selected: (key: string) -> (),
}

local PANEL_WIDTH = 200

local function category_list(props: CategoryListProps)
	local theme = use_theme()
	local background = theme(themes.background1)

	local buttons = {}
	for index, category in props.categories do
		local count = function()
			return props.counts()[category.key] or 0
		end

		buttons[index] = category_button {
			name = category.name,
			order = index,
			count = count,
			selected = function()
				return props.active() == category.key
			end,
			-- an empty category is still reachable without a search, it just has nothing yet
			disabled = function()
				return props.searching() and count() == 0
			end,
			activated = function()
				props.selected(category.key)
			end,
		}
	end

	return frame {
		Name = "category_list",
		Size = UDim2.new(0, PANEL_WIDTH, 1, 0),
		BackgroundColor3 = background,
		LayoutOrder = props.order,

		corner { radius = props.corner_radius },
		-- only the bottom left corner is an edge of the settings panel, these square the rest
		frame {
			Name = "top_squarer",
			Size = UDim2.new(1, 0, 0, props.corner_radius),
			BackgroundColor3 = background,
		},
		frame {
			Name = "right_squarer",
			AnchorPoint = Vector2.new(1, 0),
			Position = UDim2.fromScale(1, 0),
			Size = UDim2.new(0, props.corner_radius, 1, 0),
			BackgroundColor3 = background,
		},
		div {
			Name = "categories",

			padding {
				left = 14,
				right = 10,
				paddingy = 10,
			},
			top_list { gap = 6 },
			buttons,
		},
	}
end

return category_list
