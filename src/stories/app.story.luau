local vide = require "@pkg/vide"
local app = require "@ui/app"

vide.strict = false

return {
	vide = vide,
	story = function(props)
		return app {
			target = props.target,
		}
	end,
}
