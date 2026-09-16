local IMAGES = require "@constants/images"
local vide = require "@pkg/vide"
local image = require "@ui/styles/image"

local read = vide.read

export type GlowProps = {
	name: string?,
	-- slice scale of the blur image, higher means a softer edge
	blur: Derivable<number>?,
	-- how many pixels the glow extends past the parent on each axis
	extends: Derivable<Vector2>?,
	position: Derivable<Vector2>?,
	color: Derivable<Color3>?,
	transparency: Derivable<number>?,
	zindex: number?,
}

local IMAGE_SIZE = Vector2.new(512, 512)

--- Soft blurred aura rendered around the parent, used for hover and focus effects
local function glow(props: GlowProps)
	return image {
		Name = props.name or "glow",
		Image = IMAGES.blur,
		AnchorPoint = Vector2.new(0.5, 0.5),
		Position = function()
			local position = read(props.position) or Vector2.zero
			return UDim2.new(0.5, position.X, 0.5, position.Y)
		end,
		Size = function()
			local extends = read(props.extends) or Vector2.new(10, 10)
			return UDim2.new(1, extends.X, 1, extends.Y)
		end,

		ImageColor3 = props.color or Color3.new(1, 1, 1),
		ImageTransparency = props.transparency or 0.5,

		ScaleType = Enum.ScaleType.Slice,
		SliceCenter = Rect.new(IMAGE_SIZE / 2, IMAGE_SIZE / 2),
		SliceScale = props.blur or 1,
		ZIndex = props.zindex or -1,
	}
end

return glow
