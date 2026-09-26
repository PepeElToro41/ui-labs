local vide = require "@pkg/vide"
local div = require "@ui/styles/div"
local videx = require "@utils/vide/videx"
local APP_RENDER_CONTEXT = require "./app-render-context"
local use_user_input = require "./use-user-input"
local user_input_provider = require "./user-input-provider"

type Popup = APP_RENDER_CONTEXT.Popup
type Overlay = APP_RENDER_CONTEXT.Overlay

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

	Overlays are the passive counterpart (hints): any amount can exist at once, one per owner,
	and they never change how the contents or the popup behave.
]]
local function overlay_provider(props: ProviderChildren)
	local holder = vide.source(nil :: Frame?)
	local contents = vide.source(nil :: Frame?)
	local overlay = vide.source(nil :: Frame?)
	local popup = vide.source(nil :: Popup?)
	local overlays = vide.source({} :: { Overlay })
	-- whether the mouse is over the open popup
	local inside_popup = vide.source(false)

	local function open_popup(owner: unknown, render: () -> Instance)
		popup { owner = owner, render = render }
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

	-- untracked, so showing or hiding from an effect doesnt make the effect depend on the list
	local function without_owner(owner: unknown): { Overlay }
		local remaining = {}
		for _, entry in vide.untrack(overlays) do
			if entry.owner ~= owner then
				table.insert(remaining, entry)
			end
		end
		return remaining
	end

	local function show_overlay(owner: unknown, render: () -> Instance)
		local entries = without_owner(owner)
		table.insert(entries, { owner = owner, render = render })
		overlays(entries)
	end

	local function hide_overlay(owner: unknown)
		local entries = without_owner(owner)
		if #entries ~= #vide.untrack(overlays) then
			overlays(entries)
		end
	end

	local function render_popup(entry: Popup?): any
		if not entry then return nil end
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
		overlays = overlays,
		show_overlay = show_overlay,
		hide_overlay = hide_overlay,
	}

	-- the user input listener sits above the overlay, so it sees the presses over a popup too
	videx.connect(use_user_input().input_began, on_input_began)

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
				div {
					Name = "overlays",
					ZIndex = 2,

					-- keyed by entry, showing again makes a new entry so the old scope is destroyed
					vide.values(overlays, function(entry: Overlay)
						return entry.render()
					end),
				},
			},
		}
	end)
end

--- Everything the app renders under: the user input listener, then the popup / overlay layers
local function app_render_provider(props: ProviderChildren)
	return videx.provider_stack {
		providers = { user_input_provider, overlay_provider },
		children = props.children,
	}
end

return app_render_provider
