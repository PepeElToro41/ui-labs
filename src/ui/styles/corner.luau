local vide = require "@pkg/vide"

type CornerProps = {
	radius: Derivable<number>?,
}

local function corner(props: CornerProps)
	return vide.create "UICorner" {
		CornerRadius = function()
			return UDim.new(0, (props.radius and vide.read(props.radius)) or 8)
		end,
	}
end

return corner
