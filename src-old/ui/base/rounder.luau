local Vide = require "@pkg/vide"

function Rounder(props: {}?)
	return Vide.create "UICorner" {
		CornerRadius = UDim.new(0.5),
	}
end

return Rounder
