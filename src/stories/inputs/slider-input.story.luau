local ui_labs = require "@pkg/ui-labs"
local vide = require "@pkg/vide"
local slider_input = require "@ui/components/inputs/slider-input"
local div = require "@ui/styles/div"
local top_list = require "@ui/styles/list/top-list"

vide.strict = false

return ui_labs.CreateVideStory({ vide = vide }, function(props)
	local stepped_value = vide.source(60)
	local free_value = vide.source(0.25)

	return div {
		Size = UDim2.fromOffset(400, 0),
		AutomaticSize = Enum.AutomaticSize.Y,
		Position = UDim2.fromScale(0.5, 0.5),
		AnchorPoint = Vector2.new(0.5, 0.5),

		top_list { gap = 12 },
		slider_input {
			value = stepped_value,
			update = stepped_value,
			apply = stepped_value,
			min = 0,
			max = 100,
			step = 10,
		},
		slider_input {
			value = free_value,
			update = free_value,
			apply = free_value,
			min = 0,
			max = 1,
		},
	}
end)
