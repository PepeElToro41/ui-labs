local vide = require "@pkg/vide"
local APP_RENDER_CONTEXT = require "./app-render-context"

export type Popup = {
	--- opens the popup, replacing any other open popup
	open: (render: () -> Instance) -> (),
	--- closes the popup only if this owner opened it
	close: () -> (),
	--- wraps a callback so the popup closes before the callback runs
	action: (callback: () -> ()) -> () -> (),
	--- whether the open popup belongs to this owner
	is_open: Reactive<boolean>,
}

--- Popup handle bound to an owner. Without an owner, each call site is its own owner.
--- The popup is closed when the calling scope is destroyed so a removed owner never leaves a stale popup.
local function use_popup(popup_owner: unknown?): Popup
	local context = APP_RENDER_CONTEXT()
	local owner: unknown = if popup_owner ~= nil then popup_owner else {}

	local popup = {} :: Popup

	function popup.open(render: () -> Instance)
		context.open_popup(owner, render)
	end

	function popup.close()
		context.close_popup(owner)
	end

	function popup.action(callback: () -> ())
		return function()
			context.close_popup()
			callback()
		end
	end

	popup.is_open = function()
		local current = context.popup()
		return current ~= nil and current.owner == owner
	end

	vide.cleanup(popup.close)

	return popup
end

return use_popup
