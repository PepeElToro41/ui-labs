local vide = require "@pkg/vide"

export type PluginHandle = {
	--- the plugin object, nil when the app runs outside the plugin (stories)
	plugin: Plugin?,
	--- the dock widget the app is mounted in, nil outside the plugin
	widget: DockWidgetPluginGui?,
}

-- defaults to an empty handle, so the app renders in stories without a provider
local PLUGIN_CONTEXT = vide.context({} :: PluginHandle) :: vide.Context<PluginHandle>
return PLUGIN_CONTEXT
