local ui_labs = require "@pkg/ui-labs"
local vide = require "@pkg/vide"
local app = require "@ui/app"
local color_picker = require "@ui/components/color-picker"

vide.strict = false

return ui_labs.CreateVideStory({ vide = vide }, function(props)
	local color = vide.source(Color3.new(1, 0, 0))

	return color_picker {
		start_color = color(),
		update_color = color,
	}
end)
