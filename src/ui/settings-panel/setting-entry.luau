local use_theme = require "@contexts/theme/use-theme"
local themes = require "@themes"
local divisor = require "@ui/elements/divisor"
local div = require "@ui/styles/div"
local top_list = require "@ui/styles/list/top-list"
local padding = require "@ui/styles/padding"
local text = require "@ui/styles/text"
local setting_input = require "./setting-input"
local settings_config = require "./settings-config"

type SettingEntryProps = {
	setting: settings_config.Setting,
	value: Source<any>,
	--- place in the list, the first entry has no divisor above it
	index: Reactive<number>,
}

-- what the input takes from the right, the labels wrap before reaching it
local INPUT_SPACE = 240
local DIVISOR_HEIGHT = 9

--- A setting with its name and description on the left and its input on the right
local function setting_entry(props: SettingEntryProps)
	local theme = use_theme()
	local setting = props.setting

	return div {
		Name = setting.key,
		Size = UDim2.fromScale(1, 0),
		AutomaticSize = Enum.AutomaticSize.Y,
		LayoutOrder = props.index,

		top_list {},
		div {
			Name = "divisor_holder",
			Size = UDim2.new(1, 0, 0, DIVISOR_HEIGHT),
			LayoutOrder = 1,
			Visible = function()
				return props.index() > 1
			end,

			divisor {
				direction = "X",
				transparency = 0.7,
			},
		},
		div {
			Name = "contents",
			Size = UDim2.fromScale(1, 0),
			AutomaticSize = Enum.AutomaticSize.Y,
			LayoutOrder = 2,

			padding {
				paddingx = 6,
				paddingy = 4,
			},
			div {
				Name = "labels",
				Size = UDim2.new(1, -INPUT_SPACE, 0, 0),
				AutomaticSize = Enum.AutomaticSize.Y,

				top_list { gap = 4 },
				text {
					Name = "name",
					Text = setting.name,
					Size = UDim2.fromScale(1, 0),
					AutomaticSize = Enum.AutomaticSize.Y,
					TextWrapped = true,
					TextXAlignment = Enum.TextXAlignment.Left,
					LayoutOrder = 1,
				},
				text {
					Name = "description",
					Text = setting.description,
					Size = UDim2.fromScale(1, 0),
					AutomaticSize = Enum.AutomaticSize.Y,
					TextSize = 13,
					TextWrapped = true,
					TextColor3 = theme(themes.text3),
					TextXAlignment = Enum.TextXAlignment.Left,
					LayoutOrder = 2,
				},
			},
			setting_input {
				setting = setting,
				value = props.value,
			},
		},
	}
end

return setting_entry
