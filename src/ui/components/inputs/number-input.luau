local vide = require "@pkg/vide"
local use_theme = require "@contexts/theme/use-theme"
local IMAGES = require "@constants/images"

local div = require "@ui/styles/div"
local frame = require "@ui/styles/frame"
local image = require "@ui/styles/image"
local right_list = require "@ui/styles/list/right-list"
local corner = require "@ui/styles/corner"
local padding = require "@ui/styles/padding"
local text = require "@ui/styles/text"
local text_input = require "@ui/styles/text-input"
local click_detector = require "@ui/styles/click-detector"
local actions = require "@utils/vide/actions"
local videx = require "@utils/vide/videx"

function drag_handle(props: {})
	local theme = use_theme()
	local hovered = vide.source(false)
	local clicked = vide.source(false)

	return click_detector {
		Size = UDim2.new(0, 20, 0, 20),

		actions.hovered(hovered),
		actions.clicked(clicked),

		div {
			Size = UDim2.fromOffset(0, 0),
			ZIndex = -1,
		},
		image {
			AnchorPoint = Vector2.new(0, 0.5),
			Image = IMAGES.right_arrow,
			ImageColor3 = function()
				if clicked() then
					return theme().text1
				else
					return theme().text2
				end
			end,
			Position = UDim2.new(0.5, -3, 0.5, 0),
			Size = UDim2.fromOffset(14, 14),
		},
		image {
			AnchorPoint = Vector2.new(1, 0.5),
			Image = IMAGES.right_arrow,
			ImageColor3 = function()
				if clicked() then
					return theme().text1
				else
					return theme().text2
				end
			end,
			Position = UDim2.new(0.5, 3, 0.5, 0),
			Rotation = 180,
			Size = UDim2.fromOffset(14, 14),
		},
	}
end

type NumberEntryProps = {
	value: Reactive<number>,
	apply: (val: number) -> any,
	drag_handle: boolean?,
	min: number?,
	max: number?,
	step: number?,
	--- most decimals the input shows, the value itself is never rounded.
	--- Defaults to what `step` needs, or DEFAULT_DECIMALS without one
	decimals: number?,
	prefix: string?,
	native: vide.vTextButton?,
}

local MIN_SIZE = 75
local DEFAULT_DECIMALS = 3
-- a step can ask for more than the default, but never for float noise
local MAX_DECIMALS = 6

--- Fixed decimals with the trailing zeros dropped: 0.5 stays "0.5", 2 stays "2"
local function format_number(value: number, decimals: number): string
	local formatted = string.format(`%.{decimals}f`, value)
	if decimals > 0 then
		formatted = string.gsub(string.gsub(formatted, "0+$", ""), "%.$", "")
	end
	-- a tiny negative rounds to "-0"
	return if formatted == "-0" then "0" else formatted
end

--- How many decimals a step needs to be told apart: 0.25 takes 2, 10 takes 0
local function step_decimals(step: number): number
	-- finer than what can be shown, it would format as a plain 0
	if step < 10 ^ -MAX_DECIMALS then
		return MAX_DECIMALS
	end
	local formatted = format_number(step, MAX_DECIMALS)
	local point = string.find(formatted, ".", 1, true)
	return if point then #formatted - point else 0
end

function number_entry(props: NumberEntryProps)
	local theme = use_theme()
	local out_input = vide.source(nil :: TextBox?)
	local focused = vide.source(false)

	local decimals = math.clamp(
		props.decimals or (if props.step and props.step > 0 then step_decimals(props.step) else DEFAULT_DECIMALS),
		0,
		MAX_DECIMALS
	)

	local display = function()
		return format_number(props.value(), decimals)
	end

	local function constrain(value: number): number
		if props.step and props.step > 0 then
			-- steps count from the minimum when there is one, so the minimum itself stays reachable
			local origin = props.min or 0
			value = origin + math.round((value - origin) / props.step) * props.step
		end
		return math.clamp(value, props.min or -math.huge, props.max or math.huge)
	end

	local function on_focus_lost()
		local textbox = out_input()
		if not textbox then
			return
		end

		-- the text is a rounded view of the value, leaving it untouched must not write the rounding back
		local typed = tonumber(textbox.Text)
		if typed and typed == typed and textbox.Text ~= vide.untrack(display) then
			props.apply(constrain(typed))
		end
		-- resync, the text was not a number or the applied value got constrained
		textbox.Text = vide.untrack(display)
	end

	return click_detector {
		AutomaticSize = Enum.AutomaticSize.X,
		Size = UDim2.fromOffset(0, 28),
		MouseButton1Click = function()
			local out_input = out_input()
			if out_input then
				out_input:CaptureFocus()
				out_input.SelectionStart = 1
				out_input.CursorPosition = #out_input.Text + 1
			end
		end,
		props.native or {},

		div {
			Size = UDim2.fromScale(0, 1),
			AutomaticSize = Enum.AutomaticSize.X,
			Position = UDim2.fromScale(0, 0.5),
			AnchorPoint = Vector2.new(0, 0.5),
			BackgroundTransparency = 1,

			vide.create "UIStroke" {
				Thickness = 1,
				Transparency = 0.5,
				Color = function()
					return theme().border:Lerp(theme().emphasis, 0)
				end,
			},
			vide.create "UISizeConstraint" {
				MinSize = Vector2.new(MIN_SIZE, 0),
			},
			corner { Radius = 6 },
			padding {
				left = 4,
				right = props.drag_handle and 6 or 8,
			},
			right_list {
				gap = 4,
				VerticalAlignment = Enum.VerticalAlignment.Center,
			},
			text_input {
				Text = display,
				FocusLost = on_focus_lost,
				TextSize = 13,
				Size = UDim2.fromOffset(0, 28),
				AutomaticSize = Enum.AutomaticSize.X,

				vide.action(out_input),
				actions.focused(focused),
				vide.create "UISizeConstraint" {
					MinSize = Vector2.new(1, 0),
				} :: any,
				padding {
					left = 4,
					right = props.prefix and -2 or 0,
				} :: any,
			},
			videx.show(props.prefix, function()
				return text {
					Text = props.prefix,
					AutomaticSize = Enum.AutomaticSize.X,
					TextSize = 13,
					FontFace = Font.fromName("Jura", Enum.FontWeight.Medium),
				}
			end),
			videx.show(props.drag_handle, function()
				return drag_handle {}
			end),
		},
	}
end

return number_entry
