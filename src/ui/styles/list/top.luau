local List = require "."
local Extract = require("@utils/vide/props").Extract

function TopList(props: List.ListProps?)
	local gap = Extract(props or {}, "Gap")

	return List {
		Name = "TopList",
		FillDirection = Enum.FillDirection.Vertical,
		VerticalAlignment = Enum.VerticalAlignment.Top,
		Gap = gap,
		props,
	}
end

return TopList
