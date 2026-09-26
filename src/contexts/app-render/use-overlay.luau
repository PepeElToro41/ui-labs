local vide = require "@pkg/vide"
local APP_RENDER_CONTEXT = require "./app-render-context"

export type Overlay = {
	--- shows the overlay, replacing the one this owner was already showing
	show: (render: () -> Instance) -> (),
	hide: () -> (),
	--- whether this owner is showing its overlay
	is_shown: Reactive<boolean>,
}

--- Overlay handle bound to an owner. Without an owner, each call site is its own owner.
--- Unlike a popup, overlays of other owners are left alone and the contents stay interactable.
--- The overlay is hidden when the calling scope is destroyed so a removed owner never leaves a stale overlay.
local function use_overlay(overlay_owner: unknown?): Overlay
	local context = APP_RENDER_CONTEXT()
	local owner: unknown = if overlay_owner ~= nil then overlay_owner else {}

	local overlay = {} :: Overlay

	function overlay.show(render: () -> Instance)
		context.show_overlay(owner, render)
	end

	function overlay.hide()
		context.hide_overlay(owner)
	end

	overlay.is_shown = function()
		for _, entry in context.overlays() do
			if entry.owner == owner then
				return true
			end
		end
		return false
	end

	vide.cleanup(overlay.hide)

	return overlay
end

return use_overlay
