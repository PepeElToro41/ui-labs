local Vide = require "@pkg/vide"
local useTheme = require("@contexts/theme").useTheme
local Lerp = require("@utils/number").Lerp

local spring = Vide.spring

local Glow = require "@ui/elements/glow"

type InputGlowProps = {
	Extends: Derivable<Vector2>?,
	Focused: Reactive<boolean>,
}

function useFocusAlpha(focused: Reactive<boolean>)
	local focusAlpha = spring(function()
		return if focused() then 1 else 0
	end, 0.3)

	return focusAlpha
end

function InputGlow(props: InputGlowProps)
	local theme = useTheme()

	local focusAlpha = useFocusAlpha(props.Focused)

	return Glow {
		Name = "Aura",
		Extends = props.Extends or (Vector2.one * 15),
		Blur = 0.8,

		Color = theme "Emphasis",
		Transparency = function()
			return Lerp(1, 0, focusAlpha())
		end,
	}
end

type InputFocusedProps = {
	Focused: Reactive<boolean>,
}

return table.freeze {
	InputGlow = InputGlow,
	useFocusAlpha = useFocusAlpha,
}
