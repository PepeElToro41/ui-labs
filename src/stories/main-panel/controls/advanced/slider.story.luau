local Vide = require "@pkg/vide"
local UILabs = require "@pkg/ui-labs"

local source = Vide.source

local Slider = require "@ui/main-panel/controls/advanced/slider"
local Utils = require "../utils"

Vide.strict = false

local story = UILabs.CreateVideStory({ vide = Vide }, function()
	local control = UILabs.Slider(60, 0, 100, 10)
	local value = source(control.ControlValue)

	return Utils.StoryControl {
		ControlRender = Slider {
			ControlName = "Slider Control",
			ResetControl = function()
				value(control.ControlValue)
			end,
			Control = control :: any,
			Value = value,
			Apply = value,
		},
	} :: any
end)

return story
