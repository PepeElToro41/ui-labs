--!optimize 2
--!native
--!strict

local engine = require "@self/engine"

type u24 = number
type u53 = number
type ArchetypeId = number
type Bitset = number
type Column = Array<any>
type Cleanup = () -> ()

type Map<T, V> = { [T]: V }
type Array<T> = { T }

export type Entity<T = any> = { __T: T }
export type Component<T = any> = { __T: T }
export type Id<T = any> = { __T: T }
export type Pair<R, T> = Id<R>

type ArchetypeChangedHook = (source: Archetype, destination: Archetype) -> ()

type SetHook<T = any> = (entity: Entity, id: Id<T>, value: T) -> ()
type RemovedHook<T = any> = ((entity: Entity, id: Id<T>) -> () -> ()?) | (entity: Entity, id: Id<T>) -> ()?

export type ArchetypeMatch = (archetype: Archetype) -> boolean

type ArchetypeObserverCallback = (archetype: Archetype) -> ()
type ArchetypeObserver = { match: ArchetypeMatch, callback: ArchetypeObserverCallback }

type QueryMonitorCallback = (entity: u53, operation_id: number?) -> ()

type QueryIdMonitor = {
	match: ArchetypeMatch,
	added: QueryMonitorCallback?,
	removed: QueryMonitorCallback?,
}

type QueryIdObserver = {
	match: ArchetypeMatch,
	callback: QueryMonitorCallback,
}

export type Monitor = {
	cleanup: Cleanup,
	added: ((entity: Entity) -> ()) -> (),
	removed: ((entity: Entity) -> ()) -> (),
}

export type QueryChanged<T...> = typeof(setmetatable(
	{} :: {
		iter: () -> () -> (Entity, T...),
		cleanup: Cleanup,
	},
	{} :: {
		__iter: () -> () -> (Entity, T...),
	}
))

export type Query<T...> = typeof(setmetatable(
	{} :: {
		is_cached: boolean,

		with: (Query<T...>, ...Component) -> Query<T...>,
		without: (Query<T...>, ...Component) -> Query<T...>,
		clone: (Query<T...>) -> Query<T...>,
		rematch: (Query<T...>) -> { Archetype },
		archetypes: (Query<T...>) -> { Archetype },
		columns: (Query<T...>) -> () -> ...{ any },

		match: (Query<T...>, Archetype) -> boolean,
		has: (Query<T...>, entity: Entity) -> boolean,
		empty: (Query<T...>) -> boolean,
		count: (Query<T...>) -> number,
		entities: (Query<T...>) -> { Entity },
		random: (Query<T...>) -> Entity?,
		first: (Query<T...>, predicator: ((Entity, T...) -> boolean)?) -> (Entity, T...),

		cached: (Query<T...>) -> Query<T...>,
		cleanup: (Query<T...>) -> (),
		iter: (Query<T...>) -> () -> (Entity, T...),
		patch: (Query<T...>, mapper: (entity: Entity, T...) -> T...) -> (),

		monitor: (Query<T...>) -> Monitor,
		observe: (Query<T...>, callback: (entity: Entity) -> ()) -> Cleanup,
		changed: (Query<T...>) -> QueryChanged<T...>,
	},
	{} :: {
		__iter: () -> () -> (Entity, T...),
	}
))

export type QueryInternal = Query<any> & {
	terms: { u53 },
	with_ids: { u53 },
	without_ids: { u53 }?,
	cache_cleanup: (() -> ())?,

	world: World,
	compatible_archetypes: Array<Archetype>,
	compatible_archetypes_map: Map<ArchetypeId, number>,
}

export type Archetype = {
	archetype_id: ArchetypeId,
	hash: string,
	-- alive: holds at least one entity. destroyed: removed from the world,
	-- edges cleared and component records unlinked; must never be reused.
	alive: boolean,
	destroyed: boolean,

	entities: { Entity },
	columns: Array<Column>,
	components: Array<u53>,

	columns_map: { [u53]: Column },
	-- (R, *) wildcard id -> the single (R, T) pair this archetype holds, for
	-- every exclusive relation R. Lets add/set/bulk ops find the pair to swap
	-- out with one lookup.
	exclusive_pairs: Map<u53, u53>,
	forward_edges: Map<u53, Archetype>,
	backwards_edges: Map<u53, Archetype>,
	swapped_edges: Map<u53, u53>,

	traversable_count: number,
	traversable_ids: { u53 },
}

export type EntityRecord = {
	archetype: Archetype,
	archetype_row: number,
	dense: u24,
	deleting: boolean,

	archetype_changed: { ArchetypeChangedHook }?,
}

type ReachableElement = {
	archetype: Archetype,
	record: EntityRecord,
	entity: u53,
}

type ReachableCache = {
	generation: number,
	current: number,
	cached: Map<u53, true>,
	reachable: Map<u53, ReachableElement>,
}

export type PairRecord = ComponentRecord & {
	pairs_count: Map<ArchetypeId, number>,

	-- all records that share the same relation: (R, *)
	first_records: Map<u53, PairRecord>,
	-- all records that share the same target: (*, T)
	second_records: Map<u53, PairRecord>,
	-- all records with a traversable relation that share the same target:
	-- (R, T) where R is any id with ECS_TRAVERSABLE trait
	trav_records: Map<u53, PairRecord>,

	-- To find which components are reachable through the relation
	reachable: ReachableCache,
}

export type ComponentRecord = {
	-- archetype id -> column index of this id inside that archetype. Lookup only.
	column_index: Map<ArchetypeId, number>,
	-- dense list of every archetypeid with this component.
	archetype_ids: { ArchetypeId },
	-- archetype id -> position in archetype_ids, for swap-remove
	archetype_slots: Map<ArchetypeId, number>,

	flags: Bitset,

	on_added: Array<{ SetHook }>?,
	on_changed: Array<{ SetHook }>?,
	on_removed: Array<{ RemovedHook }>?,

	monitors: Array<{ QueryIdMonitor }>?,

	-- observers_added will fire when the entity's archetype changes
	-- observers_changed will fire when the column value changes
	observers_added: Array<{ QueryIdObserver }>?,
	observers_changed: Array<{ QueryIdObserver }>?,
}

export type ComponentsLookup = Map<u53, ComponentRecord>

export type EntityIndex = {
	dense: Array<u53>,
	sparse: Map<u24, EntityRecord>,
	alive: number,
}

export type WorldInternal = {
	entity_index: EntityIndex,
	component_record_ensure: (id: u53) -> ComponentRecord,

	get_entity_any: (entity_id: u24) -> u53?,
	get_entity_alive: (entity_id: u24) -> u53?,

	get_entity_record: (entity: u53) -> EntityRecord?,
	get_entity_record_alive: (entity: u53) -> EntityRecord?,
	get_entity_record_asserts_alive: (entity: u53) -> EntityRecord?,

	archetype_creation_observers: Map<u53, { ArchetypeObserver }>,
	archetype_destruction_observers: Map<u53, { ArchetypeObserver }>,

	-- entity index
	get_new_entity_id: () -> u53,
	delete_entity_id: (id: u24, record: EntityRecord) -> (),

	-- component records
	component_record_create: (id: u53) -> ComponentRecord,
	wildcard_record_ensure: (wildcard: u53) -> PairRecord,
	check_is_component: (relation: u53, target: u53?) -> boolean,

	-- archetype graph
	archetype_create: (ids: { u53 }, hash: string) -> Archetype,
	archetype_ensure: (ids: { u53 }) -> Archetype,
	archetype_destroy: (archetype: Archetype) -> (),
	archetype_find_with: (source: Archetype, id: u53) -> Archetype,
	archetype_find_without: (source: Archetype, id: u53) -> Archetype,
	archetype_find_swap_with: (source: Archetype, old: u53, new: u53, column: number) -> Archetype,

	-- archetype rows
	archetype_insert_entity: (entity: u53, archetype: Archetype) -> number,
	archetype_assign_entity: (entity: u53, record: EntityRecord, archetype: Archetype) -> (),
	archetype_move_entity: (entity: u53, record: EntityRecord, source: Archetype, destination: Archetype) -> (),
	archetype_delete_entity: (archetype: Archetype, row: number) -> (),

	-- module level helpers (stateless)
	ENTITY_MASK: number,
	GENERATION_MASK: number,
	MAX_COMPONENT_ID: number,
	ENTITY_ID: (e: u53) -> u24,
	ENTITY_GENERATION: (e: u53) -> u24,
	APPEND_GENERATION: (id: number, generation: number) -> u53,
	INCREMENT_GENERATION: (e: u53) -> u53,
	FIND_INSERT: (ids: { u53 }, added: u53) -> number,
	HASH_IDS: (ids: { u53 }) -> string,
	REMOVE_ALL_PAIRS: (
		components: { u53 },
		components_count: number,
		pair_start: number,
		pair_count: number
	) -> { u53 },
	INSERT_COMPONENT_HOOK: <T>(callback: T, hooks: { T }?) -> ({ T }, Cleanup),
	MATCH_ARCHETYPE: (with_ids: { number }, without_ids: { number }?, archetype: Archetype) -> boolean,
	FIND_MATCHED_ARCHETYPES: (
		world: World,
		with_ids: { number },
		without_ids: { number }?,
		ignore_empty: boolean
	) -> { Archetype },
	OBSERVE_MATCHED_ARCHETYPES: (
		world: World,
		with_ids: { number },
		without_ids: { number }?
	) -> ({ Archetype }, Map<ArchetypeId, number>, Cleanup),

	get_archetypes_count: () -> number,

	ECS_PAIR: (first: u53, second: u53) -> u53,
	PAIR_FIRST: (id: u53) -> u24,
	PAIR_SECOND: (id: u53) -> u24,
	IS_PAIR: (id: u53) -> boolean,
	ECS_WILDCARD: u53,
	ECS_TRANSITIVE: u53,
	NULL_ARRAY: { any },
}

export type World = {
	components_lookup: Map<u53, ComponentRecord>,
	archetypes_lookup: Map<string, Archetype>,
	internal: WorldInternal,

	archetypes: Map<ArchetypeId, Archetype>,
	ROOT_ARCHETYPE: Archetype,

	tag: () -> Entity,
	component: <T>() -> Component<T>,
	entity: () -> Entity,

	exists: (entity: Entity) -> boolean,
	alive: (entity: Entity) -> boolean,
	deleting: (entity: Entity) -> boolean,

	has: (entity: Entity, id: Component) -> boolean,
	get: & (<A>(Entity, Component<A>) -> A)
		& (<A, B>(Entity, Component<A>, Component<B>) -> (A, B))
		& (<A, B, C>(Entity, Component<A>, Component<B>, Component<C>) -> (A, B, C))
		& (<A, B, C, D>(Entity, Component<A>, Component<B>, Component<C>, Component<D>) -> (A, B, C, D))
		& (<A, B, C, D, E>(
			Entity,
			Component<A>,
			Component<B>,
			Component<C>,
			Component<D>,
			Component<E>
		) -> (A, B, C, D, E))
		& (<A, B, C, D, E, F>(
			Entity,
			Component<A>,
			Component<B>,
			Component<C>,
			Component<D>,
			Component<E>,
			Component<F>
		) -> (A, B, C, D, E, F))
		& (<A, B, C, D, E, F, G>(
			Entity,
			Component<A>,
			Component<B>,
			Component<C>,
			Component<D>,
			Component<E>,
			Component<F>,
			Component<G>
		) -> (A, B, C, D, E, F, G))
		& (<A, B, C, D, E, F, G, H>(
			Entity,
			Component<A>,
			Component<B>,
			Component<C>,
			Component<D>,
			Component<E>,
			Component<F>,
			Component<G>,
			Component<H>
		) -> (A, B, C, D, E, F, G, H))
		& (<A, B, C, D, E, F, G, H>(
			Entity,
			Component<A>,
			Component<B>,
			Component<C>,
			Component<D>,
			Component<E>,
			Component<F>,
			Component<G>,
			Component<H>,
			...Component
		) -> (A, B, C, D, E, F, G, H, ...any)),

	parent: (child: Entity) -> Entity,
	children: (parent: Entity) -> () -> Entity,
	target: (entity: Entity, relation: Id, index: number?) -> Entity,
	traverse: <T>(entity: Entity, relation: Id, id: Component<T>) -> (Entity, T),
	pairs: (entity: Entity, relation: Id) -> () -> Entity,

	add: (entity: Entity, id: Component) -> (),
	set: <T>(entity: Entity, id: Component<T>, data: T) -> (),
	remove: (entity: Entity, id: Component) -> (),
	delete: (entity: Entity) -> (),

	wipe: (component: Id) -> (),
	clear: (entity: Entity) -> (),

	bulk_add: (entity: Entity, ids: { Id }) -> (),
	bulk_set: (entity: Entity, ids: { Id }, values: { any }) -> (),
	bulk_remove: (entity: Entity, ids: { Id }) -> (),

	added: <T>(id: Id<T>, callback: SetHook<T>) -> Cleanup,
	changed: <T>(id: Id<T>, callback: SetHook<T>) -> Cleanup,
	removed: <T>(id: Id<T>, callback: RemovedHook<T>) -> Cleanup,

	pair_first: <T>(Pair<T, any>) -> Id<T>,
	pair_second: <T>(Pair<any, T>) -> Id<T>,
	is_component: (Id) -> boolean,
	is_tag: (Id) -> boolean,

	each: (id: Component) -> () -> Entity,
	query_build: () -> engine.QueryBuilder,
	query: (() -> Query<nil>)
		& (<A>(Component<A>) -> Query<A>)
		& (<A, B>(Component<A>, Component<B>) -> Query<A, B>)
		& (<A, B, C>(Component<A>, Component<B>, Component<C>) -> Query<A, B, C>)
		& (<A, B, C, D>(Component<A>, Component<B>, Component<C>, Component<D>) -> Query<A, B, C, D>)
		& (<A, B, C, D, E>(
			Component<A>,
			Component<B>,
			Component<C>,
			Component<D>,
			Component<E>
		) -> Query<A, B, C, D, E>)
		& (<A, B, C, D, E, F>(
			Component<A>,
			Component<B>,
			Component<C>,
			Component<D>,
			Component<E>,
			Component<F>
		) -> Query<A, B, C, D, E, F>)
		& (<A, B, C, D, E, F, G>(
			Component<A>,
			Component<B>,
			Component<C>,
			Component<D>,
			Component<E>,
			Component<F>,
			Component<G>
		) -> Query<A, B, C, D, E, F, G>)
		& (<A, B, C, D, E, F, G, H>(
			Component<A>,
			Component<B>,
			Component<C>,
			Component<D>,
			Component<E>,
			Component<F>,
			Component<G>,
			Component<H>,
			...Component<any>
		) -> Query<A, B, C, D, E, F, G, H>),
}

local MAX_COMPONENT_ID: number = _G.ECS_MAX_COMPONENT_ID or 256

local ENTITY_MASK = bit32.lshift(1, 24)
local GENERATION_MASK = bit32.lshift(1, 16)
local PAIR_OFFSET = 2 ^ 48

local PAIR_HOOK_INDEX = 1
local RELATION_WC_HOOK_INDEX = 2
local TARGET_WC_HOOK_INDEX = 3

--[[
local BITSET_RANGE = 32
local BITSET_PAGE_SIZE = 8
local BITSET_MAX_ID = BITSET_RANGE * BITSET_PAGE_SIZE
]]

-- stylua: ignore start
local ECS_WILDCARD = 		   MAX_COMPONENT_ID +  1
local ECS_CHILDOF = 		   MAX_COMPONENT_ID +  2
local ECS_NAME = 			   MAX_COMPONENT_ID +  3
local ECS_COMPONENT = 		   MAX_COMPONENT_ID +  4
local ECS_EXCLUSIVE = 		   MAX_COMPONENT_ID +  5
local ECS_ON_DELETE_TARGET =   MAX_COMPONENT_ID +  6
local ECS_DELETE = 			   MAX_COMPONENT_ID +  7
local ECS_ON_DELETE = 		   MAX_COMPONENT_ID +  8
local ECS_ERROR = 			   MAX_COMPONENT_ID +  9
local ECS_TRAVERSABLE = 	   MAX_COMPONENT_ID + 10
local ECS_DISABLED = 		   MAX_COMPONENT_ID + 11
local ECS_FORCE_TAG = 	   MAX_COMPONENT_ID + 12
local ECS_TRANSITIVE = 	   MAX_COMPONENT_ID + 13
local ECS_REST = 			   MAX_COMPONENT_ID + 14
-- stylua: ignore end

local IS_COMPONENT_FLAG = bit32.lshift(1, 0)
local IS_EXCLUSIVE_FLAG = bit32.lshift(1, 1)
local IS_TRAVERSABLE_FLAG = bit32.lshift(1, 3)
local HAS_DELETE_FLAG = bit32.lshift(1, 2)

local NULL_ARRAY = table.freeze {} :: { any }
local NULL_VALUE = newproxy()

local preregistered_components_count = 0
local preregistered_components: Map<u53, true> = {}
local preregistered_entities_count = ECS_REST
local preregistered_metadata: Map<u53, Map<u53, any>> = {}

local function NOOP() end

local function IS_PAIR(e: number): boolean
	return e > PAIR_OFFSET
end

local function PAIR_FIRST(id: u53): u24
	return (id - PAIR_OFFSET) // ENTITY_MASK
end

local function PAIR_SECOND(id: u53): u24
	return (id - PAIR_OFFSET) % ENTITY_MASK
end

local function ENTITY_ID(e: u53): u24
	return e % ENTITY_MASK
end

local function ENTITY_GENERATION(e: u53): u24
	return e // ENTITY_MASK
end

local function APPEND_GENERATION(id: number, generation: number): u53
	return id + (generation * ENTITY_MASK)
end

local function ECS_PAIR(first: u24, second: u24): u53
	first = ENTITY_ID(first)
	second = ENTITY_ID(second)

	return second + (first * ENTITY_MASK) + PAIR_OFFSET
end

local function HASH_IDS(ids: { u53 })
	return table.concat(ids, "-")
end

local function FIND_INSERT(ids: { u53 }, added: u53)
	for i, id in ids do
		if id == added then
			return -1
		end
		if id > added then
			return i
		end
	end
	return #ids + 1
end

local function INSERT_COMPONENT_HOOK<T>(callback: T, hooks: { T }?): ({ T }, Cleanup)
	if hooks then
		table.insert(hooks, callback)
	else
		hooks = { callback }
	end

	local function disconnect()
		local index = table.find(hooks :: { any }, callback)
		if index then
			table.remove(hooks :: { any }, index)
		end
	end

	return hooks :: { T }, disconnect
end

local function PREREGISTER_COMPONENT()
	preregistered_components_count += 1
	preregistered_components[preregistered_components_count] = true
	return preregistered_components_count
end

local function PREREGISTER_TAG()
	preregistered_components_count += 1
	return preregistered_components_count
end

local function PREREGISTER_ENTITY()
	preregistered_entities_count += 1
	return preregistered_entities_count
end

local function PREREGISTER_METADATA<T>(entity: u53, id: u53, value: T?)
	local meta: Map<u53, any> = preregistered_metadata[entity]
	if not meta then
		meta = {}
		preregistered_metadata[entity] = meta
	end
	meta[id] = if value == nil then NULL_VALUE else value
end

--[[
local function SET_COMPONENT_BITSETS(component_bitsets: Map<number, Bitset>, id: number)
	local bit = id - 1
	local bitset_page = bit // BITSET_RANGE
	local bit_index = bit - (bitset_page * BITSET_RANGE)

	local bitset_index = bitset_page + 1
	local bitset = component_bitsets[bitset_index] or 0
	component_bitsets[bitset_index] = bit32.bor(bitset, bit32.lshift(1, bit_index))
end
]]

local CHECK_FLAG = bit32.btest

local function INCREMENT_GENERATION(e: u53): u53
	if e > ENTITY_MASK then
		local id = ENTITY_ID(e)
		local generation = ENTITY_GENERATION(e)

		local next_gen = generation + 1
		if next_gen >= GENERATION_MASK then
			return id
		end

		return APPEND_GENERATION(id, next_gen)
	end
	return APPEND_GENERATION(e, 1)
end

local function REMOVE_ALL_PAIRS(components: { u53 }, components_count: number, pair_start: number, pair_count: number)
	local destination_ids = table.create(components_count - pair_count) :: { u53 }
	-- Pairs occupy the contiguous range [pair_start, pair_end]. Everything
	-- before and after that range is kept, in order.
	local pair_end = pair_start + pair_count - 1

	if pair_start > 1 then
		table.move(components, 1, pair_start - 1, 1, destination_ids)
	end
	if pair_end < components_count then
		table.move(components, pair_end + 1, components_count, pair_start, destination_ids)
	end

	return destination_ids
end

local function FIRE_SET_HOOKS(all_hooks: Array<{ SetHook }>, entity: u53, id: u53, data: any)
	for _, hooks in all_hooks do
		for _, hook in hooks do
			hook(entity :: any, id :: any, data)
		end
	end
end

local function FIRE_REMOVE_HOOKS(all_hooks: Array<{ RemovedHook }>, entity: u53, id: u53, append_to: { () -> () }?)
	local post_removed_callbacks: { () -> () }? = append_to

	for _, hooks in all_hooks do
		for _, hook in hooks :: any do
			local post_removed = hook(entity, id) :: () -> ()
			if post_removed then
				if post_removed_callbacks then
					table.insert(post_removed_callbacks, post_removed)
				else
					post_removed_callbacks = { post_removed }
				end
			end
		end
	end

	return post_removed_callbacks
end

local function PROPAGATE_PAIR_EVENTS<T>(
	world: World,
	id: u53,
	pair_record: PairRecord,
	all_hooks: Array<{ T }>,
	get_hooks: (PairRecord) -> Array<{ T }>?,
	set_hooks: (PairRecord, Array<{ T }>) -> ()
)
	local hooks = all_hooks[PAIR_HOOK_INDEX]

	local relation_wildcard = ECS_PAIR(PAIR_FIRST(id), ECS_WILDCARD)
	local target_wildcard = ECS_PAIR(ECS_WILDCARD, PAIR_SECOND(id))

	if relation_wildcard == id then
		for _, relation_record in pair_record.first_records do
			local relation_hooks = get_hooks(relation_record)
			if relation_hooks then
				relation_hooks[RELATION_WC_HOOK_INDEX] = hooks
			else
				set_hooks(relation_record, { [PAIR_HOOK_INDEX] = {}, [RELATION_WC_HOOK_INDEX] = hooks })
			end
		end
	elseif target_wildcard == id then
		for _, target_record in pair_record.second_records do
			local target_hooks = get_hooks(target_record)
			if target_hooks then
				target_hooks[RELATION_WC_HOOK_INDEX] = target_hooks[RELATION_WC_HOOK_INDEX] or {}
				target_hooks[TARGET_WC_HOOK_INDEX] = hooks
			else
				set_hooks(target_record, {
					[PAIR_HOOK_INDEX] = {},
					[RELATION_WC_HOOK_INDEX] = {},
					[TARGET_WC_HOOK_INDEX] = hooks,
				})
			end
		end
	else
		local components_lookup = world.components_lookup
		local relation_record = components_lookup[relation_wildcard] :: PairRecord
		local target_record = components_lookup[target_wildcard] :: PairRecord

		local relation_hooks = get_hooks(relation_record)
		local target_hooks = get_hooks(target_record)

		-- Link both wildcards independently. Slot 2 must never be left empty
		-- when slot 3 is set, otherwise the hook array has a hole.
		if relation_hooks then
			all_hooks[RELATION_WC_HOOK_INDEX] = relation_hooks[PAIR_HOOK_INDEX]
		end
		if target_hooks then
			all_hooks[RELATION_WC_HOOK_INDEX] = all_hooks[RELATION_WC_HOOK_INDEX] or {}
			all_hooks[TARGET_WC_HOOK_INDEX] = target_hooks[PAIR_HOOK_INDEX]
		end
	end
end

local function FIRE_MONITORS_ENTITIES(
	all_monitors: Array<{ QueryIdMonitor }>,
	entities: { u53 },
	source: Archetype,
	destination: Archetype,
	operation_id: number?
)
	for _, monitors in all_monitors do
		for _, monitor in monitors do
			local match = monitor.match
			local matched_before = match(source)
			local matched_after = match(destination)

			if matched_before ~= matched_after then
				if matched_before then
					local removed = monitor.removed
					if removed then
						for _, entity in entities do
							removed(entity, operation_id)
						end
					end
				else
					local added = monitor.added
					if added then
						for _, entity in entities do
							added(entity, operation_id)
						end
					end
				end
			end
		end
	end
end

local function FIRE_OBSERVERS_ENTITIES(
	all_observers: Array<{ QueryIdObserver }>,
	entities: { u53 },
	archetype: Archetype,
	operation_id: number?
)
	for _, observers in all_observers do
		for _, observer in observers do
			local callback = observer.callback
			if observer.match(archetype) then
				for _, entity in entities do
					callback(entity, operation_id)
				end
			end
		end
	end
end

local function FIRE_MONITORS(
	all_monitors: Array<{ QueryIdMonitor }>,
	entity: u53,
	source: Archetype,
	destination: Archetype,
	operation_id: number?
)
	for _, monitors in all_monitors do
		for _, monitor in monitors do
			local match = monitor.match
			local matched_before = match(source)
			local matched_after = match(destination)

			if matched_before ~= matched_after then
				if matched_before then
					local removed = monitor.removed
					if removed then
						removed(entity, operation_id)
					end
				else
					local added = monitor.added
					if added then
						added(entity, operation_id)
					end
				end
			end
		end
	end
end

local function FIRE_MONITORS_ADDED(
	all_monitors: Array<{ QueryIdMonitor }>,
	entity: u53,
	destination: Archetype,
	operation_id: number?
)
	for _, monitors in all_monitors do
		for _, monitor in monitors do
			local added = monitor.added
			if added then
				if monitor.match(destination) then
					added(entity, operation_id)
				end
			end
		end
	end
end

local function FIRE_MONITORS_REMOVED(
	all_monitors: Array<{ QueryIdMonitor }>,
	entity: u53,
	source: Archetype,
	operation_id: number?
)
	for _, monitors in all_monitors do
		for _, monitor in monitors do
			local removed = monitor.removed
			if removed then
				if monitor.match(source) then
					removed(entity, operation_id)
				end
			end
		end
	end
end

local function FIRE_OBSERVERS(
	all_observers: Array<{ QueryIdObserver }>,
	entity: u53,
	destination: Archetype,
	operation_id: number?
)
	for _, observers in all_observers do
		for _, observer in observers do
			if observer.match(destination) then
				observer.callback(entity, operation_id)
			end
		end
	end
end

local function REMOVE_INSERTED_OBSERVERS<T>(inserted_in: { { T } }, observer: T)
	for _, observers in inserted_in do
		local index = table.find(observers, observer)
		if index then
			table.remove(observers, index)
		end
	end
end

local function MATCH_ARCHETYPE(with_ids: { number }, without_ids: { number }?, archetype: Archetype)
	local columns_map = archetype.columns_map
	for _, id in with_ids do
		if not columns_map[id] then
			return false
		end
	end
	if without_ids then
		for _, id in without_ids do
			if columns_map[id] then
				return false
			end
		end
	end
	return true
end

-- TODO: make faster archetype matching with bitsets
local function FIND_MATCHED_ARCHETYPES(
	world: World,
	with_ids: { number },
	without_ids: { number }?,
	ignore_empty: boolean
)
	local archetypes = world.archetypes
	local components_lookup = world.components_lookup

	local best_record: ComponentRecord? = nil
	local best_record_count = math.huge
	local compatible: { Archetype } = {}

	for _, id in with_ids do
		local record = components_lookup[id]
		if not record then
			continue
		end
		local archetype_count = #record.archetype_ids
		if archetype_count < best_record_count then
			best_record = record
			best_record_count = archetype_count
		end
	end

	if best_record == nil then
		return compatible
	end

	if ignore_empty then
		for _, archetype_id in best_record.archetype_ids do
			local archetype = archetypes[archetype_id]
			if not archetype.alive then
				continue
			end
			local columns_map = archetype.columns_map
			local skip = false

			for _, component in with_ids do
				if not columns_map[component] then
					skip = true
					break
				end
			end
			if skip then
				continue
			end

			if without_ids then
				for _, component in without_ids do
					if columns_map[component] then
						skip = true
						break
					end
				end
				if skip then
					continue
				end
			end

			table.insert(compatible, archetype)
		end
	else
		for _, archetype_id in best_record.archetype_ids do
			local archetype = archetypes[archetype_id]
			local columns_map = archetype.columns_map
			local skip = false

			for _, id in with_ids do
				if not columns_map[id] then
					skip = true
					break
				end
			end
			if skip then
				continue
			end

			if without_ids then
				for _, id in without_ids do
					if columns_map[id] then
						skip = true
						break
					end
				end
				if skip then
					continue
				end
			end

			table.insert(compatible, archetype)
		end
	end
	return compatible
end

local function OBSERVE_MATCHED_ARCHETYPES(world: World, with_ids: { number }, without_ids: { number }?)
	local internal = world.internal
	local archetype_creation_observers = internal.archetype_creation_observers
	local archetype_destruction_observers = internal.archetype_destruction_observers

	if #with_ids == 0 then
		error "cannot use a query with no terms"
	end

	local compatible_archetypes = FIND_MATCHED_ARCHETYPES(world, with_ids, without_ids, false)
	local compatible_archetypes_map: Map<ArchetypeId, number> = {}

	local observe_id = with_ids[1]

	for index, archetype in compatible_archetypes do
		compatible_archetypes_map[archetype.archetype_id] = index
	end

	local function creation_observer_callback(archetype: Archetype)
		local index = #compatible_archetypes + 1
		compatible_archetypes[index] = archetype
		compatible_archetypes_map[archetype.archetype_id] = index
	end

	local function destruction_observer_callback(archetype: Archetype)
		local archetype_id = archetype.archetype_id
		local row = compatible_archetypes_map[archetype_id]

		local last_row = #compatible_archetypes

		if row ~= last_row then
			local last_archetype = compatible_archetypes[last_row]
			compatible_archetypes[row] = last_archetype
			compatible_archetypes_map[last_archetype.archetype_id] = row
		end

		compatible_archetypes[last_row] = nil
		compatible_archetypes_map[archetype_id] = nil
	end

	local function archetype_matcher(archetype: Archetype)
		return MATCH_ARCHETYPE(with_ids, without_ids, archetype)
	end

	local creation_observer: ArchetypeObserver = {
		match = archetype_matcher,
		callback = creation_observer_callback,
	}
	local destruction_observer: ArchetypeObserver = {
		match = archetype_matcher,
		callback = destruction_observer_callback,
	}

	local creation_observers = archetype_creation_observers[observe_id]
	if creation_observers then
		table.insert(creation_observers, creation_observer)
	else
		creation_observers = { creation_observer }
		archetype_creation_observers[observe_id] = creation_observers
	end

	local destruction_observers = archetype_destruction_observers[observe_id]
	if destruction_observers then
		table.insert(destruction_observers, destruction_observer)
	else
		destruction_observers = { destruction_observer }
		archetype_destruction_observers[observe_id] = destruction_observers
	end

	local function cleanup()
		local creation_index = table.find(creation_observers, creation_observer)
		if creation_index then
			table.remove(creation_observers, creation_index)
		end

		local destruction_index = table.find(destruction_observers, destruction_observer)
		if destruction_index then
			table.remove(destruction_observers, destruction_index)
		end
	end

	return compatible_archetypes, compatible_archetypes_map, cleanup
end

-- TODO: make archetype caching optional
local function observer_new(
	world: World,
	terms: { u53 },
	with_ids: { u53 },
	without_ids: { u53 }?,
	callback: (entity: u53) -> ()
)
	local component_record_ensure = world.internal.component_record_ensure
	local _, archetypes_map, observers_cleanup = OBSERVE_MATCHED_ARCHETYPES(world, with_ids, without_ids)
	local last_operation_id: number? = nil
	local fired_entities: { [u53]: boolean } = {}

	local function query_match(archetype: Archetype)
		return archetypes_map[archetype.archetype_id] ~= nil
	end

	local function match_callback(entity: u53, operation_id: number?)
		if operation_id then
			if operation_id ~= last_operation_id then
				last_operation_id = operation_id
				table.clear(fired_entities)
			elseif fired_entities[entity] then
				return
			end
			fired_entities[entity] = true
		end
		callback(entity)
	end

	local query_observer: QueryIdObserver = {
		match = query_match,
		callback = match_callback,
	}

	local inserted_in: { { QueryIdObserver } } = {}

	local function insert_added_observers(ids: { u53 })
		for _, id in ids do
			local component_record = component_record_ensure(id)
			local all_observers = component_record.observers_added
			if all_observers then
				local observers = all_observers[PAIR_HOOK_INDEX]
				table.insert(observers, query_observer)
				table.insert(inserted_in, observers)
			else
				local observers = { [PAIR_HOOK_INDEX] = query_observer }
				local all_observers = { observers }
				component_record.observers_added = all_observers
				if IS_PAIR(id) then
					PROPAGATE_PAIR_EVENTS(world, id, component_record :: PairRecord, all_observers, function(record)
						return record.observers_added
					end, function(record, set_observers)
						record.observers_added = set_observers
					end)
				end

				table.insert(inserted_in, observers)
			end
		end
	end

	insert_added_observers(with_ids)
	if without_ids then
		insert_added_observers(without_ids)
	end

	for _, id in terms do
		local component_record = component_record_ensure(id)
		local all_observers = component_record.observers_changed
		if all_observers then
			local observers = all_observers[PAIR_HOOK_INDEX]
			table.insert(observers, query_observer)
			table.insert(inserted_in, observers)
		else
			local observers = { [PAIR_HOOK_INDEX] = query_observer }
			local all_observers = { observers }
			component_record.observers_changed = all_observers

			if IS_PAIR(id) then
				PROPAGATE_PAIR_EVENTS(world, id, component_record :: PairRecord, all_observers, function(record)
					return record.observers_changed
				end, function(record, set_observers)
					record.observers_changed = set_observers
				end)
			end

			table.insert(inserted_in, observers)
		end
	end

	return function()
		observers_cleanup()
		REMOVE_INSERTED_OBSERVERS(inserted_in, query_observer)
	end
end

-- TODO: make archetype caching optional
local function monitor_new(world: World, with_ids: { u53 }, without_ids: { u53 }?)
	local component_record_ensure = world.internal.component_record_ensure
	local _, archetypes_map, cache_cleanup = OBSERVE_MATCHED_ARCHETYPES(world, with_ids, without_ids)
	local last_operation_id: number? = nil
	local fired_entities: { [u53]: boolean } = {}

	local function query_match(archetype: Archetype)
		return archetypes_map[archetype.archetype_id] ~= nil
	end

	local query_monitor: QueryIdMonitor = {
		match = query_match,
		added = nil,
		removed = nil,
	}

	local inserted_in: { { QueryIdMonitor } } = {}

	local function monitor_added(callback: QueryMonitorCallback)
		query_monitor.added = function(entity, operation_id)
			if operation_id then
				if operation_id ~= last_operation_id then
					last_operation_id = operation_id
					table.clear(fired_entities)
				elseif fired_entities[entity] then
					return
				end
				fired_entities[entity] = true
			end

			callback(entity)
		end
	end

	local function monitor_removed(callback: QueryMonitorCallback)
		query_monitor.removed = function(entity, operation_id)
			if operation_id then
				if operation_id ~= last_operation_id then
					last_operation_id = operation_id
					table.clear(fired_entities)
				elseif fired_entities[entity] then
					return
				end
				fired_entities[entity] = true
			end

			callback(entity)
		end
	end

	local function cleanup()
		cache_cleanup()
		REMOVE_INSERTED_OBSERVERS(inserted_in, query_monitor)
	end

	local function insert_monitors(ids: { u53 })
		for _, id in ids do
			local component_record = component_record_ensure(id)
			local all_monitors = component_record.monitors
			if all_monitors then
				local monitors = all_monitors[PAIR_HOOK_INDEX]
				table.insert(monitors, query_monitor)
				table.insert(inserted_in, monitors)
			else
				local monitors = { [PAIR_HOOK_INDEX] = query_monitor }
				local all_monitors = { monitors }
				component_record.monitors = all_monitors

				if IS_PAIR(id) then
					PROPAGATE_PAIR_EVENTS(world, id, component_record :: PairRecord, all_monitors, function(record)
						return record.monitors
					end, function(record, set_monitors)
						record.monitors = set_monitors
					end)
				end

				table.insert(inserted_in, monitors)
			end
		end
	end

	local monitor: Monitor = {
		added = monitor_added :: any,
		removed = monitor_removed :: any,
		cleanup = cleanup,
	}

	insert_monitors(with_ids)
	if without_ids then
		insert_monitors(without_ids)
	end

	return monitor
end

local function query_changed_new(world: World, terms: { u53 }, with_ids: { u53 }, without_ids: { u53 }?)
	local iter_queue: { u53 } = {}
	local iter_indexes: { [u53]: number } = {}

	local observer_cleanup = observer_new(world, terms, with_ids, without_ids, function(entity)
		local index = iter_indexes[entity]
		if index then
			return
		end

		table.insert(iter_queue, entity)
		iter_indexes[entity] = #iter_queue
	end)

	local monitor = monitor_new(world, with_ids, without_ids)
	monitor.removed(function(entity: any)
		local index = iter_indexes[entity]
		if index == nil then
			return
		end

		local last_entity = table.remove(iter_queue)
		if last_entity and last_entity ~= entity then
			iter_queue[index] = last_entity
			iter_indexes[last_entity] = index
		end
		iter_indexes[entity] = nil
	end)

	local function iter()
		local now_queue = iter_queue
		local row = #now_queue
		if row == 0 then
			return NOOP
		end

		iter_queue = {}
		iter_indexes = {}

		return function(): (u53, any)
			if row == 0 then
				return nil :: any
			end
			local entity = now_queue[row]
			row -= 1
			return entity, (world.get :: any)(entity, unpack(terms))
		end
	end

	local function cleanup()
		observer_cleanup()
		monitor.cleanup()
	end

	return setmetatable({
		iter = iter,
		cleanup = cleanup,
	}, { __iter = iter })
end

local query_mt = {}
query_mt.__index = query_mt

local function query_new(world: World, terms: { u53 }, with_ids: { u53 }, without_ids: { u53 }?): Query<any>
	local query = {
		is_cached = false,

		terms = terms,
		with_ids = with_ids,
		without_ids = without_ids,
		world = world,
	}

	return setmetatable(query, query_mt) :: any
end

local function query_match(query: QueryInternal, archetype: Archetype)
	if query.is_cached then
		local compatible_archetypes_map = query.compatible_archetypes_map
		return compatible_archetypes_map[archetype.archetype_id] ~= nil
	else
		return MATCH_ARCHETYPE(query.with_ids, query.without_ids, archetype)
	end
end

local function query_with(query: QueryInternal, ...: u53)
	-- compatible_archetypes is set on first match (iter/count/cached/...) and
	-- is never recomputed for that query, so terms must be final before then
	if query.compatible_archetypes then
		error "cannot add terms to a query after it has been matched"
	end
	local ids = { ... }
	local with_ids = query.with_ids
	table.move(ids, 1, #ids, #with_ids + 1, with_ids)
	return query
end

local function query_without(query: QueryInternal, ...: u53)
	if query.compatible_archetypes then
		error "cannot add terms to a query after it has been matched"
	end
	local ids = { ... }
	local without_ids = query.without_ids

	if without_ids then
		table.move(ids, 1, #ids, #without_ids + 1, without_ids)
	else
		query.without_ids = ids
	end
	return query
end

local function query_clone(query: QueryInternal)
	local without_ids = query.without_ids

	return query_new(
		query.world,
		table.clone(query.terms),
		table.clone(query.with_ids),
		without_ids and table.clone(without_ids)
	)
end

local function query_rematch(query: QueryInternal)
	-- cached queries are kept up to date by archetype observers; replacing the
	-- list here would detach it from those observers
	if query.is_cached then
		return query.compatible_archetypes
	end

	local world = query.world
	local with_ids = query.with_ids
	local without_ids = query.without_ids

	local matched = FIND_MATCHED_ARCHETYPES(world, with_ids, without_ids, true)
	query.compatible_archetypes = matched
	return matched
end

local function query_archetypes(query: QueryInternal): { Archetype }
	local compatible_archetypes = query.compatible_archetypes

	if compatible_archetypes then
		return compatible_archetypes
	else
		return query_rematch(query)
	end
end

local function query_has(query: QueryInternal, entity: number)
	local world = query.world
	local internal = world.internal
	local get_entity_record_alive = internal.get_entity_record_alive

	local record = get_entity_record_alive(entity)
	if not record then
		return false
	end
	return query_match(query, record.archetype)
end

local function query_empty(query: QueryInternal): boolean
	query_archetypes(query)
	for _, archetype in query.compatible_archetypes do
		if archetype.alive then
			return false
		end
	end
	return true
end

local function query_count(query: QueryInternal): number
	query_archetypes(query)
	local count = 0
	for _, archetype in query.compatible_archetypes do
		count += #archetype.entities
	end
	return count
end

local function query_entities(query: QueryInternal): { Entity }
	query_archetypes(query)
	local entities = {}
	for _, archetype in query.compatible_archetypes do
		if not archetype.alive then
			continue
		end
		local archetype_entities = archetype.entities
		table.move(archetype_entities, 1, #archetype_entities, #entities + 1, entities)
	end
	return entities
end

local function query_random(query: QueryInternal): u53?
	local count = query_count(query)
	if count == 0 then
		return nil
	end
	local random = math.random(1, count)

	for _, archetype in query.compatible_archetypes do
		if not archetype.alive then
			continue
		end
		local entities = archetype.entities
		local entity_count = #entities
		if random <= entity_count then
			return entities[random] :: any
		end
		random -= entity_count
	end
	return nil
end

local function query_cleanup(query: QueryInternal)
	if query.is_cached and query.cache_cleanup then
		query.is_cached = false
		query.cache_cleanup()
		query.cache_cleanup = nil
	end
end

local function query_iter(query: QueryInternal): () -> any
	local compatible_archetypes = query_archetypes(query)
	local iter_archetype_index = 1
	local iter_archetype: Archetype = compatible_archetypes[iter_archetype_index]

	if not iter_archetype then
		return NOOP
	end

	local terms = query.terms
	local A, B, C, D, E, F, G, H, I = unpack(terms)

	local a: Column, b: Column, c: Column, d: Column
	local e: Column, f: Column, g: Column, h: Column

	local iter_columns_map = iter_archetype.columns_map

	local iter_entities = iter_archetype.entities
	local iter_entity_row = #iter_entities

	local query_iter_next

	if not A then
		function query_iter_next(): ...any
			local entity = iter_entities[iter_entity_row]
			while entity == nil do
				iter_archetype_index += 1
				iter_archetype = compatible_archetypes[iter_archetype_index]
				if not iter_archetype then
					return nil :: any
				end
				if not iter_archetype.alive then
					continue
				end

				iter_entities = iter_archetype.entities
				iter_entity_row = #iter_entities
				entity = iter_entities[iter_entity_row]
			end
			iter_entity_row -= 1
			return entity
		end
	elseif not B then
		function query_iter_next(): ...any
			local entity = iter_entities[iter_entity_row]
			while entity == nil do
				iter_archetype_index += 1
				iter_archetype = compatible_archetypes[iter_archetype_index]
				if not iter_archetype then
					return nil :: any
				end
				if not iter_archetype.alive then
					continue
				end

				iter_entities = iter_archetype.entities
				iter_entity_row = #iter_entities
				entity = iter_entities[iter_entity_row]
				iter_columns_map = iter_archetype.columns_map

				a = iter_columns_map[A]
			end
			local row = iter_entity_row
			iter_entity_row -= 1

			return entity, a[row]
		end
	elseif not C then
		function query_iter_next(): ...any
			local entity = iter_entities[iter_entity_row]
			while entity == nil do
				iter_archetype_index += 1
				iter_archetype = compatible_archetypes[iter_archetype_index]
				if not iter_archetype then
					return nil :: any
				end
				if not iter_archetype.alive then
					continue
				end

				iter_entities = iter_archetype.entities
				iter_entity_row = #iter_entities
				entity = iter_entities[iter_entity_row]
				iter_columns_map = iter_archetype.columns_map

				a = iter_columns_map[A]
				b = iter_columns_map[B]
			end
			local row = iter_entity_row
			iter_entity_row -= 1

			return entity, a[row], b[row]
		end
	elseif not D then
		function query_iter_next(): ...any
			local entity = iter_entities[iter_entity_row]
			while entity == nil do
				iter_archetype_index += 1
				iter_archetype = compatible_archetypes[iter_archetype_index]
				if not iter_archetype then
					return nil :: any
				end
				if not iter_archetype.alive then
					continue
				end

				iter_entities = iter_archetype.entities
				iter_entity_row = #iter_entities
				entity = iter_entities[iter_entity_row]
				iter_columns_map = iter_archetype.columns_map

				a = iter_columns_map[A]
				b = iter_columns_map[B]
				c = iter_columns_map[C]
			end
			local row = iter_entity_row
			iter_entity_row -= 1

			return entity, a[row], b[row], c[row]
		end
	elseif not E then
		function query_iter_next(): ...any
			local entity = iter_entities[iter_entity_row]
			while entity == nil do
				iter_archetype_index += 1
				iter_archetype = compatible_archetypes[iter_archetype_index]
				if not iter_archetype then
					return nil :: any
				end
				if not iter_archetype.alive then
					continue
				end

				iter_entities = iter_archetype.entities
				iter_entity_row = #iter_entities
				entity = iter_entities[iter_entity_row]
				iter_columns_map = iter_archetype.columns_map

				a = iter_columns_map[A]
				b = iter_columns_map[B]
				c = iter_columns_map[C]
				d = iter_columns_map[D]
			end
			local row = iter_entity_row
			iter_entity_row -= 1

			return entity, a[row], b[row], c[row], d[row]
		end
	elseif not F then
		function query_iter_next(): ...any
			local entity = iter_entities[iter_entity_row]
			while entity == nil do
				iter_archetype_index += 1
				iter_archetype = compatible_archetypes[iter_archetype_index]
				if not iter_archetype then
					return nil :: any
				end
				if not iter_archetype.alive then
					continue
				end

				iter_entities = iter_archetype.entities
				iter_entity_row = #iter_entities
				entity = iter_entities[iter_entity_row]
				iter_columns_map = iter_archetype.columns_map

				a = iter_columns_map[A]
				b = iter_columns_map[B]
				c = iter_columns_map[C]
				d = iter_columns_map[D]
				e = iter_columns_map[E]
			end
			local row = iter_entity_row
			iter_entity_row -= 1

			return entity, a[row], b[row], c[row], d[row], e[row]
		end
	elseif not G then
		function query_iter_next(): ...any
			local entity = iter_entities[iter_entity_row]
			while entity == nil do
				iter_archetype_index += 1
				iter_archetype = compatible_archetypes[iter_archetype_index]
				if not iter_archetype then
					return nil
				end
				if not iter_archetype.alive then
					continue
				end

				iter_entities = iter_archetype.entities
				iter_entity_row = #iter_entities
				entity = iter_entities[iter_entity_row]
				iter_columns_map = iter_archetype.columns_map

				a = iter_columns_map[A]
				b = iter_columns_map[B]
				c = iter_columns_map[C]
				d = iter_columns_map[D]
				e = iter_columns_map[E]
				f = iter_columns_map[F]
			end
			local row = iter_entity_row
			iter_entity_row -= 1

			return entity, a[row], b[row], c[row], d[row], e[row], f[row]
		end
	elseif not H then
		function query_iter_next(): ...any
			local entity = iter_entities[iter_entity_row]
			while entity == nil do
				iter_archetype_index += 1
				iter_archetype = compatible_archetypes[iter_archetype_index]
				if not iter_archetype then
					return nil
				end
				if not iter_archetype.alive then
					continue
				end

				iter_entities = iter_archetype.entities
				iter_entity_row = #iter_entities
				entity = iter_entities[iter_entity_row]
				iter_columns_map = iter_archetype.columns_map

				a = iter_columns_map[A]
				b = iter_columns_map[B]
				c = iter_columns_map[C]
				d = iter_columns_map[D]
				e = iter_columns_map[E]
				f = iter_columns_map[F]
				g = iter_columns_map[G]
			end
			local row = iter_entity_row
			iter_entity_row -= 1

			return entity, a[row], b[row], c[row], d[row], e[row], f[row], g[row]
		end
	elseif not I then
		function query_iter_next(): ...any
			local entity = iter_entities[iter_entity_row]
			while entity == nil do
				iter_archetype_index += 1
				iter_archetype = compatible_archetypes[iter_archetype_index]
				if not iter_archetype then
					return nil
				end
				if not iter_archetype.alive then
					continue
				end

				iter_entities = iter_archetype.entities
				iter_entity_row = #iter_entities
				entity = iter_entities[iter_entity_row]
				iter_columns_map = iter_archetype.columns_map

				a = iter_columns_map[A]
				b = iter_columns_map[B]
				c = iter_columns_map[C]
				d = iter_columns_map[D]
				e = iter_columns_map[E]
				f = iter_columns_map[F]
				g = iter_columns_map[G]
				h = iter_columns_map[H]
			end
			local row = iter_entity_row
			iter_entity_row -= 1

			return entity, a[row], b[row], c[row], d[row], e[row], f[row], g[row], h[row]
		end
	else
		local rest = {}
		local terms_count = #terms

		function query_iter_next(): ...any
			local entity = iter_entities[iter_entity_row]
			while entity == nil do
				iter_archetype_index += 1
				iter_archetype = compatible_archetypes[iter_archetype_index]
				if not iter_archetype then
					return nil
				end
				if not iter_archetype.alive then
					continue
				end

				iter_entities = iter_archetype.entities
				iter_entity_row = #iter_entities
				entity = iter_entities[iter_entity_row]
				iter_columns_map = iter_archetype.columns_map

				a = iter_columns_map[A]
				b = iter_columns_map[B]
				c = iter_columns_map[C]
				d = iter_columns_map[D]
				e = iter_columns_map[E]
				f = iter_columns_map[F]
				g = iter_columns_map[G]
				h = iter_columns_map[H]
			end
			local row = iter_entity_row
			iter_entity_row -= 1

			for i = 9, terms_count do
				rest[i - 8] = iter_columns_map[terms[i]][row]
			end

			return entity, a[row], b[row], c[row], d[row], e[row], f[row], g[row], h[row], unpack(rest)
		end
	end

	if not A then
	elseif not B then
		a = iter_columns_map[A]
	elseif not C then
		a = iter_columns_map[A]
		b = iter_columns_map[B]
	elseif not D then
		a = iter_columns_map[A]
		b = iter_columns_map[B]
		c = iter_columns_map[C]
	elseif not E then
		a = iter_columns_map[A]
		b = iter_columns_map[B]
		c = iter_columns_map[C]
		d = iter_columns_map[D]
	elseif not F then
		a = iter_columns_map[A]
		b = iter_columns_map[B]
		c = iter_columns_map[C]
		d = iter_columns_map[D]
		e = iter_columns_map[E]
	elseif not G then
		a = iter_columns_map[A]
		b = iter_columns_map[B]
		c = iter_columns_map[C]
		d = iter_columns_map[D]
		e = iter_columns_map[E]
		f = iter_columns_map[F]
	elseif not H then
		a = iter_columns_map[A]
		b = iter_columns_map[B]
		c = iter_columns_map[C]
		d = iter_columns_map[D]
		e = iter_columns_map[E]
		f = iter_columns_map[F]
		g = iter_columns_map[G]
	else
		a = iter_columns_map[A]
		b = iter_columns_map[B]
		c = iter_columns_map[C]
		d = iter_columns_map[D]
		e = iter_columns_map[E]
		f = iter_columns_map[F]
		g = iter_columns_map[G]
		h = iter_columns_map[H]
	end

	return query_iter_next
end

local function query_first(query: QueryInternal, predicator: ((Entity, ...any) -> boolean)?): (Entity, ...any)
	query_archetypes(query)

	local terms = query.terms
	local compatible_archetypes = query.compatible_archetypes

	if predicator then
		local A, B, C, D, E, F, G, H, I = unpack(terms)

		if not A then
			for _, archetype in compatible_archetypes do
				if not archetype.alive then
					continue
				end
				local entities = archetype.entities
				local entity_count = #entities

				for row = entity_count, 1, -1 do
					local entity = entities[row] :: any
					if predicator(entity) then
						return entity
					end
				end
			end
		elseif not B then
			for _, archetype in compatible_archetypes do
				if not archetype.alive then
					continue
				end
				local entities = archetype.entities
				local entity_count = #entities

				local columns_map = archetype.columns_map
				local _a = columns_map[A]

				for row = entity_count, 1, -1 do
					local entity = entities[row] :: any

					local aa = _a[row]

					if predicator(entity, aa) then
						return entity, aa
					end
				end
			end
		elseif not C then
			for _, archetype in compatible_archetypes do
				if not archetype.alive then
					continue
				end
				local entities = archetype.entities
				local entity_count = #entities

				local columns_map = archetype.columns_map
				local _a = columns_map[A]
				local _b = columns_map[B]

				for row = entity_count, 1, -1 do
					local entity = entities[row] :: any

					local aa = _a[row]
					local bb = _b[row]

					if predicator(entity, aa, bb) then
						return entity, aa, bb
					end
				end
			end
		elseif not D then
			for _, archetype in compatible_archetypes do
				if not archetype.alive then
					continue
				end
				local entities = archetype.entities
				local entity_count = #entities

				local columns_map = archetype.columns_map
				local _a = columns_map[A]
				local _b = columns_map[B]
				local _c = columns_map[C]

				for row = entity_count, 1, -1 do
					local entity = entities[row] :: any

					local aa = _a[row]
					local bb = _b[row]
					local cc = _c[row]

					if predicator(entity, aa, bb, cc) then
						return entity, aa, bb, cc
					end
				end
			end
		elseif not E then
			for _, archetype in compatible_archetypes do
				if not archetype.alive then
					continue
				end
				local entities = archetype.entities
				local entity_count = #entities

				local columns_map = archetype.columns_map
				local _a = columns_map[A]
				local _b = columns_map[B]
				local _c = columns_map[C]
				local _d = columns_map[D]

				for row = entity_count, 1, -1 do
					local entity = entities[row] :: any

					local aa = _a[row]
					local bb = _b[row]
					local cc = _c[row]
					local dd = _d[row]

					if predicator(entity, aa, bb, cc, dd) then
						return entity, aa, bb, cc, dd
					end
				end
			end
		elseif not F then
			for _, archetype in compatible_archetypes do
				if not archetype.alive then
					continue
				end
				local entities = archetype.entities
				local entity_count = #entities

				local columns_map = archetype.columns_map
				local _a = columns_map[A]
				local _b = columns_map[B]
				local _c = columns_map[C]
				local _d = columns_map[D]
				local _e = columns_map[E]

				for row = entity_count, 1, -1 do
					local entity = entities[row] :: any

					local aa = _a[row]
					local bb = _b[row]
					local cc = _c[row]
					local dd = _d[row]
					local ee = _e[row]

					if predicator(entity, aa, bb, cc, dd, ee) then
						return entity, aa, bb, cc, dd, ee
					end
				end
			end
		elseif not G then
			for _, archetype in compatible_archetypes do
				if not archetype.alive then
					continue
				end
				local entities = archetype.entities
				local entity_count = #entities

				local columns_map = archetype.columns_map
				local _a = columns_map[A]
				local _b = columns_map[B]
				local _c = columns_map[C]
				local _d = columns_map[D]
				local _e = columns_map[E]
				local _f = columns_map[F]

				for row = entity_count, 1, -1 do
					local entity = entities[row] :: any

					local aa = _a[row]
					local bb = _b[row]
					local cc = _c[row]
					local dd = _d[row]
					local ee = _e[row]
					local ff = _f[row]

					if predicator(entity, aa, bb, cc, dd, ee, ff) then
						return entity, aa, bb, cc, dd, ee, ff
					end
				end
			end
		elseif not H then
			for _, archetype in compatible_archetypes do
				if not archetype.alive then
					continue
				end
				local entities = archetype.entities
				local entity_count = #entities

				local columns_map = archetype.columns_map
				local _a = columns_map[A]
				local _b = columns_map[B]
				local _c = columns_map[C]
				local _d = columns_map[D]
				local _e = columns_map[E]
				local _f = columns_map[F]
				local _g = columns_map[G]

				for row = entity_count, 1, -1 do
					local entity = entities[row] :: any

					local aa = _a[row]
					local bb = _b[row]
					local cc = _c[row]
					local dd = _d[row]
					local ee = _e[row]
					local ff = _f[row]
					local gg = _g[row]

					if predicator(entity, aa, bb, cc, dd, ee, ff, gg) then
						return entity, aa, bb, cc, dd, ee, ff, gg
					end
				end
			end
		elseif not I then
			for _, archetype in compatible_archetypes do
				if not archetype.alive then
					continue
				end
				local entities = archetype.entities
				local entity_count = #entities

				local columns_map = archetype.columns_map
				local _a = columns_map[A]
				local _b = columns_map[B]
				local _c = columns_map[C]
				local _d = columns_map[D]
				local _e = columns_map[E]
				local _f = columns_map[F]
				local _g = columns_map[G]
				local _h = columns_map[H]

				for row = entity_count, 1, -1 do
					local entity = entities[row] :: any

					local aa = _a[row]
					local bb = _b[row]
					local cc = _c[row]
					local dd = _d[row]
					local ee = _e[row]
					local ff = _f[row]
					local gg = _g[row]
					local hh = _h[row]

					if predicator(entity, aa, bb, cc, dd, ee, ff, gg, hh) then
						return entity, aa, bb, cc, dd, ee, ff, gg, hh
					end
				end
			end
		else
			local rest = {}
			local terms_count = #terms

			for _, archetype in compatible_archetypes do
				if not archetype.alive then
					continue
				end
				local entities = archetype.entities
				local entity_count = #entities

				local columns_map = archetype.columns_map
				local _a = columns_map[A]
				local _b = columns_map[B]
				local _c = columns_map[C]
				local _d = columns_map[D]
				local _e = columns_map[E]
				local _f = columns_map[F]
				local _g = columns_map[G]
				local _h = columns_map[H]

				for row = entity_count, 1, -1 do
					local entity = entities[row] :: any

					local aa = _a[row]
					local bb = _b[row]
					local cc = _c[row]
					local dd = _d[row]
					local ee = _e[row]
					local ff = _f[row]
					local gg = _g[row]
					local hh = _h[row]

					for i = 9, terms_count do
						rest[i - 8] = columns_map[terms[i]][row]
					end

					if predicator(entity, aa, bb, cc, dd, ee, ff, gg, hh, unpack(rest)) then
						return entity, aa, bb, cc, dd, ee, ff, gg, hh, unpack(rest)
					end
				end
			end
		end
	else
		local terms_output = table.create(#terms)
		for _, archetype in compatible_archetypes do
			if not archetype.alive then
				continue
			end

			local entities = archetype.entities
			local last_row = #entities
			local columns_map = archetype.columns_map

			for index, term in terms do
				terms_output[index] = columns_map[term][last_row]
			end

			return entities[last_row], unpack(terms_output)
		end
		return nil :: any
	end
	return nil :: any
end

local function query_columns(query: QueryInternal): () -> any
	local compatible_archetypes = query_archetypes(query)
	local iter_archetype_index = 1
	local total_archetypes = #compatible_archetypes

	if total_archetypes == 0 then
		return NOOP
	end

	local terms = query.terms
	local A, B, C, D, E, F, G, H, I = unpack(terms)

	if not A then
		return function(): Archetype
			if iter_archetype_index > total_archetypes then
				return nil :: any
			end
			local archetype = compatible_archetypes[iter_archetype_index]
			iter_archetype_index += 1

			return archetype
		end
	elseif not B then
		return function(): ...any
			if iter_archetype_index > total_archetypes then
				return nil :: any
			end
			local archetype = compatible_archetypes[iter_archetype_index]
			iter_archetype_index += 1

			return archetype, archetype.columns_map[A]
		end
	elseif not C then
		return function(): ...any
			if iter_archetype_index > total_archetypes then
				return nil :: any
			end
			local archetype = compatible_archetypes[iter_archetype_index]
			local columns_map = archetype.columns_map

			iter_archetype_index += 1
			return archetype, columns_map[A], columns_map[B]
		end
	elseif not D then
		return function(): ...any
			if iter_archetype_index > total_archetypes then
				return nil :: any
			end
			local archetype = compatible_archetypes[iter_archetype_index]
			local columns_map = archetype.columns_map

			iter_archetype_index += 1
			return archetype, columns_map[A], columns_map[B], columns_map[C]
		end
	elseif not E then
		return function(): ...any
			if iter_archetype_index > total_archetypes then
				return nil :: any
			end
			local archetype = compatible_archetypes[iter_archetype_index]
			local columns_map = archetype.columns_map

			iter_archetype_index += 1
			return archetype, columns_map[A], columns_map[B], columns_map[C], columns_map[D]
		end
	elseif not F then
		return function(): ...any
			if iter_archetype_index > total_archetypes then
				return nil :: any
			end
			local archetype = compatible_archetypes[iter_archetype_index]
			local columns_map = archetype.columns_map

			iter_archetype_index += 1
			return archetype, columns_map[A], columns_map[B], columns_map[C], columns_map[D], columns_map[E]
		end
	elseif not G then
		return function(): ...any
			if iter_archetype_index > total_archetypes then
				return nil :: any
			end
			local archetype = compatible_archetypes[iter_archetype_index]
			local columns_map = archetype.columns_map

			iter_archetype_index += 1
			return archetype,
				columns_map[A],
				columns_map[B],
				columns_map[C],
				columns_map[D],
				columns_map[E],
				columns_map[F]
		end
	elseif not H then
		return function(): ...any
			if iter_archetype_index > total_archetypes then
				return nil :: any
			end
			local archetype = compatible_archetypes[iter_archetype_index]
			local columns_map = archetype.columns_map

			iter_archetype_index += 1
			return archetype,
				columns_map[A],
				columns_map[B],
				columns_map[C],
				columns_map[D],
				columns_map[E],
				columns_map[F],
				columns_map[G]
		end
	elseif not I then
		return function(): ...any
			if iter_archetype_index > total_archetypes then
				return nil :: any
			end
			local archetype = compatible_archetypes[iter_archetype_index]
			local columns_map = archetype.columns_map

			iter_archetype_index += 1
			return archetype,
				columns_map[A],
				columns_map[B],
				columns_map[C],
				columns_map[D],
				columns_map[E],
				columns_map[F],
				columns_map[G],
				columns_map[H]
		end
	else
		local rest = {}
		local terms_count = #terms

		return function(): ...any
			if iter_archetype_index > total_archetypes then
				return nil :: any
			end
			local archetype = compatible_archetypes[iter_archetype_index]
			local columns_map = archetype.columns_map

			iter_archetype_index += 1

			for i = 9, terms_count do
				rest[i - 8] = columns_map[terms[i]]
			end

			return archetype,
				columns_map[A],
				columns_map[B],
				columns_map[C],
				columns_map[D],
				columns_map[E],
				columns_map[F],
				columns_map[G],
				columns_map[H],
				unpack(rest)
		end
	end
end

local function query_patch(query: QueryInternal, mapper: (Entity: Entity, ...any) -> ...any)
	query_archetypes(query)

	local compatible_archetypes = query.compatible_archetypes
	local terms = query.terms

	local A, B, C, D, E, F, G, H, I = unpack(terms)

	if not A then
		-- nothing to update
		return
	elseif not B then
		for _, archetype in compatible_archetypes do
			local entities = archetype.entities
			if not archetype.alive then
				continue
			end

			local columns_map = archetype.columns_map
			local _a = columns_map[A]

			for row, entity in entities do
				local aa = _a[row]
				local ar = mapper(entity, aa)

				_a[row] = ar
			end
		end
	elseif not C then
		for _, archetype in compatible_archetypes do
			local entities = archetype.entities
			if not archetype.alive then
				continue
			end

			local columns_map = archetype.columns_map
			local _a = columns_map[A]
			local _b = columns_map[B]

			for row, entity in entities do
				local aa = _a[row]
				local bb = _b[row]

				local ar, br = mapper(entity, aa, bb)

				_a[row] = ar
				_b[row] = br
			end
		end
	elseif not D then
		for _, archetype in compatible_archetypes do
			local entities = archetype.entities
			if not archetype.alive then
				continue
			end

			local columns_map = archetype.columns_map
			local _a = columns_map[A]
			local _b = columns_map[B]
			local _c = columns_map[C]

			for row, entity in entities do
				local aa = _a[row]
				local bb = _b[row]
				local cc = _c[row]

				local ar, br, cr = mapper(entity, aa, bb, cc)

				_a[row] = ar
				_b[row] = br
				_c[row] = cr
			end
		end
	elseif not E then
		for _, archetype in compatible_archetypes do
			local entities = archetype.entities
			if not archetype.alive then
				continue
			end

			local columns_map = archetype.columns_map
			local _a = columns_map[A]
			local _b = columns_map[B]
			local _c = columns_map[C]
			local _d = columns_map[D]

			for row, entity in entities do
				local aa = _a[row]
				local bb = _b[row]
				local cc = _c[row]
				local dd = _d[row]

				local ar, br, cr, dr = mapper(entity, aa, bb, cc, dd)

				_a[row] = ar
				_b[row] = br
				_c[row] = cr
				_d[row] = dr
			end
		end
	elseif not F then
		for _, archetype in compatible_archetypes do
			local entities = archetype.entities
			if not archetype.alive then
				continue
			end

			local columns_map = archetype.columns_map
			local _a = columns_map[A]
			local _b = columns_map[B]
			local _c = columns_map[C]
			local _d = columns_map[D]
			local _e = columns_map[E]

			for row, entity in entities do
				local aa = _a[row]
				local bb = _b[row]
				local cc = _c[row]
				local dd = _d[row]
				local ee = _e[row]

				local ar, br, cr, dr, er = mapper(entity, aa, bb, cc, dd, ee)

				_a[row] = ar
				_b[row] = br
				_c[row] = cr
				_d[row] = dr
				_e[row] = er
			end
		end
	elseif not G then
		for _, archetype in compatible_archetypes do
			local entities = archetype.entities
			if not archetype.alive then
				continue
			end

			local columns_map = archetype.columns_map
			local _a = columns_map[A]
			local _b = columns_map[B]
			local _c = columns_map[C]
			local _d = columns_map[D]
			local _e = columns_map[E]
			local _f = columns_map[F]

			for row, entity in entities do
				local aa = _a[row]
				local bb = _b[row]
				local cc = _c[row]
				local dd = _d[row]
				local ee = _e[row]
				local ff = _f[row]

				local ar, br, cr, dr, er, fr = mapper(entity, aa, bb, cc, dd, ee, ff)

				_a[row] = ar
				_b[row] = br
				_c[row] = cr
				_d[row] = dr
				_e[row] = er
				_f[row] = fr
			end
		end
	elseif not H then
		for _, archetype in compatible_archetypes do
			local entities = archetype.entities
			if not archetype.alive then
				continue
			end

			local columns_map = archetype.columns_map
			local _a = columns_map[A]
			local _b = columns_map[B]
			local _c = columns_map[C]
			local _d = columns_map[D]
			local _e = columns_map[E]
			local _f = columns_map[F]
			local _g = columns_map[G]

			for row, entity in entities do
				local aa = _a[row]
				local bb = _b[row]
				local cc = _c[row]
				local dd = _d[row]
				local ee = _e[row]
				local ff = _f[row]
				local gg = _g[row]

				local ar, br, cr, dr, er, fr, gr = mapper(entity, aa, bb, cc, dd, ee, ff, gg)

				_a[row] = ar
				_b[row] = br
				_c[row] = cr
				_d[row] = dr
				_e[row] = er
				_f[row] = fr
				_g[row] = gr
			end
		end
	elseif not I then
		for _, archetype in compatible_archetypes do
			local entities = archetype.entities
			if not archetype.alive then
				continue
			end

			local columns_map = archetype.columns_map
			local _a = columns_map[A]
			local _b = columns_map[B]
			local _c = columns_map[C]
			local _d = columns_map[D]
			local _e = columns_map[E]
			local _f = columns_map[F]
			local _g = columns_map[G]
			local _h = columns_map[H]

			for row, entity in entities do
				local aa = _a[row]
				local bb = _b[row]
				local cc = _c[row]
				local dd = _d[row]
				local ee = _e[row]
				local ff = _f[row]
				local gg = _g[row]
				local hh = _h[row]

				local ar, br, cr, dr, er, fr, gr, hr = mapper(entity, aa, bb, cc, dd, ee, ff, gg, hh)

				_a[row] = ar
				_b[row] = br
				_c[row] = cr
				_d[row] = dr
				_e[row] = er
				_f[row] = fr
				_g[row] = gr
				_h[row] = hr
			end
		end
	else
		local rest = {}
		local terms_count = #terms

		for _, archetype in compatible_archetypes do
			local entities = archetype.entities
			if not archetype.alive then
				continue
			end

			local columns_map = archetype.columns_map
			local _a = columns_map[A]
			local _b = columns_map[B]
			local _c = columns_map[C]
			local _d = columns_map[D]
			local _e = columns_map[E]
			local _f = columns_map[F]
			local _g = columns_map[G]
			local _h = columns_map[H]

			for row, entity in entities do
				local aa = _a[row]
				local bb = _b[row]
				local cc = _c[row]
				local dd = _d[row]
				local ee = _e[row]
				local ff = _f[row]
				local gg = _g[row]
				local hh = _h[row]

				for i = 9, terms_count do
					rest[i - 8] = columns_map[terms[i]][row]
				end

				local values = { mapper(entity, aa, bb, cc, dd, ee, ff, gg, hh, unpack(rest)) }

				_a[row] = values[1]
				_b[row] = values[2]
				_c[row] = values[3]
				_d[row] = values[4]
				_e[row] = values[5]
				_f[row] = values[6]
				_g[row] = values[7]
				_h[row] = values[8]

				for i = 9, terms_count do
					columns_map[terms[i]][row] = values[i]
				end
			end
		end
	end
end

local function query_cached(query: QueryInternal): QueryInternal
	if query.is_cached then
		return query
	end
	query.is_cached = true
	local with_ids = query.with_ids
	local without_ids = query.without_ids

	-- stylua: ignore
	local compatible_archetypes, compatible_archetypes_map, cleanup = OBSERVE_MATCHED_ARCHETYPES(
		query.world, with_ids, without_ids
	)
	query.compatible_archetypes = compatible_archetypes
	query.compatible_archetypes_map = compatible_archetypes_map
	query.cache_cleanup = cleanup

	return query
end

local function query_monitor(query: QueryInternal)
	return monitor_new(query.world, query.with_ids, query.without_ids)
end

local function query_observe(query: QueryInternal, callback: (entity: u53) -> ())
	return observer_new(query.world, query.terms, query.with_ids, query.without_ids, callback)
end

local function query_changed(query: QueryInternal)
	return query_changed_new(query.world, query.terms, query.with_ids, query.without_ids)
end

query_mt.with = query_with
query_mt.without = query_without
query_mt.clone = query_clone
query_mt.rematch = query_rematch
query_mt.archetypes = query_archetypes

query_mt.match = query_match
query_mt.has = query_has
query_mt.count = query_count
query_mt.empty = query_empty
query_mt.entities = query_entities
query_mt.random = query_random
query_mt.first = query_first

query_mt.cached = query_cached
query_mt.cleanup = query_cleanup
query_mt.iter = query_iter
query_mt.__iter = query_iter
query_mt.patch = query_patch
query_mt.columns = query_columns

query_mt.monitor = query_monitor
query_mt.observe = query_observe
query_mt.changed = query_changed

local function world_new()
	local dense_arr = {}
	local sparse_arr = {}

	local current_operation_id = 0
	local archetypes_count = 1
	local archetypes: Map<ArchetypeId, Archetype> = {}
	local archetypes_lookup: Map<string, Archetype> = {}

	local component_count = preregistered_components_count
	local components_lookup = table.create(ECS_REST) :: ComponentsLookup

	local archetype_creation_observers: Map<u53, { ArchetypeObserver }> = {}
	local archetype_destruction_observers: Map<u53, { ArchetypeObserver }> = {}

	local entity_index: EntityIndex = {
		dense = dense_arr,
		sparse = sparse_arr,
		alive = 0,
	}

	local ROOT_ARCHETYPE: Archetype = {
		archetype_id = archetypes_count,
		hash = "",
		alive = false,
		destroyed = false,

		entities = {},
		columns = {},
		components = {},

		columns_map = {},
		exclusive_pairs = {},
		forward_edges = {},
		backwards_edges = {},
		swapped_edges = {},
		traversable_count = 0,
		traversable_ids = {},
	}
	archetypes[1] = ROOT_ARCHETYPE
	archetypes_lookup[""] = ROOT_ARCHETYPE

	local function get_entity_record(entity: u53): EntityRecord?
		return sparse_arr[ENTITY_ID(entity)]
	end

	local function get_entity_record_asserts_alive(entity: u53): EntityRecord?
		local record = sparse_arr[ENTITY_ID(entity)]
		if record == nil then
			return nil
		end
		local dense = record.dense
		if record.dense > entity_index.alive then
			error "attempted to use a dead entity"
		end
		local dense_id = dense_arr[dense]
		if dense_id ~= entity then
			error "attempted to use an entity with a different generation"
		end
		return record
	end

	local function get_entity_record_alive(entity: u53): EntityRecord?
		local record = sparse_arr[ENTITY_ID(entity)]
		if record == nil then
			return nil
		end
		local dense = record.dense
		if dense > entity_index.alive then
			return nil
		end
		local dense_id = dense_arr[dense]
		if dense_id ~= entity then
			return nil
		end
		return record
	end

	local function get_entity_any(entity_id: u24): u53?
		local record = sparse_arr[entity_id]
		if record == nil then
			return nil
		end
		return dense_arr[record.dense]
	end

	local function get_entity_alive(entity_id: u24): u53?
		local record = sparse_arr[entity_id]
		if record == nil or record.dense > entity_index.alive then
			return nil
		end
		return dense_arr[record.dense]
	end

	local function get_new_entity_id(): u53
		local alive = entity_index.alive
		local count = #sparse_arr

		if alive >= count then
			local next_id = count + 1
			local new_record: EntityRecord = {
				dense = next_id,
				archetype = ROOT_ARCHETYPE,
				archetype_row = -1,
				deleting = false,
			}
			table.insert(sparse_arr, new_record)
			table.insert(dense_arr, next_id)
			entity_index.alive = next_id

			return next_id
		end

		alive += 1
		entity_index.alive = alive
		return dense_arr[alive]
	end

	local function delete_entity_id(id: u24, record: EntityRecord)
		local old_alive = entity_index.alive

		local dense_index = record.dense
		if dense_index ~= old_alive then
			local swap_id = dense_arr[old_alive]
			dense_arr[dense_index] = swap_id

			local swap_record = sparse_arr[ENTITY_ID(swap_id)]
			swap_record.dense = dense_index
		end
		local new_generation = INCREMENT_GENERATION(id)
		dense_arr[old_alive] = new_generation
		record.dense = old_alive

		entity_index.alive -= 1
	end

	local function reachable_invalidate_down(relation: u53, id: u53, record: PairRecord)
		record.reachable.generation += 1

		for _, archetype_id in record.archetype_ids do
			local archetype = archetypes[archetype_id]

			for _, entity in archetype.entities do
				local child_id = ECS_PAIR(relation, entity :: any)
				local child_record = components_lookup[child_id] :: PairRecord
				if child_record then
					reachable_invalidate_down(relation, child_id, child_record)
				end
			end
		end
	end

	local function fetch(columns: { [u53]: Column }, id: u53, row: number)
		local column = columns[id]
		if not column then
			return nil
		end
		return column[row]
	end

	local function world_has(entity: u53, id: u53)
		local record = get_entity_record_asserts_alive(entity)
		if not record then
			return false
		end

		local archetype = record.archetype
		return archetype.columns_map[id] ~= nil
	end

	local function world_get(
		entity: u53,
		a: u53,
		b: u53,
		c: u53,
		d: u53,
		e: u53,
		f: u53,
		g: u53,
		h: u53,
		i: u53,
		...
	): any
		local record = get_entity_record_asserts_alive(entity)
		if not record then
			return nil
		end
		local archetype = record.archetype
		if archetype == ROOT_ARCHETYPE then
			return nil
		end

		local columns_map = archetype.columns_map
		local row = record.archetype_row

		if not b then
			return fetch(columns_map, a, row)
		elseif not c then
			return fetch(columns_map, a, row), fetch(columns_map, b, row)
		elseif not d then
			return fetch(columns_map, a, row), fetch(columns_map, b, row), fetch(columns_map, c, row)
		elseif not e then
			return fetch(columns_map, a, row),
				fetch(columns_map, b, row),
				fetch(columns_map, c, row),
				fetch(columns_map, d, row)
		elseif not f then
			return fetch(columns_map, a, row),
				fetch(columns_map, b, row),
				fetch(columns_map, c, row),
				fetch(columns_map, d, row),
				fetch(columns_map, e, row)
		elseif not g then
			return fetch(columns_map, a, row),
				fetch(columns_map, b, row),
				fetch(columns_map, c, row),
				fetch(columns_map, d, row),
				fetch(columns_map, e, row),
				fetch(columns_map, f, row)
		elseif not h then
			return fetch(columns_map, a, row),
				fetch(columns_map, b, row),
				fetch(columns_map, c, row),
				fetch(columns_map, d, row),
				fetch(columns_map, e, row),
				fetch(columns_map, f, row),
				fetch(columns_map, g, row)
		elseif not i then
			return fetch(columns_map, a, row),
				fetch(columns_map, b, row),
				fetch(columns_map, c, row),
				fetch(columns_map, d, row),
				fetch(columns_map, e, row),
				fetch(columns_map, f, row),
				fetch(columns_map, g, row),
				fetch(columns_map, h, row)
		else
			local rest = { ... }
			for index, id in rest do
				rest[index] = fetch(columns_map, id, row)
			end

			return fetch(columns_map, a, row),
				fetch(columns_map, b, row),
				fetch(columns_map, c, row),
				fetch(columns_map, d, row),
				fetch(columns_map, e, row),
				fetch(columns_map, f, row),
				fetch(columns_map, g, row),
				fetch(columns_map, h, row),
				fetch(columns_map, i, row),
				unpack(rest)
		end
	end

	local function check_is_component(relation: u53, target: u53?)
		if target and world_has(relation, ECS_FORCE_TAG) then
			return false
		end

		local is_component = world_has(relation, ECS_COMPONENT)

		if target and not is_component then
			is_component = world_has(target, ECS_COMPONENT)
		end

		return is_component
	end

	local function component_record_create(id: u53)
		local is_pair = IS_PAIR(id)
		local relation = id
		local is_exclusive = false
		local has_delete = false
		local target: u53? = nil

		local record: ComponentRecord = {
			column_index = {},
			archetype_ids = {},
			archetype_slots = {},
			pairs_count = {},

			flags = nil :: any,
		}

		if is_pair then
			relation = get_entity_alive(PAIR_FIRST(id)) :: number
			target = get_entity_alive(PAIR_SECOND(id))

			if relation == nil then
				error "attempted to use a pair whose relation is not alive"
			end
			if target == nil then
				error "attempted to use a pair whose target is not alive"
			end

			-- (R, *) is consulted when R itself is deleted, so it carries OnDelete.
			-- (R, T) is consulted when T is deleted, so it carries OnDeleteTarget.
			if PAIR_SECOND(id) == ECS_WILDCARD then
				has_delete = world_has(relation, ECS_PAIR(ECS_ON_DELETE, ECS_DELETE))
			else
				has_delete = world_has(relation, ECS_PAIR(ECS_ON_DELETE_TARGET, ECS_DELETE))
			end
			is_exclusive = world_has(relation, ECS_EXCLUSIVE)

			local pair_record = record :: PairRecord
			pair_record.pairs_count = {}
			pair_record.first_records = {}
			pair_record.second_records = {}
			pair_record.trav_records = {}
		else
			-- plain component/tag: consulted when the id itself is deleted
			has_delete = world_has(id, ECS_PAIR(ECS_ON_DELETE, ECS_DELETE))
		end

		local is_component = check_is_component(relation, target)

		record.flags = bit32.bor(
			(is_component and IS_COMPONENT_FLAG) or 0,
			(has_delete and HAS_DELETE_FLAG) or 0,
			(is_exclusive and IS_EXCLUSIVE_FLAG) or 0
		)

		components_lookup[id] = record
		return record
	end

	local function wildcard_record_ensure(wildcard: u53): PairRecord
		local wildcard_record = components_lookup[wildcard]
		if not wildcard_record then
			wildcard_record = component_record_create(wildcard)
			components_lookup[wildcard] = wildcard_record
		end
		return wildcard_record :: PairRecord
	end

	local function merge_pair_relation_events<T>(relation_hooks: Array<{ T }>, all_hooks: Array<{ T }>?): Array<{ T }>
		if all_hooks then
			all_hooks[RELATION_WC_HOOK_INDEX] = relation_hooks[PAIR_HOOK_INDEX]
		else
			all_hooks = {
				[PAIR_HOOK_INDEX] = {},
				[RELATION_WC_HOOK_INDEX] = relation_hooks[PAIR_HOOK_INDEX],
			}
		end
		return all_hooks :: Array<{ T }>
	end
	local function merge_pair_target_events<T>(target_hooks: Array<{ T }>, all_hooks: Array<{ T }>?): Array<{ T }>
		if all_hooks then
			all_hooks[RELATION_WC_HOOK_INDEX] = all_hooks[RELATION_WC_HOOK_INDEX] or {}
			all_hooks[TARGET_WC_HOOK_INDEX] = target_hooks[PAIR_HOOK_INDEX]
		else
			all_hooks = {
				[PAIR_HOOK_INDEX] = {},
				[RELATION_WC_HOOK_INDEX] = {},
				[TARGET_WC_HOOK_INDEX] = target_hooks[PAIR_HOOK_INDEX],
			}
		end
		return all_hooks :: Array<{ T }>
	end

	local function component_record_ensure(id: u53)
		local record = components_lookup[id]
		if record then
			return record
		end

		local is_pair = IS_PAIR(id)
		if is_pair then
			local record = component_record_create(id) :: PairRecord

			local relation_wildcard = ECS_PAIR(PAIR_FIRST(id), ECS_WILDCARD)
			local target_wildcard = ECS_PAIR(ECS_WILDCARD, PAIR_SECOND(id))

			if relation_wildcard == id or target_wildcard == id then
				return record
			end

			local relation_record = wildcard_record_ensure(relation_wildcard)
			relation_record.first_records[id] = record

			local rel_on_added = relation_record.on_added
			local rel_on_changed = relation_record.on_changed
			local rel_on_removed = relation_record.on_removed
			local rel_monitors = relation_record.monitors
			local rel_observers_added = relation_record.observers_added
			local rel_observers_changed = relation_record.observers_changed

			if rel_on_added then
				record.on_added = merge_pair_relation_events(rel_on_added, record.on_added)
			end
			if rel_on_changed then
				record.on_changed = merge_pair_relation_events(rel_on_changed, record.on_changed)
			end
			if rel_on_removed then
				record.on_removed = merge_pair_relation_events(rel_on_removed, record.on_removed)
			end
			if rel_monitors then
				record.monitors = merge_pair_relation_events(rel_monitors, record.monitors)
			end
			if rel_observers_added then
				record.observers_added = merge_pair_relation_events(rel_observers_added, record.observers_added)
			end
			if rel_observers_changed then
				record.observers_changed = merge_pair_relation_events(rel_observers_changed, record.observers_changed)
			end

			local target_record = wildcard_record_ensure(target_wildcard)
			target_record.second_records[id] = record
			if CHECK_FLAG(relation_record.flags, IS_TRAVERSABLE_FLAG) then
				target_record.trav_records[id] = record
			end

			local tgt_on_added = target_record.on_added
			local tgt_on_changed = target_record.on_changed
			local tgt_on_removed = target_record.on_removed
			local tgt_monitors = target_record.monitors
			local tgt_observers_added = target_record.observers_added
			local tgt_observers_changed = target_record.observers_changed

			if tgt_on_added then
				record.on_added = merge_pair_target_events(tgt_on_added, record.on_added)
			end
			if tgt_on_changed then
				record.on_changed = merge_pair_target_events(tgt_on_changed, record.on_changed)
			end
			if tgt_on_removed then
				record.on_removed = merge_pair_target_events(tgt_on_removed, record.on_removed)
			end
			if tgt_monitors then
				record.monitors = merge_pair_target_events(tgt_monitors, record.monitors)
			end
			if tgt_observers_added then
				record.observers_added = merge_pair_target_events(tgt_observers_added, record.observers_added)
			end
			if tgt_observers_changed then
				record.observers_changed = merge_pair_target_events(tgt_observers_changed, record.observers_changed)
			end

			return record
		else
			return component_record_create(id)
		end
	end

	local function fire_created_archetype(archetype: Archetype, id: u53)
		local observers = archetype_creation_observers[id]
		if not observers then
			return
		end
		for _, observer in observers do
			if observer.match(archetype) then
				observer.callback(archetype)
			end
		end
	end

	local function fire_destroyed_archetype(archetype: Archetype, id: u53)
		local observers = archetype_destruction_observers[id]
		if not observers then
			return
		end
		for _, observer in observers do
			if observer.match(archetype) then
				observer.callback(archetype)
			end
		end
	end

	-- Links an archetypeid to archetypes dense list. Returns false when the archetype was already linked
	local function record_link_archetype(record: ComponentRecord, archetype_id: ArchetypeId, index: number): boolean
		local column_index = record.column_index
		if column_index[archetype_id] then
			return false
		end
		column_index[archetype_id] = index

		local archetype_ids = record.archetype_ids
		local slot = #archetype_ids + 1
		archetype_ids[slot] = archetype_id
		record.archetype_slots[archetype_id] = slot
		return true
	end

	-- Removes an archetypeid from archetypes dense list.
	local function record_unlink_archetype(record: ComponentRecord, archetype_id: ArchetypeId)
		record.column_index[archetype_id] = nil
		local pairs_count = (record :: PairRecord).pairs_count
		if pairs_count then
			pairs_count[archetype_id] = nil
		end

		local archetype_slots = record.archetype_slots
		local slot = archetype_slots[archetype_id]
		if not slot then
			return
		end
		local archetype_ids = record.archetype_ids
		local last = #archetype_ids
		if slot ~= last then
			local moved = archetype_ids[last]
			archetype_ids[slot] = moved
			archetype_slots[moved] = slot
		end
		archetype_ids[last] = nil
		archetype_slots[archetype_id] = nil
	end

	local function archetype_append_to_pair(record: PairRecord, archetype_id: ArchetypeId, index: number): boolean
		if record_link_archetype(record, archetype_id, index) then
			record.pairs_count[archetype_id] = 1
			return true
		end
		record.pairs_count[archetype_id] += 1
		return false
	end

	local function archetype_move_column_rows(
		source: Archetype,
		destination: Archetype,
		source_row: number,
		destination_row: number,
		last_row: number
	)
		local source_columns = source.columns

		if source_row == last_row then
			for index, column in source_columns do
				if column == NULL_ARRAY then
					continue
				end

				local destination_column = destination.columns_map[source.components[index]]
				if destination_column then
					destination_column[destination_row] = column[source_row]
				end

				column[last_row] = nil
			end
		else
			for index, column in source_columns do
				if column == NULL_ARRAY then
					continue
				end

				local destination_column = destination.columns_map[source.components[index]]
				if destination_column then
					destination_column[destination_row] = column[source_row]
				end

				column[source_row] = column[last_row]
				column[last_row] = nil
			end
		end
	end

	local function archetype_insert_entity(entity: u53, archetype: Archetype): number
		local entities = archetype.entities
		local last_row = #entities
		local assign_row = last_row + 1

		entities[assign_row] = entity :: any

		if last_row == 0 then
			archetype.alive = true
		end

		return assign_row
	end

	local function archetype_move_entity(entity: u53, record: EntityRecord, source: Archetype, destination: Archetype)
		local source_entities = source.entities
		local destination_entities = destination.entities

		local last_source_row = #source_entities
		local last_destination_row = #destination_entities

		local source_row = record.archetype_row
		local destination_row = last_destination_row + 1

		archetype_move_column_rows(source, destination, source_row, destination_row, last_source_row)

		if source_row == last_source_row then
			source_entities[last_source_row] = nil
			if last_source_row == 1 then
				source.alive = false
			end
		else
			local swapped_entity: u53 = source_entities[last_source_row] :: any
			source_entities[source_row] = swapped_entity :: any

			local swapped_record = get_entity_record(swapped_entity) :: EntityRecord
			swapped_record.archetype_row = source_row
			source_entities[last_source_row] = nil
		end

		destination_entities[destination_row] = entity :: any
		record.archetype_row = destination_row
		record.archetype = destination

		if last_destination_row == 0 then
			destination.alive = true
		end
	end

	local function archetype_assign_entity(entity: u53, record: EntityRecord, archetype: Archetype)
		local assigned_row = archetype_insert_entity(entity, archetype)
		record.archetype = archetype
		record.archetype_row = assigned_row
	end

	local function archetype_delete_entity(archetype: Archetype, row: number)
		local columns = archetype.columns
		local entities = archetype.entities
		local last_row = #entities
		local swap = entities[last_row]

		if last_row == row then
			-- delete last column
			for _, column in columns do
				if column ~= NULL_ARRAY then
					column[last_row] = nil
				end
			end
			entities[last_row] = nil
			if last_row == 1 then
				archetype.alive = false
			end
		else
			-- swap column, and delete last
			local swap_record = get_entity_record(swap :: any)
			if swap_record then
				swap_record.archetype_row = row
			end
			entities[row] = swap

			for _, column in columns do
				if column ~= NULL_ARRAY then
					column[row] = column[last_row]
					column[last_row] = nil
				end
			end
			entities[last_row] = nil
		end
	end

	local function archetype_destroy(archetype: Archetype)
		if archetype == ROOT_ARCHETYPE then
			return
		end
		-- cascaded deletes can reach the same archetype twice (a nested delete
		-- destroys it while an outer loop still holds it); destroying again would
		-- unlink it from its records once more and refire destruction observers
		if archetype.destroyed then
			return
		end
		archetype.destroyed = true

		local archetype_id = archetype.archetype_id

		local forward_edges = archetype.forward_edges
		local backwards_edges = archetype.backwards_edges

		for id, edge_archetype in forward_edges do
			local swapped_id = archetype.swapped_edges[id]
			if swapped_id then
				edge_archetype.forward_edges[swapped_id] = nil
				edge_archetype.swapped_edges[swapped_id] = nil
			else
				edge_archetype.backwards_edges[id] = nil
			end
		end
		table.clear(forward_edges)
		for id, edge_archetype in backwards_edges do
			edge_archetype.forward_edges[id] = nil
		end
		table.clear(backwards_edges)

		archetypes[archetype_id] = nil
		archetypes_lookup[archetype.hash] = nil

		for id in archetype.columns_map do
			local component_record = components_lookup[id]
			-- component_records_release can drop a record before every archetype
			-- referencing it is destroyed; nothing is left to unlink then.
			if not component_record then
				continue
			end
			record_unlink_archetype(component_record, archetype_id)

			-- Records are intentionally kept alive here even when no archetype
			-- references them anymore. They own hooks, monitors and observers
			-- registered by the user, and wildcard records also own the
			-- first_records/second_records bookkeeping. Records are released
			-- explicitly when their entity is deleted (see component_records_release).

			fire_destroyed_archetype(archetype, id)
		end
	end

	local function archetype_create(ids: { u53 }, hash: string): Archetype
		local archetype_id = archetypes_count + 1
		archetypes_count = archetype_id

		local columns_length = #ids
		local columns = table.create(columns_length) :: { Column }

		local columns_map: Map<u53, Column> = {}
		local exclusive_pairs: Map<u53, u53> = {}
		local traversable_ids = {}
		local traversable_count = 0

		local archetype: Archetype = {
			archetype_id = archetype_id,
			hash = hash,
			alive = false,
			destroyed = false,

			entities = {},
			columns = columns,
			components = ids,

			columns_map = columns_map,
			exclusive_pairs = exclusive_pairs,
			forward_edges = {},
			backwards_edges = {},
			swapped_edges = {},

			traversable_count = 0,
			traversable_ids = traversable_ids,
		}

		for index, id in ids do
			local id_record = component_record_ensure(id)

			local is_tag = not CHECK_FLAG(id_record.flags, IS_COMPONENT_FLAG)
			local column = if is_tag then NULL_ARRAY else {}
			columns[index] = column
			columns_map[id] = column

			record_link_archetype(id_record, archetype_id, index)

			if IS_PAIR(id) then
				local relation_wildcard = ECS_PAIR(PAIR_FIRST(id), ECS_WILDCARD)
				local target_wildcard = ECS_PAIR(ECS_WILDCARD, PAIR_SECOND(id))

				local relation_record = components_lookup[relation_wildcard] :: PairRecord

				if CHECK_FLAG(relation_record.flags, IS_TRAVERSABLE_FLAG) then
					traversable_count += 1
					table.insert(traversable_ids, id)
				end

				if CHECK_FLAG(relation_record.flags, IS_EXCLUSIVE_FLAG) then
					-- sanity check: callers must swap the previous pair out, never
					-- build an archetype holding two pairs of an exclusive relation
					if exclusive_pairs[relation_wildcard] then
						error "an entity cannot have more than one pair of an exclusive relation"
					end
					exclusive_pairs[relation_wildcard] = id
				end

				-- Wildcard records count archetypes, not pairs, so the count is only
				-- bumped the first time this archetype is appended to the wildcard.
				-- This matches archetype_destroy, which decrements once per archetype.
				local relation_appended = archetype_append_to_pair(relation_record, archetype_id, index)
				if relation_appended then
					columns_map[relation_wildcard] = column
				end

				local target_record = components_lookup[target_wildcard] :: PairRecord

				local target_appended = archetype_append_to_pair(target_record, archetype_id, index)
				if target_appended then
					columns_map[target_wildcard] = column
				end
			end
		end
		archetype.traversable_count = traversable_count
		archetypes[archetype_id] = archetype
		archetypes_lookup[hash] = archetype

		for id in columns_map do
			fire_created_archetype(archetype, id)
		end

		return archetype
	end

	local function archetype_ensure(ids: { u53 }): Archetype
		if #ids < 1 then
			return ROOT_ARCHETYPE
		end

		local hash = HASH_IDS(ids)
		local archetype = archetypes_lookup[hash]
		if archetype then
			return archetype
		end

		return archetype_create(ids, hash)
	end

	local function archetype_find_with(source: Archetype, id: u53): Archetype
		local forward_edges = source.forward_edges
		local destination = forward_edges[id]

		if not destination then
			local destination_components = table.clone(source.components)
			local insert_at = FIND_INSERT(destination_components, id)
			table.insert(destination_components, insert_at, id)

			local found = archetype_ensure(destination_components)
			forward_edges[id] = found
			found.backwards_edges[id] = source
			return found
		end

		return destination
	end

	local function archetype_find_swap_with(source: Archetype, old: u53, new: u53, column: number)
		local forward_edges = source.forward_edges
		local destination = forward_edges[new]
		if destination then
			return destination
		end

		local destination_components = table.clone(source.components)
		destination_components[column] = new

		local destination = archetype_ensure(destination_components)
		forward_edges[new] = destination
		source.swapped_edges[new] = old

		destination.forward_edges[old] = source
		destination.swapped_edges[old] = new

		return destination
	end

	local function archetype_find_without(source: Archetype, id: u53)
		local backwards_edges = source.backwards_edges
		local destination = backwards_edges[id]
		if not destination then
			local destination_components = table.clone(source.components)
			local remove_at = table.find(destination_components, id)
			table.remove(destination_components, remove_at)

			local found = archetype_ensure(destination_components)
			backwards_edges[id] = found
			found.forward_edges[id] = source
			return found
		end

		return destination
	end

	local function archetype_bulk_modify_columns(row: number, archetype: Archetype, ids: { number }, values: { any })
		local columns_map = archetype.columns_map
		for index, id in ids do
			local value = values[index]
			local column = columns_map[id]
			if value ~= nil then
				column[row] = value
			else
				if column ~= NULL_ARRAY then
					column[row] = nil
				end
			end
		end
	end

	local function archetype_bulk_move_entities(source: Archetype, destination: Archetype, entities: { u53 })
		local destination_entities = destination.entities

		local source_last_row = #entities
		local destination_last_row = #destination_entities

		local columns_map = source.columns_map
		local destination_columns = destination.columns
		local destination_components = destination.components

		if destination == ROOT_ARCHETYPE then
			for _, entity in entities do
				local record = get_entity_record(entity) :: EntityRecord
				record.archetype = ROOT_ARCHETYPE
				record.archetype_row = -1
			end
		else
			for row, entity in entities do
				local record = get_entity_record(entity) :: EntityRecord
				record.archetype = destination
				record.archetype_row = destination_last_row + row
			end

			table.move(entities :: any, 1, source_last_row, destination_last_row + 1, destination_entities)
			for index, destination_column in destination_columns do
				local id = destination_components[index]
				local column = columns_map[id]
				if column ~= NULL_ARRAY then
					table.move(column, 1, source_last_row, destination_last_row + 1, destination_column)
				end
			end

			if destination_last_row == 0 then
				destination.alive = true
			end
		end

		-- we do this so we keep the original entities table so we can iterate it later for the observers
		-- the alternative is cloning the entities table, or fire the observers inside the loop
		-- but that would mean removing the entities and columns entries one by one, instead of using table.clear
		-- this shouldnt be a problem as nothing holds the entities array
		source.entities = {}
		source.alive = false

		for _, column in source.columns do
			if column ~= NULL_ARRAY then
				table.clear(column)
			end
		end
	end

	local function world_entity(): u53
		return get_new_entity_id()
	end

	local function world_set(entity: u53, id: u53, data: any)
		local record = get_entity_record_alive(entity)
		if not record then
			return
		end

		local source = record.archetype
		local column = source.columns_map[id]

		if column then
			if column == NULL_ARRAY then
				error "cannot set a value on a tag, use world.add instead"
			end
			column[record.archetype_row] = data

			local component_record = components_lookup[id]

			local observers = component_record.observers_changed
			if observers then
				local operation_id = current_operation_id + 1
				current_operation_id = operation_id
				FIRE_OBSERVERS(observers, entity, source, operation_id)
			end

			local changed_hooks = component_record.on_changed
			if changed_hooks then
				FIRE_SET_HOOKS(changed_hooks, entity, id, data)
			end
		else
			-- resolve the record up front so a tag is rejected before the entity
			-- is moved into a new archetype
			local id_record = component_record_ensure(id)
			if not CHECK_FLAG(id_record.flags, IS_COMPONENT_FLAG) then
				error "cannot set a value on a tag, use world.add instead"
			end

			local swapped_record: PairRecord
			local post_removed: { () -> () }? = nil
			local destination: Archetype

			if IS_PAIR(id) then
				local relation = PAIR_FIRST(id)
				local relation_wildcard = ECS_PAIR(relation, ECS_WILDCARD)
				local relation_record = components_lookup[relation_wildcard] :: PairRecord

				if relation_record and CHECK_FLAG(relation_record.flags, IS_EXCLUSIVE_FLAG) then
					local column_index = relation_record.column_index[source.archetype_id]

					if column_index then
						local swapped_id = source.components[column_index]
						destination = archetype_find_swap_with(source, swapped_id, id, column_index)
						swapped_record = components_lookup[swapped_id] :: PairRecord

						local removed_hooks = swapped_record and swapped_record.on_removed
						if removed_hooks then
							post_removed = FIRE_REMOVE_HOOKS(removed_hooks, entity, swapped_id)
						end
					else
						destination = archetype_find_with(source, id)
					end
				else
					destination = archetype_find_with(source, id)
				end
			else
				destination = archetype_find_with(source, id)
			end

			if source == ROOT_ARCHETYPE then
				archetype_assign_entity(entity, record, destination)
			else
				archetype_move_entity(entity, record, source, destination)
			end

			local new_column = destination.columns_map[id]
			new_column[record.archetype_row] = data

			local operation_id = current_operation_id + 1
			current_operation_id = operation_id

			if swapped_record then
				local swap_monitors = swapped_record.monitors
				if swap_monitors then
					FIRE_MONITORS(swap_monitors, entity, source, destination, operation_id)
				end

				local swap_observers = swapped_record.observers_added
				if swap_observers then
					FIRE_OBSERVERS(swap_observers, entity, destination, operation_id)
				end
			end

			local component_record = components_lookup[id]
			if component_record then
				local monitors = component_record.monitors
				if monitors then
					FIRE_MONITORS(monitors, entity, source, destination, operation_id)
				end

				local observers = component_record.observers_added
				if observers then
					FIRE_OBSERVERS(observers, entity, destination, operation_id)
				end

				local added_hooks = component_record.on_added
				if added_hooks then
					FIRE_SET_HOOKS(added_hooks, entity, id, data)
				end
			end

			if post_removed then
				for _, callback in post_removed do
					callback()
				end
			end
		end
	end

	local function world_add(entity: u53, id: u53)
		local record = get_entity_record_asserts_alive(entity)
		if not record then
			return
		end

		local source = record.archetype
		if source.columns_map[id] then
			return
		end

		local swapped_record: PairRecord
		local post_removed: { () -> () }? = nil
		local destination: Archetype

		if IS_PAIR(id) then
			local relation = PAIR_FIRST(id)
			local relation_wildcard = ECS_PAIR(relation, ECS_WILDCARD)
			local relation_record = components_lookup[relation_wildcard] :: PairRecord

			if relation_record and CHECK_FLAG(relation_record.flags, IS_EXCLUSIVE_FLAG) then
				local column_index = relation_record.column_index[source.archetype_id]

				if column_index then
					local swapped_id = source.components[column_index]
					destination = archetype_find_swap_with(source, swapped_id, id, column_index)
					swapped_record = components_lookup[swapped_id] :: PairRecord

					local removed_hooks = swapped_record and swapped_record.on_removed
					if removed_hooks then
						post_removed = FIRE_REMOVE_HOOKS(removed_hooks, entity, swapped_id)
					end
				else
					destination = archetype_find_with(source, id)
				end
			else
				destination = archetype_find_with(source, id)
			end
		else
			destination = archetype_find_with(source, id)
		end

		if source == ROOT_ARCHETYPE then
			archetype_assign_entity(entity, record, destination)
		else
			archetype_move_entity(entity, record, source, destination)
		end

		--[[
		local target_wildcard = ECS_PAIR(ECS_WILDCARD, entity)
		local target_record = components_lookup[target_wildcard] :: PairRecord
		if target_record then
			for id, record in target_record.trav_records do
				reachable_invalidate_down(PAIR_FIRST(id), id, record)
			end
		end
		]]

		local operation_id = current_operation_id + 1
		current_operation_id = operation_id

		if swapped_record then
			local swap_monitors = swapped_record.monitors
			if swap_monitors then
				FIRE_MONITORS(swap_monitors, entity, source, destination, operation_id)
			end

			local swap_observers = swapped_record.observers_added
			if swap_observers then
				FIRE_OBSERVERS(swap_observers, entity, destination, operation_id)
			end
		end

		local component_record = components_lookup[id]
		if component_record then
			local monitors = component_record.monitors
			if monitors then
				FIRE_MONITORS(monitors, entity, source, destination, operation_id)
			end

			local observers = component_record.observers_added
			if observers then
				FIRE_OBSERVERS(observers, entity, destination, operation_id)
			end

			local added_hooks = component_record.on_added
			if added_hooks then
				FIRE_SET_HOOKS(added_hooks, entity, id)
			end
		end

		if post_removed then
			for _, callback in post_removed do
				callback()
			end
		end
	end

	local function world_remove(entity: u53, id: u53)
		local record = get_entity_record_alive(entity)
		if not record then
			return
		end

		local source = record.archetype
		if not source.columns_map[id] then
			return
		end

		local component_record = components_lookup[id]
		local removed_hooks = component_record.on_removed
		local post_removed = removed_hooks and FIRE_REMOVE_HOOKS(removed_hooks, entity, id) or nil

		local destination = archetype_find_without(source, id)
		if destination == ROOT_ARCHETYPE then
			archetype_delete_entity(source, record.archetype_row)
			record.archetype = ROOT_ARCHETYPE
			record.archetype_row = -1
		else
			archetype_move_entity(entity, record, source, destination)
		end

		local operation_id = current_operation_id + 1
		current_operation_id = operation_id

		local monitors = component_record.monitors
		if monitors then
			FIRE_MONITORS(monitors, entity, source, destination, operation_id)
		end

		local observers = component_record.observers_added
		if observers then
			FIRE_OBSERVERS(observers, entity, destination, operation_id)
		end

		-- important that post-removed callbacks are called after monitors
		-- because these callbacks should be able to edit the entity archetype freely
		-- so it can cause to fire a monitor_removed event before monitor_added, or viseversa
		if post_removed then
			for _, callback in post_removed do
				callback()
			end
		end
	end

	local function archetype_move_entities_to(
		archetype: Archetype,
		entities: { u53 },
		affected_removals: Map<u53, ComponentRecord>,
		destination: Archetype
	)
		local post_removed_callbacks: { () -> () }? = nil

		local operation_id = current_operation_id + 1
		current_operation_id = operation_id

		for id, component_record in affected_removals do
			local removed_hooks = component_record.on_removed
			if removed_hooks then
				for row, entity in entities do
					post_removed_callbacks = FIRE_REMOVE_HOOKS(removed_hooks, entity, id, post_removed_callbacks)
				end
			end
		end

		-- a hook may have deleted an entity whose cascade already emptied and
		-- destroyed this archetype; there is nothing left to move
		if archetype.destroyed then
			return
		end

		archetype_bulk_move_entities(archetype, destination, entities)

		for id, component_record in affected_removals do
			local all_monitors = component_record.monitors
			if all_monitors then
				FIRE_MONITORS_ENTITIES(all_monitors, entities, archetype, destination, operation_id)
			end

			local all_observers = component_record.observers_added
			if all_observers then
				FIRE_OBSERVERS_ENTITIES(all_observers, entities, destination, operation_id)
			end
		end

		if post_removed_callbacks then
			for _, callback in post_removed_callbacks do
				callback()
			end
		end
	end

	local function archetype_component_wipe(
		archetype: Archetype,
		id: u53,
		entities: { u53 },
		on_removed: Array<{ RemovedHook }>?,
		all_monitors: Array<{ QueryIdMonitor }>?,
		all_observers: Array<{ QueryIdObserver }>?
	)
		local destination = archetype_find_without(archetype, id)
		local post_removed_callbacks: { () -> () }?

		local operation_id = current_operation_id + 1
		current_operation_id = operation_id

		if on_removed then
			-- we fire hooks before we screw the archetypes this bad
			for _, entity in entities do
				post_removed_callbacks = FIRE_REMOVE_HOOKS(on_removed, entity, id, post_removed_callbacks)
			end
		end

		-- a hook may have deleted an entity whose cascade already emptied and
		-- destroyed this archetype; there is nothing left to move
		if archetype.destroyed then
			return
		end

		archetype_bulk_move_entities(archetype, destination, entities)

		if all_monitors then
			FIRE_MONITORS_ENTITIES(all_monitors, entities, archetype, destination, operation_id)
		end

		if all_observers then
			for _, observers in all_observers do
				for _, observer in observers do
					if observer.match(destination) then
						for _, entity in entities do
							observer.callback(entity, operation_id)
						end
					end
				end
			end
		end

		if post_removed_callbacks then
			for _, callback in post_removed_callbacks do
				callback()
			end
		end
	end

	local function component_record_wipe(component_record: ComponentRecord, id: u53, destroy_archetypes: boolean?)
		local on_removed = component_record.on_removed
		local monitors = component_record.monitors
		local observers_added = component_record.observers_added

		local archetype_ids = component_record.archetype_ids

		if destroy_archetypes then
			-- drain: every step destroys archetype_ids[#archetype_ids], which
			-- swap-removes it. Archetypes created by hooks mid-loop are appended
			-- and drained too.
			while #archetype_ids > 0 do
				local archetype_id = archetype_ids[#archetype_ids]
				local source = archetypes[archetype_id]
				if not source then
					record_unlink_archetype(component_record, archetype_id)
					continue
				end
				if not source.alive then
					archetype_destroy(source)
					continue
				end
				archetype_component_wipe(source, id, source.entities :: { any }, on_removed, monitors, observers_added)
				archetype_destroy(source)
			end
		else
			-- backwards over a snapshot of the length: a swap-remove caused by a
			-- hook lands in the already visited tail, and an archetype a hook
			-- re-creates with this id is appended past the bound (not revisited,
			-- so a hook that always re-adds cannot loop forever)
			for i = #archetype_ids, 1, -1 do
				local archetype_id = archetype_ids[i]
				if not archetype_id then
					continue
				end
				local source = archetypes[archetype_id]
				if not source or not source.alive then
					continue
				end
				archetype_component_wipe(source, id, source.entities :: { any }, on_removed, monitors, observers_added)
			end
		end
	end

	local function clear_entity_components(entity: u53, record: EntityRecord)
		local archetype = record.archetype
		local post_removed_callbacks: { () -> () }?

		local operation_id = current_operation_id + 1
		current_operation_id = operation_id

		for _, id in archetype.components do
			local component_record = components_lookup[id]

			local removed_hooks = component_record.on_removed
			if removed_hooks then
				post_removed_callbacks = FIRE_REMOVE_HOOKS(removed_hooks, entity, id, post_removed_callbacks)
			end
		end

		archetype_delete_entity(archetype, record.archetype_row)
		record.archetype = ROOT_ARCHETYPE
		record.archetype_row = -1

		for _, id in archetype.components do
			local component_record = components_lookup[id]
			local all_monitors = component_record.monitors

			if all_monitors then
				FIRE_MONITORS_REMOVED(all_monitors, entity, archetype, operation_id)
			end
		end

		if post_removed_callbacks then
			for _, callback in post_removed_callbacks do
				callback()
			end
		end
	end

	-- Releases every component record owned by a deleted entity: (*, E) and (E, *)
	local function component_records_release(entity: u53)
		components_lookup[entity] = nil

		local relation_wildcard = ECS_PAIR(entity, ECS_WILDCARD)
		local relation_record = components_lookup[relation_wildcard] :: PairRecord
		if relation_record then
			for pair_id in relation_record.first_records do
				local target_wildcard = ECS_PAIR(ECS_WILDCARD, PAIR_SECOND(pair_id))
				local target_record = components_lookup[target_wildcard] :: PairRecord
				if target_record then
					target_record.second_records[pair_id] = nil
					target_record.trav_records[pair_id] = nil
				end
				components_lookup[pair_id] = nil
			end
			components_lookup[relation_wildcard] = nil
		end

		local target_wildcard = ECS_PAIR(ECS_WILDCARD, entity)
		local target_record = components_lookup[target_wildcard] :: PairRecord
		if target_record then
			for pair_id in target_record.second_records do
				local relation_wildcard_of_pair = ECS_PAIR(PAIR_FIRST(pair_id), ECS_WILDCARD)
				local relation_record_of_pair = components_lookup[relation_wildcard_of_pair] :: PairRecord
				if relation_record_of_pair then
					relation_record_of_pair.first_records[pair_id] = nil
				end
				components_lookup[pair_id] = nil
			end
			components_lookup[target_wildcard] = nil
		end
	end

	local world_delete_recursive: (entity: u53) -> ()

	-- Deletes every entity of an archetype flagged for cascade deletion. Drains
	-- from the end so that entities appended by a nested cascade are visited,
	-- entities removed by a hook (a sibling delete) never leave a nil slot, and
	-- a bulk move that replaced archetype.entities is picked up on the next
	-- step. Stops as soon as a nested cascade destroyed the archetype itself.
	local function archetype_delete_all_entities(archetype: Archetype)
		while not archetype.destroyed do
			local entities = archetype.entities
			local last = #entities
			if last == 0 then
				break
			end
			world_delete_recursive(entities[last] :: any)
		end
	end

	-- Cascaded deletes (OnDeleteTarget, children, relation cleanup) go through
	-- here. Cycles such as A ChildOf B, B ChildOf A, or self pairs reach an
	-- entity that is already being torn down by an outer call; skip it silently.
	-- world_delete (public) errors on that case instead.
	function world_delete_recursive(entity: u53)
		local record = get_entity_record_asserts_alive(entity)
		if not record then
			return
		end
		if record.deleting then
			-- Reached through a cycle. The outer call finishes the teardown, but
			-- the caller is about to destroy the archetype this entity lives in
			-- and release its pair records, so the entity must leave it now while
			-- those records still exist.
			if record.archetype ~= ROOT_ARCHETYPE then
				clear_entity_components(entity, record)
			end
			return
		end
		record.deleting = true

		local component_record = components_lookup[entity]
		local relation_record = components_lookup[ECS_PAIR(entity, ECS_WILDCARD)] :: PairRecord
		local target_record = components_lookup[ECS_PAIR(ECS_WILDCARD, entity)] :: PairRecord

		if component_record then
			local has_delete = CHECK_FLAG(component_record.flags, HAS_DELETE_FLAG)
			if has_delete then
				local archetype_ids = component_record.archetype_ids
				while #archetype_ids > 0 do
					local archetype_id = archetype_ids[#archetype_ids]
					local archetype = archetypes[archetype_id]
					if not archetype then
						record_unlink_archetype(component_record, archetype_id)
						continue
					end

					archetype_delete_all_entities(archetype)
					archetype_destroy(archetype)
				end
			else
				component_record_wipe(component_record, entity, true)
			end
		end
		if target_record then
			local removing: Map<u53, ComponentRecord> = {}
			local archetype_ids = target_record.archetype_ids

			-- drain loop: every step ends by destroying archetype_ids[#archetype_ids],
			-- which swap-removes it. Nested cascades may append archetypes that
			-- still hold a pair to this entity; they are drained too.
			while #archetype_ids > 0 do
				local archetype_id = archetype_ids[#archetype_ids]
				local archetype = archetypes[archetype_id]
				if not archetype then
					record_unlink_archetype(target_record, archetype_id)
					continue
				end

				-- Dead archetypes hold no entities, so there is nothing to wipe or
				-- move. They still have to be destroyed.
				if not archetype.alive then
					archetype_destroy(archetype)
					continue
				end

				local deleted_any = false
				local entities: { u53 } = archetype.entities :: any
				local removing_count = 0

				for _, id in archetype.components do
					if not IS_PAIR(id) then
						continue
					end
					if get_entity_any(PAIR_SECOND(id)) ~= entity then
						continue
					end

					local id_record = components_lookup[id]
					local has_delete = CHECK_FLAG(id_record.flags, HAS_DELETE_FLAG)

					if has_delete then
						deleted_any = true
						break
					else
						removing[id] = id_record
						removing_count += 1
					end
				end

				if deleted_any then
					archetype_delete_all_entities(archetype)
				else
					if removing_count == 1 then
						for id, id_record in removing do
							local on_removed = id_record.on_removed
							local monitors = id_record.monitors
							local observers_added = id_record.observers_added
							archetype_component_wipe(archetype, id, entities, on_removed, monitors, observers_added)
						end
					else
						local destination_ids = table.clone(archetype.components)
						for id in removing do
							local at = table.find(destination_ids, id)
							table.remove(destination_ids, at)
						end

						local destination = archetype_ensure(destination_ids)
						archetype_move_entities_to(archetype, entities, removing, destination)
					end
				end

				table.clear(removing)
				archetype_destroy(archetype)
			end
		end
		if relation_record then
			local column_index = relation_record.column_index
			local archetype_ids = relation_record.archetype_ids
			local has_delete = CHECK_FLAG(relation_record.flags, HAS_DELETE_FLAG)

			if has_delete then
				while #archetype_ids > 0 do
					local archetype_id = archetype_ids[#archetype_ids]
					local archetype = archetypes[archetype_id]
					if not archetype then
						record_unlink_archetype(relation_record, archetype_id)
						continue
					end
					if not archetype.alive then
						archetype_destroy(archetype)
						continue
					end

					archetype_delete_all_entities(archetype)
					archetype_destroy(archetype)
				end
			else
				local pairs_count = relation_record.pairs_count

				while #archetype_ids > 0 do
					local archetype_id = archetype_ids[#archetype_ids]
					local archetype = archetypes[archetype_id]
					if not archetype then
						record_unlink_archetype(relation_record, archetype_id)
						continue
					end

					-- Dead archetypes hold no entities, so there is nothing to wipe or
					-- move. They still have to be destroyed.
					if not archetype.alive then
						archetype_destroy(archetype)
						continue
					end

					local entities: { u53 } = archetype.entities :: any
					local id_count = pairs_count[archetype_id]
					local index = column_index[archetype_id]
					local components = archetype.components
					local components_count = #components

					if id_count == 1 then
						local id = components[index]
						local id_record = components_lookup[id]
						local on_removed = id_record.on_removed
						local monitors = id_record.monitors
						local observers_added = id_record.observers_added

						archetype_component_wipe(archetype, id, entities, on_removed, monitors, observers_added)
					elseif id_count > 1 then
						local pair_start = column_index[archetype_id]
						local affected: Map<u53, ComponentRecord> = {}

						if id_count == components_count then
							for _, id in components do
								local id_record = components_lookup[id]
								affected[id] = id_record
							end
							archetype_move_entities_to(archetype, entities, affected, ROOT_ARCHETYPE)
						else
							for i = pair_start, pair_start + id_count - 1 do
								local id = components[i]
								local id_record = components_lookup[id]
								affected[id] = id_record
							end
							local destination_ids = REMOVE_ALL_PAIRS(components, components_count, pair_start, id_count)
							local destination = archetype_ensure(destination_ids)
							archetype_move_entities_to(archetype, entities, affected, destination)
						end
					end

					-- Every entity has been moved out of this archetype, and it holds
					-- pairs whose relation is about to be deleted, so it can never be
					-- reached again. Destroy it so its component records are unlinked
					-- before they are released below.
					archetype_destroy(archetype)
				end
			end
		end

		if record.archetype ~= ROOT_ARCHETYPE then
			clear_entity_components(entity, record)
		end
		local modified_archetype = record.archetype

		-- monitors/hooks can move the entity out of the root archetype by adding extra components
		if modified_archetype ~= ROOT_ARCHETYPE then
			archetype_delete_entity(modified_archetype, record.archetype_row)
			record.archetype = ROOT_ARCHETYPE
			record.archetype_row = -1
		end
		record.deleting = false
		component_records_release(entity)
		delete_entity_id(entity, record)
	end

	local function world_delete(entity: u53)
		local record = get_entity_record_asserts_alive(entity)
		if record and record.deleting then
			error "attempted to destroy an entity twice"
		end
		world_delete_recursive(entity)
	end

	local function world_wipe(id: u53)
		local component_record = components_lookup[id]
		if not component_record then
			return
		end
		component_record_wipe(component_record, id)
	end

	local function world_clear(entity: u53)
		local record = get_entity_record_asserts_alive(entity)
		if not record then
			return
		end

		local archetype = record.archetype
		if archetype == ROOT_ARCHETYPE then
			return
		end

		clear_entity_components(entity, record)
	end

	-- Places `id` into the sorted `destination_ids` for a bulk operation. When
	-- `id` is a pair of an exclusive relation and `source` already holds a
	-- different pair for it, that pair is replaced in place (same relation
	-- group, so order is preserved) and returned so the caller can fire its
	-- removal events. Two pairs of the same exclusive relation inside one batch
	-- both get inserted and are rejected by the sanity check in archetype_create.
	local function bulk_insert_id(source: Archetype, destination_ids: { u53 }, id: u53): (boolean, u53?)
		if IS_PAIR(id) then
			local relation_wildcard = ECS_PAIR(PAIR_FIRST(id), ECS_WILDCARD)
			local swapped_id = source.exclusive_pairs[relation_wildcard]
			if swapped_id then
				if swapped_id == id then
					return false, nil
				end
				local at = table.find(destination_ids, swapped_id)
				if at then
					destination_ids[at] = id
					return true, swapped_id
				end
			end
		end

		local at = FIND_INSERT(destination_ids, id)
		if at == -1 then
			return false, nil
		end
		table.insert(destination_ids, at, id)
		return true, nil
	end

	local function fire_swapped_removed_hooks(entity: u53, swapped: { u53 }): { () -> () }?
		local post_removed: { () -> () }? = nil
		for _, id in swapped do
			local removed_hooks = components_lookup[id].on_removed
			if removed_hooks then
				post_removed = FIRE_REMOVE_HOOKS(removed_hooks, entity, id, post_removed)
			end
		end
		return post_removed
	end

	local function fire_swapped_removed_events(
		entity: u53,
		swapped: { u53 },
		source: Archetype,
		destination: Archetype,
		operation_id: number
	)
		for _, id in swapped do
			local component_record = components_lookup[id]

			local monitors = component_record.monitors
			if monitors then
				FIRE_MONITORS(monitors, entity, source, destination, operation_id)
			end

			local observers = component_record.observers_added
			if observers then
				FIRE_OBSERVERS(observers, entity, destination, operation_id)
			end
		end
	end

	local function world_bulk_add(entity: u53, ids: { u53 })
		local record = get_entity_record_asserts_alive(entity)
		if not record then
			return
		end

		local operation_id = current_operation_id + 1
		current_operation_id = operation_id

		local source = record.archetype

		if source == ROOT_ARCHETYPE then
			local destination_ids = table.clone(ids)
			table.sort(destination_ids)

			local destination = archetype_ensure(destination_ids)
			archetype_assign_entity(entity, record, destination)

			for index, id in ids do
				local component_record = components_lookup[id]
				local all_monitors = component_record.monitors
				if all_monitors then
					-- small optimization in root archetype, as no queries are currently matching
					-- so we fire all monitors that match as "added" without checking the old archetype
					FIRE_MONITORS_ADDED(all_monitors, entity, destination, operation_id)
				end

				local all_observers = component_record.observers_added
				if all_observers then
					FIRE_OBSERVERS(all_observers, entity, destination, operation_id)
				end

				local on_added = component_record.on_added
				if on_added then
					FIRE_SET_HOOKS(on_added, entity, id, nil)
				end
			end
		else
			local destination_ids = table.clone(source.components)
			local inserted: Array<number> = {}
			local swapped: { u53 }? = nil

			for index, id in ids do
				local was_inserted, swapped_id = bulk_insert_id(source, destination_ids, id)
				if was_inserted then
					table.insert(inserted, index)
				end
				if swapped_id then
					swapped = swapped or {}
					table.insert(swapped :: { u53 }, swapped_id)
				end
			end

			local destination = archetype_ensure(destination_ids)

			if destination ~= source then
				local post_removed = swapped and fire_swapped_removed_hooks(entity, swapped) or nil

				archetype_move_entity(entity, record, source, destination)

				if swapped then
					fire_swapped_removed_events(entity, swapped, source, destination, operation_id)
				end

				for _, index in inserted do
					local id = ids[index]
					local component_record = components_lookup[id]

					local all_monitors = component_record.monitors
					if all_monitors then
						FIRE_MONITORS(all_monitors, entity, source, destination, operation_id)
					end

					local all_observers = component_record.observers_added
					if all_observers then
						FIRE_OBSERVERS(all_observers, entity, destination, operation_id)
					end

					local on_added = component_record.on_added
					if on_added then
						FIRE_SET_HOOKS(on_added, entity, id, nil)
					end
				end

				if post_removed then
					for _, callback in post_removed do
						callback()
					end
				end
			end
		end
	end

	local function world_bulk_set(entity: u53, ids: { u53 }, values: { any })
		local record = get_entity_record_asserts_alive(entity)
		if not record then
			return
		end

		local operation_id = current_operation_id + 1
		current_operation_id = operation_id

		local source = record.archetype

		if source == ROOT_ARCHETYPE then
			local destination_ids = table.clone(ids)
			table.sort(destination_ids)

			local destination = archetype_ensure(destination_ids)
			archetype_assign_entity(entity, record, destination)
			archetype_bulk_modify_columns(record.archetype_row, destination, ids, values)

			for index, id in ids do
				local component_record = components_lookup[id]
				local all_monitors = component_record.monitors
				if all_monitors then
					-- small optimization in root archetype, as no queries are currently matching
					-- so we fire all monitors that match as "added" without checking the old archetype
					FIRE_MONITORS_ADDED(all_monitors, entity, destination, operation_id)
				end

				local all_observers = component_record.observers_added
				if all_observers then
					FIRE_OBSERVERS(all_observers, entity, destination, operation_id)
				end

				local on_added = component_record.on_added
				if on_added then
					FIRE_SET_HOOKS(on_added, entity, id, values[index])
				end
			end
		else
			local destination_ids = table.clone(source.components)
			local inserted: Map<number, boolean> = {}
			local swapped: { u53 }? = nil

			for index, id in ids do
				local was_inserted, swapped_id = bulk_insert_id(source, destination_ids, id)
				inserted[index] = was_inserted
				if swapped_id then
					swapped = swapped or {}
					table.insert(swapped :: { u53 }, swapped_id)
				end
			end

			local destination = archetype_ensure(destination_ids)
			local post_removed: { () -> () }? = nil

			if destination ~= source then
				post_removed = swapped and fire_swapped_removed_hooks(entity, swapped) or nil
				archetype_move_entity(entity, record, source, destination)
			end

			archetype_bulk_modify_columns(record.archetype_row, destination, ids, values)

			if destination ~= source then
				if swapped then
					fire_swapped_removed_events(entity, swapped, source, destination, operation_id)
				end

				for index, was_inserted in inserted do
					local id = ids[index]
					local component_record = components_lookup[id]

					if was_inserted then
						local all_monitors = component_record.monitors
						local all_observers_added = component_record.observers_added
						local on_added = component_record.on_added

						if all_monitors then
							FIRE_MONITORS(all_monitors, entity, source, destination, operation_id)
						end
						if all_observers_added then
							FIRE_OBSERVERS(all_observers_added, entity, destination, operation_id)
						end
						if on_added then
							FIRE_SET_HOOKS(on_added, entity, id, values[index])
						end
					else
						local all_observers_changed = component_record.observers_changed
						if all_observers_changed then
							FIRE_OBSERVERS(all_observers_changed, entity, destination, operation_id)
						end

						local on_changed = component_record.on_changed
						if on_changed then
							FIRE_SET_HOOKS(on_changed, entity, id, values[index])
						end
					end
				end

				if post_removed then
					for _, callback in post_removed do
						callback()
					end
				end
			else
				for index, id in ids do
					local component_record = components_lookup[id]

					local all_observers_changed = component_record.observers_changed
					if all_observers_changed then
						FIRE_OBSERVERS(all_observers_changed, entity, destination, operation_id)
					end
					local on_changed = component_record.on_changed
					if on_changed then
						FIRE_SET_HOOKS(on_changed, entity, id, values[index])
					end
				end
			end
		end
	end

	local function world_bulk_remove(entity: u53, ids: { u53 })
		local record = get_entity_record_asserts_alive(entity)
		if not record then
			return
		end

		local source = record.archetype
		if source == ROOT_ARCHETYPE then
			return
		end

		local operation_id = current_operation_id + 1
		current_operation_id = operation_id

		local destination_ids = table.clone(source.components)
		local removed_ids: { u53 } = {}

		for _, id in ids do
			local at = table.find(destination_ids, id)
			if at then
				table.remove(destination_ids, at)
				table.insert(removed_ids, id)
			end
		end

		local destination = archetype_ensure(destination_ids)
		if source ~= destination then
			local post_removed_callbacks: { () -> () }? = nil
			for _, id in removed_ids do
				local component_record = components_lookup[id]

				local removed_hooks = component_record.on_removed
				if removed_hooks then
					post_removed_callbacks = FIRE_REMOVE_HOOKS(removed_hooks, entity, id, post_removed_callbacks)
				end
			end

			if destination == ROOT_ARCHETYPE then
				archetype_delete_entity(source, record.archetype_row)
				record.archetype = ROOT_ARCHETYPE
				record.archetype_row = -1
			else
				archetype_move_entity(entity, record, source, destination)
			end

			for _, id in removed_ids do
				local component_record = components_lookup[id]

				local all_monitors = component_record.monitors
				if all_monitors then
					FIRE_MONITORS(all_monitors, entity, source, destination, operation_id)
				end

				local all_observers = component_record.observers_added
				if all_observers then
					FIRE_OBSERVERS(all_observers, entity, destination, operation_id)
				end
			end

			if post_removed_callbacks then
				for _, callback in post_removed_callbacks do
					callback()
				end
			end
		end
	end

	local function world_tag(): u24
		component_count += 1
		if component_count > MAX_COMPONENT_ID then
			error "max components exceeded, consider changing _G.ECS_MAX_COMPONENT_ID"
		end
		return component_count
	end

	local function world_component(): u24
		local new_component = world_tag()
		world_add(new_component, ECS_COMPONENT)
		return new_component
	end

	local function world_pair_first(id: u53): u53?
		return get_entity_alive(PAIR_FIRST(id))
	end

	local function world_pair_second(id: u53): u53?
		return get_entity_alive(PAIR_SECOND(id))
	end

	local function world_traverse(entity: u53, relation: u53, id: u53): (u53?, any?)
		local record = get_entity_record_alive(entity)
		if not record then
			return nil, nil
		end
		local relation_wildcard = ECS_PAIR(relation, ECS_WILDCARD)
		local component_record = components_lookup[relation_wildcard]
		if not component_record then
			return nil, nil
		end

		local archetype: Archetype = record.archetype

		while true do
			local index = component_record.column_index[archetype.archetype_id]
			if not index then
				return nil, nil
			end

			local target_record = get_entity_record(PAIR_SECOND(archetype.components[index])) :: EntityRecord
			local target_archetype = target_record.archetype
			local column = target_archetype.columns_map[id]

			if column then
				return dense_arr[target_record.dense], column[target_record.archetype_row]
			end
			archetype = target_archetype
		end
	end

	local function world_target(entity: u53, relation: u53, index: number?): u53?
		local record = get_entity_record_alive(entity)
		if not record then
			return nil
		end

		local archetype = record.archetype
		local archetype_id = archetype.archetype_id
		local relation_wildcard = ECS_PAIR(relation, ECS_WILDCARD)
		local pair_record = components_lookup[relation_wildcard] :: PairRecord
		if not pair_record then
			return nil
		end
		local pairs_count = pair_record.pairs_count[archetype_id]

		if not pairs_count then
			return nil
		end
		local nth = index or 0
		if nth >= pairs_count then
			return nil
		end

		local pair_start = pair_record.column_index[archetype_id]
		local target_pair = archetype.components[pair_start + nth]
		return get_entity_any(PAIR_SECOND(target_pair))
	end

	local function world_pairs(entity: u53, relation: u53): () -> u53
		local record = get_entity_record(entity)
		if not record then
			return NOOP :: () -> u53
		end

		local relation_wildcard = ECS_PAIR(relation, ECS_WILDCARD)
		local pair_record = components_lookup[relation_wildcard] :: PairRecord
		if not pair_record then
			return NOOP :: () -> u53
		end

		local archetype = record.archetype

		local archetype_id = archetype.archetype_id
		local pairs_count = pair_record.pairs_count[archetype_id]

		if not pairs_count then
			return NOOP :: () -> u53
		end

		local pair_start = pair_record.column_index[archetype_id]
		local archetype_components = archetype.components
		local nth = 0

		return function(): u53
			if nth >= pairs_count then
				return nil :: any
			end

			local pair = archetype_components[pair_start + nth]
			nth += 1
			return pair
		end
	end

	local function world_each(id: u53): () -> u53
		local component_record = components_lookup[id]
		if not component_record then
			return NOOP :: () -> u53
		end

		-- Walk archetype_ids backwards by index: if the caller destroys the
		-- current archetype (by deleting its last entity) the swap-remove pulls
		-- the tail id into a slot already behind the cursor. Rows also walk
		-- backwards so deleting the yielded entity is safe.
		local archetype_ids = component_record.archetype_ids
		local index = #archetype_ids + 1
		local archetype: Archetype? = nil
		local row = 0

		return function(): u53
			while true do
				if archetype and not archetype.destroyed then
					-- re-read: a bulk move replaces archetype.entities
					local entities = archetype.entities
					if row > #entities then
						row = #entities
					end
					local entity = entities[row]
					if entity then
						row -= 1
						return entity :: any
					end
				end

				index -= 1
				local archetype_id = archetype_ids[index]
				if not archetype_id then
					return nil :: any
				end
				archetype = archetypes[archetype_id]
				if archetype and archetype.alive then
					row = #archetype.entities
				else
					archetype = nil
				end
			end
		end
	end

	local function world_children(parent: u53): () -> u53
		return world_each(ECS_PAIR(ECS_CHILDOF, parent))
	end

	local function world_parent(child: u53): u53?
		return world_target(child, ECS_CHILDOF)
	end

	local function world_exists(entity: u53): boolean
		local record = sparse_arr[ENTITY_ID(entity)]
		if not record then
			return false
		end
		local dense = record.dense
		if dense > entity_index.alive then
			return false
		end
		local alive_id = dense_arr[dense]
		return alive_id == entity
	end

	local function world_deleting(entity: u53): boolean
		local record = sparse_arr[ENTITY_ID(entity)]
		if not record then
			return false
		end
		return record.deleting
	end

	local function world_alive(entity: u53): boolean
		local record = sparse_arr[ENTITY_ID(entity)]
		if not record then
			return false
		end
		local dense = record.dense
		if dense > entity_index.alive then
			return false
		end
		local alive_id = dense_arr[dense]
		if alive_id ~= entity then
			return false
		end
		return not record.deleting
	end

	local function world_is_component(id: u53)
		local record = components_lookup[id]
		if record then
			return CHECK_FLAG(record.flags, IS_COMPONENT_FLAG)
		else
			if IS_PAIR(id) then
				local relation = world_pair_first(id)
				local target = world_pair_second(id)
				if not relation or not target then
					return false
				end
				return check_is_component(relation, target)
			else
				return check_is_component(id)
			end
		end
	end

	local function world_is_tag(id: u53)
		return not world_is_component(id)
	end

	local world_internal: WorldInternal = {
		entity_index = entity_index,

		archetype_creation_observers = archetype_creation_observers,
		archetype_destruction_observers = archetype_destruction_observers,

		component_record_ensure = component_record_ensure,

		get_entity_any = get_entity_any,
		get_entity_alive = get_entity_alive,

		get_entity_record = get_entity_record,
		get_entity_record_alive = get_entity_record_alive,
		get_entity_record_asserts_alive = get_entity_record_asserts_alive,

		get_new_entity_id = get_new_entity_id,
		delete_entity_id = delete_entity_id,

		component_record_create = component_record_create,
		wildcard_record_ensure = wildcard_record_ensure,
		check_is_component = check_is_component,

		archetype_create = archetype_create,
		archetype_ensure = archetype_ensure,
		archetype_destroy = archetype_destroy,
		archetype_find_with = archetype_find_with,
		archetype_find_without = archetype_find_without,
		archetype_find_swap_with = archetype_find_swap_with,

		archetype_insert_entity = archetype_insert_entity,
		archetype_assign_entity = archetype_assign_entity,
		archetype_move_entity = archetype_move_entity,
		archetype_delete_entity = archetype_delete_entity,

		ENTITY_MASK = ENTITY_MASK,
		GENERATION_MASK = GENERATION_MASK,
		MAX_COMPONENT_ID = MAX_COMPONENT_ID,
		ENTITY_ID = ENTITY_ID,
		ENTITY_GENERATION = ENTITY_GENERATION,
		APPEND_GENERATION = APPEND_GENERATION,
		INCREMENT_GENERATION = INCREMENT_GENERATION,
		FIND_INSERT = FIND_INSERT,
		HASH_IDS = HASH_IDS,
		REMOVE_ALL_PAIRS = REMOVE_ALL_PAIRS,
		INSERT_COMPONENT_HOOK = INSERT_COMPONENT_HOOK,
		MATCH_ARCHETYPE = MATCH_ARCHETYPE,
		FIND_MATCHED_ARCHETYPES = FIND_MATCHED_ARCHETYPES,
		OBSERVE_MATCHED_ARCHETYPES = OBSERVE_MATCHED_ARCHETYPES,
		get_archetypes_count = function()
			return archetypes_count
		end,

		ECS_PAIR = ECS_PAIR,
		PAIR_FIRST = PAIR_FIRST,
		PAIR_SECOND = PAIR_SECOND,
		IS_PAIR = IS_PAIR,
		ECS_WILDCARD = ECS_WILDCARD,
		ECS_TRANSITIVE = ECS_TRANSITIVE,
		NULL_ARRAY = NULL_ARRAY,
	}

	local world: World = {
		components_lookup = components_lookup,
		archetypes_lookup = archetypes_lookup,
		internal = world_internal,

		archetypes = archetypes,
		ROOT_ARCHETYPE = ROOT_ARCHETYPE,

		tag = world_tag,
		component = world_component,
		entity = world_entity,

		exists = world_exists,
		alive = world_alive,
		deleting = world_deleting,

		has = world_has,
		get = world_get,

		parent = world_parent,
		children = world_children,
		target = world_target,
		traverse = world_traverse,
		pairs = world_pairs,

		add = world_add,
		set = world_set,
		remove = world_remove,
		delete = world_delete,

		wipe = world_wipe,
		clear = world_clear,

		bulk_add = world_bulk_add,
		bulk_set = world_bulk_set,
		bulk_remove = world_bulk_remove,

		pair_first = world_pair_first,
		pair_second = world_pair_second,
		is_component = world_is_component,
		is_tag = world_is_tag,
	} :: any

	local function world_added(id: u53, callback: SetHook)
		local record = component_record_ensure(id)
		local all_hooks = record.on_added :: Array<{ SetHook }>
		if all_hooks == nil then
			all_hooks = { {} } :: Array<{ SetHook }>
			if IS_PAIR(id) then
				PROPAGATE_PAIR_EVENTS(world, id, record :: PairRecord, all_hooks, function(record)
					return record.on_added
				end, function(record, hooks)
					record.on_added = hooks
				end)
			end
		end

		local hooks, disconnect = INSERT_COMPONENT_HOOK(callback, all_hooks[PAIR_HOOK_INDEX])
		all_hooks[1] = hooks
		record.on_added = all_hooks

		return disconnect
	end

	local function world_changed(id: u53, callback: SetHook)
		local record = component_record_ensure(id)
		local all_hooks = record.on_changed :: Array<{ SetHook }>
		if all_hooks == nil then
			all_hooks = { {} } :: Array<{ SetHook }>
			if IS_PAIR(id) then
				PROPAGATE_PAIR_EVENTS(world, id, record :: PairRecord, all_hooks, function(record)
					return record.on_changed
				end, function(record, hooks)
					record.on_changed = hooks
				end)
			end
		end

		local hooks, disconnect = INSERT_COMPONENT_HOOK(callback, all_hooks[PAIR_HOOK_INDEX])
		all_hooks[1] = hooks
		record.on_changed = all_hooks

		return disconnect
	end

	local function world_removed(id: u53, callback: RemovedHook)
		local record = component_record_ensure(id)
		local all_hooks = record.on_removed :: Array<{ RemovedHook }>
		if all_hooks == nil then
			all_hooks = { {} } :: Array<{ RemovedHook }>
			local is_pair = IS_PAIR(id)
			if is_pair then
				PROPAGATE_PAIR_EVENTS(world, id, record :: PairRecord, all_hooks, function(record)
					return record.on_removed
				end, function(record, hooks)
					record.on_removed = hooks
				end)
			end
		end

		local hooks, disconnect = INSERT_COMPONENT_HOOK(callback, all_hooks[PAIR_HOOK_INDEX])
		all_hooks[1] = hooks
		record.on_removed = all_hooks

		return disconnect
	end

	local function world_query(...: u53)
		local terms = { ... }
		local with = { ... }
		return query_new(world, terms, with)
	end

	local function world_query_build()
		return engine.build(world)
	end

	world.each = world_each :: any
	world.query_build = world_query_build :: any
	world.query = world_query :: any
	world.added = world_added :: any
	world.changed = world_changed :: any
	world.removed = world_removed :: any

	for i = 1, preregistered_entities_count do
		get_new_entity_id()
	end

	for id in preregistered_components do
		world_add(id, ECS_COMPONENT)
	end

	world_add(ECS_NAME, ECS_COMPONENT)
	world_add(ECS_REST, ECS_COMPONENT)
	world_add(ECS_WILDCARD, ECS_COMPONENT)

	world_set(ECS_WILDCARD, ECS_NAME, "ecs.Wildcard")
	world_set(ECS_CHILDOF, ECS_NAME, "ecs.ChildOf")
	world_set(ECS_COMPONENT, ECS_NAME, "ecs.Component")

	world_set(ECS_ON_DELETE, ECS_NAME, "ecs.OnDelete")
	world_set(ECS_ON_DELETE_TARGET, ECS_NAME, "ecs.OnDeleteTarget")

	world_set(ECS_DELETE, ECS_NAME, "ecs.Delete")
	world_set(ECS_NAME, ECS_NAME, "ecs.Name")
	world_set(ECS_REST, ECS_NAME, "ecs.Rest")
	world_set(ECS_TRANSITIVE, ECS_NAME, "ecs.Transitive")

	world_add(ECS_CHILDOF, ECS_EXCLUSIVE)
	world_add(ECS_CHILDOF, ECS_PAIR(ECS_ON_DELETE_TARGET, ECS_DELETE))

	world_add(ECS_ON_DELETE, ECS_EXCLUSIVE)
	world_add(ECS_ON_DELETE_TARGET, ECS_EXCLUSIVE)
	world_add(ECS_CHILDOF, ECS_EXCLUSIVE)

	for entity, metadata in preregistered_metadata do
		for component, value in metadata do
			if value == NULL_VALUE then
				world_add(entity, component)
			else
				world_set(entity, component, value)
			end
		end
	end

	return world
end

local function ANY(value: any): any
	return value
end

return {
	is_pair = ANY(IS_PAIR) :: (Id) -> boolean,
	pair = ANY(ECS_PAIR) :: <R, T>(first: Id<R>, second: Id<T>) -> Pair<R, T>,

	component = ANY(PREREGISTER_COMPONENT) :: () -> Component,
	tag = ANY(PREREGISTER_TAG) :: () -> Entity,
	entity = ANY(PREREGISTER_ENTITY) :: () -> Entity,
	meta = ANY(PREREGISTER_METADATA) :: <T>(Entity, Component<T>, T?) -> (),

	PAIR_FIRST = PAIR_FIRST,
	PAIR_SECOND = PAIR_SECOND,

	Rest = ANY(ECS_REST) :: Entity,
	ChildOf = ANY(ECS_CHILDOF) :: Entity,
	Name = ANY(ECS_NAME) :: Component<string>,
	Exclusive = ANY(ECS_EXCLUSIVE) :: Entity,
	OnDelete = ANY(ECS_ON_DELETE) :: Entity,
	OnDeleteTarget = ANY(ECS_ON_DELETE_TARGET) :: Entity,
	Wildcard = ANY(ECS_WILDCARD) :: Entity,
	Delete = ANY(ECS_DELETE) :: Entity,
	ForceTag = ANY(ECS_FORCE_TAG) :: Entity,
	Error = ANY(ECS_ERROR) :: Entity,
	Traversable = ANY(ECS_TRAVERSABLE) :: Entity,
	Transitive = ANY(ECS_TRANSITIVE) :: Entity,
	Disabled = ANY(ECS_DISABLED) :: Entity,

	world = world_new,
	World = {
		new = world_new,
	},
}
