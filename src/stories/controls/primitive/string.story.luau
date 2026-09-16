local ui_labs = require "@pkg/ui-labs"
local vide = require "@pkg/vide"
local string_control = require "@ui/main-panel/control-rendering/primitive/string"
local utils = require "../utils"

vide.strict = false

local function uppercase_filter(input: string)
	return string.upper(input)
end

return ui_labs.CreateVideStory({ vide = vide }, function(props)
	local multiline_default = "String here\nsecond line"
	local single_default = "STRING HERE"

	local multiline_value = vide.source(multiline_default)
	local single_value = vide.source(single_default)

	return utils.story_control {
		controls = {
			string_control {
				name = "multiline string control",
				order = 1,
				control = {
					MultiLine = true,
				},
				value = multiline_value,
				apply = multiline_value,
				reset = function()
					multiline_value(multiline_default)
				end,
			},
			string_control {
				name = "filtered string control",
				order = 2,
				control = {
					MultiLine = false,
					Filters = { uppercase_filter },
				},
				value = single_value,
				apply = single_value,
				reset = function()
					single_value(single_default)
				end,
			},
		},
	}
end)
