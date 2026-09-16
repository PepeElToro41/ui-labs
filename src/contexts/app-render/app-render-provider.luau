local vide = require "@pkg/vide"
local div = require "@ui/styles/div"
local videx = require "@utils/vide/videx"
local APP_RENDER_CONTEXT = require "./app-render-context"

type Popup = APP_RENDER_CONTEXT.Popup

local MOUSE_BUTTONS = {
	[Enum.UserInputType.MouseButton1] = true,
	[Enum.UserInputType.MouseButton2] = true,
	[Enum.UserInputType.MouseButton3] = true,
}

--[[
	Renders the app inside a holder with an overlay layer on top of the contents.

	Only one popup exists at a time: `popup` is a single source, so opening a popup
	replaces the previous one. While a popup is open the contents are not interactable,
	so nothing under the popup hovers or reacts. A mouse press outside the popup closes it,
	which makes the contents interactable again before the release, so a popup opener
	listening to the release (`MouseButton2Up`) can open its popup with the same click.
]]
local function app_render_provider(props: ProviderChildren)
	local holder = vide.source(nil :: Frame?)
	local contents = vide.source(nil :: Frame?)
	local overlay = vide.source(nil :: Frame?)
	local popup = vide.source(nil :: Popup?)
	-- whether the mouse is over the open popup
	local inside_popup = vide.source(false)

	local function open_popup(owner: unknown, render: () -> Instance)
		popup({ owner = owner, render = render })
	end

	local function close_popup(owner: unknown?)
		local current = popup()
		if not current then
			return
		end
		if owner ~= nil and current.owner ~= owner then
			return
		end
		popup(nil)
	end

	local function render_popup(entry: Popup)
		local instance = entry.render()
		if instance:IsA "GuiObject" then
			videx.connect(instance.MouseEnter, function()
				inside_popup(true)
			end)
			videx.connect(instance.MouseLeave, function()
				inside_popup(false)
			end)
		end
		vide.cleanup(function()
			inside_popup(false)
		end)
		return instance
	end

	local function on_input_began(input: InputObject)
		if popup() == nil or not MOUSE_BUTTONS[input.UserInputType] then
			return
		end
		if not inside_popup() then
			close_popup()
		end
	end

	local context: APP_RENDER_CONTEXT.AppRender = {
		holder = holder,
		contents = contents,
		overlay = overlay,
		popup = popup,
		open_popup = open_popup,
		close_popup = close_popup,
	}

	return APP_RENDER_CONTEXT(context, function()
		return div {
			Name = "app_holder",
			vide.action(holder),

			div {
				Name = "contents",
				Interactable = function()
					return popup() == nil
				end,
				vide.action(contents),

				props.children(),
			},
			div {
				Name = "overlay",
				ZIndex = 2,
				vide.action(overlay),

				div {
					Name = "popups",

					-- keyed by value, swapping popups destroys the old scope and creates the new one
					videx.single(popup, render_popup),
				},
			},
			-- not Active, so it sees every press without taking input away from anything below
			div {
				Name = "input_listener",
				ZIndex = 3,
				vide.action(function(frame: Frame)
					videx.connect(frame.InputBegan, on_input_began)
				end),
			},
		}
	end)
end

return app_render_provider
