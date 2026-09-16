local scheduler_provider = require "@contexts/scheduler/scheduler-provider"
local SYSTEM_ORDER = require "@contexts/scheduler/system-order"
local use_system = require "@contexts/scheduler/use-system"
local use_world = require "@contexts/world/use-world"
local world_provider = require "@contexts/world/world-provider"
local vide = require "@pkg/vide"
local module_loading = require "@src/systems/module-loading"
local module_search = require "@src/systems/module-search"
local story_nodes = require "@src/systems/story-nodes"
local storybooks = require "@src/systems/storybooks"
local videx = require "@utils/vide/videx"
local jabby = require "@vendor/jabby"
local ui_labs = require "./ui-labs"

local function app(props: {
	target: any,
})
	return videx.provider_stack {
		providers = {
			world_provider,
			scheduler_provider,
		},
		children = function()
			local world = use_world()

			use_system(module_search.system(), SYSTEM_ORDER.module_search)
			use_system(module_loading.system(), SYSTEM_ORDER.module_loading)
			use_system(storybooks.system(), SYSTEM_ORDER.storybooks)
			use_system(story_nodes.system(), SYSTEM_ORDER.story_nodes)

			jabby.register({
				applet = jabby.applets.world,
				name = `World - UI Labs`,
				configuration = {
					world = world,
				},
			} :: any)

			local client = jabby.obtain_client()
			client.spawn_app(client.apps.home :: any, nil, nil, props.target :: any)

			vide.cleanup(function()
				client.unmount_all()
			end)

			return ui_labs {}
		end,
	}
end

return app
