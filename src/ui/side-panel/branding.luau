local CONFIG = require "@constants/config"
local IMAGES = require "@constants/images"
local use_theme = require "@contexts/theme/use-theme"
local themes = require "@themes"
local border = require "@ui/elements/border"
local corner = require "@ui/styles/corner"
local div = require "@ui/styles/div"
local frame = require "@ui/styles/frame"
local image = require "@ui/styles/image"
local left_list = require "@ui/styles/list/left-list"
local text = require "@ui/styles/text"

local VERSION = CONFIG.version
local LOGO_COLOR = Color3.fromRGB(245, 179, 255)

local function logo()
	return div {
		Name = "logo",
		Size = UDim2.fromOffset(28, 28),

		image {
			Name = "icon",
			Image = IMAGES.logo,
			ImageColor3 = LOGO_COLOR,
			Size = UDim2.fromOffset(24, 24),
			Position = UDim2.fromScale(0.5, 0.5),
			AnchorPoint = Vector2.new(0.5, 0.5),
		},
	}
end

local function branding(props: {}?)
	local theme = use_theme()

	return div {
		Name = "branding",
		Size = UDim2.new(1, 0, 0, 34),

		div {
			Name = "plugin_name",
			Size = UDim2.new(1, -25, 1, 0),
			ClipsDescendants = true,

			left_list {
				VerticalAlignment = Enum.VerticalAlignment.Center,
				gap = 8,
			},
			logo(),
			text {
				Name = "name",
				Text = CONFIG.plugin_name,
				TextColor3 = theme(themes.text1),
				weight = Enum.FontWeight.Bold,
				TextSize = 18,
				AutomaticSize = Enum.AutomaticSize.X,
			},
			text {
				Name = "version",
				Text = `v{VERSION.mayor}.{VERSION.minor}.{VERSION.fix}`,
				TextColor3 = theme(themes.text2),
				weight = Enum.FontWeight.Light,
				TextSize = 10,
				AutomaticSize = Enum.AutomaticSize.X,
			},
		},
		frame {
			Name = "plugin_options",
			BackgroundTransparency = 1,
			Position = UDim2.fromScale(1, 0.5),
			AnchorPoint = Vector2.new(1, 0.5),
			Size = UDim2.fromOffset(20, 20),

			border {
				transparency = 0,
			},
			corner {
				radius = 4,
			},
			image {
				Name = "icon",
				Image = IMAGES.dot_options,
				Size = UDim2.fromOffset(16, 16),
				Position = UDim2.fromScale(0.5, 0.5),
				AnchorPoint = Vector2.new(0.5, 0.5),
			},
		},
	}
end

return branding
