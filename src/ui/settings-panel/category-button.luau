local use_theme = require "@contexts/theme/use-theme"
local vide = require "@pkg/vide"
local click_detector = require "@ui/styles/click-detector"
local corner = require "@ui/styles/corner"
local div = require "@ui/styles/div"
local frame = require "@ui/styles/frame"
local padding = require "@ui/styles/padding"
local text = require "@ui/styles/text"
local actions = require "@utils/vide/actions"
local derivers = require "@utils/vide/derivers"

type CategoryButtonProps = {
	name: string,
	--- how many settings of the category are listed, the ones that match while searching
	count: Reactive<number>,
	selected: Reactive<boolean>,
	--- grayed out and not clickable, a category with nothing to show
	disabled: Reactive<boolean>,
	order: number?,
	activated: () -> (),
}

local COUNT_SIZE = 20

local function category_button(props: CategoryButtonProps)
	local theme = use_theme()
	local hovered = vide.source(false)

	local select_alpha = vide.spring(derivers.boolean(props.selected, 1, 0), 0.2, 1)

	local text_color = function()
		return theme().text2:Lerp(theme().text_active1, select_alpha())
	end
	local text_transparency = function()
		return if props.disabled() then 0.6 else 0
	end

	return div {
		Name = props.name,
		Size = UDim2.new(1, 0, 0, 28),
		LayoutOrder = props.order,

		frame {
			Name = "background",
			BackgroundColor3 = function()
				return theme().border:Lerp(theme().emphasis, select_alpha())
			end,
			BackgroundTransparency = function()
				local unselected = if hovered() and not props.disabled() then 0.85 else 1
				return math.lerp(unselected, 0, select_alpha())
			end,

			corner { radius = 6 },
		},
		div {
			Name = "contents",

			padding { paddingx = 6 },
			text {
				Name = "name",
				Text = props.name,
				Size = UDim2.new(1, -(COUNT_SIZE + 6), 1, 0),
				TextColor3 = text_color,
				TextTransparency = text_transparency,
				TextXAlignment = Enum.TextXAlignment.Left,
				TextTruncate = Enum.TextTruncate.AtEnd,
			},
			frame {
				Name = "count",
				AnchorPoint = Vector2.new(1, 0.5),
				Position = UDim2.fromScale(1, 0.5),
				Size = UDim2.fromOffset(COUNT_SIZE, COUNT_SIZE),
				-- light over the panel, dark over the selected background
				BackgroundColor3 = function()
					return theme().pure_inverted:Lerp(theme().pure, select_alpha())
				end,
				BackgroundTransparency = function()
					return math.lerp(0.9, 0.85, select_alpha())
				end,

				corner { radius = 8 },
				text {
					Text = function()
						return tostring(props.count())
					end,
					Size = UDim2.fromScale(1, 1),
					TextSize = 12,
					TextColor3 = text_color,
					TextTransparency = text_transparency,
				},
			},
		},
		click_detector {
			Activated = function()
				if props.disabled() then
					return
				end
				props.activated()
			end,

			actions.hovered(hovered),
		},
	}
end

return category_button
