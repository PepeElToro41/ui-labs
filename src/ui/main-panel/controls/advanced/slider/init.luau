local UILabs = require "@pkg/ui-labs"
local Vide = require "@pkg/vide"

local create = Vide.create
local source = Vide.source
local effect = Vide.effect
local changed = Vide.changed
local cleanup = Vide.cleanup
local untrack = Vide.untrack
local derive = Vide.derive
local show = Vide.show
local spring = Vide.spring

local Common = require "../../common"
local PRESETS = require "@constants/ui-presets"
local useTheme = require("@contexts/theme").useTheme
local useMotion = require "@hooks/useMotion"
local inner_effect = require("@utils/vide").inner_effect
local actions = require "@actions"
local derivers = require "@utils/vide/derivers"

local SliderMarks = require "./marks"
local DragDetector = require "@base/drag-detector"
local Detector = require "@base/detector"
local Div = require "@base/div"
local Frame = require "@base/frame"
local LeftList = require "@base/list/left"
local Text = require "@base/text"
local Rounder = require "@base/rounder"
local Padding = require "@base/padding"

local NumberInput = require "../../common/number-input"

-- TODO: Export this in the utility package

function GetPercent(control: SliderControl, value: number)
	return (value - control.Min) / (control.Max - control.Min)
end
function GetValue(control: SliderControl, percent: number)
	return control.Min + (control.Max - control.Min) * percent
end
function CalculateMarks(control: SliderControl)
	if control.Step == nil or control.Step <= 0 then return 0 end

	local markDelta = control.Max - control.Min
	local markSize = control.Step / markDelta
	return math.floor(1 / markSize)
end
function GetSteppedValue(control: SliderControl, value: number)
	if not control.Step or control.Step <= 0 then return value end

	local delta = value - control.Min
	local stepped = math.round(delta / control.Step) * control.Step
	return control.Min + stepped
end

local SPRING_CONFIG = {
	friction = 30,
	tension = 300,
	clamp = true,
}

local MIN_MARK_SEPARATION = 15

function Slider(props: Common.ControlProps<SliderControl, number>)
	local theme = useTheme()
	local absoluteSize = source(Vector2.zero)
	local absolutePosition = source(Vector2.zero)

	local hovered = source(false)
	local dragging = source(false)

	local hoverSize = spring(function()
		if dragging() then
			return 34
		elseif hovered() then
			return 26
		else
			return 12
		end
	end, 0.3, 0.6)
	local handleSize = spring(function()
		if dragging() then
			return 20
		else
			return 14
		end
	end, 0.2, 0.6)

	local marks = CalculateMarks(props.Control)
	local marksVisible = derive(function()
		if marks == 0 then return false end

		local size = absoluteSize()
		local separation = math.floor(size.X / marks)
		return separation >= MIN_MARK_SEPARATION
	end)

	local percent = source(GetPercent(props.Control, props.Value()))
	local value = source(props.Value())

	local springActive = source(false)
	local spring, motion = useMotion(percent(), springActive)

	effect(function()
		if dragging() then
			local marks = marksVisible()

			if not marks then return end
			motion:set(untrack(percent))
			-- following changes
			inner_effect(function()
				springActive(true)
				motion:spring(percent(), SPRING_CONFIG)
			end)
		else
			-- reconciliation
			if motion:isComplete() then motion:set(GetPercent(props.Control, untrack(props.Value))) end

			local first = true

			inner_effect(function()
				if first then return end
				local value = props.Value()
				local setPercent = GetPercent(props.Control, value)

				springActive(true)
				if motion:isComplete() then
					motion:set(setPercent)
					motion:spring(setPercent, SPRING_CONFIG)
				else
					motion:spring(setPercent, SPRING_CONFIG)
				end
				percent(setPercent)
			end)
			first = false
		end

		--[[local disconnect = motion:onComplete(function()
			springActive(false)
		end)]]

		cleanup(function()
			--disconnect()
			if motion:isComplete() then springActive(false) end
		end)
	end)

	local function DragUpdate(mouse: Vector2)
		local size = absoluteSize()
		local pos = absolutePosition()
		local newPercent = math.clamp((mouse.X - pos.X) / size.X, 0, 1)

		if not props.Control.Step or props.Control.Step <= 0 then
			percent(newPercent)
			value(GetValue(props.Control, newPercent))
			return
		end

		local newFinal = GetSteppedValue(props.Control, GetValue(props.Control, newPercent))
		percent(GetPercent(props.Control, newFinal))
		value(newFinal)
	end

	return Div {
		LeftList { Gap = 10, VerticalAlignment = Enum.VerticalAlignment.Center },
		Div {
			Size = UDim2.fromScale(0, 1),
			AutomaticSize = Enum.AutomaticSize.X,

			LeftList { VerticalAlignment = Enum.VerticalAlignment.Center },
			Padding { Right = 10 },
			NumberInput {
				Value = props.Value,
				Apply = props.Apply,
				Dragger = false,
			},
		},
		Text {
			Name = "SliderMin",
			Text = tostring(props.Control.Min),
			TextSize = 13,
			TextColor3 = theme "Text2",
			Size = UDim2.fromScale(0, 1),
			AutomaticSize = Enum.AutomaticSize.X,
		},
		-- SLIDER
		Detector {
			Name = "SliderHolder",

			create "UIFlexItem" { FlexMode = Enum.UIFlexMode.Fill },
			changed("AbsoluteSize", absoluteSize),
			changed("AbsolutePosition", absolutePosition),
			actions.Hovered(hovered),

			DragDetector {
				Dragging = dragging,
				DragStart = DragUpdate,
				DragContinue = DragUpdate,
			},
			Frame {
				Name = "Slider",
				Size = UDim2.new(1, 0, 0, 4),
				BackgroundColor3 = theme "Background4",
				PRESETS.LeftCenter,

				Rounder(),
				show(marksVisible, function()
					return SliderMarks {
						Amount = marks,
						Percent = function()
							return springActive() and spring() or percent()
						end,
					}
				end),
				Frame {
					Name = "SliderProgress",
					ZIndex = 2,
					Size = function()
						if springActive() then
							return UDim2.fromScale(spring(), 1)
						else
							return UDim2.fromScale(percent(), 1)
						end
					end,
					BackgroundColor3 = theme "Emphasis",

					Rounder(),
					Div {
						Name = "SliderHandle",
						Size = derivers.offset(handleSize, nil, true),
						AnchorPoint = Vector2.new(0.5, 0.5),
						Position = UDim2.fromScale(1, 0.5),

						Frame {
							Name = "HandleRender",
							BackgroundColor3 = theme "Emphasis",
							Size = UDim2.fromScale(1, 1),
							Rounder(),
						},
						Frame {
							Name = "HandleHover",
							Size = derivers.offset(hoverSize, nil, true),
							BackgroundColor3 = theme "Border",
							BackgroundTransparency = 0.85,
							PRESETS.Centered,
							Rounder(),
						},
					},
				},
			},
		},
		--------------------------------------------------------------------------------
		Text {
			Name = "SliderMax",
			Text = tostring(props.Control.Max),
			TextColor3 = theme "Text2",
			TextSize = 13,
			Size = UDim2.fromScale(0, 1),
			AutomaticSize = Enum.AutomaticSize.X,
		},
	}
end

return Slider
