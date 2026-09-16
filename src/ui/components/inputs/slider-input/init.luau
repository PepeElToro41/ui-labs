local use_theme = require "@contexts/theme/use-theme"
local vide = require "@pkg/vide"
local step_marks = require "@self/step-marks"
local themes = require "@themes"
local drag_percentage = require "@ui/elements/drag-percentage"
local div = require "@ui/styles/div"
local frame = require "@ui/styles/frame"
local rounder = require "@ui/styles/rounder"
local actions = require "@utils/vide/actions"
local derivers = require "@utils/vide/derivers"

type SliderInputProps = {
	value: Reactive<number>,
	-- called while dragging
	update: ((value: number) -> ())?,
	-- called when the drag ends
	apply: (value: number) -> (),

	min: number,
	max: number,
	step: number?,

	native: vide.vFrame?,
}

local MIN_MARK_SEPARATION = 15

local function get_percent(props: SliderInputProps, value: number)
	local range = props.max - props.min
	if range == 0 then
		return 0
	end
	return math.clamp((value - props.min) / range, 0, 1)
end

local function get_value(props: SliderInputProps, percent: number)
	return props.min + (props.max - props.min) * percent
end

local function get_stepped_value(props: SliderInputProps, value: number)
	if not props.step or props.step <= 0 then
		return value
	end

	local delta = value - props.min
	local stepped = math.round(delta / props.step) * props.step
	return math.clamp(props.min + stepped, props.min, props.max)
end

local function calculate_marks_amount(props: SliderInputProps)
	if not props.step or props.step <= 0 then
		return 0
	end

	local range = props.max - props.min
	if range <= 0 then
		return 0
	end
	return math.floor(range / props.step)
end

local function slider_input(props: SliderInputProps)
	local theme = use_theme()
	local hovered = vide.source(false)
	local dragging = vide.source(false)
	local slider_size = vide.source(Vector2.zero)

	local percent = vide.source(get_percent(props, props.value()))

	-- follow the external value when not dragging
	vide.effect(function()
		local value = props.value()
		if vide.untrack(dragging) then
			return
		end
		percent(get_percent(props, value))
	end)

	local marks = calculate_marks_amount(props)
	local marks_visible = vide.derive(function()
		if marks == 0 then
			return false
		end

		local separation = math.floor(slider_size().X / marks)
		return separation >= MIN_MARK_SEPARATION
	end)

	local spring_percent = vide.spring(percent, 0.2, 1)
	local display_percent = function()
		-- when dragging freely (no marks to snap to) follow the mouse directly
		if dragging() and not marks_visible() then
			return percent()
		end
		return spring_percent()
	end

	local hover_size = vide.spring(function()
		if dragging() then
			return 34
		elseif hovered() then
			return 26
		else
			return 12
		end
	end, 0.3, 0.6)
	local handle_size = vide.spring(derivers.boolean(dragging, 20, 14), 0.2, 0.6)

	local function drag_update(new_percent: number)
		local value = get_stepped_value(props, get_value(props, new_percent))
		percent(get_percent(props, value))
		return value
	end

	return div {
		Name = "slider_input",
		Size = UDim2.new(1, 0, 0, 32),
		props.native or {},

		actions.absolute_size(slider_size),

		frame {
			Name = "slider",
			Size = UDim2.new(1, 0, 0, 4),
			AnchorPoint = Vector2.new(0, 0.5),
			Position = UDim2.fromScale(0, 0.5),
			BackgroundColor3 = theme(themes.background4),

			rounder(),
			vide.show(marks_visible, function()
				return step_marks {
					amount = marks,
					percent = display_percent,
				}
			end),
			frame {
				Name = "slider_progress",
				ZIndex = 2,
				Size = function()
					return UDim2.fromScale(display_percent(), 1)
				end,
				BackgroundColor3 = theme(themes.emphasis),

				rounder(),
				div {
					Name = "slider_handle",
					Size = derivers.offset(handle_size, nil, true),
					AnchorPoint = Vector2.new(0.5, 0.5),
					Position = UDim2.fromScale(1, 0.5),

					frame {
						Name = "handle_render",
						BackgroundColor3 = theme(themes.emphasis),

						rounder(),
					},
					frame {
						Name = "handle_hover",
						Size = derivers.offset(hover_size, nil, true),
						AnchorPoint = Vector2.new(0.5, 0.5),
						Position = UDim2.fromScale(0.5, 0.5),
						BackgroundColor3 = theme(themes.border),
						BackgroundTransparency = 0.85,

						rounder(),
					},
				},
			},
		},
		drag_percentage {
			name = "slider_detector",
			hovered = hovered,
			dragging = dragging,
			axis = Vector2.new(1, 0),

			update = function(percentage)
				local value = drag_update(percentage.X)
				if props.update then
					props.update(value)
				end
			end,
			apply = function(percentage)
				local value = drag_update(percentage.X)
				props.apply(value)
			end,

			native = {
				ZIndex = 3,
			},
		},
	}
end

return slider_input
