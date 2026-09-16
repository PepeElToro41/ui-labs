local IMAGES = require "@constants/images"
local use_theme = require "@contexts/theme/use-theme"
local vide = require "@pkg/vide"
local themes = require "@themes"
local divisor = require "@ui/elements/divisor"
local interaction_hover = require "@ui/elements/interaction-hover"
local measured_frame = require "@ui/holders/measured-frame"
local click_detector = require "@ui/styles/click-detector"
local div = require "@ui/styles/div"
local left_list = require "@ui/styles/list/left-list"
local padding = require "@ui/styles/padding"
local rounder = require "@ui/styles/rounder"
local text = require "@ui/styles/text"
local actions = require "@utils/vide/actions"
local icon_button = require "./icon-button"
local instance_label = require "./instance-label"

local Selection = game:GetService "Selection"

type ObjectHolderProps = {
	-- the instance currently assigned to the control
	object: Reactive<Instance?>,
	-- called when the clear button is clicked
	clear: () -> (),

	order: number?,
}

local HEIGHT = 26

-- shows the assigned instance, clicking it selects the instance in studio
local function object_holder(props: ObjectHolderProps)
	local theme = use_theme()
	local hovered = vide.source(false)

	local assigned = function()
		return props.object() ~= nil
	end

	local function select_object()
		local object = props.object()
		if not object then
			return
		end
		Selection:Set { object }
	end

	return measured_frame {
		outer_native = {
			interaction_hover {
				hovered = function()
					return hovered() and assigned()
				end,
				extends = 6,
				corner = UDim.new(1, 0),
			},
			click_detector {
				Activated = select_object,

				actions.hovered(hovered),
			},
		},
		native = {
			Name = "object_holder",
			Size = UDim2.fromOffset(0, HEIGHT),
			AutomaticSize = Enum.AutomaticSize.X,
			LayoutOrder = props.order,
			BackgroundTransparency = 0,
			BackgroundColor3 = theme(themes.background4),

			rounder(),
			div {
				Name = "contents",
				Size = UDim2.fromScale(0, 1),
				AutomaticSize = Enum.AutomaticSize.X,
				ZIndex = 2,

				left_list {
					gap = 6,
					VerticalAlignment = Enum.VerticalAlignment.Center,
				},
				padding { paddingx = 8 },

				vide.show(assigned, function()
					return {
						instance_label {
							instance = props.object,
							order = 1,
							icon_size = 16,
							min_width = 60,
							max_width = 230,
							native = {
								padding { right = 4 } :: any,
							},
						},
						divisor {
							direction = "Y",
							size = UDim.new(1, -10),
							order = 2,
						},
						icon_button {
							name = "clear_button",
							icon = IMAGES.close,
							size = 18,
							icon_size = 12,
							order = 3,
							activated = props.clear,
						},
					}
				end, function()
					return text {
						Name = "nothing_assigned",
						Text = "Nothing assigned",
						TextSize = 13,
						TextColor3 = theme(themes.text3),
						Size = UDim2.fromScale(0, 1),
						AutomaticSize = Enum.AutomaticSize.X,

						padding { paddingx = 4 },
					}
				end),
			},
		},
	}
end

return object_holder
