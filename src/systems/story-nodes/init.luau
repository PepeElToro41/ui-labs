local CONFIG = require "@constants/config"
local use_world = require "@contexts/world/use-world"
local vide = require "@pkg/vide"
local c = require "@src/components"
local module_search = require "@src/systems/module-search"
local ecs = require "@vendor/ecs"

--[[
	Builds the story explorer tree as entities.

	Every node carries `(r_node, kind)`, so `(r_node, Wildcard)` matches any node and a query can
	walk `ChildOf` upwards through folders to the storybook without knowing each node's kind.

	- storybook node: the storybook module entity itself ((r_node, storybook), node_name, node_order)
	- folder node:    (r_node, folder), node_instance, node_order, ChildOf(parent)
	- story node:     (r_node, story), node_name, node_order, (r_module, story entity), ChildOf(parent)
	- unknown root:   (r_node, unknown), node_name "Unknown", node_order (single top level node holding
	                  one folder node per parent instance for stories outside every storybook)

	A story is claimed by the nearest ancestor that is a storybook root (the storybook sorted first by
	name wins a shared root), so any change runs a single reconcile pass that diffs the desired tree
	against the existing entities. ChildOf is exclusive, so re-parenting is one `world.add` and a
	no-op when nothing moved. Entities are reused, so per-node ui state such as `expanded` survives.

	The ecs cascades deletes through ChildOf and r_module before monitors fire, so monitors only
	invalidate the tree; every world write happens inside the rebuild.
]]

local story_nodes = {}

local STORY_EXTENSION = ecs.pair(c.r_extension, c.story)
local STORYBOOK_EXTENSION = ecs.pair(c.r_extension, c.storybook)

local STORYBOOK_NODE = ecs.pair(c.r_node, c.storybook)
local FOLDER_NODE = ecs.pair(c.r_node, c.folder)
local STORY_NODE = ecs.pair(c.r_node, c.story)
local UNKNOWN_NODE = ecs.pair(c.r_node, c.unknown)

local STORY_SUFFIX = CONFIG.file_extensions.story
local STORYBOOK_SUFFIX = CONFIG.file_extensions.storybook

-- roots are ordered separately (storybooks by name, unknown last)
local RANK_FOLDER = 1
local RANK_STORY = 2

local UNKNOWN_NAME = "Unknown"

-- a tree key is the node entity for storybooks / stories / the unknown root, or the instance for folders
type Key = ecs.Entity | Instance

type Entry = {
	key: Key,
	name: string,
	rank: number,
	tie: number, -- table.sort is unstable, so equal names fall back to this
}

local function compare_entries(a: Entry, b: Entry)
	if a.rank ~= b.rank then
		return a.rank < b.rank
	end
	local a_name, b_name = a.name:lower(), b.name:lower()
	if a_name ~= b_name then
		return a_name < b_name
	end
	return a.tie < b.tie
end

type Book = {
	entity: ecs.Entity,
	module: ModuleScript,
	result: Storybook,
	name: string,
}

type Story = {
	entity: ecs.Entity,
	module: ModuleScript,
}

type RootOwner = {
	book: ecs.Entity,
	group: boolean,
}

local function compare_books(a: Book, b: Book)
	local a_name, b_name = a.name:lower(), b.name:lower()
	if a_name ~= b_name then
		return a_name < b_name
	end
	return (a.entity :: any) < (b.entity :: any)
end

local function storybook_name(module: ModuleScript, result: Storybook): string
	local name = (result :: any).name
	if type(name) == "string" then
		return name
	end
	return module_search.remove_extension(module.Name, STORYBOOK_SUFFIX)
end

function story_nodes.system()
	local world = use_world()
	local dirty = false

	-- story nodes are keyed by their module entity, folder nodes by the instance. The storybook node
	-- is the module entity itself, so only the set of currently tagged ones is tracked.
	local story_nodes: Map<ecs.Entity, ecs.Entity> = {}
	local folder_nodes: Map<Instance, ecs.Entity> = {}
	local tagged_storybooks: Map<ecs.Entity, true> = {}

	local services: Map<Instance, true> = {}
	for _, service in CONFIG.story_search do
		services[service] = true
	end

	local function mark_dirty()
		dirty = true
	end

	-- nodes can be killed underneath us when their parent (storybook module or folder) or their
	-- story module is deleted, so a dead entry is treated as missing
	local function ensure_node<K>(nodes_map: Map<K, ecs.Entity>, from: K): ecs.Entity
		local existing = nodes_map[from]
		if existing and world.exists(existing) then
			return existing
		end
		local new_node = world.entity()
		nodes_map[from] = new_node
		return new_node
	end

	local function delete_node<K>(nodes_map: Map<K, ecs.Entity>, from: K)
		local existing = nodes_map[from]
		if not existing then
			return
		end
		if world.exists(existing) then
			world.delete(existing)
		end
		nodes_map[from] = nil
	end

	local function set_if_changed<T>(entity: ecs.Entity, component: ecs.Component<T>, value: T)
		if world.get(entity, component) ~= value then
			world.set(entity, component, value)
		end
	end

	-- instance signals that invalidate the tree, keyed the same way as the node maps
	local connections: Map<Key, { RBXScriptConnection }> = {}

	local function disconnect(key: Key)
		local existing = connections[key]
		if not existing then
			return
		end
		for _, connection in existing do
			connection:Disconnect()
		end
		connections[key] = nil
	end

	local function connect(key: Key, ...: RBXScriptConnection)
		disconnect(key)
		connections[key] = { ... }
	end

	vide.cleanup(function()
		for _, existing in connections do
			for _, connection in existing do
				connection:Disconnect()
			end
		end
		table.clear(connections)
	end)

	--- Folder nodes are created on demand by the rebuild for every instance between a storybook
	--- root (or the unknown root) and a story. The name is read live for display, but it also
	--- decides the sort order, so a rename still needs a rebuild.
	local function ensure_folder_node(instance: Instance): ecs.Entity
		local existing = folder_nodes[instance]
		if existing and world.exists(existing) then
			return existing
		end

		local node = ensure_node(folder_nodes, instance)
		world.add(node, FOLDER_NODE)
		world.set(node, c.node_instance, instance)
		connect(instance, instance:GetPropertyChangedSignal("Name"):Connect(mark_dirty))
		return node
	end

	local function delete_folder_node(instance: Instance)
		disconnect(instance)
		delete_node(folder_nodes, instance)
	end

	local q_storybooks = world.query(c.module_script, c.storybook_result):with(STORYBOOK_EXTENSION):cached()
	local q_stories = world.query(c.module_script):with(STORY_EXTENSION):cached()

	-- the single top level node that groups stories no storybook claimed
	local unknown_node: ecs.Entity = world.entity()

	-- storybook results appearing, being replaced or going away (including entity deletion)
	vide.cleanup(world.added(c.storybook_result, mark_dirty))
	vide.cleanup(world.changed(c.storybook_result, mark_dirty))
	vide.cleanup(world.removed(c.storybook_result, mark_dirty))

	-- fires when a story enters the query or its module_script value changes. A story moving
	-- in the hierarchy can change which storybook claims it, and a rename that keeps the story
	-- extension never touches the entity (the extension pair is already there), so both signals
	-- have to invalidate the tree from here.
	vide.cleanup(q_stories:observe(function(entity)
		local module = world.get(entity, c.module_script)
		if not module then
			disconnect(entity)
			return
		end

		connect(
			entity,
			module.AncestryChanged:Connect(mark_dirty),
			module:GetPropertyChangedSignal("Name"):Connect(mark_dirty)
		)
		mark_dirty()
	end))

	-- same for storybooks: the display name falls back to the module name
	vide.cleanup(q_storybooks:observe(function(entity)
		local module = world.get(entity, c.module_script)
		if not module then
			disconnect(entity)
			return
		end

		connect(entity, module:GetPropertyChangedSignal("Name"):Connect(mark_dirty))
		mark_dirty()
	end))

	-- leaving the query only invalidates: the node may already be dead through a cascade, and the
	-- rebuild diffs the node maps against the query anyway
	local story_monitor = q_stories:monitor()
	story_monitor.removed(function(entity: ecs.Entity)
		disconnect(entity)
		mark_dirty()
	end)
	vide.cleanup(story_monitor.cleanup)

	local storybook_monitor = q_storybooks:monitor()
	storybook_monitor.removed(function(entity: ecs.Entity)
		disconnect(entity)
		mark_dirty()
	end)
	vide.cleanup(storybook_monitor.cleanup)

	local function node_of(key: Key): ecs.Entity
		if typeof(key) == "Instance" then
			return ensure_folder_node(key :: Instance)
		end
		return key :: ecs.Entity
	end

	local function rebuild_tree()
		dirty = false

		-- pass 1: snapshot both queries. Nothing is written to the world until both are done,
		-- since adding node components moves the storybook entities between archetypes.
		local books: { Book } = {}
		for entity, module, result in q_storybooks:iter() do
			local book: Book = {
				entity = entity,
				module = module,
				result = result,
				name = storybook_name(module, result),
			}
			table.insert(books, book)
		end
		table.sort(books, compare_books)

		local stories: { Story } = {}
		for entity, module in q_stories:iter() do
			local story: Story = { entity = entity, module = module }
			table.insert(stories, story)
		end

		-- pass 2: plan the desired tree in plain lua
		local root_owner: Map<Instance, RootOwner> = {}
		for _, book in books do
			for _, root in book.result.storyRoots do
				if not root_owner[root] then
					root_owner[root] = { book = book.entity, group = book.result.groupRoots == true }
				end
			end
		end

		local children: Map<Key, { Entry }> = {}
		local folder_parent: Map<Instance, Key> = {}
		local story_parent: Map<ecs.Entity, Key> = {}

		local function push(parent: Key, entry: Entry)
			local list = children[parent]
			if not list then
				list = {}
				children[parent] = list
			end
			table.insert(list, entry)
		end

		local function place_folder(instance: Instance, parent: Key)
			local current = folder_parent[instance]
			assert(
				current == nil or current == parent,
				`[UI Labs] {instance:GetFullName()} would be placed under two different parents`
			)
			folder_parent[instance] = parent
		end

		for _, story in stories do
			local module = story.module

			-- walk up until a storybook root claims the story. The root test comes before the
			-- service stop because a service can itself be a root.
			local chain: { Instance } = {}
			local owner: RootOwner? = nil
			local current: Instance? = module
			while current do
				owner = root_owner[current]
				if owner then
					break
				end
				if current ~= module then
					table.insert(chain, current)
				end
				if services[current] then
					break
				end
				current = current.Parent
			end

			local parent: Key
			if owner then
				parent = owner.book
				if owner.group then
					table.insert(chain, current :: Instance)
				end
				-- chain is bottom-up, folders are placed top-down
				for index = #chain, 1, -1 do
					local instance = chain[index]
					place_folder(instance, parent)
					parent = instance
				end
			elseif module.Parent then
				-- unclaimed stories sit under one folder per parent instance in the unknown root
				parent = module.Parent
				place_folder(module.Parent, unknown_node)
			else
				continue
			end

			story_parent[story.entity] = parent
			push(parent, {
				key = story.entity,
				name = module_search.remove_extension(module.Name, STORY_SUFFIX),
				rank = RANK_STORY,
				tie = story.entity :: any,
			})
		end

		for instance, parent in folder_parent do
			push(parent, {
				key = instance,
				name = instance.Name,
				rank = RANK_FOLDER,
				tie = (folder_nodes[instance] :: any) or math.huge,
			})
		end

		local order: Map<Key, number> = {}
		for _, list in children do
			table.sort(list, compare_entries)
			for index, entry in list do
				order[entry.key] = index
			end
		end
		for index, book in books do
			order[book.entity] = index
		end
		order[unknown_node] = #books + 1

		-- pass 3: apply. Tags, names and orders go on before ChildOf so the ui mounts a
		-- complete node, and orphan folders are deleted last since deletion cascades.
		local wanted_books: Map<ecs.Entity, true> = {}
		for _, book in books do
			wanted_books[book.entity] = true
			tagged_storybooks[book.entity] = true
			set_if_changed(book.entity, c.node_name, book.name)
			set_if_changed(book.entity, c.node_order, order[book.entity])
			world.add(book.entity, STORYBOOK_NODE)
		end
		for entity in tagged_storybooks do
			if wanted_books[entity] then
				continue
			end
			tagged_storybooks[entity] = nil
			if world.exists(entity) then
				world.remove(entity, STORYBOOK_NODE)
				world.remove(entity, c.node_name)
				world.remove(entity, c.node_order)
			end
		end

		for instance in folder_parent do
			local node = ensure_folder_node(instance)
			set_if_changed(node, c.node_order, order[instance])
		end
		for instance, parent in folder_parent do
			world.add(node_of(instance), ecs.pair(ecs.ChildOf, node_of(parent)))
		end

		for _, story in stories do
			local parent = story_parent[story.entity]
			if not parent then
				continue
			end
			local node = ensure_node(story_nodes, story.entity)
			world.add(node, STORY_NODE)
			world.add(node, ecs.pair(c.r_module, story.entity))
			set_if_changed(node, c.node_name, module_search.remove_extension(story.module.Name, STORY_SUFFIX))
			set_if_changed(node, c.node_order, order[story.entity])
			world.add(node, ecs.pair(ecs.ChildOf, node_of(parent)))
		end
		for story_entity in story_nodes do
			if not story_parent[story_entity] then
				delete_node(story_nodes, story_entity)
			end
		end

		if children[unknown_node] then
			set_if_changed(unknown_node, c.node_name, UNKNOWN_NAME)
			set_if_changed(unknown_node, c.node_order, order[unknown_node])
			world.add(unknown_node, UNKNOWN_NODE)
		else
			world.remove(unknown_node, UNKNOWN_NODE)
		end

		-- every live node was re-parented above, so only other orphans can still hang off these
		for instance in folder_nodes do
			if not folder_parent[instance] then
				delete_folder_node(instance)
			end
		end
	end

	return function()
		if dirty then
			rebuild_tree()
		end
	end
end

local owner_queries: { [ecs.World]: any } = setmetatable({}, { __mode = "k" }) :: any

--- Finds the storybook a story node belongs to by walking `ChildOf` upwards
function story_nodes.owning_storybook(world: ecs.World, node: ecs.Entity): Storybook?
	local query = owner_queries[world]
	if not query then
		-- stylua: ignore
		query = world
			.query_build()
			:with(STORY_NODE)
			:term(c.storybook_result):up(ecs.ChildOf)
			:build()

		owner_queries[world] = query
	end

	for entity, storybook in query:iter() do
		if entity == node then
			return storybook
		end
	end
	return nil
end

return story_nodes
