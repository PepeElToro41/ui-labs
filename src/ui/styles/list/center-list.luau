local list = require "."

local function center_list(props: list.ListProps)
	local gap = props.gap
	props.gap = nil

	return list({
		Name = "CenterList",
		HorizontalAlignment = Enum.HorizontalAlignment.Center,
		VerticalAlignment = Enum.VerticalAlignment.Center,
		Gap = gap,
		props,
	} :: any)
end

return center_list
