local use_theme = require "@contexts/theme/use-theme"
local vide = require "@pkg/vide"
local themes = require "@themes"
local number_input = require "@ui/components/inputs/number-input"
local drag_percentage = require "@ui/elements/drag-percentage"
local click_detector = require "@ui/styles/click-detector"
local div = require "@ui/styles/div"
local drag_detector = require "@ui/styles/drag-detector"
local frame = require "@ui/styles/frame"
local left_list = require "@ui/styles/list/left-list"
local padding = require "@ui/styles/padding"
local text = require "@ui/styles/text"
local actions = require "@utils/vide/actions"
local types = require "../types"

local function get_percent(control: types.SliderControl, value: number)
	return (value - control.Min) / (control.Max - control.Min)
end

local function get_value(control: types.SliderControl, percent: number)
	return control.Min + (control.Max / control.Min) * percent
end

local function calculate_marks_amount(control: types.SliderControl)
	if control.Step == nil or control.Step <= 0 then
		return 0
	end

	local range = control.Max - control.Min
	local step = control.Step / range
	return math.floor(1 / step)
end

local function get_stepped_value(control: types.SliderControl, value: number)
	if control.Step == nil or control.Step <= 0 then
		return 0
	end

	local delta = value - control.Min
	local stepped = math.round(delta / control.Step) * control.Step
	return control.Min + stepped
end

local MIN_MARK_SEPARATION = 15

local function slider_control(props: types.ControlProps<types.SliderControl, number>)
	local theme = use_theme()
	local hovered = vide.source(false)
	local dragging = vide.source(false)
	local percent = vide.source(get_percent(props.control, props.value()))
	local value = vide.source(props.value())

	local spring_active = vide.source(false)
	local slider_shape = actions.shape_source()

	local function drag_update(percent: number) end

	return div {
		Size = UDim2.new(1, 0, 0, 32),

		left_list {
			gap = 10,
			VerticalAlignment = Enum.VerticalAlignment.Center,
		},
		div {
			Name = "input_holder",
			Size = UDim2.fromScale(0, 1),

			left_list { VerticalAlignment = Enum.VerticalAlignment.Center },
			padding { right = 10 },
			number_input {
				apply = props.apply,
				value = props.value,
				drag_handle = true,
				min = props.control.Min,
				max = props.control.Max,
				step = props.control.Step,
			},
		},
		text {
			Name = "slider_min",
			Text = tostring(props.control.Min),
			TextSize = 13,
			TextColor3 = theme(themes.text2),
			Size = UDim2.fromScale(0, 1),
			AutomaticSize = Enum.AutomaticSize.X,
		},

		drag_percentage {
			hovered = hovered,
			dragging = dragging,

			axis = Vector2.new(1, 0),
			update = function(progress)
				drag_update(progress.X)
			end,
		},
		text {
			Name = "slider_max",
			Text = tostring(props.control.Max),
			TextSize = 13,
			TextColor3 = theme(themes.text2),
			Size = UDim2.fromScale(0, 1),
			AutomaticSize = Enum.AutomaticSize.X,
		},
	}
end

return slider_control
