local RunService = game:GetService "RunService"

local vide = require "@pkg/vide"
local div = require "@ui/styles/div"
local actions = require "@utils/vide/actions"
local videx = require "@utils/vide/videx"
local hit_test = require "./hit-test"

type OutlineMarkerProps = {
	--- the frame the story is mounted in, everything under it is outlined
	root: Reactive<Frame?>,
	--- absolute position and size of the overlay the tool draws in, absolute positions are
	--- turned into offsets inside it by subtracting its position
	view: Reactive<actions.GuiShape>,
}

local OUTLINE_COLOR = Color3.fromRGB(218, 131, 1)
local STROKE_THICKNESS = 1
local CORNER_RADIUS = 2
-- the stroke is drawn around the frame, which is inset by this much so the outline lands on
-- the bounds of the element instead of around them
local INSET = 1
-- an element this small has no room for an outline once it is inset on both sides
local MIN_SIZE = INSET * 2 + 2
-- a child that covers its parent completely is left out, its outline would sit exactly over
-- the one of the parent. Absolute sizes are floats, so the corners are compared with slack
local COVER_SLACK = 1
-- outlining more than this tells nothing about the story anymore, and a pass has to fit in a
-- frame: a story with more elements than this gets the first ones the walk reaches
local MAX_OUTLINES = 400

--- Whether `gui` covers `parent` completely, which is what a size of `1, 1` in scale does
local function covers(gui: GuiObject, parent: GuiObject): boolean
	local size = gui.AbsoluteSize - parent.AbsoluteSize
	local position = gui.AbsolutePosition - parent.AbsolutePosition
	return size.Magnitude <= COVER_SLACK and position.Magnitude <= COVER_SLACK
end

--- Outline marker: draws an outline around every element of the story.
---
--- Children that cover their parent are left out, their outline would only double the one of
--- the parent, and so are elements that are not visible or that an ancestor clipped away (see
--- `hit-test`). A partly clipped element is outlined around the part of it that is drawn.
---
--- The outlines come from a pool and are placed by hand: the story is walked again every
--- frame, so the outlines keep up with anything that moves, and a story that rebuilds its
--- elements constantly only moves the frames of the pool around instead of creating any
local function outline_marker(props: OutlineMarkerProps)
	local holder = div { Name = "outline_marker" }

	--- the outlines built so far, reused by every pass. The ones a pass does not need are
	--- hidden instead of destroyed
	local pool: { Frame } = {}

	--- built by hand and not through vide: the pool writes their properties itself
	local function create_outline(): Frame
		local outline = Instance.new "Frame"
		outline.Name = "outline"
		outline.BackgroundTransparency = 1
		outline.BorderSizePixel = 0
		outline.Visible = false

		local corner = Instance.new "UICorner"
		corner.CornerRadius = UDim.new(0, CORNER_RADIUS)
		corner.Parent = outline

		local stroke = Instance.new "UIStroke"
		stroke.Color = OUTLINE_COLOR
		stroke.Thickness = STROKE_THICKNESS
		stroke.ApplyStrokeMode = Enum.ApplyStrokeMode.Border
		stroke.Parent = outline

		outline.Parent = holder
		return outline
	end

	local function refresh()
		local root = props.root()
		local anchor = props.view().position
		local used = 0

		if root then
			hit_test.walk(root, function(gui, window, parent)
				if used >= MAX_OUTLINES then
					return
				end

				local size = hit_test.size(window)
				-- clipped away by an ancestor, or too small to outline
				if hit_test.empty(window) or size.X < MIN_SIZE or size.Y < MIN_SIZE then
					return
				end
				if covers(gui, parent) then
					return
				end

				used += 1
				local outline = pool[used]
				if not outline then
					outline = create_outline()
					pool[used] = outline
				end

				local min = window.min - anchor
				outline.Position = UDim2.fromOffset(min.X + INSET, min.Y + INSET)
				outline.Size = UDim2.fromOffset(size.X - INSET * 2, size.Y - INSET * 2)
				outline.Visible = true
			end)
		end

		for index = used + 1, #pool do
			pool[index].Visible = false
		end
	end

	--- the outlines are placed in the frame the story is drawn in, a heartbeat would leave
	--- them one frame behind everything that moves
	videx.connect(RunService.RenderStepped, refresh)

	-- vide only unparents what it stops rendering, the pool goes with its holder
	vide.cleanup(holder)

	return holder
end

return outline_marker
