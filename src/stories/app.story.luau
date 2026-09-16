local ui_labs = require "@pkg/ui-labs"
local vide = require "@pkg/vide"
local app = require "@ui/app"

vide.strict = false

return ui_labs.CreateVideStory({ vide = vide }, function(props)
	return app {
		target = props.target,
	}
end)
