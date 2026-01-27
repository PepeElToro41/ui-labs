local Vide = require "@pkg/vide"
local UILabs = require "@pkg/ui-labs"
local Utils = require "../utils"
local Boolean = require "@ui/main-panel/controls/primitives/boolean"

local source = Vide.source

local story = UILabs.CreateVideStory({ vide = Vide }, function()
	local control = UILabs.Boolean(false)
	local value = source(control.ControlValue)

	return Utils.StoryControl {
		ControlRender = Boolean {
			ControlName = "Boolean Control",
			Control = control :: any,
			ResetControl = function()
				value(control.ControlValue)
			end,
			Value = value,
			Apply = value,
		},
	}
end)

return story
