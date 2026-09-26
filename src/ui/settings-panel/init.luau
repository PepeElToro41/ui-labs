local use_theme = require "@contexts/theme/use-theme"
local vide = require "@pkg/vide"
local themes = require "@themes"
local corner = require "@ui/styles/corner"
local div = require "@ui/styles/div"
local flex_fill = require "@ui/styles/flex-fill"
local frame = require "@ui/styles/frame"
local left_list = require "@ui/styles/list/left-list"
local top_list = require "@ui/styles/list/top-list"
local string_utils = require "@utils/string-utils"
local category_list = require "@self/category-list"
local setting_list = require "@self/setting-list"
local settings_config = require "@self/settings-config"
local title_bar = require "@self/title-bar"

type Setting = settings_config.Setting

type SettingsPanelProps = {
	closed: (() -> ())?,

	native: vide.vFrame?,
}

local PANEL_SIZE = Vector2.new(700, 450)
local CORNER_RADIUS = 6

-- the settings are not stored anywhere yet, the panel holds them while it is open
local function create_values(): { [string]: Source<any> }
	local values = {}
	for _, category in settings_config do
		for _, setting in category.settings do
			assert(values[setting.key] == nil, `duplicated setting key "{setting.key}"`)
			values[setting.key] = vide.source(setting.default)
		end
	end
	return values
end

local function matches_search(setting: Setting, needle: string): boolean
	return setting.name:lower():find(needle, 1, true) ~= nil or setting.description:lower():find(needle, 1, true) ~= nil
end

local function settings_panel(props: SettingsPanelProps)
	local theme = use_theme()

	local values = create_values()
	local search = vide.source ""
	local selected = vide.source(settings_config[1].key)

	local needle = vide.derive(function()
		return string_utils.trim(search()):lower()
	end)
	local searching = function()
		return needle() ~= ""
	end

	-- the settings each category lists, everything without a search
	local listed = vide.derive(function()
		local search_needle = needle()
		local by_category: { [string]: { Setting } } = {}

		for _, category in settings_config do
			if search_needle == "" then
				by_category[category.key] = category.settings
				continue
			end

			local matches = {}
			for _, setting in category.settings do
				if matches_search(setting, search_needle) then
					table.insert(matches, setting)
				end
			end
			by_category[category.key] = matches
		end
		return by_category
	end)

	local counts = vide.derive(function()
		local by_category = {}
		for key, settings in listed() do
			by_category[key] = #settings
		end
		return by_category
	end)

	-- a search that leaves the selected category empty shows the first one with matches instead.
	-- the selection is not written, clearing the search goes back to it
	local active = vide.derive(function()
		local selected_key = selected()
		if not searching() or counts()[selected_key] > 0 then
			return selected_key
		end

		for _, category in settings_config do
			if counts()[category.key] > 0 then
				return category.key
			end
		end
		return selected_key
	end)

	local active_settings = function()
		return listed()[active()]
	end

	return frame {
		Name = "settings_panel",
		AnchorPoint = Vector2.new(0.5, 0.5),
		Position = UDim2.fromScale(0.5, 0.5),
		Size = UDim2.fromOffset(PANEL_SIZE.X, PANEL_SIZE.Y),
		BackgroundColor3 = theme(themes.background2),
		props.native or {},

		
		corner { radius = CORNER_RADIUS },
		top_list {},
		title_bar {
			order = 1,
			corner_radius = CORNER_RADIUS,
			searched = search,
			closed = props.closed or function() end,
		},
		div {
			Name = "contents",
			LayoutOrder = 2,

			flex_fill(),
			left_list {},
			category_list {
				order = 1,
				corner_radius = CORNER_RADIUS,
				categories = settings_config,
				active = active,
				counts = counts,
				searching = searching,
				selected = selected,
			},
			setting_list {
				order = 2,
				settings = active_settings,
				values = values,
				searching = searching,
			},
		},
	}
end

return settings_panel
