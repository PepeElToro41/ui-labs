local vide = require "@pkg/vide"

export type ListProps = vide.vUIListLayout & {
	gap: Derivable<number>?,
}

local function list(props: ListProps)
	local gap = props.gap
	props.gap = nil

	return vide.create "UIListLayout" {
		Name = "List",
		SortOrder = Enum.SortOrder.LayoutOrder,
		Padding = function()
			if gap then
				return UDim.new(0, vide.read(gap))
			else
				return UDim.new(0, 0)
			end
		end,
		props :: any,
	}
end

return list
