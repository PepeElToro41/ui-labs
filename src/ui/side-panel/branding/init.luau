local Vide = require "@pkg/vide"
local VERSION = require("@constants/configs").Version
local IMAGES = require "@constants/images"
local UI_PRESETS = require "@constants/ui-presets"
local useTheme = require("@contexts/theme").useTheme

local Logo = require "./logo"

local Div = require "@styles/div"
local Frame = require "@styles/frame"
local LeftList = require "@styles/list/left"
local Text = require "@styles/text"
local Corner = require "@styles/corner"
local Image = require "@styles/image"

local create = Vide.create

function Branding()
	local theme = useTheme()

	return Div {
		Name = "Branding",
		Size = UDim2.new(1, 0, 0, 34),
		Div {
			Name = "PluginName",
			Size = UDim2.new(1, -25, 1, 0),

			LeftList {
				VerticalAlignment = Enum.VerticalAlignment.Center,
				Gap = 8,
			},
			Logo(),
			Text {
				Name = "PluginName",
				TextColor3 = theme "Text",
				Text = "UI Labs",
				Weight = Enum.FontWeight.Bold,
				TextSize = 18,
				AutomaticSize = Enum.AutomaticSize.X,
			},
			Text {
				Name = "PluginVersion",
				TextColor3 = theme "TextDisabled",
				Text = `v{VERSION.Mayor}.{VERSION.Minor}.{VERSION.Fix}`,
				Weight = Enum.FontWeight.Light,
				TextSize = 10,
				AutomaticSize = Enum.AutomaticSize.X,
			},
		},
		Frame {
			Name = "PluginOptions",
			BackgroundTransparency = 1,
			Position = UDim2.fromScale(1, 0.5),
			AnchorPoint = Vector2.new(1, 0.5),
			Size = UDim2.fromOffset(20, 20),

			create "UIStroke" {
				Thickness = 1,
				Color = theme "Border",
			},
			Corner { Radius = 4 },
			Image {
				Image = IMAGES.DotOptions,
				Size = UDim2.fromOffset(16, 16),
				UI_PRESETS.Centered,
			},
		},
	}
end

return Branding
