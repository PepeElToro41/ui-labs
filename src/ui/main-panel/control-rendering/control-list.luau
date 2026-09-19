local use_world = require "@contexts/world/use-world"
local use_query = require "@hooks/use-query"
local vide = require "@pkg/vide"
local c = require "@src/components"
local ecs = require "@vendor/ecs"
local columns = require "./columns"
local control_entry = require "./control-entry"

type ControlListProps = {
	--- the preview, or a control group
	parent: ecs.Entity,
	columns: columns.Columns,
	indent: number?,
	--- renders the control groups found in the list. Groups do not nest, so a group lists its
	--- controls without it (it also keeps this module from requiring the group back)
	group: ((entity: ecs.Entity, order: Reactive<number>) -> Instance)?,
}

--- The rows of every control that is a direct child of `parent`, as children for a vertical list
local function control_list(props: ControlListProps)
	local world = use_world()

	-- controls and groups both carry a name
	local entities = use_query(world.query():with(c.control_name, ecs.pair(ecs.ChildOf, props.parent)))

	-- stories declare controls in a map, so the entities arrive in no order: the ones with an
	-- explicit order go first, the rest follow by name
	local positions = vide.derive(function()
		local sorted = table.clone(entities())
		table.sort(sorted, function(a, b)
			local order_a = world.get(a, c.control_order) or math.huge
			local order_b = world.get(b, c.control_order) or math.huge
			if order_a ~= order_b then
				return order_a < order_b
			end
			local name_a = world.get(a, c.control_name) or ""
			local name_b = world.get(b, c.control_name) or ""
			if name_a ~= name_b then
				return name_a < name_b
			end
			-- entities are numbers, this only makes the sort total
			return (a :: any) < (b :: any)
		end)

		local map: Map<ecs.Entity, number> = {}
		for index, entity in sorted do
			map[entity] = index
		end
		return map
	end)

	return vide.values(entities, function(entity)
		local order = function()
			return positions()[entity] or 0
		end

		if props.group and world.has(entity, c.control_group) then
			return props.group(entity, order)
		end
		return control_entry {
			entity = entity,
			order = order,
			columns = props.columns,
			indent = props.indent,
		}
	end)
end

return control_list
