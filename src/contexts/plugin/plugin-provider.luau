local PLUGIN_CONTEXT = require "./plugin-context"

type PluginHandle = PLUGIN_CONTEXT.PluginHandle

--- Exposes the plugin object and the widget the app lives in. Both are optional so
--- the app can render in stories, where neither exists
local function plugin_provider(props: {
	plugin: Plugin?,
	widget: DockWidgetPluginGui?,
	children: () -> any,
})
	local handle: PluginHandle = {
		plugin = props.plugin,
		widget = props.widget,
	}
	return PLUGIN_CONTEXT(handle, props.children)
end

return plugin_provider
