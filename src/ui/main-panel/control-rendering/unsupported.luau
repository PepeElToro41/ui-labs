local use_theme = require "@contexts/theme/use-theme"
local themes = require "@themes"
local text = require "@ui/styles/text"

type UnsupportedProps = {
	--- the `Type` of the control, as the story declared it
	type: string,
}

--- Stands in for the control types that have no renderer yet, the row still shows up in the table
local function unsupported_control(props: UnsupportedProps)
	local theme = use_theme()

	return text {
		Name = "unsupported",
		Text = `{props.type} controls are not supported yet`,
		TextColor3 = theme(themes.text3),
		TextSize = 13,
		TextXAlignment = Enum.TextXAlignment.Left,
		TextTruncate = Enum.TextTruncate.AtEnd,
		Size = UDim2.new(1, 0, 0, 32),
	}
end

return unsupported_control
