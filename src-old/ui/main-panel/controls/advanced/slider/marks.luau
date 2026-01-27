local Vide = require "@pkg/vide"

local derive = Vide.derive

local useTheme = require("@contexts/theme").useTheme

local Frame = require "@base/frame"
local Div = require "@base/div"
local Rounder = require "@base/rounder"

type MarkProps = {
	Index: number,
	Amount: number,
	Percent: Reactive<number>,
}

function Mark(props: MarkProps)
	local position = (1 / props.Amount) * props.Index
	local theme = useTheme()

	local color = function()
		local isFilled = props.Percent() >= position
		return isFilled and theme().Emphasis or theme().Background4
	end

	return Frame {
		Size = UDim2.fromOffset(8, 8),
		AnchorPoint = Vector2.new(0.5, 0.5),
		Position = UDim2.fromScale(position, 0.5),
		BackgroundColor3 = color,
		ZIndex = 1,

		Rounder(),
	}
end

type SliderMarksProps = {
	Amount: number,
	Percent: Reactive<number>,
}

function SliderMarks(props: SliderMarksProps)
	local marks = {} :: { Instance }

	-- first and last marks
	marks[#marks + 1] = Mark { Index = 0, Amount = props.Amount, Percent = props.Percent }
	marks[#marks + 1] = Mark { Index = 1, Amount = props.Amount, Percent = props.Percent }

	for i = 1, props.Amount - 1 do
		marks[#marks + 1] = Mark {
			Index = i,
			Amount = props.Amount,
			Percent = props.Percent,
		}
	end

	return Div {
		marks,
	}
end

return SliderMarks
