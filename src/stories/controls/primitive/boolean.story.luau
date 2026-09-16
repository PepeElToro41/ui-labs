local ui_labs = require "@pkg/ui-labs"
local vide = require "@pkg/vide"
local boolean_control = require "@ui/main-panel/control-rendering/primitive/boolean"
local div = require "@ui/styles/div"

return ui_labs.CreateVideStory({ vide = vide }, function(props)
	local value = vide.source(false)

	return div {
		Position = UDim2.fromScale(0.5, 0.5),

		boolean_control {
			name = "boolean control",
			reset = function() end,
			value = value,
			apply = value,
			control = {},
		},
	}
end)
