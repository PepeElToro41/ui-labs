--[[
	Hit testing a mounted story.

	Nothing reports what the mouse is over inside a plugin widget: a plugin cannot ask a
	widget for the object under the cursor, and `UserInputService` does not see the widget at
	all. The tools that need it (the element selection, the outline marker) walk the story
	themselves and test every object against the mouse, which is what this module is for.

	`walk` visits the gui objects under a root in draw order, bottom first: siblings by their
	`ZIndex`, and every object before its own descendants. The sibling order is stable, so
	objects sharing a `ZIndex` keep the order they are parented in, which is the order roblox
	draws them in. Objects that are not visible are skipped along with everything under them.

	Every object is visited with the window it is drawn inside of: its own rectangle, clipped
	by every `ClipsDescendants` ancestor above it. An object scrolled out of a scrolling frame
	is left with an empty window, so a tool can tell it is not on screen without knowing which
	ancestor clipped it away.
]]

local hit_test = {}

--- An axis aligned rectangle in absolute gui space, as its two corners
export type Window = {
	min: Vector2,
	max: Vector2,
}

export type Hit = {
	gui: GuiObject,
	--- the part of it that is drawn, see `walk`
	window: Window,
}

--- visits one object with the window it is drawn inside of and the gui object it is drawn in,
--- which is the root itself for the objects directly under it
export type Visitor = (gui: GuiObject, window: Window, parent: GuiObject) -> ()

-- what an object with no clipping ancestor is clipped by
local UNCLIPPED: Window = {
	min = Vector2.new(-math.huge, -math.huge),
	max = Vector2.new(math.huge, math.huge),
}

local function rect(gui: GuiObject): Window
	local position = gui.AbsolutePosition
	return {
		min = position,
		max = position + gui.AbsoluteSize,
	}
end

local function clip(window: Window, within: Window): Window
	return {
		min = Vector2.new(math.max(window.min.X, within.min.X), math.max(window.min.Y, within.min.Y)),
		max = Vector2.new(math.min(window.max.X, within.max.X), math.min(window.max.Y, within.max.Y)),
	}
end

--- Whether nothing of the window is left, which is what being clipped away looks like
function hit_test.empty(window: Window): boolean
	return window.min.X >= window.max.X or window.min.Y >= window.max.Y
end

function hit_test.size(window: Window): Vector2
	return window.max - window.min
end

function hit_test.covers(window: Window, point: Vector2): boolean
	if hit_test.empty(window) then
		return false
	end
	local inside_x = point.X >= window.min.X and point.X <= window.max.X
	local inside_y = point.Y >= window.min.Y and point.Y <= window.max.Y
	return inside_x and inside_y
end

type Ordered = {
	instance: Instance,
	zindex: number,
	index: number,
}

--- `table.sort` is not stable, so the order the children came in is part of the comparison:
--- it is what breaks a `ZIndex` tie, the same way roblox draws siblings that share one
local function compare(a: Ordered, b: Ordered): boolean
	if a.zindex ~= b.zindex then
		return a.zindex < b.zindex
	end
	return a.index < b.index
end

local function draw_order(instance: Instance): { Ordered }
	local children = instance:GetChildren()
	local ordered: { Ordered } = table.create(#children)

	for index, child in children do
		-- only gui objects carry a ZIndex, anything else (a folder holding gui objects, a
		-- layout) is drawn wherever its own children are
		local zindex = if child:IsA "GuiObject" then child.ZIndex else 0
		table.insert(ordered, { instance = child, zindex = zindex, index = index })
	end

	table.sort(ordered, compare)
	return ordered
end

local function visit_children(instance: Instance, window: Window, parent: GuiObject, visit: Visitor)
	for _, entry in draw_order(instance) do
		local child = entry.instance

		if not child:IsA "GuiObject" then
			-- it is not drawn itself, its gui children are drawn as if they were here
			visit_children(child, window, parent, visit)
			continue
		end
		-- an object that is not visible hides everything under it as well
		if not child.Visible then
			continue
		end

		local clipped = clip(rect(child), window)
		visit(child, clipped, parent)
		visit_children(child, if child.ClipsDescendants then clipped else window, child, visit)
	end
end

--- Visits every visible gui object under `root`, bottom first. The root itself is not visited
function hit_test.walk(root: GuiObject, visit: Visitor)
	visit_children(root, if root.ClipsDescendants then rect(root) else UNCLIPPED, root, visit)
end

--- Every visible gui object under `root` that is drawn over `point`, in draw order, the one
--- on top first
function hit_test.guis_at(root: GuiObject, point: Vector2): { Hit }
	local hits: { Hit } = {}

	hit_test.walk(root, function(gui, window)
		if hit_test.covers(window, point) then
			table.insert(hits, { gui = gui, window = window })
		end
	end)

	-- the walk goes bottom first, the array is read from the top down
	local count = #hits
	for index = 1, count // 2 do
		hits[index], hits[count - index + 1] = hits[count - index + 1], hits[index]
	end
	return hits
end

return hit_test
