local app_render_provider = require "@contexts/app-render/app-render-provider"
local ui_labs = require "@pkg/ui-labs"
local vide = require "@pkg/vide"
local color_control = require "@ui/main-panel/control-rendering/datatype/color"
local utils = require "../utils"

vide.strict = false

-- a light, a dark and a mid tone: the hex label has to stay readable on all of them
local DEFAULTS = {
	Color3.fromRGB(255, 236, 140),
	Color3.fromRGB(24, 28, 60),
	Color3.fromRGB(180, 133, 255),
}

return ui_labs.CreateVideStory({ vide = vide }, function(props)
	-- the picker opens as a popup in the app overlay
	return app_render_provider {
		children = function()
			local rendered = {}
			for index, default in DEFAULTS do
				local value = vide.source(default)

				rendered[index] = color_control {
					name = `color control {index}`,
					control = {},
					order = index,
					value = value,
					apply = value,
					reset = function()
						value(default)
					end,
				}
			end

			return utils.story_control {
				controls = rendered,
			}
		end,
	}
end)
