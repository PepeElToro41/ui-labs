local use_overlay = require "@contexts/app-render/use-overlay"
local vide = require "@pkg/vide"
local hint_popup = require "@ui/overlays/hint-popup"

export type WrappeablePlaces = hint_popup.WrappeablePlaces

export type HoverHintProps = {
	--- whether the target is hovered, the hint is shown while it is
	hovered: Reactive<boolean>,
	--- no hint is shown without a text
	text: Derivable<string>?,
	--- where the hint sits around the target, see `hint_popup.anchor`
	anchor: (Vector2 | WrappeablePlaces)?,
	padding: Derivable<number>?,
}

--- Shows a `hint_popup` in the overlay layer while the target is hovered.
--- Returns an action, the frame it is added to is the target of the hint.
local function hover_hint(props: HoverHintProps)
	local hint_text = props.text
	if hint_text == nil then
		return {}
	end

	local overlay = use_overlay()

	return vide.action(function(target: GuiObject)
		vide.effect(function()
			if props.hovered() then
				overlay.show(function()
					return hint_popup {
						target = target,
						anchor = props.anchor,
						padding = props.padding,
						text = hint_text,
					}
				end)
			else
				overlay.hide()
			end
		end)
	end)
end

return hover_hint
