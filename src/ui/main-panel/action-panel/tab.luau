local use_theme = require "@contexts/theme/use-theme"
local vide = require "@pkg/vide"
local themes = require "@themes"
local measured_frame = require "@ui/holders/measured-frame"
local click_detector = require "@ui/styles/click-detector"
local corner = require "@ui/styles/corner"
local frame = require "@ui/styles/frame"
local padding = require "@ui/styles/padding"
local text = require "@ui/styles/text"
local actions = require "@utils/vide/actions"
local derivers = require "@utils/vide/derivers"

type ActionTabProps = {
	name: string,
	order: number?,
	visible: Reactive<boolean>?,
	selected: Reactive<boolean>,
	activated: () -> (),
}

local PADDING_X = 10
local HOVER_INSET = 8
local INDICATOR_THICKNESS = 2

local function action_tab(props: ActionTabProps)
	local theme = use_theme()
	local hovered = vide.source(false)

	local hover_alpha = vide.spring(derivers.boolean(hovered, 1, 0), 0.15, 1)
	local select_alpha = vide.spring(derivers.boolean(props.selected, 1, 0), 0.25, 1)

	local text_color = function()
		local colors = theme()
		local idle = colors.text3:Lerp(colors.text2, hover_alpha())
		return idle:Lerp(colors.text1, select_alpha())
	end

	return measured_frame {
		outer_children = {
			frame {
				Name = "hover",
				-- under the label, equal ZIndex siblings have no reliable order
				ZIndex = 0,
				AnchorPoint = Vector2.new(0.5, 0.5),
				Position = UDim2.fromScale(0.5, 0.5),
				Size = UDim2.new(1, 0, 1, -HOVER_INSET),
				BackgroundColor3 = theme(themes.background4),
				BackgroundTransparency = derivers.lerp(hover_alpha, 1, 0.3),

				corner { radius = 6 },
			},
			-- grows from the center, it sits over the header divisor so the tab reads as attached to the content
			frame {
				Name = "indicator",
				AnchorPoint = Vector2.new(0.5, 1),
				Position = UDim2.fromScale(0.5, 1),
				Size = function()
					return UDim2.new(select_alpha(), 0, 0, INDICATOR_THICKNESS)
				end,
				BackgroundColor3 = theme(themes.emphasis),
				Visible = function()
					return select_alpha() > 0.01
				end,
				ZIndex = 3,

				corner { radius = INDICATOR_THICKNESS },
			},
			click_detector {
				Activated = props.activated,
				actions.hovered(hovered),
			},
		} :: Array<Instance>,
		outer_native = {
			-- the list skips it, the other tabs close the gap
			Visible = props.visible,
		},
		native = {
			Name = props.name,
			AutomaticSize = Enum.AutomaticSize.X,
			Size = UDim2.fromScale(0, 1),
			LayoutOrder = props.order,

			padding { paddingx = PADDING_X },
			text {
				Name = "label",
				Text = props.name,
				TextColor3 = text_color,
				TextSize = 13,
				AutomaticSize = Enum.AutomaticSize.X,
				Size = UDim2.fromScale(0, 1),
			},
		},
	}
end

return action_tab
