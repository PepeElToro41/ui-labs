local UILabs = require "@pkg/ui-labs"
local Vide = require "@pkg/vide"
local App = require "@ui/app"

Vide.strict = false

return UILabs.CreateVideStory({ vide = Vide }, function()
	return App {}
end)
