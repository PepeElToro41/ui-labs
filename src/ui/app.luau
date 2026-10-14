local api = require "@src/api"
local app_render_provider = require "@contexts/app-render/app-render-provider"
local plugin_provider = require "@contexts/plugin/plugin-provider"
local scheduler_provider = require "@contexts/scheduler/scheduler-provider"
local SYSTEM_ORDER = require "@contexts/scheduler/system-order"
local use_system = require "@contexts/scheduler/use-system"
local use_world = require "@contexts/world/use-world"
local world_provider = require "@contexts/world/world-provider"
local module_loading = require "@src/systems/module-loading"
local module_search = require "@src/systems/module-search"
local mounters = require "@src/systems/mounters"
local previews = require "@src/systems/previews"
local story_nodes = require "@src/systems/story-nodes"
local storybooks = require "@src/systems/storybooks"
local videx = require "@utils/vide/videx"
local ui_labs = require "./ui-labs"

export type AppProps = {
	plugin: Plugin?,
	widget: DockWidgetPluginGui?,
	-- id of the widget, the app names the widgets it creates itself after it
	widget_id: string?,
	-- registers the automation api in `shared.UILabs[id]` while the app is mounted
	api: api.RegisterInfo?,
}

--- The whole app. `plugin`, `widget` and `api` come from the plugin entry point and are
--- absent when the app is rendered inside a story
local function app(props: AppProps?)
	local plugin_props: AppProps = props or {}

	return plugin_provider {
		plugin = plugin_props.plugin,
		widget = plugin_props.widget,
		widget_id = plugin_props.widget_id,
		children = function()
			return videx.provider_stack {
				providers = {
					world_provider,
					scheduler_provider,
					app_render_provider,
				},
				children = function()
					use_system(module_search.system(), SYSTEM_ORDER.module_search)
					use_system(module_loading.system(), SYSTEM_ORDER.module_loading)
					use_system(storybooks.system(), SYSTEM_ORDER.storybooks)
					use_system(story_nodes.system(), SYSTEM_ORDER.story_nodes)
					use_system(previews.system(), SYSTEM_ORDER.previews)
					use_system(mounters.system(), SYSTEM_ORDER.mounters)

					if plugin_props.api then
						api.register(use_world(), plugin_props.api)
					end

					return ui_labs {}
				end,
			}
		end,
	}
end

return app
