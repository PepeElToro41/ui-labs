local Vide = require "@pkg/vide"

local IMAGES = require "@constants/images"

local Image = require "@base/image"

export type GlowProps = {
	Name: string?,
	Blur: Derivable<number>?,
	Extends: Derivable<Vector2>?,
	Position: Derivable<Vector2>?,
	Color: Derivable<Color3>?,
	Transparency: Derivable<number>?,
	ZIndex: number?,
}

local IMAGE_SIZE = Vector2.new(512, 512)

function Glow(props: GlowProps)
	return Image {
		Name = props.Name or "Glow",
		Image = IMAGES.Blur,
		AnchorPoint = Vector2.new(0.5, 0.5),
		Position = function()
			local position = Vide.read(props.Position) or Vector2.new(0, 0)
			return UDim2.new(0.5, position.X, 0.5, position.Y)
		end,
		Size = function()
			local extends = Vide.read(props.Extends) or Vector2.new(10, 10)
			return UDim2.new(1, extends.X, 1, extends.Y)
		end,

		ImageColor3 = props.Color or Color3.new(1, 1, 1),
		ImageTransparency = props.Transparency or 0.5,

		ScaleType = Enum.ScaleType.Slice,
		SliceCenter = Rect.new(IMAGE_SIZE / 2, IMAGE_SIZE / 2),
		SliceScale = props.Blur or 1,
		ZIndex = props.ZIndex or -1,
	}
end

return Glow
