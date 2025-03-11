local Vide = require "@pkg/vide"
local UILabs = require "@pkg/ui-labs"

local source = Vide.source

local Slider = require "@ui/main-panel/controls/advanced/slider"
local Utils = require "../utils"

local story = UILabs.CreateVideStory({ vide = Vide }, function()
	local control = UILabs.Slider(50, 10, 100)
	local value = source(control.ControlValue)

	return Utils.StoryControl {
		ControlName = "Slider Control",
		ResetControl = function()
			value(control.ControlValue)
		end,
		ControlRender = Slider {
			Control = control :: any,
			Value = value,
			Apply = value,
		},
	} :: any
end)

return story
