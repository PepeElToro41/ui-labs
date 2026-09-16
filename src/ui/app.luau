local app_render_provider = require "@contexts/app-render/app-render-provider"
local scheduler_provider = require "@contexts/scheduler/scheduler-provider"
local SYSTEM_ORDER = require "@contexts/scheduler/system-order"
local use_system = require "@contexts/scheduler/use-system"
local world_provider = require "@contexts/world/world-provider"
local module_loading = require "@src/systems/module-loading"
local module_search = require "@src/systems/module-search"
local previews = require "@src/systems/previews"
local story_nodes = require "@src/systems/story-nodes"
local storybooks = require "@src/systems/storybooks"
local videx = require "@utils/vide/videx"
local ui_labs = require "./ui-labs"

local function app(props: {}?)
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

			return ui_labs {}
		end,
	}
end

return app
