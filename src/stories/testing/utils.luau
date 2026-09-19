local vide = require "@pkg/vide"

type ValueListProps = {
	title: string,
	-- label and value pairs, shown in order
	values: { { name: string, value: () -> unknown } },
}

-- test stories only need to prove the controls reach them, so they print the live values
local function value_list(props: ValueListProps)
	local rows = {}
	for index, entry in props.values do
		rows[index] = vide.create "TextLabel" {
			Name = entry.name,
			LayoutOrder = index + 1,
			AutomaticSize = Enum.AutomaticSize.XY,
			BackgroundTransparency = 1,
			FontFace = Font.fromName("GothamSSm", Enum.FontWeight.Medium),
			TextSize = 14,
			TextColor3 = Color3.fromRGB(196, 196, 196),
			TextXAlignment = Enum.TextXAlignment.Left,
			Text = function()
				return `{entry.name}: {tostring(entry.value())}`
			end,
		}
	end

	return vide.create "Frame" {
		Name = "value_list",
		AutomaticSize = Enum.AutomaticSize.XY,
		Position = UDim2.fromOffset(20, 20),
		BackgroundTransparency = 1,

		vide.create "UIListLayout" {
			SortOrder = Enum.SortOrder.LayoutOrder,
			Padding = UDim.new(0, 6),
		},
		vide.create "TextLabel" {
			Name = "title",
			LayoutOrder = 1,
			AutomaticSize = Enum.AutomaticSize.XY,
			BackgroundTransparency = 1,
			FontFace = Font.fromName("GothamSSm", Enum.FontWeight.Bold),
			TextSize = 16,
			TextColor3 = Color3.new(1, 1, 1),
			TextXAlignment = Enum.TextXAlignment.Left,
			Text = props.title,
		},
		rows,
	}
end

return {
	value_list = value_list,
}
