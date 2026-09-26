local use_theme = require "@contexts/theme/use-theme"
local vide = require "@pkg/vide"
local themes = require "@themes"
local div = require "@ui/styles/div"
local flex_fill = require "@ui/styles/flex-fill"
local top_list = require "@ui/styles/list/top-list"
local padding = require "@ui/styles/padding"
local scroller = require "@ui/styles/scroller"
local text = require "@ui/styles/text"
local setting_entry = require "./setting-entry"
local settings_config = require "./settings-config"

type SettingListProps = {
	--- the settings to show, already filtered by the search
	settings: Reactive<{ settings_config.Setting }>,
	--- value of every setting by its key
	values: { [string]: Source<any> },
	--- whether a search is active, it changes what the empty list says
	searching: Reactive<boolean>,
	order: number?,
}

local function setting_list(props: SettingListProps)
	local theme = use_theme()

	local empty = function()
		return #props.settings() == 0
	end

	return div {
		Name = "setting_list",
		LayoutOrder = props.order,

		flex_fill(),
		scroller {
			Visible = function()
				return not empty()
			end,
			ScrollBarImageColor3 = theme(themes.text3),

			-- another category or search starts from the top
			vide.action(function(instance: ScrollingFrame)
				vide.effect(function()
					props.settings()
					instance.CanvasPosition = Vector2.zero
				end)
			end),
			padding { padding = 10 },
			top_list {},
			-- keyed by the setting, an entry that survives a search keeps its input state
			vide.values(props.settings, function(setting, index)
				return setting_entry {
					setting = setting,
					value = props.values[setting.key],
					index = index,
				}
			end),
		},
		text {
			Name = "empty_label",
			Text = function()
				return if props.searching() then "No settings match the search" else "Nothing to set here yet"
			end,
			TextColor3 = theme(themes.text3),
			Size = UDim2.fromScale(1, 1),
			Visible = empty,
		},
	}
end

return setting_list
