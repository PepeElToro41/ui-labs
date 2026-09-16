local IMAGES = require "@constants/images"
local use_theme = require "@contexts/theme/use-theme"
local themes = require "@themes"
local frame = require "@ui/styles/frame"
local image = require "@ui/styles/image"

--- Solid panel backdrop with the tiled dot pattern laid over it
local function background(props: {}?)
	local theme = use_theme()

	return frame {
		Name = "background",
		BackgroundColor3 = theme(themes.background1),

		image {
			Name = "pattern",
			Image = IMAGES.pattern,
			ScaleType = Enum.ScaleType.Tile,
			TileSize = UDim2.fromOffset(80, 80),
			Position = UDim2.fromOffset(10, 10),
			Size = UDim2.new(1, -10, 1, -10),
			ImageTransparency = 0.87,
		},
	}
end

return background
