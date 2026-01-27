--!optimize 2
--!native
--!strict

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
type RemovedHook<T = any> = (entity: Entity, id: Id<T>) -> (() -> ())?

export type ArchetypeMatch = (archetype: Archetype) -> boolean

type ArchetypeObserverCallback = (archetype: Archetype) -> ()
type ArchetypeObserver = { match: ArchetypeMatch, callback: ArchetypeObserverCallback }

type QueryMonitorCallback = (entity: u53) -> ()

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

export type Query<T...> = typeof(setmetatable(
	{} :: {
		is_cached: boolean,

		with: (Query<T...>, ...Component) -> Query<T...>,
		without: (Query<T...>, ...Component) -> Query<T...>,
		clone: (Query<T...>) -> Query<T...>,
		rematch: (Query<T...>) -> { Archetype },
		archetypes: (Query<T...>) -> { Archetype },

		match: (Query<T...>, Archetype) -> boolean,
		has: (Query<T...>, entity: Entity) -> boolean,
		empty: (Query<T...>) -> boolean,
		count: (Query<T...>) -> number,
		entities: (Query<T...>) -> { Entity },
		random: (Query<T...>) -> Entity?,
		first: (Query<T...>, predicator: ((Entity, T...) -> boolean)?) -> (Entity, T...),

		cached: (Query<T...>) -> Query<T...>,
		cleanup: Cleanup,
		iter: (Query<T...>) -> () -> (Entity, T...),
		patch: (Query<T...>, mapper: (entity: Entity, T...) -> T...) -> (),

		monitor: (Query<T...>) -> Monitor,
		observe: (Query<T...>, callback: (entity: Entity) -> ()) -> Cleanup,
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

	match_archetype: (QueryInternal, Archetype) -> boolean,
}

export type Archetype = {
	archetype_id: ArchetypeId,
	hash: string,
	alive: boolean,

	entities: { Entity },
	columns: Array<Column>,
	components: Array<u53>,

	columns_map: { [u53]: Column },
	forward_edges: Map<u53, Archetype>,
	backwards_edges: Map<u53, Archetype>,
}

export type EntityRecord = {
	archetype: Archetype,
	archetype_row: number,
	dense: u24,
	deleting: boolean,

	archetype_changed: { ArchetypeChangedHook }?,
}

export type PairRecord = ComponentRecord & {
	pairs_count: Map<ArchetypeId, number>,
	pair_records: Map<u53, ComponentRecord>,
}

export type ComponentRecord = {
	column_index: Map<ArchetypeId, number>,

	archetype_count: number,
	flags: Bitset,

	on_added: { SetHook }?,
	on_changed: { SetHook }?,
	on_removed: { RemovedHook }?,

	monitors: { QueryIdMonitor }?,
	inherited: ComponentRecord?,

	-- observers_added will fire when the entity's archetype changes
	-- observers_changed will fire when the column value changes
	observers_added: { QueryIdObserver }?,
	observers_changed: { QueryIdObserver }?,
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
		& (<A, B>(Entity, Component<A>, Component<A>) -> (A, B))
		& (<A, B, C>(World, Entity, Component<A>, Component<A>, Component<A>) -> (A, B, C))
		& (<A, B, C, D>(Entity, Component<A>, Component<B>, Component<C>, Component<D>) -> (A, B, C, D)),

	parent: (child: Entity) -> Entity,
	children: (parent: Entity) -> () -> Entity,
	target: (entity: Entity, relation: Id, index: number?) -> Entity,
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

local preregistered_count = 0
local preregistered_components: Map<u53, true> = {}
local preregistered_metadata: Map<u53, Map<u53, any>> = {}

local MAX_COMPONENT_ID: number = _G.ECS_MAX_COMPONENT_ID or 256

local ENTITY_MASK = bit32.lshift(1, 24)
local GENERATION_MASK = bit32.lshift(1, 16)
local PAIR_OFFSET = 2 ^ 48

--[[
local BITSET_RANGE = 32
local BITSET_PAGE_SIZE = 8
local BITSET_MAX_ID = BITSET_RANGE * BITSET_PAGE_SIZE
]]

local ECS_WILDCARD = MAX_COMPONENT_ID + 1
local ECS_CHILDOF = MAX_COMPONENT_ID + 2
local ECS_NAME = MAX_COMPONENT_ID + 3
local ECS_COMPONENT = MAX_COMPONENT_ID + 4
local ECS_EXCLUSIVE = MAX_COMPONENT_ID + 5
local ECS_ON_DELETE_TARGET = MAX_COMPONENT_ID + 6
local ECS_DELETE = MAX_COMPONENT_ID + 7
local ECS_ON_DELETE = MAX_COMPONENT_ID + 8
local ECS_ERROR = MAX_COMPONENT_ID + 10
local ECS_TRAVERSABLE = MAX_COMPONENT_ID + 11
local ECS_DISABLED = MAX_COMPONENT_ID + 12
local ECS_REST = MAX_COMPONENT_ID + 13

local IS_COMPONENT_FLAG = bit32.lshift(1, 0)
local IS_EXCLUSIVE_FLAG = bit32.lshift(1, 1)
local HAS_DELETE_FLAG = bit32.lshift(1, 2)

local NULL_ARRAY = table.freeze {} :: { any }
local NULL_VALUE = newproxy()

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

local function PREREGISTER_COMPONENT()
	local id = MAX_COMPONENT_ID - preregistered_count
	preregistered_count += 1
	preregistered_components[id] = true
	return id
end

local function PREREGISTER_TAG()
	local id = MAX_COMPONENT_ID - preregistered_count
	preregistered_count += 1
	return id
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

	if pair_start > 1 then
		table.move(components, 1, pair_count - 1, 1, destination_ids)
		if pair_start + pair_count < components_count then
			table.move(components, pair_count + 1, components_count, 1, destination_ids)
		end
	else
		table.move(components, pair_count + 1, components_count, 1, destination_ids)
	end

	return destination_ids
end

local function FIRE_SET_HOOKS(hooks: { SetHook }, entity: u53, id: u53, data: any)
	for _, hook in hooks do
		hook(entity :: any, id :: any, data)
	end
end

local function FIRE_REMOVE_HOOKS(hooks: { RemovedHook }, entity: u53, id: u53, append_to: { () -> () }?)
	local post_removed_callbacks: { () -> () }? = append_to

	for _, hook in hooks do
		local post_removed = hook(entity :: any, id :: any)
		if post_removed then
			if post_removed_callbacks then
				table.insert(post_removed_callbacks, post_removed)
			else
				post_removed_callbacks = { post_removed }
			end
		end
	end

	return post_removed_callbacks
end

local function FIRE_MONITOR(monitor: QueryIdMonitor, entity: u53, source: Archetype, destination: Archetype)
	local match = monitor.match
	local matched_before = match(source)
	local matched_after = match(destination)

	if matched_before ~= matched_after then
		if matched_before then
			local removed = monitor.removed
			if removed then
				removed(entity)
			end
		else
			local added = monitor.added
			if added then
				added(entity)
			end
		end
	end
end

local function FIRE_MONITOR_ENTITIES(
	monitor: QueryIdMonitor,
	entities: { u53 },
	source: Archetype,
	destination: Archetype
)
	local match = monitor.match
	local matched_before = match(source)
	local matched_after = match(destination)

	if matched_before ~= matched_after then
		if matched_before then
			local removed = monitor.removed
			if removed then
				for _, entity in entities do
					removed(entity)
				end
			end
		else
			local added = monitor.added
			if added then
				for _, entity in entities do
					added(entity)
				end
			end
		end
	end
end

local function FIRE_QUERY_MONITORS(monitors: { QueryIdMonitor }, entity: u53, source: Archetype, destination: Archetype)
	for _, monitor in monitors do
		FIRE_MONITOR(monitor, entity, source, destination)
	end
end

local function FIRE_QUERY_OBSERVERS(observers: { QueryIdObserver }, entity: u53, archetype: Archetype)
	for _, observer in observers do
		if observer.match(archetype) then
			observer.callback(entity)
		end
	end
end

local function FIRE_QUERY_OBSERVERS_SET(observers_set: Map<QueryIdObserver, true>, entity: u53, archetype: Archetype)
	for observer in observers_set do
		if observer.match(archetype) then
			observer.callback(entity)
		end
	end
end

-- monitors/observers will be accumulated in a hashmap set for code that changes multiple components at once
-- to prevent them from firing multiple times as a single monitor subscribes to multiple components at the same time.
-- multiple monitors that belong to the same query are ovewritten and fired once per query
-- its slower but keeps monitors reliable
local function ACCUMULATE_MONITORS_SET(
	component_record: ComponentRecord,
	monitors_set: Map<QueryIdMonitor, true>?,
	observers_added_set: Map<QueryIdObserver, true>?,
	observers_changed_set: Map<QueryIdObserver, true>?
)
	if monitors_set then
		local monitors = component_record.monitors
		if monitors then
			for _, monitor in monitors do
				monitors_set[monitor] = true
			end
		end
	end

	if observers_added_set then
		local observers_added = component_record.observers_added
		if observers_added then
			for _, observer in observers_added do
				observers_added_set[observer] = true
			end
		end
	end

	if observers_changed_set then
		local observers_changed = component_record.observers_changed
		if observers_changed then
			for _, observer in observers_changed do
				observers_changed_set[observer] = true
			end
		end
	end

	local inherited = component_record.inherited
	if inherited then
		ACCUMULATE_MONITORS_SET(inherited, monitors_set, observers_added_set, observers_changed_set)
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
		local archetype_count = record.archetype_count
		if archetype_count < best_record_count then
			best_record = record
			best_record_count = archetype_count
		end
	end

	if best_record == nil then
		return compatible
	end

	if ignore_empty then
		for archetype_id in best_record.column_index do
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
		for archetype_id in best_record.column_index do
			local archetype = archetypes[archetype_id]
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
	end
	return compatible
end

local function OBSERVE_MATCHED_ARCHETYPES(world: World, with_ids: { number }, without_ids: { number }?)
	local internal = world.internal
	local archetype_creation_observers = internal.archetype_creation_observers
	local archetype_destruction_observers = internal.archetype_destruction_observers

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
		local last_archetype = compatible_archetypes[last_row]

		compatible_archetypes[row] = last_archetype
		compatible_archetypes[last_row] = nil

		compatible_archetypes_map[archetype_id] = nil
		compatible_archetypes_map[last_archetype.archetype_id] = row
	end

	local function archetype_matcher(archetype: Archetype)
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
		archetype_creation_observers[observe_id] = { creation_observer }
	end

	local destruction_observers = archetype_destruction_observers[observe_id]
	if destruction_observers then
		table.insert(destruction_observers, destruction_observer)
	else
		archetype_destruction_observers[observe_id] = { destruction_observer }
	end

	local function cleanup()
		local creation_index = table.find(creation_observers, creation_observer)
		if creation_index then
			table.remove(creation_observers, creation_index)
		end
	end

	return compatible_archetypes, compatible_archetypes_map, cleanup
end

local function observer_new(
	world: World,
	callback: QueryMonitorCallback,
	terms: { u53 },
	with_ids: { u53 },
	without_ids: { u53 }?
)
	local component_record_ensure = world.internal.component_record_ensure
	local _, archetypes_map, observers_cleanup = OBSERVE_MATCHED_ARCHETYPES(world, with_ids, without_ids)

	local function query_match(archetype: Archetype)
		return archetypes_map[archetype.archetype_id] ~= nil
	end

	local query_observer: QueryIdObserver = {
		match = query_match,
		callback = callback,
	}
	local inserted_in: { { QueryIdObserver } } = {}

	local function insert_added_observers(ids: { u53 })
		for _, id in ids do
			local component_record = component_record_ensure(id)
			local observers = component_record.observers_added
			if observers then
				table.insert(observers, query_observer)
			else
				observers = { query_observer }
				component_record.observers_added = observers
			end
			table.insert(inserted_in, observers :: { QueryIdObserver })
		end
	end

	insert_added_observers(with_ids)
	if without_ids then
		insert_added_observers(without_ids)
	end

	for _, id in terms do
		local component_record = component_record_ensure(id)
		local observers = component_record.observers_changed
		if observers then
			table.insert(observers, query_observer)
		else
			observers = { query_observer }
			component_record.observers_changed = observers
		end
		table.insert(inserted_in, observers :: { QueryIdObserver })
	end

	return function()
		observers_cleanup()
		REMOVE_INSERTED_OBSERVERS(inserted_in, query_observer)
	end
end

local function monitor_new(world: World, with_ids: { u53 }, without_ids: { u53 }?)
	local component_record_ensure = world.internal.component_record_ensure
	local _, archetypes_map, cache_cleanup = OBSERVE_MATCHED_ARCHETYPES(world, with_ids, without_ids)

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
		query_monitor.added = callback
	end

	local function monitor_removed(callback: QueryMonitorCallback)
		query_monitor.removed = callback
	end

	local function cleanup()
		cache_cleanup()
		REMOVE_INSERTED_OBSERVERS(inserted_in, query_monitor)
	end

	local function insert_monitors(ids: { u53 })
		for _, id in ids do
			local component_record = component_record_ensure(id)
			local monitors = component_record.monitors
			if monitors then
				table.insert(monitors, query_monitor)
			else
				monitors = { query_monitor }
				component_record.monitors = monitors
			end
			table.insert(inserted_in, monitors :: { QueryIdMonitor })
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
		return query.match_archetype(query, archetype)
	end
end

local function query_with(query: QueryInternal, ...: u53)
	local ids = { ... }
	local with_ids = query.with_ids
	table.move(ids, 1, #ids, #with_ids + 1, with_ids)
	return query
end

local function query_without(query: QueryInternal, ...: u53)
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

local function query_cached(query: QueryInternal)
	if query.is_cached then
		return
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
end

local function query_monitor(query: QueryInternal)
	return monitor_new(query.world, query.with_ids, query.without_ids)
end

local function query_observe(query: QueryInternal, callback: QueryMonitorCallback)
	return observer_new(query.world, callback, query.terms, query.with_ids, query.without_ids)
end

query_mt.with = query_with
query_mt.without = query_without
query_mt.clone = query_clone
query_mt.rematch = query_rematch
query_mt.archetypes = query_archetypes

query_mt.match = query_match
query_mt.has = query_has
query_mt.empty = query_empty
query_mt.entities = query_entities
query_mt.random = query_random
query_mt.first = query_first

query_mt.cached = query_cached
query_mt.cleanup = query_cleanup
query_mt.iter = query_iter
query_mt.__iter = query_iter
query_mt.patch = query_patch

query_mt.monitor = query_monitor
query_mt.observe = query_observe

local function world_new()
	local dense_arr = {}
	local sparse_arr = {}

	local archetypes_count = 1
	local archetypes: Map<ArchetypeId, Archetype> = {}
	local archetypes_lookup: Map<string, Archetype> = {}

	local component_count = 0
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

		entities = {},
		columns = {},
		components = {},

		columns_map = {},
		forward_edges = {},
		backwards_edges = {},
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
		return dense_arr[record.dense]
	end

	local function get_entity_alive(entity_id: u24): u53?
		local record = sparse_arr[entity_id]
		if record.dense > entity_index.alive then
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
		local alive = entity_index.alive

		local dense_index = record.dense
		if dense_index ~= alive then
			local swap = dense_arr[alive]
			dense_arr[dense_index] = swap

			local swap_record = sparse_arr[swap]
			swap_record.dense = dense_index
		end
		local new_generation = INCREMENT_GENERATION(dense_arr[dense_index])
		dense_arr[alive] = new_generation
		record.dense = alive
		entity_index.alive -= 1
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

	local function world_get(entity: u53, a: u53, b: u53, c: u53, d: u53, e: u53, ...): any
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
				unpack(rest)
		end
	end

	local function component_record_create(id: u53)
		local is_pair = IS_PAIR(id)
		local relation = id
		local is_exclusive = false
		local has_delete = false
		local target: u53? = nil

		local record: ComponentRecord = {
			column_index = {},
			pairs_count = {},

			archetype_count = 0,
			flags = nil :: any,

			monitors = {},
			observers_added = {},
			observers_changed = {},
		}

		if is_pair then
			relation = get_entity_alive(PAIR_FIRST(id)) :: number
			target = get_entity_alive(PAIR_SECOND(id))

			has_delete = world_has(relation, ECS_PAIR(ECS_ON_DELETE_TARGET, ECS_DELETE))
			is_exclusive = world_has(relation, ECS_EXCLUSIVE)

			local pair_record = record :: PairRecord
			pair_record.pairs_count = {}
			pair_record.pair_records = {}
		end

		local is_component = world_has(relation, ECS_COMPONENT) or preregistered_components[id]

		if world_has(relation, ECS_PAIR(ECS_ON_DELETE, ECS_DELETE)) then
			has_delete = true
		end

		if target and not is_component then
			is_component = world_has(target, ECS_COMPONENT)
		end

		record.flags = bit32.bor(
			(is_component and IS_COMPONENT_FLAG) or 0,
			(has_delete and HAS_DELETE_FLAG) or 0,
			(is_exclusive and IS_EXCLUSIVE_FLAG) or 0
		)

		components_lookup[id] = record
		return record
	end

	local function component_record_ensure(id: u53)
		local record = components_lookup[id]
		if record then
			return record
		end

		return component_record_create(id)
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

	local function archetype_append_to_pair(record: PairRecord, archetype_id: ArchetypeId, index: number): boolean
		local column_index = record.column_index
		local pairs_count = record.pairs_count

		if not column_index[archetype_id] then
			column_index[archetype_id] = index
			pairs_count[archetype_id] = 1
			return true
		else
			pairs_count[archetype_id] += 1
			return false
		end
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

			archetype.alive = false
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
		local archetype_id = archetype.archetype_id

		local forward_edges = archetype.forward_edges
		local backwards_edges = archetype.backwards_edges

		for id, edge_archetype in forward_edges do
			edge_archetype.backwards_edges[id] = nil
			forward_edges[id] = nil
		end
		for id, edge_archetype in backwards_edges do
			edge_archetype.forward_edges[id] = nil
			backwards_edges[id] = nil
		end

		archetypes[archetype_id] = nil
		archetypes_lookup[archetype.hash] = nil

		for id in archetype.columns_map do
			local component_record = components_lookup[id]
			component_record.column_index[archetype_id] = nil
			if (component_record :: PairRecord).pairs_count then
				(component_record :: PairRecord).pairs_count[archetype_id] = nil
			end
			component_record.archetype_count -= 1

			if component_record.archetype_count == 0 then
				components_lookup[id] = nil
			end

			fire_destroyed_archetype(archetype, id)
		end
	end

	local function archetype_create(ids: { u53 }, hash: string): Archetype
		local archetype_id = archetypes_count + 1
		archetypes_count = archetype_id

		local columns_length = #ids
		local columns = table.create(columns_length) :: { Column }

		local columns_map: Map<u53, Column> = {}

		local archetype: Archetype = {
			archetype_id = archetype_id,
			hash = hash,
			alive = false,

			entities = {},
			columns = columns,
			components = ids,

			columns_map = columns_map,
			forward_edges = {},
			backwards_edges = {},
		}

		for index, id in ids do
			local id_record = component_record_ensure(id)
			id_record.archetype_count += 1

			local is_tag = not CHECK_FLAG(id_record.flags, IS_COMPONENT_FLAG)
			local column = if is_tag then NULL_ARRAY else {}
			columns[index] = column
			columns_map[id] = column

			id_record.column_index[archetype_id] = index

			if IS_PAIR(id) then
				local relation = PAIR_FIRST(id)
				local target = PAIR_SECOND(id)

				local relation_wildcard = ECS_PAIR(relation, ECS_WILDCARD)
				local relation_record = component_record_ensure(relation_wildcard) :: PairRecord
				relation_record.archetype_count += 1

				local relation_appended = archetype_append_to_pair(relation_record, archetype_id, index)
				if relation_appended then
					columns_map[relation_wildcard] = column
				end

				local pair_records = relation_record.pair_records
				if pair_records then
					pair_records[id] = id_record
				else
					relation_record.pair_records = {
						[id] = id_record,
					}
				end

				local target_wildcard = ECS_PAIR(ECS_WILDCARD, target)
				local target_record = component_record_ensure(target_wildcard) :: PairRecord
				target_record.archetype_count += 1

				local target_appended = archetype_append_to_pair(target_record, archetype_id, index)
				if target_appended then
					columns_map[target_wildcard] = column
				end
			end
		end

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

	local function archetype_find_swap_with(source: Archetype, swapped: u53, id: u53, at: number)
		local forward_edges = source.forward_edges
		local destination = forward_edges[id]

		if not destination then
			local destination_components = table.clone(source.components)
			destination_components[at] = id

			local found = archetype_ensure(destination_components)
			forward_edges[id] = found

			local backwards_edges = source.backwards_edges
			local root = backwards_edges[swapped]
			if root then
				root.forward_edges[id] = found
			end

			return found
		end

		return destination
	end

	local function archetype_find_without(source: Archetype, id: u53)
		local edges = source.backwards_edges
		local destination = edges[id]
		if not destination then
			local destination_components = table.clone(source.components)
			local remove_at = table.find(destination_components, id)
			table.remove(destination_components, remove_at)

			local found = archetype_ensure(destination_components)
			edges[id] = found
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
				table.move(column, 1, source_last_row, destination_last_row + 1, destination_column)
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
			column[record.archetype_row] = data

			local component_record: ComponentRecord? = components_lookup[id]
			while component_record do
				local observers = component_record.observers_changed
				if observers then
					FIRE_QUERY_OBSERVERS(observers, entity, source)
				end

				local changed_hooks = component_record.on_changed
				if changed_hooks then
					FIRE_SET_HOOKS(changed_hooks, entity, id, data)
				end

				component_record = component_record.inherited
			end
		else
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

			if swapped_record then
				local swap_monitor = swapped_record.monitors
				if swap_monitor then
					FIRE_QUERY_MONITORS(swap_monitor, entity, source, destination)
				end

				local rel_observers = swapped_record.observers_added
				if rel_observers then
					FIRE_QUERY_OBSERVERS(rel_observers, entity, destination)
				end
			end

			local component_record: ComponentRecord? = components_lookup[id]
			while component_record do
				local monitors = component_record.monitors
				if monitors then
					FIRE_QUERY_MONITORS(monitors, entity, source, destination)
				end

				local observers = component_record.observers_added
				if observers then
					FIRE_QUERY_OBSERVERS(observers, entity, destination)
				end

				local added_hooks = component_record.on_added
				if added_hooks then
					FIRE_SET_HOOKS(added_hooks, entity, id, data)
				end
				component_record = component_record.inherited
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

		if swapped_record then
			local swap_monitor = swapped_record.monitors
			if swap_monitor then
				FIRE_QUERY_MONITORS(swap_monitor, entity, source, destination)
			end

			local rel_observers = swapped_record.observers_added
			if rel_observers then
				FIRE_QUERY_OBSERVERS(rel_observers, entity, destination)
			end
		end

		local component_record: ComponentRecord? = components_lookup[id]

		while component_record do
			local monitors = component_record.monitors
			if monitors then
				FIRE_QUERY_MONITORS(monitors, entity, source, destination)
			end

			local observers = component_record.observers_added
			if observers then
				FIRE_QUERY_OBSERVERS(observers, entity, destination)
			end

			local added_hooks = component_record.on_added
			if added_hooks then
				FIRE_SET_HOOKS(added_hooks, entity, id)
			end

			component_record = component_record.inherited
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
		archetype_move_entity(entity, record, source, destination)

		local monitors = component_record.monitors
		if monitors then
			FIRE_QUERY_MONITORS(monitors, entity, source, destination)
		end

		local observers = component_record.observers_added
		if observers then
			FIRE_QUERY_OBSERVERS(observers, entity, destination)
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

	local function archetype_swap_to(
		archetype: Archetype,
		entities: { u53 },
		affected: Map<u53, ComponentRecord>,
		destination: Archetype
	)
		local post_removed_callbacks: Array<{ () -> () }>
		local monitors_set: Map<QueryIdMonitor, true> = {}
		local observers_added_set: Map<QueryIdObserver, true> = {}

		for id, component_record in affected do
			ACCUMULATE_MONITORS_SET(component_record, monitors_set, observers_added_set)

			local removed_hooks = component_record.on_removed
			if removed_hooks then
				for row, entity in entities do
					local post_removed = FIRE_REMOVE_HOOKS(removed_hooks, entity, id)
					if post_removed then
						if post_removed_callbacks then
							table.insert(post_removed_callbacks, post_removed)
						else
							post_removed_callbacks = { post_removed }
						end
					end
				end
			end
		end

		archetype_bulk_move_entities(archetype, destination, entities)

		for monitor in monitors_set do
			FIRE_MONITOR_ENTITIES(monitor, entities, archetype, destination)
		end

		for observer in observers_added_set do
			if observer.match(destination) then
				for _, entity in entities do
					observer.callback(entity)
				end
			end
		end

		if post_removed_callbacks then
			for _, post_removed in post_removed_callbacks do
				for _, callback in post_removed do
					callback()
				end
			end
		end
	end

	local function archetype_component_wipe(
		archetype: Archetype,
		id: u53,
		entities: { u53 },
		on_removed: { RemovedHook }?,
		monitors: { QueryIdMonitor }?,
		observers_added: { QueryIdObserver }?
	)
		local destination = archetype_find_without(archetype, id)
		local post_removed_callbacks: { () -> () }?

		if on_removed then
			-- we fire hooks before we screw the archetypes this bad
			for _, entity in entities do
				post_removed_callbacks = FIRE_REMOVE_HOOKS(on_removed, entity, id, post_removed_callbacks)
			end
		end

		archetype_bulk_move_entities(archetype, destination, entities)

		if monitors then
			for _, monitor in monitors do
				FIRE_MONITOR_ENTITIES(monitor, entities, archetype, destination)
			end
		end

		if observers_added then
			for _, observer in observers_added do
				if observer.match(destination) then
					for _, entity in entities do
						observer.callback(entity)
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

		if destroy_archetypes then
			for archetype_id in component_record.column_index do
				local source = archetypes[archetype_id]
				if not source.alive then
					archetype_destroy(source)
					continue
				end
				archetype_component_wipe(source, id, source.entities :: { any }, on_removed, monitors, observers_added)
				archetype_destroy(source)
			end
		else
			for archetype_id in component_record.column_index do
				local source = archetypes[archetype_id]
				if not source.alive then
					continue
				end
				archetype_component_wipe(source, id, source.entities :: { any }, on_removed, monitors, observers_added)
			end
		end
	end

	local function clear_entity_components(entity: u53, record: EntityRecord)
		local archetype = record.archetype
		local post_removed_callbacks: { () -> () }?
		local monitors_set: Map<QueryIdMonitor, true> = {}

		for _, id in archetype.components do
			local component_record = components_lookup[id]
			ACCUMULATE_MONITORS_SET(component_record, monitors_set)

			local removed_hooks = component_record.on_removed
			if removed_hooks then
				post_removed_callbacks = FIRE_REMOVE_HOOKS(removed_hooks, entity, id, post_removed_callbacks)
			end
		end

		archetype_delete_entity(archetype, record.archetype_row)
		record.archetype = ROOT_ARCHETYPE
		record.archetype_row = -1

		for monitor in monitors_set do
			local removed = monitor.removed
			if removed then
				if monitor.match(archetype) then
					removed(entity)
				end
			end
		end

		if post_removed_callbacks then
			for _, callback in post_removed_callbacks do
				callback()
			end
		end
	end

	local function world_delete(entity: u53)
		local record = get_entity_record_asserts_alive(entity)
		if not record then
			return
		end
		if record.deleting then
			error "attempted to destroy an entity twice"
		end

		local component_record = components_lookup[entity]
		local relation_record = components_lookup[ECS_PAIR(entity, ECS_WILDCARD)] :: PairRecord
		local target_record = components_lookup[ECS_PAIR(ECS_WILDCARD, entity)] :: PairRecord

		if component_record then
			local has_delete = CHECK_FLAG(component_record.flags, HAS_DELETE_FLAG)
			if has_delete then
				for archetype_id in component_record.column_index do
					local archetype = archetypes[archetype_id]
					local entities = archetype.entities
					local last_row = #entities

					for row = last_row, 1, -1 do
						local child = entities[last_row]
						world_delete(child :: any)
					end

					archetype_destroy(archetype)
				end
			else
				component_record_wipe(component_record, entity, true)
			end
		end
		if target_record then
			local removing: Map<u53, ComponentRecord> = {}

			for archetype_id in target_record.column_index do
				local archetype = archetypes[archetype_id]
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
					for row = #entities, 1, -1 do
						local child = entities[row]
						world_delete(child)
					end
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
						archetype_swap_to(archetype, entities, removing, destination)
					end
				end

				table.clear(removing)
				archetype_destroy(archetype)
			end
		end
		if relation_record then
			local column_index = relation_record.column_index
			local has_delete = CHECK_FLAG(relation_record.flags, HAS_DELETE_FLAG)

			if has_delete then
				for archetype_id in column_index do
					local archetype = archetypes[archetype_id]
					local entities = archetype.entities
					local last_row = #entities

					for i = last_row, 1, -1 do
						world_delete(entities[i] :: any)
					end
					archetype_destroy(archetype)
				end
			else
				local pairs_count = relation_record.pairs_count

				for archetype_id in column_index do
					local archetype = archetypes[archetype_id]
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
							archetype_swap_to(archetype, entities, affected, ROOT_ARCHETYPE)
						else
							for i = pair_start, id_count do
								local id = components[i]
								local id_record = components_lookup[id]
								affected[id] = id_record
							end
							local destination_ids = REMOVE_ALL_PAIRS(components, components_count, pair_start, id_count)
							local destination = archetype_ensure(destination_ids)
							archetype_swap_to(archetype, entities, affected, destination)
						end
					end
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
		delete_entity_id(entity, record)
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

	local function world_bulk_add(entity: u53, ids: { u53 })
		local record = get_entity_record_asserts_alive(entity)
		if not record then
			return
		end
		local source = record.archetype

		if source == ROOT_ARCHETYPE then
			local destination_ids = table.clone(ids)
			table.sort(destination_ids)

			local destination = archetype_ensure(destination_ids)
			archetype_assign_entity(entity, record, destination)

			-- notifying
			local monitors_set: Map<QueryIdMonitor, true> = {}
			local observers_added_set: Map<QueryIdObserver, true> = {}
			local firing_hooks: Map<number, { SetHook }> = {}

			-- hooks are added in an array to keep the same order things are fired
			-- monitors/observers sets are fired before changed hooks
			-- so this means monitor sets should be fully accumulated before firing added hooks
			for index, id in ids do
				local component_record = components_lookup[id]
				ACCUMULATE_MONITORS_SET(component_record, monitors_set, observers_added_set)
				local on_added = component_record.on_added
				if on_added then
					firing_hooks[index] = on_added
				end
			end

			for monitor in monitors_set do
				local added = monitor.added
				if added then
					local matched = monitor.match(destination)
					if matched then
						added(entity)
					end
				end
			end

			FIRE_QUERY_OBSERVERS_SET(observers_added_set, entity, destination)

			for index, hooks in firing_hooks do
				FIRE_SET_HOOKS(hooks, entity, ids[index], nil)
			end
		else
			local destination_ids = table.clone(source.components)
			local inserted: Array<number> = {}

			-- inserting ids
			for index, id in ids do
				local at = FIND_INSERT(destination_ids, id)
				if at ~= -1 then
					table.insert(destination_ids, id, at)
					table.insert(inserted, index)
				end
			end

			local destination = archetype_ensure(destination_ids)

			-- notifying
			if destination ~= source then
				archetype_move_entity(entity, record, source, destination)

				local monitors_set: Map<QueryIdMonitor, true> = {}
				local observers_added_set: Map<QueryIdObserver, true> = {}
				local firing_hooks: Map<number, { SetHook }> = {}

				for _, index in inserted do
					local id = ids[index]
					local component_record = components_lookup[id]
					ACCUMULATE_MONITORS_SET(component_record, monitors_set, observers_added_set)
					local on_added = component_record.on_added
					if on_added then
						firing_hooks[index] = on_added
					end
				end

				for monitor in monitors_set do
					FIRE_MONITOR(monitor, entity, source, destination)
				end

				FIRE_QUERY_OBSERVERS_SET(observers_added_set, entity, destination)

				for index, hooks in firing_hooks do
					FIRE_SET_HOOKS(hooks, entity, ids[index], nil)
				end
			end
		end
	end

	local function world_bulk_set(entity: u53, ids: { u53 }, values: { any })
		local record = get_entity_record_asserts_alive(entity)
		if not record then
			return
		end
		local source = record.archetype

		if source == ROOT_ARCHETYPE then
			local destination_ids = table.clone(ids)
			table.sort(destination_ids)

			local destination = archetype_ensure(destination_ids)
			archetype_assign_entity(entity, record, destination)
			archetype_bulk_modify_columns(record.archetype_row, destination, ids, values)

			-- notifying
			local monitors_set: Map<QueryIdMonitor, true> = {}
			local observers_added_set: Map<QueryIdObserver, true> = {}
			local firing_hooks: Map<number, { SetHook }> = {}

			for index, id in ids do
				local component_record = components_lookup[id]
				ACCUMULATE_MONITORS_SET(component_record, monitors_set, observers_added_set)
				local on_added = component_record.on_added
				if on_added then
					firing_hooks[index] = on_added
				end
			end

			for monitor in monitors_set do
				local added = monitor.added
				if added then
					local matched = monitor.match(destination)
					if matched then
						added(entity)
					end
				end
			end

			FIRE_QUERY_OBSERVERS_SET(observers_added_set, entity, destination)

			for index, hooks in firing_hooks do
				FIRE_SET_HOOKS(hooks, entity, ids[index], values[index])
			end
		else
			local destination_ids = table.clone(source.components)
			local inserted: Map<number, boolean> = {}

			-- inserting ids
			for index, id in ids do
				local at = FIND_INSERT(destination_ids, id)
				if at == -1 then
					inserted[index] = false
				else
					table.insert(destination_ids, id, at)
					inserted[index] = true
				end
			end

			local destination = archetype_ensure(destination_ids)
			if destination ~= source then
				archetype_move_entity(entity, record, source, destination)
			end

			archetype_bulk_modify_columns(record.archetype_row, destination, ids, values)

			-- notifying
			if destination ~= source then
				local monitors_set: Map<QueryIdMonitor, true> = {}
				local observers_set: Map<QueryIdObserver, true> = {}
				local firing_hooks: Map<number, { SetHook }> = {}

				for index, was_inserted in inserted do
					local id = ids[index]
					local component_record = components_lookup[id]

					local hooks: { SetHook }? = nil
					if was_inserted then
						-- accumulates monitors and observers_added
						ACCUMULATE_MONITORS_SET(component_record, monitors_set, observers_set)
						hooks = component_record.on_added
					else
						-- accumulates observers_changed only
						ACCUMULATE_MONITORS_SET(component_record, nil, nil, observers_set)
						hooks = component_record.on_changed
					end
					if hooks then
						firing_hooks[index] = hooks
					end
				end

				for monitor in monitors_set do
					FIRE_MONITOR(monitor, entity, source, destination)
				end

				FIRE_QUERY_OBSERVERS_SET(observers_set, entity, destination)

				for index, hooks in firing_hooks do
					FIRE_SET_HOOKS(hooks, entity, ids[index], values[index])
				end
			else
				local observers_changed_set: Map<QueryIdObserver, true> = {}
				local firing_hooks: Map<number, { SetHook }> = {}

				for index, id in ids do
					local component_record = components_lookup[id]
					ACCUMULATE_MONITORS_SET(component_record, nil, nil, observers_changed_set)
					local on_changed = component_record.on_changed
					if on_changed then
						firing_hooks[index] = on_changed
					end
				end

				FIRE_QUERY_OBSERVERS_SET(observers_changed_set, entity, destination)

				for index, hooks in firing_hooks do
					FIRE_SET_HOOKS(hooks, entity, ids[index], values[index])
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
			local post_removed_callbacks: { () -> () }?
			local monitors_set: Map<QueryIdMonitor, true> = {}
			local observers_added_set: Map<QueryIdObserver, true> = {}

			for _, id in removed_ids do
				local component_record = components_lookup[id]
				ACCUMULATE_MONITORS_SET(component_record, monitors_set, observers_added_set)

				local removed_hooks = component_record.on_removed
				if removed_hooks then
					post_removed_callbacks = FIRE_REMOVE_HOOKS(removed_hooks, entity, id, post_removed_callbacks)
				end
			end

			archetype_move_entity(entity, record, source, destination)

			for monitor in monitors_set do
				FIRE_MONITOR(monitor, entity, source, destination)
			end

			FIRE_QUERY_OBSERVERS_SET(observers_added_set, entity, destination)

			if post_removed_callbacks then
				for _, callback in post_removed_callbacks do
					callback()
				end
			end
		end
	end

	local function world_tag(): u24
		component_count += 1
		if component_count > (MAX_COMPONENT_ID - preregistered_count) then
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

	local function world_target(entity: u53, relation: u53, index: number?): u53?
		local record = get_entity_record_alive(entity)
		if not record then
			return nil
		end

		local archetype = record.archetype
		local archetype_id = archetype.archetype_id
		local relation_wildcard = ECS_PAIR(relation, ECS_WILDCARD)
		local pair_record = components_lookup[relation_wildcard] :: PairRecord
		local pairs_count = pair_record.pairs_count[archetype_id]

		if not pairs_count then
			return nil
		end
		local nth = index or 0
		if pairs_count >= nth then
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

		local component_archetypes = component_record.column_index
		local archetype_id = next(component_archetypes) :: number
		local archetype: Archetype? = archetype_id and archetypes[archetype_id]
		if not archetype then
			return NOOP :: () -> u53
		end

		local entities = archetype.entities
		local row = #entities

		return function(): u53
			local entity = entities[row]
			while not entity do
				archetype_id = next(archetypes, archetype_id) :: number
				if not archetype_id then
					return nil :: any
				end

				archetype = archetypes[archetype_id]
				entities = archetype.entities
				row = #entities
				entity = entities[row]
			end
			row -= 1
			return entity :: any
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
		if record == nil then
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
		if dense <= entity_index.alive then
			return false
		end
		local alive_id = dense_arr[dense]
		if alive_id ~= entity then
			return false
		end
		return not record.deleting
	end

	local function is_component(id: u53)
		local record = component_record_ensure(id)
		return CHECK_FLAG(record.flags, IS_COMPONENT_FLAG)
	end

	local function is_tag(id: u53)
		return not is_component(id)
	end

	local function insert_component_hook<T>(callback: T, hooks: { T }?)
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

		return hooks, disconnect
	end

	local function world_added(id: u53, callback: SetHook)
		local record = component_record_ensure(id)
		local hooks, disconnect = insert_component_hook(callback, record.on_added)
		record.on_added = hooks
		return disconnect
	end

	local function world_changed(id: u53, callback: SetHook)
		local record = component_record_ensure(id)
		local hooks, disconnect = insert_component_hook(callback, record.on_changed)
		record.on_changed = hooks
		return disconnect
	end

	local function world_removed(id: u53, callback: RemovedHook)
		local record = component_record_ensure(id)
		local hooks, disconnect = insert_component_hook(callback, record.on_removed)
		record.on_removed = hooks
		return disconnect
	end

	local world_internal: WorldInternal = {
		entity_index = entity_index,

		archetype_creation_observers = archetype_creation_observers,
		archetype_destruction_observers = archetype_creation_observers,

		component_record_ensure = component_record_ensure,

		get_entity_any = get_entity_any,
		get_entity_alive = get_entity_alive,

		get_entity_record = get_entity_record,
		get_entity_record_alive = get_entity_record_alive,
		get_entity_record_asserts_alive = get_entity_record_asserts_alive,
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

		added = world_added,
		changed = world_changed,
		removed = world_removed,

		pair_first = world_pair_first,
		pair_second = world_pair_second,
		is_component = is_component,
		is_tag = is_tag,
	} :: any

	local function world_query(...: u53)
		local terms = { ... }
		local with = { ... }
		return query_new(world, terms, with)
	end

	world.each = world_each :: any
	world.query = world_query :: any

	for i = 1, ECS_REST do
		get_new_entity_id()
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
	meta = ANY(PREREGISTER_METADATA) :: <T>(Entity, Component<T>, T?) -> (),

	Name = ANY(ECS_NAME) :: Component<string>,
	Exclusive = ANY(ECS_EXCLUSIVE) :: Entity,
	OnDelete = ANY(ECS_ON_DELETE) :: Entity,
	OnDeleteTarget = ANY(ECS_ON_DELETE_TARGET) :: Entity,
	Wildcard = ANY(ECS_WILDCARD) :: Entity,
	Error = ANY(ECS_ERROR) :: Entity,
	Delete = ANY(ECS_DELETE) :: Entity,
	Traversable = ANY(ECS_TRAVERSABLE),
	Disabled = ANY(),

	world = world_new,
	World = {
		new = world_new,
	},
}
