local add_names = require "@utils/ecs/add-names"
local environment = require "@utils/hot-reloading/environment"
local ecs = require "@vendor/ecs"
local control_types = require "@src/systems/controls/types"

export type StoryType = "Functional" | "React" | "Roact" | "Fusion" | "Iris" | "Vide" | "Generic"

local components = {
	module_script = ecs.component() :: ecs.Component<ModuleScript>,

	r_extension = ecs.tag(),
	story = ecs.tag(),
	storybook = ecs.tag(),
	uilabs_config = ecs.tag(),

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

	-- story nodes: every node carries (r_node, kind) so one wildcard term matches any node --
	r_node = ecs.tag(), -- relation: node -> kind (storybook / folder / story / unknown)
	folder = ecs.tag(), -- node kind
	unknown = ecs.tag(), -- node kind (storybook / story kinds reuse the extension tags)
	-- the storybook node lives on the storybook module entity itself

	node_name = ecs.component() :: ecs.Component<string>, -- storybook / story display name
	node_instance = ecs.component() :: ecs.Component<Instance>, -- folder / unknown bound instance (name read live)
	node_order = ecs.component() :: ecs.Component<number>, -- layout order inside the parent
	r_module = ecs.tag(), -- relation: story node -> story module entity

	-- previews (each preview loads the story module in its own environment, ChildOf its story node) --
	story_preview = ecs.tag(),
	quick_mounted = ecs.tag(), -- the single preview swapped by a plain click
	selected_preview = ecs.tag(), -- active tab
	preview_order = ecs.component() :: ecs.Component<number>, -- tab layout order, contiguous 1..n
	story_type = ecs.component() :: ecs.Component<StoryType>, -- detected from the preview's module_result
	story_error = ecs.component() :: ecs.Component<string>, -- why the result is not a valid story

	preview_holder = ecs.component() :: ecs.Component<Frame>,
	preview_holder_override = ecs.component() :: ecs.Component<Frame>,

	-- controls (one entity per story control, ChildOf the preview or of a control_group) --
	control = ecs.component() :: ecs.Component<control_types.Control>, -- the converted ui-labs control object
	control_value = ecs.component() :: ecs.Component<unknown>, -- live value: written by the ui, observed by mounters
	control_name = ecs.component() :: ecs.Component<string>, -- key in the story's controls table
	control_order = ecs.component() :: ecs.Component<number>, -- only when the control declares `Order`
	control_group = ecs.tag(), -- a ControlGroup entity, its controls are ChildOf it
	keep_controls = ecs.tag(), -- on a preview: values are recovered across reloads
	control_recovery = ecs.component() :: ecs.Component<control_types.RecoverData>, -- on a preview: last values, per control name

	hidden = ecs.tag(),
	transparency = ecs.component() :: ecs.Component<number>,
	zoom = ecs.component() :: ecs.Component<number>,
	padding = ecs.component() :: ecs.Component<number>,
}

add_names(components)
ecs.meta(components.r_extension, ecs.Exclusive)

-- a node has exactly one kind
ecs.meta(components.r_node, ecs.Exclusive)

-- a story node belongs to exactly one story module and is deleted with it
ecs.meta(components.r_module, ecs.Exclusive)
ecs.meta(components.r_module, ecs.pair(ecs.OnDeleteTarget, ecs.Delete))

return components
