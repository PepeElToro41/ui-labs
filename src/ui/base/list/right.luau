local List = require "."
local Extract = require("@utils/vide/props").Extract

function RightList(props: List.ListProps?)
	local gap = Extract(props or {}, "Gap")

	return List {
		Name = "RightList",
		FillDirection = Enum.FillDirection.Horizontal,
		HorizontalAlignment = Enum.HorizontalAlignment.Right,
		Gap = gap,
		props,
	}
end

return RightList
