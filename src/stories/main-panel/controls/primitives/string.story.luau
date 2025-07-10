local Vide = require "@pkg/vide"
local UILabs = require "@pkg/ui-labs"
local Utils = require "../utils"

local Div = require "@base/div"
local String = require "@ui/main-panel/controls/primitives/string"

local source = Vide.source

local story = UILabs.CreateVideStory({ vide = Vide }, function()
	local control = UILabs.String "String here"
	local value = source(control.ControlValue)

	return Utils.StoryControl {
		ControlRender = {
			String {
				ControlName = "String Control",
				Order = 1,
				ResetControl = function()
					value(control.ControlValue)
				end,
				Control = control :: any,
				Value = value,
				Apply = value,
			},
		},
	}
end)

return story
