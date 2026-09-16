local ui_labs = require "@pkg/ui-labs"
local vide = require "@pkg/vide"
local object_control = require "@ui/main-panel/control-rendering/advanced/object"
local utils = require "../utils"

vide.strict = false

return ui_labs.CreateVideStory({ vide = vide }, function(props)
	local any_value = vide.source(nil :: Instance?)
	local model_value = vide.source(nil :: Instance?)

	return utils.story_control {
		controls = {
			object_control {
				name = "object control",
				order = 1,
				control = {
					ClassName = "Instance",
				},
				value = any_value,
				apply = any_value,
				reset = function()
					any_value(nil)
				end,
			},
			object_control {
				name = "model object control",
				order = 2,
				control = {
					ClassName = "Model",
					Predicator = function(instance)
						return instance.Name ~= "Rejected"
					end,
				},
				value = model_value,
				apply = model_value,
				reset = function()
					model_value(nil)
				end,
			},
		},
	}
end)
