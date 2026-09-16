local ui_labs = require "@pkg/ui-labs"
local vide = require "@pkg/vide"
local string_input = require "@ui/components/inputs/string-input"
local div = require "@ui/styles/div"
local top_list = require "@ui/styles/list/top-list"

vide.strict = false

return ui_labs.CreateVideStory({ vide = vide }, function(props)
	local multiline_value = vide.source "Hello world\nsecond line"
	local single_value = vide.source ""

	return div {
		Size = UDim2.fromOffset(320, 0),
		AutomaticSize = Enum.AutomaticSize.Y,
		Position = UDim2.fromScale(0.5, 0.5),
		AnchorPoint = Vector2.new(0.5, 0.5),

		top_list { gap = 12 },
		string_input {
			value = multiline_value,
			apply = multiline_value,
			multiline = true,
		},
		string_input {
			value = single_value,
			apply = single_value,
			multiline = false,
			placeholder = "Single line...",
		},
	}
end)
