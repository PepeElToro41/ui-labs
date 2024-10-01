local Glow = require "./glow"

function Shadow(props: Glow.GlowProps)
	props.Position = props.Position or Vector2.new(4, 4)
	props.Color = props.Color or Color3.new(0, 0, 0)
	props.Transparency = props.Transparency or 0.7

	return Glow(props)
end

return Shadow
