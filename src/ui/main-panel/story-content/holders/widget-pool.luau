--[[
	Pool of the dock widgets the widget holder renders previews in.

	Studio keeps a plugin widget around for the rest of the session once it was created, and
	remembers its size, position and dock state by id, so widgets are never thrown away here: a
	released one is hidden, and the next preview that asks for one takes it back. Their ids are
	a plain `{widget id}_Preview{n}` sequence for that reason, nothing about them is tied to a
	story.

	`CreateDockWidgetPluginGuiAsync` yields, which a vide scope must never do, so a widget that
	does not exist yet is created in its own thread and the handle reports it through `ready`
	once it is there. Releasing before that cancels the hand over and the widget stays free.

	Nothing here parents a story: the holder publishes the widget and the holder controller
	decides what goes in it, so a released widget is only hidden, never emptied.
]]

local widget_pool = {}

export type AcquireProps = {
	plugin: Plugin,
	--- id of the app's own widget, the pooled ids are derived from it
	prefix: string,
	--- called with the widget once it exists, never after the handle was released
	ready: (widget: DockWidgetPluginGui) -> (),
	--- the user closed the window: the caller is expected to release the handle
	closed: () -> (),
}

export type Handle = {
	--- renames the window, the title follows the story name
	set_title: (title: string) -> (),
	--- gives the widget back to the pool
	release: () -> (),
}

type Entry = {
	id: string,
	--- nil while the widget is still being created
	widget: DockWidgetPluginGui?,
	taken: boolean,
}

-- float by default: a preview widget is meant to be dragged somewhere, docked or not
local WIDGET_INFO = DockWidgetPluginGuiInfo.new(Enum.InitialDockState.Float, true, true, 450, 350, 160, 120)

local pool: { Entry } = {}

local function free_entry(): Entry?
	for _, entry in pool do
		if not entry.taken and entry.widget then
			return entry
		end
	end
	return nil
end

--- The lowest unused id, a failed creation leaves its slot free again
local function next_id(prefix: string): string
	local index = 1
	while true do
		local id = `{prefix}_Preview{index}`
		local used = false
		for _, entry in pool do
			if entry.id == id then
				used = true
				break
			end
		end
		if not used then
			return id
		end
		index += 1
	end
end

--- Takes a widget out of the pool, creating one when all of them are busy. `ready` is called
--- with it as soon as it exists, which can be a few frames later
function widget_pool.acquire(props: AcquireProps): Handle
	local released = false
	local title = ""
	local connection: RBXScriptConnection? = nil

	local function attach(widget: DockWidgetPluginGui)
		widget.Title = title
		widget.Enabled = true
		props.ready(widget)

		-- closing the window is the user asking for the story back, the caller decides what
		-- that means. Our own `Enabled` writes happen with the connection gone
		connection = widget:GetPropertyChangedSignal("Enabled"):Connect(function()
			if not widget.Enabled then
				props.closed()
			end
		end)
	end

	local entry = free_entry()
	if entry then
		entry.taken = true
		attach(entry.widget :: DockWidgetPluginGui)
	else
		local slot: Entry = { id = next_id(props.prefix), widget = nil, taken = true }
		table.insert(pool, slot)
		entry = slot

		task.spawn(function()
			local ok, result = pcall(function()
				return props.plugin:CreateDockWidgetPluginGuiAsync(slot.id, WIDGET_INFO)
			end)
			if not ok then
				warn(`[UI Labs] the preview widget {slot.id} could not be created:\n{result}`)
				local index = table.find(pool, slot)
				if index then
					table.remove(pool, index)
				end
				return
			end

			local widget = result :: DockWidgetPluginGui
			widget.Name = slot.id
			widget.ZIndexBehavior = Enum.ZIndexBehavior.Sibling
			slot.widget = widget

			-- released while it was being created, it goes straight back to the pool
			if released then
				slot.taken = false
				widget.Enabled = false
				return
			end
			attach(widget)
		end)
	end

	local taken = entry :: Entry

	local function set_title(value: string)
		title = value
		local widget = taken.widget
		if widget and not released then
			widget.Title = value
		end
	end

	local function release()
		if released then
			return
		end
		released = true
		taken.taken = false

		if connection then
			connection:Disconnect()
			connection = nil
		end

		local widget = taken.widget
		if widget then
			widget.Enabled = false
		end
	end

	return {
		set_title = set_title,
		release = release,
	}
end

return widget_pool
