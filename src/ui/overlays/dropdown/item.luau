local use_theme = require "@contexts/theme/use-theme"
local vide = require "@pkg/vide"
local themes = require "@themes"
local click_detector = require "@ui/styles/click-detector"
local corner = require "@ui/styles/corner"
local div = require "@ui/styles/div"
local frame = require "@ui/styles/frame"
local image = require "@ui/styles/image"
local padding = require "@ui/styles/padding"
local text = require "@ui/styles/text"
local actions = require "@utils/vide/actions"
local videx = require "@utils/vide/videx"

export type DropdownItemProps = {
	text: Derivable<string>,
	--- optional text shown at the right side, usually a keyboard shortcut
	shortcut: Derivable<string?>?,
	--- optional icon shown at the right edge, usually an arrow for nested dropdowns
	icon: Derivable<string?>?,

	order: number?,
	--- a disabled item is greyed out, never hovers and never activates
	disabled: Derivable<boolean>?,
	--- called when the item is clicked
	activated: (() -> ())?,
	--- optional source that receives the hovered state of the item
	hovered: Source<boolean>?,

	--- extra properties that get applied to the item frame
	native: vide.vFrame?,
}

local ITEM_HEIGHT = 26
local ITEM_PADDING = 6
local CORNER_RADIUS = 6
local ICON_SIZE = 16

local function dropdown_item(props: DropdownItemProps)
	local theme = use_theme()
	local hovered = props.hovered or vide.source(false)

	local disabled = function()
		return vide.read(props.disabled) == true
	end
	local hover_transparency = vide.spring(function()
		return if hovered() and not disabled() then 0 else 1
	end, 0.1, 1)

	local function on_activated()
		if disabled() then
			return
		end
		if props.activated then
			props.activated()
		end
	end

	return div {
		Name = "dropdown_item",
		Size = UDim2.new(1, 0, 0, ITEM_HEIGHT),
		LayoutOrder = props.order,
		props.native or {},

		frame {
			Name = "hover",
			BackgroundColor3 = theme(themes.background4),
			BackgroundTransparency = hover_transparency,

			corner {
				radius = CORNER_RADIUS,
			},
		},
		div {
			Name = "contents",

			padding {
				paddingx = ITEM_PADDING,
			},
			text {
				Name = "label",
				Size = UDim2.fromScale(1, 1),
				ClipsDescendants = true,
				Text = props.text,
				TextColor3 = function()
					return theme()[if disabled() then themes.text3 else themes.text1]
				end,
				TextXAlignment = Enum.TextXAlignment.Left,
			},
			videx.show(props.shortcut, function()
				return text {
					Name = "shortcut",
					Size = UDim2.fromScale(1, 1),
					ClipsDescendants = true,
					Text = props.shortcut :: Derivable<string>,
					TextColor3 = theme(themes.text3),
					TextXAlignment = Enum.TextXAlignment.Right,
				}
			end),
			videx.show(props.icon, function()
				return image {
					Name = "icon",
					AnchorPoint = Vector2.new(1, 0.5),
					Position = UDim2.new(1, 2, 0.5, 0),
					Size = UDim2.fromOffset(ICON_SIZE, ICON_SIZE),
					Image = props.icon :: Derivable<string>,
				}
			end),
		},
		click_detector {
			Activated = on_activated,

			actions.hovered(hovered),
		},
	}
end

return dropdown_item
