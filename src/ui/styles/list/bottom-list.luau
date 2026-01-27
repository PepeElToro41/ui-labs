local list = require "."

local function bottom_list(props: list.ListProps)
	local gap = props.gap
	props.gap = nil

	return list({
		Name = "BottomList",
		FillDirection = Enum.FillDirection.Vertical,
		VerticalAlignment = Enum.VerticalAlignment.Bottom,
		Gap = gap,
		props,
	} :: any)
end

return bottom_list
