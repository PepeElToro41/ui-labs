local use_theme = require "@contexts/theme/use-theme"
local themes = require "@themes"
local padding = require "@ui/styles/padding"
local scroller = require "@ui/styles/scroller"
local text = require "@ui/styles/text"

type SummaryTabProps = {
	summary: Reactive<string?>,
}

--- Shows the `summary` of a story, the tab is hidden while there is none
local function summary_tab(props: SummaryTabProps)
	local theme = use_theme()

	return scroller {
		Name = "summary",
		ScrollBarImageColor3 = theme(themes.border),

		padding { paddingx = 12, paddingy = 10 },
		text {
			Name = "label",
			Text = function()
				return props.summary() or ""
			end,
			TextColor3 = theme(themes.text2),
			RichText = true,
			TextWrapped = true,
			TextXAlignment = Enum.TextXAlignment.Left,
			TextYAlignment = Enum.TextYAlignment.Top,
			AutomaticSize = Enum.AutomaticSize.Y,
			Size = UDim2.fromScale(1, 0),
		},
	}
end

return summary_tab
