local glow = require "./glow"

--- Dark glow offset below the parent, reads as a drop shadow
local function shadow(props: glow.GlowProps)
	props.name = props.name or "shadow"
	props.position = props.position or Vector2.new(4, 4)
	props.color = props.color or Color3.new(0, 0, 0)
	props.transparency = props.transparency or 0.7

	return glow(props)
end

return shadow
