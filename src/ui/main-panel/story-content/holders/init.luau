local vide = require "@pkg/vide"
local c = require "@src/components"
local editor_holder = require "@self/editor"
local types = require "@self/types"
local viewport_holder = require "@self/viewport"
local widget_holder = require "@self/widget"

--[[
	Story holders: the places a mounted story can be shown in.

	The preview owns one frame (`preview_holder`, created by the story_holder ui) and the
	mounters render the story inside it. A holder never touches that frame: it builds a place
	for it and publishes it through its own `target`.

	- `editor`   a frame in the slot the story panel keeps for the preview, always there. It
	             carries the zoom and the position, so those only apply in the editor
	- `viewport` a ScreenGui under CoreGui, drawn over the Studio viewport
	- `widget`   a dock widget of its own, which can be docked anywhere in Studio

	Opening a holder (`in_viewport`, `in_widget`) only builds it. Which one actually gets the
	story is decided here, once, for all of them: the viewport wins over the widget, which
	wins over the editor (`previews.active_holder`). A story moved to the viewport while it is
	in a widget leaves that widget open and empty, and goes back into it when the viewport
	closes. The frame is only ever moved between holders, never parented to nothing, so the
	story keeps running wherever it ends up.
]]

export type HolderProps = types.HolderProps
export type Holder = types.Holder

export type ControllerProps = types.PreviewProps & {
	--- the holders that are open, see `use_holders`
	viewport: Reactive<boolean>,
	widget: Reactive<boolean>,
	--- the one of them that shows the story
	active: Reactive<c.HolderType>,
}

--- Builds the holders of a preview and keeps its story frame in the active one
local function story_holders(props: ControllerProps)
	local targets: { [c.HolderType]: Source<GuiBase2d?> } = {
		editor = vide.source(nil),
		viewport = vide.source(nil),
		widget = vide.source(nil),
	}

	local function holder_props(holder: c.HolderType): types.HolderProps
		return {
			entity = props.entity,
			holder = props.holder,
			slot = props.slot,
			name = props.name,
			target = targets[holder],
		}
	end

	--- `vide.switch` over a boolean instead of `vide.show`: switch keeps the branch of a
	--- value it already built, which is what stops strict mode from building the holder (and
	--- taking a widget out of the pool) twice
	local function optional(open: Reactive<boolean>, holder: types.Holder, kind: c.HolderType)
		return vide.switch(open) {
			[true] = function()
				holder(holder_props(kind))
				return nil
			end,
		}
	end

	-- the editor slot is part of the preview, it is built once and never closes
	editor_holder(holder_props "editor")

	optional(props.viewport, viewport_holder, "viewport")
	optional(props.widget, widget_holder, "widget")

	-- a holder that is still being built has no target yet (a widget takes a few frames), the
	-- story then stays where it is until it reports in
	vide.effect(function()
		local target = targets[props.active()]()
		if target then
			props.holder.Parent = target
		end
	end)
end

return story_holders
