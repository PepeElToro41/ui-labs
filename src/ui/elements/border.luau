local use_theme = require "@contexts/theme/use-theme"
local vide = require "@pkg/vide"

type BorderProps = {
	transparency: Derivable<number>?,
	color: Derivable<Color3>?,
}

local function border(props: BorderProps)
	local theme = use_theme()

	return vide.create "UIStroke" {
		Transparency = function()
			return vide.read(props.transparency) or 0.7
		end,
		Color = function()
			return vide.read(props.color) or theme().border
		end,
		ApplyStrokeMode = Enum.ApplyStrokeMode.Border,
	}
end

return border
