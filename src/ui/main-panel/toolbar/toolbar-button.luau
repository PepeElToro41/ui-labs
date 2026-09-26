local use_theme = require "@contexts/theme/use-theme"
local vide = require "@pkg/vide"
local themes = require "@themes"
local hover_hint = require "@ui/overlays/hover-hint"
local click_detector = require "@ui/styles/click-detector"
local corner = require "@ui/styles/corner"
local frame = require "@ui/styles/frame"
local image = require "@ui/styles/image"
local actions = require "@utils/vide/actions"
local derivers = require "@utils/vide/derivers"

local read = vide.read

type ToolbarButtonProps = {
	name: string?,
	icon: string,
	order: number?,
	--- shown next to the button while it is hovered
	hint: string?,
	--- whether the toolbar is hovered, the button can only be hovered while it is
	toolbar_hovered: Reactive<boolean>?,
	-- when disabled the icon grays out and clicks are ignored
	disabled: Derivable<boolean>?,
	activated: () -> (),
}

local BUTTON_SIZE = 30
local ICON_SIZE = 18

-- the toolbar sits at the left of the story, so the hint goes to the right unless it doesnt fit
local HINT_ANCHOR = {
	Vector2.new(2, 0.5),
	Vector2.new(-1, 0.5),
}
local HINT_PADDING = 6

local function toolbar_button(props: ToolbarButtonProps)
	local theme = use_theme()
	local hovered = vide.source(false)

	local disabled = function()
		return read(props.disabled) == true
	end
	local hover_active = function()
		return hovered() and not disabled()
	end
	local transparency = vide.spring(derivers.boolean(hover_active, 0, 1), 0.25, 1)

	-- MouseLeave does not fire when the toolbar gets hidden, the hint would stay
	vide.effect(function()
		if props.toolbar_hovered and not props.toolbar_hovered() then
			hovered(false)
		end
	end)

	return frame {
		Name = props.name or "toolbar_button",
		Size = UDim2.fromOffset(BUTTON_SIZE, BUTTON_SIZE),
		LayoutOrder = props.order,
		BackgroundTransparency = transparency,
		BackgroundColor3 = theme(themes.background4),

		corner {},
		image {
			Name = "icon",
			Image = props.icon,
			Size = UDim2.fromOffset(ICON_SIZE, ICON_SIZE),
			Position = UDim2.fromScale(0.5, 0.5),
			AnchorPoint = Vector2.new(0.5, 0.5),
			ImageColor3 = function()
				return if disabled() then theme().text3 else theme().text1
			end,
			ImageTransparency = function()
				return if disabled() then 0.4 else 0
			end,
		},
		click_detector {
			Activated = function()
				if disabled() then
					return
				end
				props.activated()
			end,

			actions.hovered(hovered),
		},
		-- disabled buttons keep their hint, it still tells what the button is
		hover_hint {
			hovered = hovered,
			text = props.hint,
			anchor = HINT_ANCHOR,
			padding = HINT_PADDING,
		},
	}
end

return toolbar_button
