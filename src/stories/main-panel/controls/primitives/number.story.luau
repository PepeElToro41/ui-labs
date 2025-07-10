local Vide = require "@pkg/vide"
local UILabs = require "@pkg/ui-labs"
local Utils = require "../utils"
local Number = require "@ui/main-panel/controls/primitives/number"

local source = Vide.source

local story = UILabs.CreateVideStory({ vide = Vide }, function()
	local control = UILabs.Number(50, 10, 100)
	local value = source(control.ControlValue)

	return Utils.StoryControl {
		ControlRender = Number {
			ControlName = "Number Control",
			ResetControl = function()
				value(control.ControlValue)
			end,

			Control = control :: any,
			Value = value,
			Apply = value,
		},
	}
end)

return story
