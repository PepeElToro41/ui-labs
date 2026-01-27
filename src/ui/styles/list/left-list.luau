local list = require "."

local function left_list(props: list.ListProps)
	local gap = props.gap
	props.gap = nil

	return list({
		Name = "LeftList",
		FillDirection = Enum.FillDirection.Horizontal,
		HorizontalAlignment = Enum.HorizontalAlignment.Left,
		Gap = gap,
		props,
	} :: any)
end

return left_list
