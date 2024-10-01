local Vide = require "@pkg/vide"
local Extract = require("@utils/vide/props").Extract

export type ListProps = Vide.vUIListLayout & {
	Gap: Derivable<number>?,
}

function List(props: ListProps?)
	local gap = (props and Extract(props, "Gap")) or nil

	local gapDerive = function()
		if gap then
			return UDim.new(0, Vide.read(gap))
		else
			return UDim.new(0, 0)
		end
	end

	return Vide.create "UIListLayout" {
		Name = "List",
		SortOrder = Enum.SortOrder.LayoutOrder,
		Padding = gapDerive,
		props,
	}
end

return List
