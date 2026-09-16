local ui_labs = require "@pkg/ui-labs"
local vide = require "@pkg/vide"
local boolean_input = require "@ui/components/inputs/boolean-input"

vide.strict = false

return ui_labs.CreateVideStory({ vide = vide }, function(props)
	local value = vide.source(false)

	return boolean_input {
		value = value,
		apply = value,

		native = {
			Position = UDim2.fromScale(0.5, 0.5),
			AnchorPoint = Vector2.new(0.5, 0.5),
		},
	}
end)
