local use_theme = require "@contexts/theme/use-theme"
local vide = require "@pkg/vide"
local interaction_hover = require "@ui/elements/interaction-hover"
local click_detector = require "@ui/styles/click-detector"
local div = require "@ui/styles/div"
local image = require "@ui/styles/image"
local actions = require "@utils/vide/actions"

local read = vide.read

type IconButtonProps = {
	name: string?,
	icon: string,
	size: number,
	icon_size: number,
	order: number?,
	-- when disabled the icon grays out and clicks are ignored
	disabled: Derivable<boolean>?,
	activated: () -> (),
}

local function icon_button(props: IconButtonProps)
	local theme = use_theme()
	local hovered = vide.source(false)

	local disabled = function()
		return read(props.disabled) == true
	end
	local hover_active = function()
		return hovered() and not disabled()
	end

	return div {
		Name = props.name or "icon_button",
		Size = UDim2.fromOffset(props.size, props.size),
		LayoutOrder = props.order,

		interaction_hover {
			hovered = hover_active,
			extends = 4,
			corner = 6,
			hide_unactive = true,
		},
		image {
			Name = "icon",
			Image = props.icon,
			Size = UDim2.fromOffset(props.icon_size, props.icon_size),
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
	}
end

return icon_button
