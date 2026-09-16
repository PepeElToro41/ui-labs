local ui_labs = require "@pkg/ui-labs"
local vide = require "@pkg/vide"
local slider_control = require "@ui/main-panel/control-rendering/advanced/slider"
local utils = require "../utils"

vide.strict = false

return ui_labs.CreateVideStory({ vide = vide }, function(props)
	local stepped_default = 60
	local free_default = 0.25

	local stepped_value = vide.source(stepped_default)
	local free_value = vide.source(free_default)

	return utils.story_control {
		controls = {
			slider_control {
				name = "stepped slider control",
				order = 1,
				control = {
					Min = 0,
					Max = 100,
					Step = 10,
				},
				value = stepped_value,
				apply = stepped_value,
				reset = function()
					stepped_value(stepped_default)
				end,
			},
			slider_control {
				name = "free slider control",
				order = 2,
				control = {
					Min = 0,
					Max = 1,
				},
				value = free_value,
				apply = free_value,
				reset = function()
					free_value(free_default)
				end,
			},
		},
	}
end)
