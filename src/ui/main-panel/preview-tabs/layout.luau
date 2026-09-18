local use_component = require "@hooks/use-component"
local vide = require "@pkg/vide"
local c = require "@src/components"
local ecs = require "@vendor/ecs"

local PADDING_X = 6
local PADDING_TOP = 3
local PADDING_BOTTOM = 4
local GAP = 5

export type Slot = {
	x: number,
	width: number,
	index: number,
	settled: boolean,
}

export type Slots = {
	map: { [ecs.Entity]: Slot },
	total: number,
	count: number,
}

type Entry = {
	entity: ecs.Entity,
	width: Source<number>,
	order: Reactive<number?>,
}

export type TabLayout = {
	register: (entity: ecs.Entity) -> Source<number>,
	slots: Reactive<Slots>,
	slot: (entity: ecs.Entity) -> Slot?,
	slot_x: (entity: ecs.Entity) -> number,
	--- canvas width of the strip
	total: Reactive<number>,
	--- the tab being dragged, if any
	dragging: Source<ecs.Entity?>,
	--- set by the strip, needed to map mouse positions into the canvas
	scroller: Source<ScrollingFrame?>,
	to_canvas_x: (absolute_x: number) -> number,
	clamp_x: (x: number, width: number) -> number,
	index_for_bounds: (entity: ecs.Entity, left: number, right: number) -> number,
}

type Sortable = { entity: ecs.Entity, order: number, width: number }

local function compare_sortable(a: Sortable, b: Sortable)
	if a.order ~= b.order then
		return a.order < b.order
	end
	return (a.entity :: any) < (b.entity :: any)
end

local function create_layout(): TabLayout
	local entries = vide.source({} :: { [ecs.Entity]: Entry })
	local dragging = vide.source(nil :: ecs.Entity?)
	local scroller = vide.source(nil :: ScrollingFrame?)

	local slots = vide.derive(function(): Slots
		local sortable: { Sortable } = {}
		for entity, entry in entries() do
			table.insert(sortable, {
				entity = entity,
				order = entry.order() or 0,
				width = entry.width(),
			})
		end
		table.sort(sortable, compare_sortable)

		local map: { [ecs.Entity]: Slot } = {}
		local x = PADDING_X
		local settled = true
		for index, item in sortable do
			settled = settled and item.width > 0
			map[item.entity] = {
				x = x,
				width = item.width,
				index = index,
				settled = settled,
			}
			x += item.width + GAP
		end

		local count = #sortable
		return {
			map = map,
			count = count,
			-- the last gap is replaced by the right padding
			total = if count == 0 then 0 else x - GAP + PADDING_X,
		}
	end)

	local function slot(entity: ecs.Entity): Slot?
		return slots().map[entity]
	end

	local function slot_x(entity: ecs.Entity): number
		local current = slot(entity)
		return if current then current.x else PADDING_X
	end

	local function total(): number
		return slots().total
	end

	local function register(entity: ecs.Entity): Source<number>
		local width = vide.source(0)
		local order = use_component(entity, c.preview_order)

		local map = vide.untrack(entries)
		map[entity] = { entity = entity, width = width, order = order }
		entries(map)

		vide.cleanup(function()
			vide.untrack(function()
				local current = entries()
				current[entity] = nil
				entries(current)

				if dragging() == entity then
					dragging(nil)
				end
			end)
		end)

		return width
	end

	local function to_canvas_x(absolute_x: number): number
		local frame = vide.untrack(scroller)
		if not frame then
			return absolute_x
		end
		return absolute_x - frame.AbsolutePosition.X + frame.CanvasPosition.X
	end

	local function clamp_x(x: number, width: number): number
		local maximum = math.max(PADDING_X, vide.untrack(total) - width - PADDING_X)
		return math.clamp(x, PADDING_X, maximum)
	end

	local function index_for_bounds(entity: ecs.Entity, left: number, right: number): number
		local map = vide.untrack(slots).map
		local own = map[entity]
		if not own then
			return 1
		end

		local index = 1
		for other, current in map do
			if other == entity then
				continue
			end
			local center = current.x + current.width / 2
			if current.index < own.index then
				if center <= left then
					index += 1
				end
			elseif center < right then
				index += 1
			end
		end
		return index
	end

	return {
		register = register,
		slots = slots,
		slot = slot,
		slot_x = slot_x,
		total = total,
		dragging = dragging,
		scroller = scroller,
		to_canvas_x = to_canvas_x,
		clamp_x = clamp_x,
		index_for_bounds = index_for_bounds,
	}
end

return {
	create = create_layout,
	PADDING_X = PADDING_X,
	PADDING_TOP = PADDING_TOP,
	PADDING_BOTTOM = PADDING_BOTTOM,
	GAP = GAP,
}
