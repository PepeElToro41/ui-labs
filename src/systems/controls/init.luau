local ui_labs = require "@pkg/ui-labs"
local c = require "@src/components"
local ecs = require "@vendor/ecs"
local RECOVERERS = require "@self/recoverers"
local types = require "@self/types"

--[[
	Story controls as entities.

	A mounted story's `controls` table is converted (literals through the ui-labs library) and
	turned into one entity per control, `ChildOf` the preview. A `ControlGroup` becomes a
	`control_group` entity with its controls `ChildOf` it (one level deep). `control` keeps the
	converted object untouched, `control_value` is the live value: the ui writes it and the
	mounters observe it through `observe`.

	Controls are recreated on every mount. Between mounts the values survive in the preview's
	`control_recovery` (see `snapshot` / `recover`), when the preview carries `keep_controls`.

	These are plain helpers over the world, there is no system tick. Callers must respect the
	hook rules: `create` / `destroy` / `reset` write to the world, never call them inside a
	removed hook of the preview itself.
]]

local controls = {}

export type Control = types.Control
export type ControlGroup = types.ControlGroup
export type ConvertedControls = types.ConvertedControls
export type RecoverData = types.RecoverData
export type RecoverControl = types.RecoverControl
export type StateTree<S> = types.StateTree<S>
export type ByEntity<S> = types.ByEntity<S>
export type Values = types.Values

local CHILD_OF_WILDCARD = ecs.pair(ecs.ChildOf, ecs.Wildcard)

------------------------------------------------------------------ conversion

local function validate_control(value: any): (Control?, string?)
	if value.EntryType ~= "Control" then
		return nil, `unexpected EntryType "{tostring(value.EntryType)}"`
	end
	if not RECOVERERS[value.Type] then
		return nil, `unknown control type "{tostring(value.Type)}"`
	end
	return value :: Control, nil
end

--- Converts one entry: literals through the library, tables validated in place
local function convert_entry(value: unknown, allow_group: boolean): (types.ConvertedEntry?, string?)
	if type(value) ~= "table" then
		local success, converted = pcall(ui_labs.ConvertControl, value)
		if not success then
			return nil, tostring(converted)
		end
		return converted :: Control, nil
	end

	local entry = value :: any
	if entry.EntryType == "ControlGroup" then
		if not allow_group then
			return nil, "control groups cannot be nested"
		end
		if type(entry.Controls) ~= "table" then
			return nil, "control group has no Controls table"
		end
		return entry :: ControlGroup, nil
	end

	return validate_control(entry)
end

--- Converts a story's `controls` table, warning about and skipping any invalid entry
function controls.convert(returned: Map<string, unknown>, prefix: string): ConvertedControls
	local converted: ConvertedControls = {}

	for name, value in returned do
		if type(name) ~= "string" then
			warn(`{prefix} control keys must be strings, got {typeof(name)}`)
			continue
		end

		local entry, err = convert_entry(value, true)
		if not entry then
			warn(`{prefix} control "{name}" is not valid: {err}`)
			continue
		end

		if entry.EntryType == "ControlGroup" then
			local group_controls: Map<string, Control> = {}
			for child_name, child_value in (entry :: ControlGroup).Controls do
				local child, child_err = convert_entry(child_value, false)
				if not child then
					warn(`{prefix} control "{name}.{tostring(child_name)}" is not valid: {child_err}`)
					continue
				end
				group_controls[child_name] = child :: Control
			end
			converted[name] = {
				EntryType = "ControlGroup",
				Controls = group_controls,
				Order = (entry :: ControlGroup).Order,
			}
		else
			converted[name] = entry
		end
	end

	return converted
end


--- The value a new control starts with: the recovered one when the old control agrees, else its default
function controls.recover(control: Control, entry: types.RecoverEntry?): unknown
	if not entry or entry.kind ~= "control" then
		return control.ControlValue
	end
	local recovered = entry :: RecoverControl
	if recovered.control.Type ~= control.Type then
		return control.ControlValue
	end

	local recoverer = RECOVERERS[control.Type]
	local ok, value = recoverer(control, recovered.control, recovered.value)
	if not ok then
		return control.ControlValue
	end
	return value
end

local function create_control(world: ecs.World, parent: ecs.Entity, name: string, control: Control, entry: types.RecoverEntry?)
	local entity = world.entity()
	world.set(entity, c.control, control)
	world.set(entity, c.control_name, name)
	if type(control.Order) == "number" then
		world.set(entity, c.control_order, control.Order)
	end
	world.add(entity, ecs.pair(ecs.ChildOf, parent))
	world.set(entity, c.control_value, controls.recover(control, entry))
	return entity
end

--- Creates the control entities of `preview` from a converted table
function controls.create(world: ecs.World, preview: ecs.Entity, converted: ConvertedControls, recovery: RecoverData?)
	for name, entry in converted do
		local recovered = if recovery then recovery[name] else nil

		if entry.EntryType == "ControlGroup" then
			local group = entry :: ControlGroup
			local group_entity = world.entity()
			world.add(group_entity, c.control_group)
			world.set(group_entity, c.control_name, name)
			if type(group.Order) == "number" then
				world.set(group_entity, c.control_order, group.Order)
			end
			world.add(group_entity, ecs.pair(ecs.ChildOf, preview))

			local group_recovery = if recovered and recovered.kind == "group" then (recovered :: types.RecoverGroup).controls else nil
			for child_name, child in group.Controls do
				local child_entry = if group_recovery then group_recovery[child_name] else nil
				create_control(world, group_entity, child_name, child, child_entry)
			end
		else
			create_control(world, preview, name, entry :: Control, recovered)
		end
	end
end

--- Direct control / group children of `parent`, collected so callers can write freely
local function collect_children(world: ecs.World, parent: ecs.Entity): { ecs.Entity }
	local children: { ecs.Entity } = {}
	for child in world.children(parent) do
		if world.has(child, c.control) or world.has(child, c.control_group) then
			table.insert(children, child)
		end
	end
	return children
end

--- Deletes the control entities of `preview` (group children go with their group)
function controls.destroy(world: ecs.World, preview: ecs.Entity)
	for _, child in collect_children(world, preview) do
		world.delete(child)
	end
end

--- Walks every control of `preview`, groups one level deep
local function each_control(
	world: ecs.World,
	preview: ecs.Entity,
	callback: (entity: ecs.Entity, name: string, control: Control, value: unknown, group: string?) -> ()
)
	for _, child in collect_children(world, preview) do
		local name = world.get(child, c.control_name) :: string
		if world.has(child, c.control_group) then
			for _, nested in collect_children(world, child) do
				local nested_name = world.get(nested, c.control_name) :: string
				local control = world.get(nested, c.control) :: Control
				callback(nested, nested_name, control, world.get(nested, c.control_value), name)
			end
		else
			local control = world.get(child, c.control) :: Control
			callback(child, name, control, world.get(child, c.control_value), nil)
		end
	end
end

--- Records the current controls and values so the next mount can recover them
function controls.snapshot(world: ecs.World, preview: ecs.Entity): RecoverData
	local data: RecoverData = {}
	each_control(world, preview, function(_, name, control, value, group)
		local entry: RecoverControl = { kind = "control", control = control, value = value }
		if group then
			local group_entry = data[group]
			if not group_entry then
				group_entry = { kind = "group", controls = {} }
				data[group] = group_entry
			end
			(group_entry :: types.RecoverGroup).controls[name] = entry
		else
			data[name] = entry
		end
	end)
	return data
end

--- The plain nested values table, shaped like the story's controls
function controls.values(world: ecs.World, preview: ecs.Entity): Values
	local values: Values = {}
	each_control(world, preview, function(_, name, _, value, group)
		if group then
			local group_values = values[group] :: Map<string, unknown>?
			if not group_values then
				group_values = {}
				values[group] = group_values
			end
			(group_values :: Map<string, unknown>)[name] = value
		else
			values[name] = value
		end
	end)
	return values
end

--- Builds a per-control state tree (sources, values, ...) shaped like the story's controls,
--- plus a flat entity -> state lookup for `observe`
function controls.map_states<S>(
	world: ecs.World,
	preview: ecs.Entity,
	creator: (entity: ecs.Entity, control: Control, value: unknown) -> S
): (StateTree<S>, ByEntity<S>)
	local tree: StateTree<S> = {}
	local by_entity: ByEntity<S> = {}

	each_control(world, preview, function(entity, name, control, value, group)
		local state = creator(entity, control, value)
		by_entity[entity] = state

		if group then
			local group_tree = (tree :: any)[group] :: Map<string, S>?
			if not group_tree then
				group_tree = {}
				tree[group] = group_tree :: any
			end
			(group_tree :: Map<string, S>)[name] = state
		else
			tree[name] = state
		end
	end)

	return tree, by_entity
end

--- Calls back whenever a `control_value` of an entity in `by_entity` is replaced.
--- Fires on every set, equal values included. Returns the disconnect.
function controls.observe<S>(
	world: ecs.World,
	by_entity: ByEntity<S>,
	callback: (entity: ecs.Entity, state: S, value: unknown) -> ()
): () -> ()
	return world.changed(c.control_value, function(entity, _, value)
		local state = by_entity[entity]
		if state ~= nil then
			callback(entity, state, value)
		end
	end)
end

------------------------------------------------------------------ resetting

function controls.reset_control(world: ecs.World, entity: ecs.Entity)
	if not world.exists(entity) then
		return
	end
	local control = world.get(entity, c.control)
	if control then
		world.set(entity, c.control_value, control.ControlValue)
	end
end

--- Puts every control of `preview` back to its default
function controls.reset(world: ecs.World, preview: ecs.Entity)
	local entities: { ecs.Entity } = {}
	each_control(world, preview, function(entity)
		table.insert(entities, entity)
	end)
	for _, entity in entities do
		controls.reset_control(world, entity)
	end
end

--- The preview a control (or group) belongs to, walking up the ChildOf chain
function controls.owner(world: ecs.World, entity: ecs.Entity): ecs.Entity?
	local current: ecs.Entity? = entity
	while current do
		if world.has(current, c.story_preview) then
			return current
		end
		if not world.has(current, CHILD_OF_WILDCARD) then
			return nil
		end
		current = world.parent(current)
	end
	return nil
end

return controls
