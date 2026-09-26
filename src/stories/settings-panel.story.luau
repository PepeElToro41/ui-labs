local use_theme = require "@contexts/theme/use-theme"
local ui_labs = require "@pkg/ui-labs"
local vide = require "@pkg/vide"
local themes = require "@themes"
local settings_panel = require "@ui/settings-panel"
local click_detector = require "@ui/styles/click-detector"
local corner = require "@ui/styles/corner"
local frame = require "@ui/styles/frame"
local text = require "@ui/styles/text"

vide.strict = false

return ui_labs.CreateVideStory({ vide = vide }, function(props)
	local theme = use_theme()
	local open = vide.source(true)

	return frame {
		Name = "canvas",
		BackgroundColor3 = theme(themes.background1),

		-- the app has nothing that opens the settings yet, this brings the panel back after closing it
		frame {
			Name = "reopen",
			AnchorPoint = Vector2.new(0.5, 0.5),
			Position = UDim2.fromScale(0.5, 0.5),
			Size = UDim2.fromOffset(170, 30),
			BackgroundColor3 = theme(themes.background4),
			Visible = function()
				return not open()
			end,

			corner { radius = 8 },
			text {
				Text = "Open settings",
				Size = UDim2.fromScale(1, 1),
			},
			click_detector {
				Activated = function()
					open(true)
				end,
			},
		},
		-- mounted again on every open, the values go back to their defaults as nothing stores them
		vide.show(open, function()
			return settings_panel {
				closed = function()
					open(false)
				end,
			}
		end),
	}
end)
