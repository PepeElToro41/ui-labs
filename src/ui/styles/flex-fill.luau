local vide = require "@pkg/vide"

local function flex_fill()
	return vide.create "UIFlexItem" {
		FlexMode = Enum.UIFlexMode.Fill,
	}
end

return flex_fill
