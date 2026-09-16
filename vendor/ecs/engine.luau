--!optimize 2
--!native
--!strict

-- Query engine.
--
-- A query is described with a builder, compiled once into bytecode
-- and then executed by a small stackless backtracking interpreter.
-- The interpreter only runs per archetype (or per archetype result), never per
-- entity: everything a term needs is archetype invariant except the row, which
-- is handled by specialised emission closures.
--
-- Queries whose terms are all plain `$this` terms (Class S) never build a
-- program at all; they iterate with the same shape as `world.query`.

type u24 = number
type u53 = number
type Column = { any }
type Map<K, V> = { [K]: V }

type Archetype = {
	archetype_id: number,
	alive: boolean,
	destroyed: boolean,
	entities: { u53 },
	columns: { Column },
	components: { u53 },
	columns_map: Map<u53, Column>,
}

type ComponentRecord = {
	column_index: Map<number, number>,
	archetype_ids: { number },
}

type PairRecord = ComponentRecord & {
	pairs_count: Map<number, number>,
}

type EntityRecord = {
	archetype: Archetype,
	archetype_row: number,
	dense: number,
}

type EntityIndex = {
	dense: { u53 },
	sparse: Map<u24, EntityRecord>,
	alive: number,
}

type WorldInternal = {
	entity_index: EntityIndex,

	ECS_PAIR: (first: u53, second: u53) -> u53,
	PAIR_FIRST: (id: u53) -> u24,
	PAIR_SECOND: (id: u53) -> u24,
	IS_PAIR: (id: u53) -> boolean,
	ECS_WILDCARD: u53,
	ECS_TRANSITIVE: u53,
	NULL_ARRAY: Column,
	get_entity_alive: (entity_id: u24) -> u53?,

	get_archetypes_count: () -> number,
	MATCH_ARCHETYPE: (with_ids: { u53 }, without_ids: { u53 }?, archetype: Archetype) -> boolean,
	FIND_MATCHED_ARCHETYPES: (
		world: any,
		with_ids: { u53 },
		without_ids: { u53 }?,
		ignore_empty: boolean
	) -> { Archetype },
	OBSERVE_MATCHED_ARCHETYPES: (
		world: any,
		with_ids: { u53 },
		without_ids: { u53 }?
	) -> ({ Archetype }, Map<number, number>, () -> ()),
}

type World = {
	components_lookup: Map<u53, ComponentRecord>,
	archetypes: Map<number, Archetype>,
	internal: WorldInternal,
	has: (entity: u53, id: u53) -> boolean,
}

local MODE_TERM = 1
local MODE_WITH = 2
local MODE_WITHOUT = 3

type Term = {
	id: u53,
	mode: number,
	out: number,
	optional: boolean,
	target: (u53 | string)?,
	source: string?,
	up: u53?,
	self: boolean,
	transitive: boolean,
	or_next: Term?,
	chained: boolean,

	-- filled by compile
	rid: u53,
	src_var: number,
	tgt_var: number,
	rel_wc: u53,
}

export type QueryBuilder = {
	term: (self: QueryBuilder, id: any) -> QueryBuilder,
	with: (self: QueryBuilder, id: any) -> QueryBuilder,
	without: (self: QueryBuilder, id: any) -> QueryBuilder,

	optional: (self: QueryBuilder) -> QueryBuilder,
	bor: (self: QueryBuilder) -> QueryBuilder,
	wildcard: (self: QueryBuilder) -> QueryBuilder,
	target: (self: QueryBuilder, target: any) -> QueryBuilder,
	from: (self: QueryBuilder, source: string) -> QueryBuilder,
	up: (self: QueryBuilder, relation: any) -> QueryBuilder,
	self: (self: QueryBuilder) -> QueryBuilder,
	transitive: (self: QueryBuilder) -> QueryBuilder,

	build: (self: QueryBuilder) -> Query,
}

type BuilderInternal = {
	world: World,
	terms: { Term },
	pending: Term?,
	pending_or: Term?,
	n_out: number,
}

export type Query = typeof(setmetatable(
	{} :: {
		iter: (self: Query) -> () -> ...any,
		archetypes: (self: Query) -> { any },
		match: (self: Query, archetype: any) -> boolean,
		rematch: (self: Query) -> { any },
		cached: (self: Query) -> Query,
		cleanup: (self: Query) -> (),
		var: (self: Query, name: string) -> any,
		is_cached: boolean,
	},
	{} :: { __iter: (self: Query) -> () -> ...any }
))

type Prematcher = {
	with_ids: { u53 },
	without_ids: { u53 },
	match: (archetype: Archetype) -> boolean,
	find: (ignore_empty: boolean) -> { Archetype },
}

type QueryInternal = {
	world: World,
	is_static: boolean,
	n_out: number,
	prematcher: Prematcher,
	term_ids: { u53 },

	code: { number },
	n_ops: number,
	n_vars: number,
	var_names: { string },
	yield_fail_pc: number,
	cacheable_results: boolean,

	is_cached: boolean,
	compatible_archetypes: { Archetype }?,
	compatible_archetypes_map: Map<number, number>?,
	cache_cleanup: (() -> ())?,
	matched_generation: number,

	last_var_ent: { u53? }?,
}

-- opcodes, ordered by expected dispatch frequency
local OP_TERM = 1
local OP_SELECT_THIS = 2
local OP_YIELD = 3
local OP_TERM_OPT = 4
local OP_UP_TERM = 5
local OP_TARGET_VAR = 6
local OP_WITH = 7
local OP_WITHOUT = 8
local OP_UP_WITH = 9
local OP_UP_WITHOUT = 10
local OP_TARGET_BOUND = 11
local OP_TARGET_BOUND_NOT = 12
local OP_EACH_THIS = 13
local OP_FROM_SELECT = 14
local OP_FROM_SELECT_PAIR = 15
local OP_JMP = 16
local OP_NONE = 17

-- instruction layout: [op, fail_pc, fail_redo, A, B, C, D, E]
local STRIDE = 8
local MAX_UP_DEPTH = 64
local THIS_VAR = 1

local function NOOP() end

-------------------------------------------------------------------------------
-- builder
-------------------------------------------------------------------------------

local function builder_commit(builder: BuilderInternal)
	local pending = builder.pending
	if pending then
		if not pending.chained then
			table.insert(builder.terms, pending)
		end
		builder.pending = nil
	end
end

local function builder_new_term(builder: BuilderInternal, id: u53, mode: number): Term
	local previous_or = builder.pending_or
	builder_commit(builder)

	local term: Term = {
		id = id,
		mode = mode,
		out = 0,
		optional = false,
		target = nil,
		source = nil,
		up = nil,
		self = false,
		transitive = false,
		or_next = nil,
		chained = false,

		rid = id,
		src_var = THIS_VAR,
		tgt_var = 0,
		rel_wc = 0,
	}

	if previous_or then
		if mode == MODE_WITHOUT then
			error ":bor() cannot be followed by :without()"
		end
		previous_or.or_next = term
		term.chained = true
		term.out = previous_or.out
		builder.pending_or = nil
	elseif mode == MODE_TERM then
		builder.n_out += 1
		term.out = builder.n_out
	end

	builder.pending = term
	return term
end

local function builder_pending(builder: BuilderInternal, method: string): Term
	local pending = builder.pending
	if not pending then
		error(`cannot call :{method}() without a term`)
	end
	return pending
end

local function is_var(value: any): boolean
	return type(value) == "string"
end

local function validate_var(name: any, method: string)
	if type(name) ~= "string" or string.sub(name, 1, 1) ~= "$" then
		error(`:{method}() expects an entity or a "$variable" name`)
	end
end

local builder_mt = {}
builder_mt.__index = builder_mt

function builder_mt.term(builder: BuilderInternal, id: u53): BuilderInternal
	builder_new_term(builder, id, MODE_TERM)
	return builder
end

function builder_mt.with(builder: BuilderInternal, id: u53): BuilderInternal
	builder_new_term(builder, id, MODE_WITH)
	return builder
end

function builder_mt.without(builder: BuilderInternal, id: u53): BuilderInternal
	builder_new_term(builder, id, MODE_WITHOUT)
	return builder
end

function builder_mt.optional(builder: BuilderInternal): BuilderInternal
	local term = builder_pending(builder, "optional")
	if term.mode == MODE_WITHOUT then
		error ":optional() cannot be used on :without()"
	end
	term.optional = true
	return builder
end

function builder_mt.bor(builder: BuilderInternal): BuilderInternal
	local term = builder_pending(builder, "bor")
	if term.mode == MODE_WITHOUT then
		error ":bor() cannot be used after :without()"
	end
	builder.pending_or = term
	return builder
end

function builder_mt.wildcard(builder: BuilderInternal): BuilderInternal
	local term = builder_pending(builder, "wildcard")
	if builder.world.internal.IS_PAIR(term.id) then
		error ":wildcard() cannot be used on a pair id"
	end
	term.target = builder.world.internal.ECS_WILDCARD
	return builder
end

function builder_mt.target(builder: BuilderInternal, target: u53 | string): BuilderInternal
	local term = builder_pending(builder, "target")
	if builder.world.internal.IS_PAIR(term.id) then
		error ":target() cannot be used on a pair id"
	end
	if term.up then
		error ":target() cannot be combined with :up()"
	end
	if is_var(target) then
		validate_var(target, "target")
	end
	term.target = target
	return builder
end

function builder_mt.from(builder: BuilderInternal, source: string): BuilderInternal
	local term = builder_pending(builder, "from")
	validate_var(source, "from")
	if source == "$this" then
		term.source = nil
	else
		term.source = source
	end
	return builder
end

function builder_mt.up(builder: BuilderInternal, relation: u53): BuilderInternal
	local term = builder_pending(builder, "up")
	if builder.world.internal.IS_PAIR(relation) then
		error ":up() expects a relation, not a pair"
	end
	if is_var(term.target) then
		error ":up() cannot be combined with a variable :target()"
	end
	if term.transitive then
		error ":up() cannot be combined with :transitive()"
	end
	term.up = relation
	return builder
end

-- :transitive() — this is just term(pair(R, T)):up(R). No special logic for multiple pairs,
-- so this only works with exclusive relationships
function builder_mt.transitive(builder: BuilderInternal): BuilderInternal
	local term = builder_pending(builder, "transitive")
	if term.up then
		error ":transitive() cannot be combined with :up()"
	end
	term.transitive = true
	return builder
end

builder_mt["self"] = function(builder: BuilderInternal): BuilderInternal
	local term = builder_pending(builder, "self")
	if not term.up then
		error ":self() requires :up()"
	end
	term.self = true
	return builder
end

-- traverses up `rel_wc` from `archetype` until an archetype holding `id` is found.
-- Returns the holder row (0 when `include_self` hit the starting archetype)
-- and the column, or nil when nothing up the chain has `id`. Follows the first
-- target of the relation on every level and gives up after MAX_UP_DEPTH so
-- transient relation cycles cannot hang the query.
local function traverse_up(
	components_lookup: Map<u53, ComponentRecord>,
	sparse: Map<u24, EntityRecord>,
	PAIR_SECOND: (u53) -> u24,
	archetype: Archetype,
	rel_wc: u53,
	id: u53,
	include_self: boolean
): (number?, Column?)
	if include_self then
		local column = archetype.columns_map[id]
		if column then
			return 0, column
		end
	end

	local pair_record = components_lookup[rel_wc]
	if not pair_record then
		return nil, nil
	end
	local column_index = pair_record.column_index

	for _ = 1, MAX_UP_DEPTH do
		local index = column_index[archetype.archetype_id]
		if not index then
			return nil, nil
		end
		local record = sparse[PAIR_SECOND(archetype.components[index])]
		if not record then
			return nil, nil
		end
		local holder = record.archetype
		local column = holder.columns_map[id]
		if column then
			return record.archetype_row, column
		end
		archetype = holder
	end

	return nil, nil
end

-------------------------------------------------------------------------------
-- compiler
-------------------------------------------------------------------------------

type OpRecord = {
	op: number,
	a: number,
	b: number,
	c: number,
	d: number,
	e: number,
	iter: boolean,
	fail_pc: number?,
	fail_redo: number?,
	binds: { number }?,
}

type TermPlan = {
	priority: number,
	needs_each: boolean,
	ops: { OpRecord },
	binds: { number },
}

local function op_record(
	op: number,
	iter: boolean,
	a: number?,
	b: number?,
	c: number?,
	d: number?,
	e: number?
): OpRecord
	return {
		op = op,
		a = a or 0,
		b = b or 0,
		c = c or 0,
		d = d or 0,
		e = e or 0,
		iter = iter,
	}
end

local function term_is_required(term: Term): boolean
	return term.mode ~= MODE_WITHOUT and not term.optional and term.or_next == nil
end

local function compile(builder: BuilderInternal): QueryInternal
	local world = builder.world
	local internal = world.internal
	local ECS_PAIR = internal.ECS_PAIR
	local ECS_WILDCARD = internal.ECS_WILDCARD

	builder_commit(builder)
	if builder.pending_or then
		error ":bor() must be followed by a term"
	end

	local terms = builder.terms

	-- 1. variables ----------------------------------------------------------
	local var_names: { string } = { "$this" }
	local var_indices: Map<string, number> = { ["$this"] = THIS_VAR }

	local function var_index(name: string): number
		local existing = var_indices[name]
		if existing then
			return existing
		end
		local index = #var_names + 1
		var_names[index] = name
		var_indices[name] = index
		return index
	end

	-- 2. normalise ----------------------------------------------------------
	local IS_PAIR = internal.IS_PAIR
	local PAIR_FIRST = internal.PAIR_FIRST
	local PAIR_SECOND = internal.PAIR_SECOND
	local ECS_TRANSITIVE = internal.ECS_TRANSITIVE
	local get_entity_alive = internal.get_entity_alive

	local function normalise(term: Term)
		local target = term.target
		-- relation of a (R, T) term with a concrete target, used for transitivity
		local relation: u53? = nil

		if type(target) == "string" then
			term.tgt_var = var_index(target)
			term.rid = ECS_PAIR(term.id, ECS_WILDCARD)
			if term.transitive or world.has(term.id, ECS_TRANSITIVE) then
				error "transitive terms with a variable target are not supported yet"
			end
		elseif type(target) == "number" then
			term.rid = ECS_PAIR(term.id, target)
			if target ~= ECS_WILDCARD then
				relation = term.id
			end
		else
			term.rid = term.id
			if IS_PAIR(term.id) then
				local first, second = PAIR_FIRST(term.id), PAIR_SECOND(term.id)
				if first ~= ECS_WILDCARD and second ~= ECS_WILDCARD then
					relation = get_entity_alive(first)
				end
			end
		end

		-- transitive (R, T): (R, T) on self, or on anything reached through R
		if relation and not term.up then
			if term.transitive or world.has(relation, ECS_TRANSITIVE) then
				term.transitive = true
				term.up = relation
				term.self = true
			end
		elseif term.transitive then
			error ":transitive() needs a pair term with a target"
		end

		local source = term.source
		term.src_var = if source then var_index(source) else THIS_VAR

		local up = term.up
		if up then
			term.rel_wc = ECS_PAIR(up, ECS_WILDCARD)
		end
	end

	for _, head in terms do
		normalise(head)
		local alternative = head.or_next
		while alternative do
			normalise(alternative)
			if alternative.src_var ~= head.src_var then
				error "all alternatives of a :bor() chain must share the same source"
			end
			-- :optional() on any alternative makes the whole chain optional
			if alternative.optional then
				head.optional = true
			end
			alternative = alternative.or_next
		end
	end

	-- 3. prematcher ---------------------------------------------------------
	local with_ids: { u53 } = {}
	local without_ids: { u53 } = {}
	local with_set: Map<u53, boolean> = {}
	local without_set: Map<u53, boolean> = {}

	for _, term in terms do
		if term.src_var ~= THIS_VAR or term.or_next then
			continue
		end
		if term.mode == MODE_WITHOUT then
			if term.up == nil and term.tgt_var == 0 and not without_set[term.rid] then
				without_set[term.rid] = true
				table.insert(without_ids, term.rid)
			end
		elseif not term.optional then
			local id = if term.up then term.rel_wc else term.rid
			if not with_set[id] then
				with_set[id] = true
				table.insert(with_ids, id)
			end
		end
	end

	if #with_ids == 0 then
		error "query needs at least one required term on $this"
	end

	local MATCH_ARCHETYPE = internal.MATCH_ARCHETYPE
	local FIND_MATCHED_ARCHETYPES = internal.FIND_MATCHED_ARCHETYPES
	local prematcher_without: { u53 }? = if #without_ids > 0 then without_ids else nil

	local prematcher: Prematcher = {
		with_ids = with_ids,
		without_ids = without_ids,
		match = function(archetype: Archetype): boolean
			return MATCH_ARCHETYPE(with_ids, prematcher_without, archetype)
		end,
		find = function(ignore_empty: boolean): { Archetype }
			return FIND_MATCHED_ARCHETYPES(world, with_ids, prematcher_without, ignore_empty)
		end,
	}

	-- 4. classify -----------------------------------------------------------
	local is_static = true
	local term_ids: { u53 } = table.create(builder.n_out)

	for _, term in terms do
		if term.src_var ~= THIS_VAR or term.up or term.tgt_var ~= 0 or term.or_next then
			is_static = false
			break
		end
	end

	if is_static then
		for _, term in terms do
			if term.out ~= 0 then
				term_ids[term.out] = term.rid
			end
		end
	end

	local query: QueryInternal = {
		world = world,
		is_static = is_static,
		n_out = builder.n_out,
		prematcher = prematcher,
		term_ids = term_ids,

		code = {},
		n_ops = 0,
		n_vars = #var_names,
		var_names = var_names,
		yield_fail_pc = 0,
		cacheable_results = true,

		is_cached = false,
		compatible_archetypes = nil,
		compatible_archetypes_map = nil,
		cache_cleanup = nil,
		matched_generation = -1,

		last_var_ent = nil,
	}

	if is_static then
		return query
	end

	-- 5. plan ops -----------------------------------------------------------
	local bound: Map<number, boolean> = { [THIS_VAR] = true }
	local this_each = false

	local function m_of(var: number): number
		return if var == THIS_VAR then 1 else 0
	end

	-- Builds the single check op for a term whose source is bound and whose
	-- target (if any) is bound. Returns nil when the term is not a check.
	local function check_op(term: Term): (OpRecord?, boolean)
		local src = term.src_var
		local m = m_of(src)
		local needs_each = false

		if term.up then
			local op = if term.mode == MODE_WITHOUT
				then OP_UP_WITHOUT
				elseif term.mode == MODE_WITH then OP_UP_WITH
				else OP_UP_TERM
			local self_flag = if term.self then 1 else 0
			if op == OP_UP_TERM then
				return op_record(op, false, src, term.rel_wc, term.rid, term.out, self_flag), false
			end
			return op_record(op, false, src, term.rel_wc, term.rid, self_flag), false
		end

		local tgt = term.tgt_var
		if tgt ~= 0 then
			if not bound[tgt] then
				return nil, false
			end
			needs_each = tgt == THIS_VAR and not this_each
			local op = if term.mode == MODE_WITHOUT then OP_TARGET_BOUND_NOT else OP_TARGET_BOUND
			return op_record(op, false, src, term.id, tgt, term.out, m), needs_each
		end

		if term.mode == MODE_WITHOUT then
			return op_record(OP_WITHOUT, false, src, term.rid), false
		elseif term.mode == MODE_WITH then
			return op_record(OP_WITH, false, src, term.rid), false
		end
		return op_record(OP_TERM, false, src, term.rid, term.out, m), false
	end

	local function plan_term(term: Term): TermPlan?
		local src = term.src_var
		local priority = if src == THIS_VAR then 0 else 1

		-- or chain: every alternative must be a ready check op
		if term.or_next then
			if not bound[src] then
				return nil
			end
			local ops: { OpRecord } = {}
			local needs_each = false
			local alternative: Term? = term
			while alternative do
				local op, each = check_op(alternative)
				if not op then
					return nil
				end
				needs_each = needs_each or each
				table.insert(ops, op)
				alternative = alternative.or_next
			end
			if term.optional then
				table.insert(ops, op_record(OP_NONE, false, term.out))
			end
			return { priority = priority, needs_each = needs_each, ops = ops, binds = {} }
		end

		-- unbound source: this term must bind it by scanning
		if not bound[src] then
			if not term_is_required(term) or term.up then
				return nil
			end
			local tgt = term.tgt_var
			if tgt == 0 then
				return {
					priority = 3,
					needs_each = false,
					ops = { op_record(OP_FROM_SELECT, true, src, term.rid, term.out) },
					binds = { src },
				}
			elseif bound[tgt] then
				return {
					priority = 3,
					needs_each = tgt == THIS_VAR and not this_each,
					ops = { op_record(OP_FROM_SELECT_PAIR, true, src, term.id, tgt, term.out) },
					binds = { src },
				}
			end
			-- both source and target unbound: scan (rel, *) then enumerate targets
			return {
				priority = 3,
				needs_each = false,
				ops = {
					op_record(OP_FROM_SELECT, true, src, term.rid, 0),
					op_record(OP_TARGET_VAR, true, src, term.rid, tgt, term.out, 0),
				},
				binds = { src, tgt },
			}
		end

		-- bound source, unbound target: bind it by enumerating pairs
		local tgt = term.tgt_var
		if tgt ~= 0 and not bound[tgt] then
			if not term_is_required(term) then
				return nil
			end
			return {
				priority = 2,
				needs_each = false,
				ops = { op_record(OP_TARGET_VAR, true, src, term.rid, tgt, term.out, m_of(src)) },
				binds = { tgt },
			}
		end

		local op, needs_each = check_op(term)
		if not op then
			return nil
		end
		local ops = { op }
		if term.optional then
			if op.op == OP_TERM then
				op.op = OP_TERM_OPT
			else
				table.insert(ops, op_record(OP_NONE, false, term.out))
			end
		end
		return { priority = priority, needs_each = needs_each, ops = ops, binds = {} }
	end

	local ops: { OpRecord } = {}

	local function emit(record: OpRecord): number
		table.insert(ops, record)
		return #ops
	end

	local function emit_plan(plan: TermPlan)
		local plan_ops = plan.ops
		local count = #plan_ops
		local is_chain = count > 1 and not plan_ops[1].iter

		if not is_chain then
			for _, record in plan_ops do
				emit(record)
			end
		else
			-- alternatives: fail falls through to the next alternative without
			-- redo, success jumps past the chain
			local jumps: { OpRecord } = {}
			for index, record in plan_ops do
				local pc = emit(record)
				if index < count then
					record.fail_pc = pc + 2
					record.fail_redo = 0
					local jump = op_record(OP_JMP, false, 0)
					emit(jump)
					table.insert(jumps, jump)
				end
			end
			local after = #ops + 1
			for _, jump in jumps do
				jump.a = after
			end
		end

		for _, var in plan.binds do
			bound[var] = true
		end
	end

	emit(op_record(OP_SELECT_THIS, true))

	local placed: Map<Term, boolean> = {}
	local remaining = #terms

	while remaining > 0 do
		local best: TermPlan? = nil
		local best_term: Term? = nil
		local blocked_on_each = false

		for _, term in terms do
			if placed[term] then
				continue
			end
			local plan = plan_term(term)
			if not plan then
				continue
			end
			if plan.needs_each then
				blocked_on_each = true
				continue
			end
			if not best or plan.priority < best.priority then
				best = plan
				best_term = term
			end
		end

		if best and best_term then
			emit_plan(best)
			placed[best_term] = true
			remaining -= 1
		elseif blocked_on_each then
			emit(op_record(OP_EACH_THIS, true))
			this_each = true
		else
			for _, term in terms do
				if placed[term] then
					continue
				end
				local unbound_var = if not bound[term.src_var]
					then term.src_var
					elseif term.tgt_var ~= 0 and not bound[term.tgt_var] then term.tgt_var
					else 0
				if unbound_var ~= 0 then
					error(`variable {var_names[unbound_var]} is never bound`)
				end
			end
			error "query could not be planned"
		end
	end

	local yield = op_record(OP_YIELD, false)
	emit(yield)

	-- 6. encode -------------------------------------------------------------
	local code: { number } = table.create(#ops * STRIDE, 0)
	local last_iter = 0
	local cacheable_results = true

	for pc, record in ops do
		local fail_pc = record.fail_pc
		local fail_redo = record.fail_redo
		if fail_pc == nil then
			fail_pc = last_iter
			fail_redo = 1
		end
		if record.op == OP_SELECT_THIS then
			fail_pc = 0
			fail_redo = 0
		end

		local off = (pc - 1) * STRIDE
		code[off + 1] = record.op
		code[off + 2] = fail_pc :: number
		code[off + 3] = fail_redo :: number
		code[off + 4] = record.a
		code[off + 5] = record.b
		code[off + 6] = record.c
		code[off + 7] = record.d
		code[off + 8] = record.e

		if record.iter then
			last_iter = pc
			if record.op ~= OP_SELECT_THIS and record.op ~= OP_TARGET_VAR then
				cacheable_results = false
			end
		end
	end

	query.code = table.freeze(code)
	query.n_ops = #ops
	query.yield_fail_pc = last_iter
	query.cacheable_results = cacheable_results

	return query
end

-------------------------------------------------------------------------------
-- iteration: static class
-------------------------------------------------------------------------------

local function iter_static(query: QueryInternal, list: { Archetype }): () -> ...any
	local EMPTY = query.world.internal.NULL_ARRAY
	local n_out = query.n_out
	local A, B, C, D, E, F, G, H = unpack(query.term_ids)

	local index = 0
	local entities: { u53 } = EMPTY
	local row = 0
	local a: Column, b: Column, c: Column, d: Column
	local e: Column, f: Column, g: Column, h: Column

	if n_out == 0 then
		return function(): ...any
			local entity = entities[row]
			while entity == nil do
				index += 1
				local archetype = list[index]
				if not archetype then
					return nil
				end
				if not archetype.alive then
					continue
				end
				entities = archetype.entities
				row = #entities
				entity = entities[row]
			end
			row -= 1
			return entity
		end
	elseif n_out == 1 then
		return function(): ...any
			local entity = entities[row]
			while entity == nil do
				index += 1
				local archetype = list[index]
				if not archetype then
					return nil
				end
				if not archetype.alive then
					continue
				end
				entities = archetype.entities
				row = #entities
				local columns_map = archetype.columns_map
				a = columns_map[A] or EMPTY
				entity = entities[row]
			end
			local r = row
			row -= 1
			return entity, a[r]
		end
	elseif n_out == 2 then
		return function(): ...any
			local entity = entities[row]
			while entity == nil do
				index += 1
				local archetype = list[index]
				if not archetype then
					return nil
				end
				if not archetype.alive then
					continue
				end
				entities = archetype.entities
				row = #entities
				local columns_map = archetype.columns_map
				a = columns_map[A] or EMPTY
				b = columns_map[B] or EMPTY
				entity = entities[row]
			end
			local r = row
			row -= 1
			return entity, a[r], b[r]
		end
	elseif n_out == 3 then
		return function(): ...any
			local entity = entities[row]
			while entity == nil do
				index += 1
				local archetype = list[index]
				if not archetype then
					return nil
				end
				if not archetype.alive then
					continue
				end
				entities = archetype.entities
				row = #entities
				local columns_map = archetype.columns_map
				a = columns_map[A] or EMPTY
				b = columns_map[B] or EMPTY
				c = columns_map[C] or EMPTY
				entity = entities[row]
			end
			local r = row
			row -= 1
			return entity, a[r], b[r], c[r]
		end
	elseif n_out == 4 then
		return function(): ...any
			local entity = entities[row]
			while entity == nil do
				index += 1
				local archetype = list[index]
				if not archetype then
					return nil
				end
				if not archetype.alive then
					continue
				end
				entities = archetype.entities
				row = #entities
				local columns_map = archetype.columns_map
				a = columns_map[A] or EMPTY
				b = columns_map[B] or EMPTY
				c = columns_map[C] or EMPTY
				d = columns_map[D] or EMPTY
				entity = entities[row]
			end
			local r = row
			row -= 1
			return entity, a[r], b[r], c[r], d[r]
		end
	elseif n_out == 5 then
		return function(): ...any
			local entity = entities[row]
			while entity == nil do
				index += 1
				local archetype = list[index]
				if not archetype then
					return nil
				end
				if not archetype.alive then
					continue
				end
				entities = archetype.entities
				row = #entities
				local columns_map = archetype.columns_map
				a = columns_map[A] or EMPTY
				b = columns_map[B] or EMPTY
				c = columns_map[C] or EMPTY
				d = columns_map[D] or EMPTY
				e = columns_map[E] or EMPTY
				entity = entities[row]
			end
			local r = row
			row -= 1
			return entity, a[r], b[r], c[r], d[r], e[r]
		end
	elseif n_out == 6 then
		return function(): ...any
			local entity = entities[row]
			while entity == nil do
				index += 1
				local archetype = list[index]
				if not archetype then
					return nil
				end
				if not archetype.alive then
					continue
				end
				entities = archetype.entities
				row = #entities
				local columns_map = archetype.columns_map
				a = columns_map[A] or EMPTY
				b = columns_map[B] or EMPTY
				c = columns_map[C] or EMPTY
				d = columns_map[D] or EMPTY
				e = columns_map[E] or EMPTY
				f = columns_map[F] or EMPTY
				entity = entities[row]
			end
			local r = row
			row -= 1
			return entity, a[r], b[r], c[r], d[r], e[r], f[r]
		end
	elseif n_out == 7 then
		return function(): ...any
			local entity = entities[row]
			while entity == nil do
				index += 1
				local archetype = list[index]
				if not archetype then
					return nil
				end
				if not archetype.alive then
					continue
				end
				entities = archetype.entities
				row = #entities
				local columns_map = archetype.columns_map
				a = columns_map[A] or EMPTY
				b = columns_map[B] or EMPTY
				c = columns_map[C] or EMPTY
				d = columns_map[D] or EMPTY
				e = columns_map[E] or EMPTY
				f = columns_map[F] or EMPTY
				g = columns_map[G] or EMPTY
				entity = entities[row]
			end
			local r = row
			row -= 1
			return entity, a[r], b[r], c[r], d[r], e[r], f[r], g[r]
		end
	elseif n_out == 8 then
		return function(): ...any
			local entity = entities[row]
			while entity == nil do
				index += 1
				local archetype = list[index]
				if not archetype then
					return nil
				end
				if not archetype.alive then
					continue
				end
				entities = archetype.entities
				row = #entities
				local columns_map = archetype.columns_map
				a = columns_map[A] or EMPTY
				b = columns_map[B] or EMPTY
				c = columns_map[C] or EMPTY
				d = columns_map[D] or EMPTY
				e = columns_map[E] or EMPTY
				f = columns_map[F] or EMPTY
				g = columns_map[G] or EMPTY
				h = columns_map[H] or EMPTY
				entity = entities[row]
			end
			local r = row
			row -= 1
			return entity, a[r], b[r], c[r], d[r], e[r], f[r], g[r], h[r]
		end
	end

	local term_ids = query.term_ids
	local rest_count = n_out - 8
	local rest_columns: { Column } = table.create(rest_count)
	local rest: { any } = table.create(rest_count)

	return function(): ...any
		local entity = entities[row]
		while entity == nil do
			index += 1
			local archetype = list[index]
			if not archetype then
				return nil
			end
			if not archetype.alive then
				continue
			end
			entities = archetype.entities
			row = #entities
			local columns_map = archetype.columns_map
			a = columns_map[A] or EMPTY
			b = columns_map[B] or EMPTY
			c = columns_map[C] or EMPTY
			d = columns_map[D] or EMPTY
			e = columns_map[E] or EMPTY
			f = columns_map[F] or EMPTY
			g = columns_map[G] or EMPTY
			h = columns_map[H] or EMPTY
			for i = 1, rest_count do
				rest_columns[i] = columns_map[term_ids[i + 8]] or EMPTY
			end
			entity = entities[row]
		end
		local r = row
		row -= 1
		for i = 1, rest_count do
			rest[i] = rest_columns[i][r]
		end
		return entity, a[r], b[r], c[r], d[r], e[r], f[r], g[r], h[r], unpack(rest, 1, rest_count)
	end
end

local function iter_program(query: QueryInternal, list: { Archetype }): () -> ...any
	local world = query.world
	local internal = world.internal
	local components_lookup = world.components_lookup
	local archetypes = world.archetypes
	local entity_index = internal.entity_index
	local sparse = entity_index.sparse
	local dense = entity_index.dense
	local ECS_PAIR = internal.ECS_PAIR
	local PAIR_SECOND = internal.PAIR_SECOND
	local EMPTY = internal.NULL_ARRAY

	local code = query.code
	local n_out = query.n_out
	local n_vars = query.n_vars
	local yield_fail_pc = query.yield_fail_pc

	local ctx: { number } = table.create(query.n_ops * 2, 0)
	local var_ent: { u53? } = table.create(n_vars)
	local var_arch: { Archetype } = table.create(n_vars)
	local var_row: { number } = table.create(n_vars, 0)
	local rc: { Column } = table.create(n_out, EMPTY)
	local rm: { number } = table.create(n_out, 0)
	local rb: { number } = table.create(n_out, 1)

	local res_entities: { u53 } = EMPTY
	local res_lo = 1
	local res_hi = 0

	query.last_var_ent = var_ent

	-- Runs the program until the next OP_YIELD. `redo` resumes the last
	-- iterating op instead of starting from the beginning.
	local function run(redo: boolean): boolean
		local pc = if redo then yield_fail_pc else 1

		while true do
			local off = (pc - 1) * STRIDE
			local op = code[off + 1]
			local ok: boolean

			if op == OP_TERM then
				local src = code[off + 4]
				local column = var_arch[src].columns_map[code[off + 5]]
				if column then
					local out, m = code[off + 6], code[off + 7]
					rc[out], rm[out], rb[out] = column, m, (1 - m) * var_row[src]
					ok = true
				else
					ok = false
				end
			elseif op == OP_SELECT_THIS then
				local index = if redo then ctx[pc * 2 - 1] + 1 else 1
				local archetype = list[index]
				while archetype and not archetype.alive do
					index += 1
					archetype = list[index]
				end
				if not archetype then
					return false
				end

				ctx[pc * 2 - 1] = index
				var_arch[THIS_VAR], var_row[THIS_VAR], var_ent[THIS_VAR] = archetype, 0, nil
				res_entities = archetype.entities
				res_lo, res_hi = 1, #res_entities
				ok = true
			elseif op == OP_YIELD then
				return true
			elseif op == OP_TERM_OPT then
				local src = code[off + 4]
				local term = code[off + 5]
				local output = code[off + 6]

				local column = var_arch[src].columns_map[term]
				if column then
					local m = code[off + 7]
					rc[output], rm[output], rb[output] = column, m, (1 - m) * var_row[src]
				else
					rc[output], rm[output], rb[output] = EMPTY, 0, 1
				end
				ok = true
			elseif op == OP_UP_TERM then
				local src = code[off + 4]
				local row, column = traverse_up(
					components_lookup,
					sparse,
					PAIR_SECOND,
					var_arch[src],
					code[off + 5],
					code[off + 6],
					code[off + 8] == 1
				)
				if column then
					local out = code[off + 7]
					if row == 0 then
						local m = if src == THIS_VAR then 1 else 0
						rc[out], rm[out], rb[out] = column, m, (1 - m) * var_row[src]
					else
						rc[out], rm[out], rb[out] = column, 0, row :: number
					end
					ok = true
				else
					ok = false
				end
			elseif op == OP_TARGET_VAR then
				local src = code[off + 4]
				local archetype = var_arch[src]
				local archetype_id = archetype.archetype_id
				local k: number
				local count: number
				local start = 0

				local pair_record = (components_lookup[code[off + 5]] :: any) :: PairRecord?
				if redo then
					k = ctx[pc * 2 - 1] + 1
					count = ctx[pc * 2]
				else
					k = 0
					count = if pair_record then pair_record.pairs_count[archetype_id] or 0 else 0
					ctx[pc * 2] = count
				end
				if count > 0 and pair_record then
					start = pair_record.column_index[archetype_id]
				end

				ok = false
				local components, columns = archetype.components, archetype.columns
				while k < count do
					local record = sparse[PAIR_SECOND(components[start + k])]
					if record then
						local var = code[off + 6]
						var_arch[var], var_row[var], var_ent[var] =
							record.archetype, record.archetype_row, dense[record.dense]
						local out = code[off + 7]
						if out ~= 0 then
							local m = code[off + 8]
							rc[out], rm[out], rb[out] = columns[start + k], m, (1 - m) * var_row[src]
						end
						ctx[pc * 2 - 1] = k
						ok = true
						break
					end
					k += 1
				end
			elseif op == OP_WITH then
				ok = var_arch[code[off + 4]].columns_map[code[off + 5]] ~= nil
			elseif op == OP_WITHOUT then
				ok = var_arch[code[off + 4]].columns_map[code[off + 5]] == nil
			elseif op == OP_UP_WITH or op == OP_UP_WITHOUT then
				local _, column = traverse_up(
					components_lookup,
					sparse,
					PAIR_SECOND,
					var_arch[code[off + 4]],
					code[off + 5],
					code[off + 6],
					code[off + 7] == 1
				)
				ok = if op == OP_UP_WITH then column ~= nil else column == nil
			elseif op == OP_TARGET_BOUND or op == OP_TARGET_BOUND_NOT then
				local src = code[off + 4]
				local target = var_ent[code[off + 6]]
				local column = if target then var_arch[src].columns_map[ECS_PAIR(code[off + 5], target)] else nil
				if op == OP_TARGET_BOUND_NOT then
					ok = column == nil
				elseif column then
					local out = code[off + 7]
					if out ~= 0 then
						local m = code[off + 8]
						rc[out], rm[out], rb[out] = column, m, (1 - m) * var_row[src]
					end
					ok = true
				else
					ok = false
				end
			elseif op == OP_EACH_THIS then
				local entities = var_arch[THIS_VAR].entities
				local count = #entities
				local row = if redo then ctx[pc * 2 - 1] - 1 else count
				if row > count then
					row = count
				end
				if row < 1 then
					ok = false
				else
					ctx[pc * 2 - 1] = row
					var_ent[THIS_VAR], var_row[THIS_VAR] = entities[row], row
					res_lo, res_hi = row, row
					ok = true
				end
			elseif op == OP_FROM_SELECT or op == OP_FROM_SELECT_PAIR then
				local var = code[off + 4]
				local id: u53
				local index: number
				local row: number
				local record: ComponentRecord?

				if op == OP_FROM_SELECT then
					id = code[off + 5]
				else
					local target = var_ent[code[off + 6]]
					id = if target then ECS_PAIR(code[off + 5], target) else 0
				end
				record = components_lookup[id]

				if redo then
					index = ctx[pc * 2 - 1]
					row = ctx[pc * 2] - 1
				else
					index = if record then #record.archetype_ids + 1 else 0
					row = 0
				end

				ok = false
				if record then
					local archetype_ids = record.archetype_ids
					local column_index = record.column_index
					while true do
						local archetype: Archetype? = if index >= 1 then archetypes[archetype_ids[index]] else nil
						if archetype then
							local entities = archetype.entities
							local count = #entities
							if row > count then
								row = count
							end
							if row >= 1 then
								var_arch[var], var_row[var], var_ent[var] = archetype, row, entities[row]
								local out = if op == OP_FROM_SELECT then code[off + 6] else code[off + 7]
								if out ~= 0 then
									rc[out], rm[out], rb[out] =
										archetype.columns[column_index[archetype.archetype_id]], 0, row
								end
								ctx[pc * 2 - 1], ctx[pc * 2] = index, row
								ok = true
								break
							end
						end
						index -= 1
						if index < 1 then
							break
						end
						local next_archetype = archetypes[archetype_ids[index]]
						row = if next_archetype then #next_archetype.entities else 0
					end
				end
			elseif op == OP_JMP then
				pc = code[off + 4]
				redo = false
				continue
			elseif op == OP_NONE then
				local out = code[off + 4]
				if out ~= 0 then
					rc[out], rm[out], rb[out] = EMPTY, 0, 1
				end
				ok = true
			else
				error(`query engine: unknown opcode {op}`)
			end

			if ok then
				pc += 1
				redo = false
			else
				pc = code[off + 2]
				if pc == 0 then
					return false
				end
				redo = code[off + 3] == 1
			end
		end
	end

	local cur_row = 0
	local row_lo = 1
	local redo = false
	local entities: { u53 } = EMPTY

	local a: Column, b: Column, c: Column, d: Column
	local e: Column, f: Column, g: Column, h: Column
	local ma, mb, mc, md, me, mf, mg, mh = 0, 0, 0, 0, 0, 0, 0, 0
	local ba, bb, bc, bd, be, bf, bg, bh = 1, 1, 1, 1, 1, 1, 1, 1

	if n_out == 0 then
		return function(): ...any
			local row = cur_row
			if row < row_lo then
				if not run(redo) then
					return nil
				end
				redo = true
				entities, row_lo, row = res_entities, res_lo, res_hi
			end
			cur_row = row - 1
			return entities[row]
		end
	elseif n_out == 1 then
		return function(): ...any
			local row = cur_row
			if row < row_lo then
				if not run(redo) then
					return nil
				end
				redo = true
				entities, row_lo, row = res_entities, res_lo, res_hi
				a, ma, ba = rc[1], rm[1], rb[1]
			end
			cur_row = row - 1
			return entities[row], a[row * ma + ba]
		end
	elseif n_out == 2 then
		return function(): ...any
			local row = cur_row
			if row < row_lo then
				if not run(redo) then
					return nil
				end
				redo = true
				entities, row_lo, row = res_entities, res_lo, res_hi
				a, ma, ba = rc[1], rm[1], rb[1]
				b, mb, bb = rc[2], rm[2], rb[2]
			end
			cur_row = row - 1
			return entities[row], a[row * ma + ba], b[row * mb + bb]
		end
	elseif n_out == 3 then
		return function(): ...any
			local row = cur_row
			if row < row_lo then
				if not run(redo) then
					return nil
				end
				redo = true
				entities, row_lo, row = res_entities, res_lo, res_hi
				a, ma, ba = rc[1], rm[1], rb[1]
				b, mb, bb = rc[2], rm[2], rb[2]
				c, mc, bc = rc[3], rm[3], rb[3]
			end
			cur_row = row - 1
			return entities[row], a[row * ma + ba], b[row * mb + bb], c[row * mc + bc]
		end
	elseif n_out == 4 then
		return function(): ...any
			local row = cur_row
			if row < row_lo then
				if not run(redo) then
					return nil
				end
				redo = true
				entities, row_lo, row = res_entities, res_lo, res_hi
				a, ma, ba = rc[1], rm[1], rb[1]
				b, mb, bb = rc[2], rm[2], rb[2]
				c, mc, bc = rc[3], rm[3], rb[3]
				d, md, bd = rc[4], rm[4], rb[4]
			end
			cur_row = row - 1
			return entities[row], a[row * ma + ba], b[row * mb + bb], c[row * mc + bc], d[row * md + bd]
		end
	elseif n_out == 5 then
		return function(): ...any
			local row = cur_row
			if row < row_lo then
				if not run(redo) then
					return nil
				end
				redo = true
				entities, row_lo, row = res_entities, res_lo, res_hi
				a, ma, ba = rc[1], rm[1], rb[1]
				b, mb, bb = rc[2], rm[2], rb[2]
				c, mc, bc = rc[3], rm[3], rb[3]
				d, md, bd = rc[4], rm[4], rb[4]
				e, me, be = rc[5], rm[5], rb[5]
			end
			cur_row = row - 1
			return entities[row],
				a[row * ma + ba],
				b[row * mb + bb],
				c[row * mc + bc],
				d[row * md + bd],
				e[row * me + be]
		end
	elseif n_out == 6 then
		return function(): ...any
			local row = cur_row
			if row < row_lo then
				if not run(redo) then
					return nil
				end
				redo = true
				entities, row_lo, row = res_entities, res_lo, res_hi
				a, ma, ba = rc[1], rm[1], rb[1]
				b, mb, bb = rc[2], rm[2], rb[2]
				c, mc, bc = rc[3], rm[3], rb[3]
				d, md, bd = rc[4], rm[4], rb[4]
				e, me, be = rc[5], rm[5], rb[5]
				f, mf, bf = rc[6], rm[6], rb[6]
			end
			cur_row = row - 1
			return entities[row],
				a[row * ma + ba],
				b[row * mb + bb],
				c[row * mc + bc],
				d[row * md + bd],
				e[row * me + be],
				f[row * mf + bf]
		end
	elseif n_out == 7 then
		return function(): ...any
			local row = cur_row
			if row < row_lo then
				if not run(redo) then
					return nil
				end
				redo = true
				entities, row_lo, row = res_entities, res_lo, res_hi
				a, ma, ba = rc[1], rm[1], rb[1]
				b, mb, bb = rc[2], rm[2], rb[2]
				c, mc, bc = rc[3], rm[3], rb[3]
				d, md, bd = rc[4], rm[4], rb[4]
				e, me, be = rc[5], rm[5], rb[5]
				f, mf, bf = rc[6], rm[6], rb[6]
				g, mg, bg = rc[7], rm[7], rb[7]
			end
			cur_row = row - 1
			return entities[row],
				a[row * ma + ba],
				b[row * mb + bb],
				c[row * mc + bc],
				d[row * md + bd],
				e[row * me + be],
				f[row * mf + bf],
				g[row * mg + bg]
		end
	elseif n_out == 8 then
		return function(): ...any
			local row = cur_row
			if row < row_lo then
				if not run(redo) then
					return nil
				end
				redo = true
				entities, row_lo, row = res_entities, res_lo, res_hi
				a, ma, ba = rc[1], rm[1], rb[1]
				b, mb, bb = rc[2], rm[2], rb[2]
				c, mc, bc = rc[3], rm[3], rb[3]
				d, md, bd = rc[4], rm[4], rb[4]
				e, me, be = rc[5], rm[5], rb[5]
				f, mf, bf = rc[6], rm[6], rb[6]
				g, mg, bg = rc[7], rm[7], rb[7]
				h, mh, bh = rc[8], rm[8], rb[8]
			end
			cur_row = row - 1
			return entities[row],
				a[row * ma + ba],
				b[row * mb + bb],
				c[row * mc + bc],
				d[row * md + bd],
				e[row * me + be],
				f[row * mf + bf],
				g[row * mg + bg],
				h[row * mh + bh]
		end
	end

	local rest_count = n_out - 8
	local rest: { any } = table.create(rest_count)

	return function(): ...any
		local row = cur_row
		if row < row_lo then
			if not run(redo) then
				return nil
			end
			redo = true
			entities, row_lo, row = res_entities, res_lo, res_hi
			a, ma, ba = rc[1], rm[1], rb[1]
			b, mb, bb = rc[2], rm[2], rb[2]
			c, mc, bc = rc[3], rm[3], rb[3]
			d, md, bd = rc[4], rm[4], rb[4]
			e, me, be = rc[5], rm[5], rb[5]
			f, mf, bf = rc[6], rm[6], rb[6]
			g, mg, bg = rc[7], rm[7], rb[7]
			h, mh, bh = rc[8], rm[8], rb[8]
		end
		cur_row = row - 1
		for i = 1, rest_count do
			local slot = i + 8
			rest[i] = rc[slot][row * rm[slot] + rb[slot]]
		end
		return entities[row],
			a[row * ma + ba],
			b[row * mb + bb],
			c[row * mc + bc],
			d[row * md + bd],
			e[row * me + be],
			f[row * mf + bf],
			g[row * mg + bg],
			h[row * mh + bh],
			unpack(rest, 1, rest_count)
	end
end

local query_mt = {}
query_mt.__index = query_mt

local function query_rematch(query: QueryInternal): { Archetype }
	if query.is_cached then
		return query.compatible_archetypes :: { Archetype }
	end
	-- empty archetypes are kept: entities may move into them before the next
	-- archetype creation, which is the only event that refreshes this list
	local list = query.prematcher.find(false)
	query.compatible_archetypes = list
	query.matched_generation = query.world.internal.get_archetypes_count()
	return list
end

-- Non cached queries keep their prematched list while no archetype has been
-- created since the last match; destroyed archetypes are skipped while
-- iterating, so only creations can change the result.
local function query_archetypes(query: QueryInternal): { Archetype }
	local list = query.compatible_archetypes
	if list and (query.is_cached or query.matched_generation == query.world.internal.get_archetypes_count()) then
		return list
	end
	return query_rematch(query)
end

local function query_match(query: QueryInternal, archetype: Archetype): boolean
	local map = query.compatible_archetypes_map
	if map then
		return map[archetype.archetype_id] ~= nil
	end
	return query.prematcher.match(archetype)
end

local function query_iter(query: QueryInternal): () -> ...any
	local list = query_archetypes(query)
	if #list == 0 then
		return NOOP
	end
	if query.is_static then
		return iter_static(query, list)
	end
	return iter_program(query, list)
end

local function query_cached(query: QueryInternal): QueryInternal
	if query.is_cached then
		return query
	end
	local prematcher = query.prematcher
	local list, map, cleanup = query.world.internal.OBSERVE_MATCHED_ARCHETYPES(
		query.world,
		prematcher.with_ids,
		if #prematcher.without_ids > 0 then prematcher.without_ids else nil
	)
	query.is_cached = true
	query.compatible_archetypes = list
	query.compatible_archetypes_map = map
	query.cache_cleanup = cleanup
	return query
end

local function query_cleanup(query: QueryInternal)
	local cleanup = query.cache_cleanup
	if cleanup then
		cleanup()
	end
	query.is_cached = false
	query.cache_cleanup = nil
	query.compatible_archetypes = nil
	query.compatible_archetypes_map = nil
end

local function query_var(query: QueryInternal, name: string): u53?
	local var_ent = query.last_var_ent
	if not var_ent then
		return nil
	end
	local index = table.find(query.var_names, name)
	if not index then
		error(`unknown query variable {name}`)
	end
	return var_ent[index]
end

query_mt.iter = query_iter
query_mt.__iter = query_iter
query_mt.archetypes = query_archetypes
query_mt.match = query_match
query_mt.rematch = query_rematch
query_mt.cached = query_cached
query_mt.cleanup = query_cleanup
query_mt.var = query_var

function builder_mt.build(builder: BuilderInternal): Query
	local query = compile(builder)
	return setmetatable(query, query_mt) :: any
end

local function build(world: any): QueryBuilder
	local builder: BuilderInternal = {
		world = world,
		terms = {},
		pending = nil,
		pending_or = nil,
		n_out = 0,
	}
	return setmetatable(builder, builder_mt) :: any
end

return {
	build = build,
}
