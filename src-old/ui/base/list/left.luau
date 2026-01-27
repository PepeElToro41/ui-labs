local List = require "."
local Extract = require("@utils/vide/props").Extract

function LeftList(props: List.ListProps?)
	local gap = Extract(props or {}, "Gap")

	return List {
		Name = "LeftList",
		FillDirection = Enum.FillDirection.Horizontal,
		HorizontalAlignment = Enum.HorizontalAlignment.Left,
		Gap = gap,
		props,
	}
end

return LeftList
