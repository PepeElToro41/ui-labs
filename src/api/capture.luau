local StarterGui = game:GetService "StarterGui"

--[[
	Capture mode: renders clones of preview holders into a ScreenGui under StarterGui so the
	Studio viewport (and anything that screenshots it, like the Studio MCP `screen_capture`
	tool) shows them. Dock widgets and CoreGui never show up in those captures, StarterGui does
	because Studio draws it in edit mode.

	The ScreenGui is not archivable so it can never be saved with the place, and a session ends
	itself after `timeout` seconds in case `finish` is never called. Only one session exists at a
	time, starting a new one ends the previous.

	Clones are used instead of re-parenting the live holders so a capture can never disturb a
	running story. Descendants with `Archivable = false` are left out by `Clone`.
]]

local capture = {}

export type Entry = {
	id: number,
	holder: Frame,
}

export type Options = {
	columns: number?,
	size: Vector2?,
	gap: number?,
	background: Color3?,
	timeout: number?,
}

export type Rect = {
	preview: number,
	x: number,
	y: number,
	width: number,
	height: number,
}

export type Session = {
	gui: ScreenGui,
	path: string,
	rects: { Rect },
	viewport: Vector2,
	scale: number,
	ends_at: number,
}

local GUI_NAME = "UILabsCapture"
local DEFAULT_GAP = 8
local DEFAULT_TIMEOUT = 30
local DEFAULT_BACKGROUND = Color3.fromRGB(37, 37, 42)

local session: Session? = nil

local function viewport_size(): Vector2
	local camera = workspace.CurrentCamera
	local size = if camera then camera.ViewportSize else Vector2.zero
	if size.X <= 0 or size.Y <= 0 then
		return Vector2.new(1024, 768)
	end
	return size
end

--- The cell size every preview gets: the requested one, else the largest holder, else a
--- quarter of the viewport (holders inside hidden tabs can report a zero size)
local function cell_size(entries: { Entry }, requested: Vector2?, viewport: Vector2): Vector2
	if requested then
		return Vector2.new(math.max(requested.X, 1), math.max(requested.Y, 1))
	end
	local largest = Vector2.zero
	for _, entry in entries do
		local size = entry.holder.AbsoluteSize
		if size.X * size.Y > largest.X * largest.Y then
			largest = size
		end
	end
	if largest.X <= 0 or largest.Y <= 0 then
		return viewport / 2
	end
	return largest
end

function capture.finish(): boolean
	local current = session
	if not current then
		return false
	end
	session = nil
	current.gui:Destroy()
	return true
end

function capture.active(): Session?
	return session
end

function capture.begin(entries: { Entry }, options: Options?): Session
	capture.finish()

	local opts: Options = options or {}
	local viewport = viewport_size()
	local cell = cell_size(entries, opts.size, viewport)
	local gap = opts.gap or DEFAULT_GAP
	local columns = math.clamp(opts.columns or #entries, 1, math.max(#entries, 1))
	local rows = math.ceil(#entries / columns)

	local grid_size = Vector2.new(columns * cell.X + (columns - 1) * gap, rows * cell.Y + (rows - 1) * gap)
	-- the whole grid has to fit the viewport, otherwise the capture would clip it
	local scale = math.min(1, viewport.X / grid_size.X, viewport.Y / grid_size.Y)

	local gui = Instance.new "ScreenGui"
	gui.Name = GUI_NAME
	gui.Archivable = false
	gui.IgnoreGuiInset = true
	gui.ResetOnSpawn = false
	gui.DisplayOrder = 1000
	gui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling

	local cover = Instance.new "Frame"
	cover.Name = "cover"
	cover.Size = UDim2.fromScale(1, 1)
	cover.BackgroundColor3 = opts.background or DEFAULT_BACKGROUND
	cover.BorderSizePixel = 0
	cover.Parent = gui

	local grid = Instance.new "Frame"
	grid.Name = "grid"
	grid.Size = UDim2.fromOffset(grid_size.X, grid_size.Y)
	grid.BackgroundTransparency = 1
	grid.Parent = cover

	local grid_scale = Instance.new "UIScale"
	grid_scale.Scale = scale
	grid_scale.Parent = grid

	local rects: { Rect } = {}
	for index, entry in entries do
		local column = (index - 1) % columns
		local row = (index - 1) // columns
		local position = Vector2.new(column * (cell.X + gap), row * (cell.Y + gap))

		local frame = Instance.new "Frame"
		frame.Name = tostring(entry.id)
		frame.Size = UDim2.fromOffset(cell.X, cell.Y)
		frame.Position = UDim2.fromOffset(position.X, position.Y)
		frame.BackgroundTransparency = 1
		frame.ClipsDescendants = true
		frame.Parent = grid

		local clone = entry.holder:Clone()
		clone.Name = "holder"
		clone.Position = UDim2.fromOffset(0, 0)
		clone.Size = UDim2.fromScale(1, 1)
		clone.Parent = frame

		table.insert(rects, {
			preview = entry.id,
			x = math.round(position.X * scale),
			y = math.round(position.Y * scale),
			width = math.round(cell.X * scale),
			height = math.round(cell.Y * scale),
		})
	end

	gui.Parent = StarterGui

	local timeout = opts.timeout or DEFAULT_TIMEOUT
	local new_session: Session = {
		gui = gui,
		path = gui:GetFullName(),
		rects = rects,
		viewport = viewport,
		scale = scale,
		ends_at = os.clock() + timeout,
	}
	session = new_session

	task.delay(timeout, function()
		if session == new_session then
			capture.finish()
		end
	end)

	return new_session
end

return capture
