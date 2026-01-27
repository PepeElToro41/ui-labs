local list = require "."

local function right_list(props: list.ListProps)
	local gap = props.gap
	props.gap = nil

	return list({
		Name = "RightList",
		FillDirection = Enum.FillDirection.Horizontal,
		HorizontalAlignment = Enum.HorizontalAlignment.Right,
		Gap = gap,
		props,
	} :: any)
end

return right_list
