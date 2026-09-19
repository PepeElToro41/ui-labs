local IMAGES = require "@constants/images"
local use_theme = require "@contexts/theme/use-theme"
local vide = require "@pkg/vide"
local themes = require "@themes"
local divisor = require "@ui/elements/divisor"
local icon_button = require "@ui/elements/icon-button"
local div = require "@ui/styles/div"
local flex_fill = require "@ui/styles/flex-fill"
local frame = require "@ui/styles/frame"
local left_list = require "@ui/styles/list/left-list"
local right_list = require "@ui/styles/list/right-list"
local top_list = require "@ui/styles/list/top-list"
local padding = require "@ui/styles/padding"
local action_tab = require "@self/tab"

export type ActionTab = {
	--- identifies the tab in `selected`
	key: string,
	name: string,
	--- a hidden tab loses its button, and the selection when it had it. Always visible without it
	visible: Reactive<boolean>?,
	--- called once, the contents stay mounted while their tab is hidden so they keep their state
	render: () -> any,
}

type ActionPanelProps = {
	tabs: { ActionTab },
	--- key of the wanted tab, defaults to the first one
	selected: Source<string>?,
	--- called by the close button, the owner decides how the panel hides. No button without it
	closed: (() -> ())?,
}

local HEADER_HEIGHT = 32
local ACTIONS_WIDTH = 36

local function is_visible(tab: ActionTab): boolean
	return tab.visible == nil or tab.visible()
end

local function action_panel(props: ActionPanelProps)
	local theme = use_theme()

	local tabs = props.tabs
	local selected: Source<string> = props.selected or vide.source(if tabs[1] then tabs[1].key else "")

	-- the wanted tab can be hidden, the first visible one shows until it comes back
	local current = vide.derive(function(): string?
		local wanted = selected()
		local fallback: string? = nil
		for _, tab in tabs do
			if not is_visible(tab) then
				continue
			end
			if tab.key == wanted then
				return wanted
			end
			fallback = fallback or tab.key
		end
		return fallback
	end)

	local buttons: { Instance } = {}
	local contents: { Instance } = {}
	for index, tab in tabs do
		local tab_selected = function()
			return current() == tab.key
		end

		buttons[index] = action_tab {
			name = tab.name,
			order = index,
			visible = tab.visible,
			selected = tab_selected,
			activated = function()
				selected(tab.key)
			end,
		}
		contents[index] = div {
			Name = tab.key,
			Visible = tab_selected,

			tab.render(),
		}
	end

	return frame {
		Name = "action_panel",
		BackgroundColor3 = theme(themes.background3),
		ClipsDescendants = true,

		top_list {},
		frame {
			Name = "header",
			Size = UDim2.new(1, 0, 0, HEADER_HEIGHT),
			BackgroundColor3 = theme(themes.background2),
			LayoutOrder = 1,

			divisor {
				direction = "X",
				anchor = 0,
				position = UDim2.fromOffset(0, 1),
				size = UDim.new(1, 0),
				transparency = 0.95,
			},
			divisor {
				direction = "X",
				anchor = 0,
				position = UDim2.new(0, 0, 1, -1),
				size = UDim.new(1, 0),
				transparency = 0.8,
			},
			div {
				Name = "tabs",
				Size = UDim2.new(1, -ACTIONS_WIDTH, 1, 0),
				ClipsDescendants = true,
				-- over the divisor, the selected tab indicator covers it
				ZIndex = 2,

				padding { left = 6 },
				left_list { gap = 2 },
				buttons,
			},
			div {
				Name = "actions",
				AnchorPoint = Vector2.new(1, 0),
				Position = UDim2.fromScale(1, 0),
				Size = UDim2.new(0, ACTIONS_WIDTH, 1, 0),
				ZIndex = 2,

				padding { right = 9 },
				right_list {
					VerticalAlignment = Enum.VerticalAlignment.Center,
				},
				if props.closed
					then icon_button {
						name = "close",
						icon = IMAGES.close,
						size = 18,
						icon_size = 14,
						activated = props.closed,
					}
					else {},
			},
		},
		div {
			Name = "contents",
			LayoutOrder = 2,

			flex_fill(),
			contents,
		},
	}
end

return action_panel
