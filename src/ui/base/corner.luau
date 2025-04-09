local Vide = require "@pkg/vide"

type CornerProps = {
	Radius: number?,
}

function Corner(props: CornerProps?)
	return Vide.create "UICorner" {
		CornerRadius = UDim.new(0, (props and props.Radius) or 8),
	}
end

return Corner
