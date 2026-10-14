local CONFIG = require "@constants/config"
local use_plugin = require "@contexts/plugin/use-plugin"
local use_world = require "@contexts/world/use-world"
local vide = require "@pkg/vide"
local previews = require "@src/systems/previews"
local types = require "./types"
local widget_pool = require "./widget-pool"

-- only used when the app somehow runs without its own widget id, the pooled ids stay stable
local FALLBACK_PREFIX = "UILabs"

--- Widget holder: a dock widget of its own, which can be docked anywhere in Studio. The
--- widget is handed out by the pool and can take a few frames to arrive, the story stays
--- where it is until then. Closing the window closes the holder
local function widget_holder(props: types.HolderProps)
	local handle = use_plugin()
	local world = use_world()
	local plugin = handle.plugin

	-- no plugin (the app rendered inside a story), no widgets to hand out
	if not plugin then
		warn "[UI Labs] a story can only be shown in a widget while the plugin is running"
		return
	end

	local acquired = widget_pool.acquire {
		plugin = plugin,
		prefix = handle.widget_id or FALLBACK_PREFIX,
		ready = function(widget)
			props.target(widget)
		end,
		closed = function()
			previews.show_in(world, props.entity, "widget", false)
		end,
	}

	vide.effect(function()
		acquired.set_title(`{props.name()} - {CONFIG.plugin_name}`)
	end)

	vide.cleanup(function()
		props.target(nil)
		acquired.release()
	end)
end

return widget_holder :: types.Holder
