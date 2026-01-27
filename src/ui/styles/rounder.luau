local vide = require "@pkg/vide"

local function rounder(props: {}?)
	return vide.create "UICorner" {
		CornerRadius = UDim.new(1),
	}
end

return rounder
