local add_names = require "@utils/ecs/add-names"
local environment = require "@utils/hot-reloading/environment"
local ecs = require "@vendor/ecs"

local components = {
	module_script = ecs.component() :: ecs.Component<ModuleScript>,

	r_extension = ecs.tag(),
	story = ecs.tag(),
	storybook = ecs.tag(),
	uilabs_config = ecs.tag(),

	folder = ecs.component() :: ecs.Component<Folder>,
	expanded = ecs.tag(),

	-- hot reloading --
	environment = ecs.component() :: ecs.Component<environment.Environment>,
	r_shared_environment = ecs.tag(),
	auto_reload = ecs.tag(),
	reload_queued = ecs.tag(),

	module_result = ecs.component() :: ecs.Component<unknown>,
	storybook_result = ecs.component() :: ecs.Component<Storybook>,

	-- tab preview --
	tab_preview = ecs.tag(),

	preview_holder = ecs.component() :: ecs.Component<Frame>,
	preview_holder_override = ecs.component() :: ecs.Component<Frame>,

	hidden = ecs.tag(),
	transparency = ecs.component() :: ecs.Component<number>,
	zoom = ecs.component() :: ecs.Component<number>,
	padding = ecs.component() :: ecs.Component<number>,
}

add_names(components)
ecs.meta(components.r_extension, ecs.Exclusive)

return components
