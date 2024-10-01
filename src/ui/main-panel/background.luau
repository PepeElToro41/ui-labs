local Vide = require "@pkg/vide"
local useTheme = require("@contexts/theme").useTheme
local Frame = require "@styles/frame"
local Image = require "@styles/image"

local IMAGES = require "@constants/images"

local create = Vide.create

function Background(props: Map<number, any>)
	local theme = useTheme()

	return Frame {
		BackgroundColor3 = theme "Background1",

		create "UIFlexItem" { FlexMode = Enum.UIFlexMode.Fill },
		Image {
			Name = "Pattern",
			Image = IMAGES.Pattern,
			ScaleType = Enum.ScaleType.Tile,
			TileSize = UDim2.fromOffset(80, 80),
			Position = UDim2.fromOffset(10, 10),
			Size = UDim2.new(1, -10, 1, -10),
			ImageTransparency = 0.87,
		},
		props,
	}
end

return Background
