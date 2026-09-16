local vide = require "@pkg/vide"
local use_theme = require "@contexts/theme/use-theme"
local themes = require "@themes"
local corner = require "@ui/styles/corner"
local types = require "../types"

local div = require "@ui/styles/div"
local frame = require "@ui/styles/frame"
local left_list = require "@ui/styles/list/left-list"
local padding = require "@ui/styles/padding"
local text_input = require "@ui/styles/text-input"
local actions = require "@utils/vide/actions"
local derivers = require "@utils/vide/derivers"

local function string_control(props: types.ControlProps<{}, string>)
	local theme = use_theme()
	local focused = vide.source(false)
	local total_size = vide.source(Vector2.zero)

	local follow_size = vide.spring(function()
		if focused() then
			return total_size().Y
		else
			return 28
		end
	end, 0.18, 0.9)

	return div {
		AutomaticSize = Enum.AutomaticSize.Y,

		padding {
			paddingy = 4,
		},
		div {
			Size = function()
				return UDim2.new(1, 0, 0, follow_size())
			end,

			frame {
				Size = UDim2.fromScale(1, 1),
				BackgroundColor3 = theme(themes.background3),
				ClipsDescendants = true,

				vide.create "UIStroke" {
					Color = theme(themes.border),
					Transparency = 0.5,
				},
				corner { radius = 6 },
				padding { paddingx = 8 },
				-- this covers the last bit of the text in multiline
				-- this is done because the text next line is visible at the bottom
				frame {
					Name = "text_cover",
					AnchorPoint = Vector2.new(0, 1),
					Position = UDim2.fromScale(0, 1),
					BackgroundColor3 = theme(themes.background3),
					Size = UDim2.new(1, 0, 0, 3),
					ZIndex = 2,
					Visible = derivers.invert(focused),
				},

				text_input {
					Size = UDim2.new(1, 0, 0, 28),
					LineHeight = 1.35,
					TextSize = 13,
					PlaceholderColor3 = theme(themes.text2),
					TextColor3 = theme(themes.text1),
					TextXAlignment = Enum.TextXAlignment.Left,
					AutomaticSize = Enum.AutomaticSize.Y,
					MultiLine = true,
					PlaceholderText = "Edit String...",

					actions.focused(focused),
					actions.absolute_size(total_size),

					padding {
						Top = 7,
						Bottom = 7,
					},
				},
			},
		},
	}
end

return string_control
