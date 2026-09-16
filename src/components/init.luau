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
	reload_postponed = ecs.tag(),

	module_result = ecs.component() :: ecs.Component<unknown>,
	module_error = ecs.component() :: ecs.Component<string>,
	storybook_result = ecs.component() :: ecs.Component<Storybook>,

	-- story nodes --
	storybook_node = ecs.tag(), -- lives on the storybook module entity itself
	folder_node = ecs.tag(),
	story_node = ecs.tag(),
	unknown_node = ecs.tag(),

	node_name = ecs.component() :: ecs.Component<string>, -- storybook / story display name
	node_instance = ecs.component() :: ecs.Component<Instance>, -- folder / unknown bound instance (name read live)
	node_order = ecs.component() :: ecs.Component<number>, -- layout order inside the parent
	r_module = ecs.tag(), -- relation: story node -> story module entity

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

-- a story node belongs to exactly one story module and is deleted with it
ecs.meta(components.r_module, ecs.Exclusive)
ecs.meta(components.r_module, ecs.pair(ecs.OnDeleteTarget, ecs.Delete))

return components
