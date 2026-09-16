local use_theme = require "@contexts/theme/use-theme"
local vide = require "@pkg/vide"
local themes = require "@themes"
local corner = require "@ui/styles/corner"
local div = require "@ui/styles/div"
local frame = require "@ui/styles/frame"
local padding = require "@ui/styles/padding"
local text_input = require "@ui/styles/text-input"
local actions = require "@utils/vide/actions"
local derivers = require "@utils/vide/derivers"

export type StringFilter = (input: string, old: string) -> string

type StringInputProps = {
	value: Reactive<string>,
	apply: (value: string) -> (),

	placeholder: string?,
	multiline: boolean?,
	filters: { StringFilter }?,

	native: vide.vFrame?,
}

local COLLAPSED_HEIGHT = 28

local function string_input(props: StringInputProps)
	local theme = use_theme()
	local textbox_ref = vide.source(nil :: any) :: Source<TextBox>
	local focused = vide.source(false)
	local total_size = vide.source(Vector2.zero)
	local filtering_text = false

	local multiline = if props.multiline == nil then true else props.multiline

	local follow_size = vide.spring(function()
		if focused() and multiline then
			return math.max(total_size().Y, COLLAPSED_HEIGHT)
		else
			return COLLAPSED_HEIGHT
		end
	end, 0.18, 0.9)

	local focus_alpha = vide.spring(derivers.boolean(focused, 1, 0), 0.2, 1)

	local function on_focus_lost()
		local textbox = textbox_ref()
		props.apply(textbox.Text)
		-- resync in case the applied value was rejected or transformed
		textbox.Text = vide.untrack(props.value)
	end

	local function on_text_changed(text: string)
		if filtering_text or not props.filters then
			return
		end

		local filtered_text = text
		for _, filter in props.filters do
			local next_filtered = filter(filtered_text, text)
			if type(next_filtered) == "string" then
				filtered_text = next_filtered
			end
		end

		if filtered_text ~= text then
			filtering_text = true
			textbox_ref().Text = filtered_text
			filtering_text = false
		end
	end

	return div {
		Name = "string_input",
		Size = function()
			return UDim2.new(1, 0, 0, math.round(follow_size()))
		end,
		props.native or {},

		frame {
			Name = "input_frame",
			BackgroundColor3 = theme(themes.background3),
			ClipsDescendants = true,

			vide.create "UIStroke" {
				Thickness = 1,
				Transparency = 0.5,
				Color = function()
					return theme().border:Lerp(theme().emphasis, focus_alpha())
				end,
			},
			corner { radius = 6 },
			padding { paddingx = 8 },
			-- this covers the last bit of the text in multiline
			-- this is done because the text next line is visible at the bottom
			frame {
				Name = "text_cover",
				AnchorPoint = Vector2.new(0, 1),
				Position = UDim2.fromScale(0, 1),
				BackgroundColor3 = theme(themes.background3),
				Size = UDim2.new(1, 0, 0, 3),
				ZIndex = 2,
				Visible = function()
					return multiline and not focused()
				end,
			},

			text_input {
				Size = UDim2.new(1, 0, 0, COLLAPSED_HEIGHT),
				AutomaticSize = if multiline then Enum.AutomaticSize.Y else Enum.AutomaticSize.None,
				LineHeight = 1.35,
				TextSize = 13,
				PlaceholderColor3 = theme(themes.text2),
				TextColor3 = theme(themes.text1),
				TextXAlignment = Enum.TextXAlignment.Left,
				TextTruncate = if multiline then Enum.TextTruncate.None else Enum.TextTruncate.AtEnd,
				MultiLine = multiline,
				ClearTextOnFocus = false,
				PlaceholderText = props.placeholder or "Edit String...",
				Text = props.value,
				FocusLost = on_focus_lost,

				vide.action(textbox_ref),
				actions.focused(focused),
				actions.absolute_size(total_size),
				vide.changed("Text", on_text_changed),

				padding {
					top = 7,
					bottom = 7,
				},
			},
		},
	}
end

return string_input
