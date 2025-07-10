local Vide = require "@pkg/vide"
local Common = require "../common"
local derivers = require "@utils/vide/derivers"
local actions = require "@actions"
local IMAGES = require "@constants/images"
local PRESETS = require "@constants/ui-presets"

local useTheme = require("@contexts/theme").useTheme
local source = Vide.source
local create = Vide.create
local changed = Vide.changed
local spring = Vide.spring

local TextInput = require "@base/text-input"
local Rounder = require "@base/rounder"
local Detector = require "@base/detector"
local Image = require "@base/image"
local Text = require "@base/text"
local Padding = require "@base/padding"
local Corner = require "@base/corner"
local Frame = require "@base/frame"
local Div = require "@base/div"
local LeftList = require "@base/list/left"
local ControlHolder = require "../control-holder"

function String(props: Common.ControlProps<{}, string>)
	local focused = source(false)
	local theme = useTheme()
	local totalSize = source(0)

	local followSize = spring(function()
		if focused() then
			return totalSize()
		else
			return 28
		end
	end, 0.18, 0.9)

	return ControlHolder {
		Control = props,
		Size = function()
			return UDim2.new(1, 0, 0, math.round(followSize()) + 4)
		end,
		ZIndex = function()
			return followSize() > 32 and (200 - (props.Order or 0)) or 1
		end,

		ControlRender = Div {
			Name = "StringRender",
			Size = UDim2.new(1, 0, 1, 0),

			LeftList { VerticalAlignment = Enum.VerticalAlignment.Top },
			Padding { PaddingY = 2 },

			Frame {
				Size = UDim2.fromScale(1, 1),
				BackgroundColor3 = theme "Background3",
				ClipsDescendants = true,

				create "UIStroke" {
					Color = theme "Border",
					Transparency = 0.5,
				},
				Corner { Radius = 6 },
				Padding { PaddingX = 10 },
				Frame {
					Name = "TextCover",
					AnchorPoint = Vector2.new(0, 1),
					Position = UDim2.fromScale(0, 1),
					BackgroundColor3 = theme "Background3",
					Size = UDim2.new(1, 0, 0, 3),
					ZIndex = 2,
					Visible = derivers.boolean(focused, false, true),
				},
				TextInput {
					Size = UDim2.new(1, 0, 0, 28),
					LineHeight = 1.35,
					TextSize = 13,
					PlaceholderColor3 = theme "Text2",
					TextColor3 = theme "Text1",
					TextXAlignment = Enum.TextXAlignment.Left,
					AutomaticSize = Enum.AutomaticSize.Y,
					MultiLine = true,
					PlaceholderText = "Edit String...",

					actions.Focused(focused),
					changed("AbsoluteSize", function(size: Vector2)
						totalSize(size.Y)
					end),

					Padding {
						Top = 7,
						Bottom = 7,
					},
				},
			},
		},
	}
end

return String
