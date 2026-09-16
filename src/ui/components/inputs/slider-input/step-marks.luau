local use_theme = require "@contexts/theme/use-theme"
local div = require "@ui/styles/div"
local frame = require "@ui/styles/frame"
local rounder = require "@ui/styles/rounder"

type StepMarkProps = {
	index: number,
	amount: number,
	percent: Reactive<number>,
}

local function step_mark(props: StepMarkProps)
	local theme = use_theme()
	local position = (1 / props.amount) * props.index

	return frame {
		Name = "step_mark",
		Size = UDim2.fromOffset(8, 8),
		AnchorPoint = Vector2.new(0.5, 0.5),
		Position = UDim2.fromScale(position, 0.5),
		BackgroundColor3 = function()
			local filled = props.percent() >= position
			return if filled then theme().emphasis else theme().background4
		end,
		ZIndex = 1,

		rounder(),
	}
end

type StepMarksProps = {
	amount: number,
	percent: Reactive<number>,
}

local function step_marks(props: StepMarksProps)
	local marks = {} :: { Instance }

	-- first and last marks
	marks[#marks + 1] = step_mark { index = 0, amount = props.amount, percent = props.percent }
	marks[#marks + 1] = step_mark { index = props.amount, amount = props.amount, percent = props.percent }

	for index = 1, props.amount - 1 do
		marks[#marks + 1] = step_mark {
			index = index,
			amount = props.amount,
			percent = props.percent,
		}
	end

	return div {
		Name = "step_marks",
		marks,
	}
end

return step_marks
