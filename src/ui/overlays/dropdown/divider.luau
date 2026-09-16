local divisor = require "@ui/elements/divisor"
local div = require "@ui/styles/div"

export type DropdownDividerProps = {
	order: number?,
}

local DIVIDER_HEIGHT = 6
-- the line extends past the dropdown inner padding to touch the border
local DIVIDER_OVERFLOW = 8

local function dropdown_divider(props: DropdownDividerProps)
	return div {
		Name = "dropdown_divider",
		Size = UDim2.new(1, 0, 0, DIVIDER_HEIGHT),
		LayoutOrder = props.order,

		divisor {
			direction = "X",
			size = UDim.new(1, DIVIDER_OVERFLOW),
			transparency = 0.7,
		},
	}
end

return dropdown_divider
