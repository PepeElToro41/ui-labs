local vide = require "@pkg/vide"

local read = vide.read

type PaddingProps = {
	padding: Derivable<number>?,
	paddingx: Derivable<number>?,
	paddingy: Derivable<number>?,
	left: Derivable<number>?,
	right: Derivable<number>?,
	top: Derivable<number>?,
	bottom: Derivable<number>?,
}

local function padding(props: PaddingProps)
	if not props.paddingx then
		props.paddingx = props.padding
	end
	if not props.paddingy then
		props.paddingy = props.padding
	end

	return vide.create "UIPadding" {
		PaddingLeft = function()
			return UDim.new(0, read(props.left) :: number or read(props.paddingx) :: number or 0)
		end,
		PaddingRight = function()
			return UDim.new(0, read(props.right) :: number or read(props.paddingx) :: number or 0)
		end,
		PaddingTop = function()
			return UDim.new(0, read(props.top) :: number or read(props.paddingy) :: number or 0)
		end,
		PaddingBottom = function()
			return UDim.new(0, read(props.bottom) :: number or read(props.paddingy) :: number or 0)
		end,
	}
end

return padding
