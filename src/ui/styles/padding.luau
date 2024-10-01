local Vide = require "@pkg/vide"

type PaddingProps = {
	Padding: number?,
	PaddingX: number?,
	PaddingY: number?,
	Left: number?,
	Right: number?,
	Top: number?,
	Bottom: number?,
}

function Padding(props: PaddingProps)
	if not props.PaddingX then props.PaddingX = props.Padding end
	if not props.PaddingY then props.PaddingY = props.Padding end

	return Vide.create "UIPadding" {
		PaddingLeft = UDim.new(0, props.Left or props.PaddingX or 0),
		PaddingRight = UDim.new(0, props.Right or props.PaddingX or 0),
		PaddingTop = UDim.new(0, props.Top or props.PaddingY or 0),
		PaddingBottom = UDim.new(0, props.Bottom or props.PaddingY or 0),
	}
end

return Padding
