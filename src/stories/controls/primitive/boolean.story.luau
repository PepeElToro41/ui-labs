local ui_labs = require "@pkg/ui-labs"
local vide = require "@pkg/vide"
local boolean_control = require "@ui/main-panel/control-rendering/primitive/boolean"
local utils = require "../utils"

vide.strict = false

return ui_labs.CreateVideStory({ vide = vide }, function(props)
	local default = false
	local value = vide.source(default)

	return utils.story_control {
		controls = boolean_control {
			name = "boolean control",
			control = {},
			value = value,
			apply = value,
			reset = function()
				value(default)
			end,
		},
	}
end)
