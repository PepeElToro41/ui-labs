local list = require "."

local function top_list(props: list.ListProps)
	local gap = props.gap
	props.gap = nil

	return list({
		Name = "TopList",
		FillDirection = Enum.FillDirection.Vertical,
		VerticalAlignment = Enum.VerticalAlignment.Top,
		Gap = gap,
		props,
	} :: any)
end

return top_list
