local use_theme = require "@contexts/theme/use-theme"
local vide = require "@pkg/vide"
local themes = require "@themes"
local border = require "@ui/elements/border"
local corner = require "@ui/styles/corner"
local frame = require "@ui/styles/frame"
local top_list = require "@ui/styles/list/top-list"
local padding = require "@ui/styles/padding"

export type DropdownProps = {
	--- fixed width of the dropdown, height is content driven
	width: number?,

	--- extra properties that get applied to the dropdown frame
	native: vide.vFrame?,

	--- dropdown children, usually `dropdown/item` and `dropdown/divider`
	children: any?,
}

local DEFAULT_WIDTH = 215
local CORNER_RADIUS = 6
local INNER_PADDING = 4
local ITEM_GAP = 1

local function dropdown(props: DropdownProps)
	local theme = use_theme()

	return frame {
		Name = "dropdown",
		AutomaticSize = Enum.AutomaticSize.Y,
		Size = UDim2.fromOffset(props.width or DEFAULT_WIDTH, 0),
		BackgroundColor3 = theme(themes.background2),
		BackgroundTransparency = 0.1,
		props.native or {},

		corner {
			radius = CORNER_RADIUS,
		},
		border {},
		padding {
			padding = INNER_PADDING,
		},
		top_list {
			gap = ITEM_GAP,
			HorizontalAlignment = Enum.HorizontalAlignment.Center,
		},

		props.children or {},
	}
end

return dropdown
