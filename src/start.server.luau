--[[
	Plugin entry point. Creates the toolbar, its buttons and the dock widget, then
	mounts the app inside the widget the first time it opens.

	The app stays mounted while the widget is hidden so the open stories survive
	closing the window. The stop button unmounts it, and opening the widget again
	mounts a fresh app.
]]

local RunService = game:GetService "RunService"

local BUILD = require "@constants/build"
local CONFIG = require "@constants/config"
local IMAGES = require "@constants/images"
local vide = require "@pkg/vide"
local app = require "@ui/app"

-- only runs in edit mode, never inside a running game or a play test
if RunService:IsRunning() and not RunService:IsEdit() then
	return
end

-- a local plugin is loaded from a file, so its name is the file name
local is_local = string.find(plugin.Name, ".rbxm", 1, true) ~= nil

-- every variant gets its own toolbar, widget and icon so they can be installed together.
-- The build channel wins over being local: a downloaded canary file is still a canary
local variant = if BUILD.channel == "canary" then "canary" elseif is_local then "dev" else "release"

local VARIANTS = {
	release = { suffix = "", widget_id = "UILabs", icon = IMAGES.plugin_open },
	canary = { suffix = " (Canary)", widget_id = "UILabs_CANARY", icon = IMAGES.plugin_open_canary },
	dev = { suffix = " (DEV)", widget_id = "UILabs_DEV", icon = IMAGES.plugin_open_dev },
}
local settings = VARIANTS[variant]

local toolbar_name = CONFIG.plugin_name .. settings.suffix

-- toolbar --

local toolbar = plugin:CreateToolbar(toolbar_name)

local open_button = toolbar:CreateButton(CONFIG.plugin_name, `Open {toolbar_name}`, settings.icon)
local stop_button = toolbar:CreateButton("Stop", `Stop {toolbar_name}`, IMAGES.plugin_stop)

open_button.ClickableWhenViewportHidden = true
stop_button.ClickableWhenViewportHidden = true

-- widget --

local widget_info = DockWidgetPluginGuiInfo.new(Enum.InitialDockState.Float, false, false, 0, 0)
local widget = plugin:CreateDockWidgetPluginGuiAsync(settings.widget_id, widget_info)

widget.Name = settings.widget_id
widget.Title = `{toolbar_name} - Storybook`
widget.ZIndexBehavior = Enum.ZIndexBehavior.Sibling

-- app --

vide.strict = true

local unmount: (() -> ())? = nil

local function mount_app()
	if unmount then
		return
	end
	unmount = vide.mount(function()
		return app {
			plugin = plugin,
			widget = widget,
		}
	end, widget)
end

local function unmount_app()
	if not unmount then
		return
	end
	unmount()
	unmount = nil
end

local function on_widget_toggled()
	open_button:SetActive(widget.Enabled)
	if widget.Enabled then
		mount_app()
	end
end

-- connections --

local open_connection = open_button.Click:Connect(function()
	widget.Enabled = not widget.Enabled
end)

local stop_connection = stop_button.Click:Connect(function()
	stop_button:SetActive(false)
	widget.Enabled = false
	unmount_app()
end)

local enabled_connection = widget:GetPropertyChangedSignal("Enabled"):Connect(on_widget_toggled)

widget:BindToClose(function()
	widget.Enabled = false
end)

-- studio restores the widget enabled state from the last session
on_widget_toggled()

plugin.Unloading:Connect(function()
	unmount_app()
	open_connection:Disconnect()
	stop_connection:Disconnect()
	enabled_connection:Disconnect()
end)
