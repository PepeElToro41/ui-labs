local List = require "."
local Extract = require("@utils/vide/props").Extract

function BottomList(props: List.ListProps?)
	local gap = Extract(props or {}, "Gap")

	return List {
		Name = "BottomList",
		FillDirection = Enum.FillDirection.Vertical,
		VerticalAlignment = Enum.VerticalAlignment.Bottom,
		Gap = gap,
		props,
	}
end

return BottomList
