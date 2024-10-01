local UI_PRESETS = require "@constants/ui-presets"
local IMAGES = require "@constants/images"

local Div = require "@styles/div"
local Image = require "@styles/image"

function Logo()
	return Div {
		Name = "Logo",
		Size = UDim2.fromOffset(28, 28),
		Image {
			Name = "LogoIcon",
			Size = UDim2.fromOffset(24, 24),
			ImageColor3 = Color3.fromRGB(245, 179, 255),
			Image = IMAGES.Logo,
			UI_PRESETS.Centered,
		},
	}
end

return Logo
