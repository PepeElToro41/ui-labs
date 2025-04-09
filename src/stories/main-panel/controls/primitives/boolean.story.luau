local Vide = require "@pkg/vide"
local UILabs = require "@pkg/ui-labs"
local Utils = require "../utils"
local Boolean = require "@ui/main-panel/controls/primitives/boolean"

local source = Vide.source

local story = UILabs.CreateVideStory({ vide = Vide }, function()
	local control = UILabs.Boolean(false)
	local value = source(control.ControlValue)

	return Utils.StoryControl {
		ControlName = "Boolean Control",
		ResetControl = function()
			value(control.ControlValue)
		end,
		ControlRender = Boolean {
			Control = control :: any,
			Value = value,
			Apply = value,
		},
	}
end)

return story
