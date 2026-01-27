local List = require "."
local Extract = require("@utils/vide/props").Extract

function CenterList(props: List.ListProps?)
	local gap = Extract(props or {}, "Gap")

	return List {
		Name = "CenterList",
		HorizontalAlignment = Enum.HorizontalAlignment.Center,
		VerticalAlignment = Enum.VerticalAlignment.Center,
		Gap = gap,
		props,
	}
end

return CenterList
