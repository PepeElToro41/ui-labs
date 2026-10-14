local use_tag = require "@hooks/use-tag"
local c = require "@src/components"
local previews = require "@src/systems/previews"
local ecs = require "@vendor/ecs"

export type Holders = {
	--- whether that holder is open, the editor slot always is
	viewport: Reactive<boolean>,
	widget: Reactive<boolean>,
	--- the open holder the story is parented into
	active: Reactive<c.HolderType>,
}

--- The holders of `preview`: which ones are open and which one shows the story
local function use_holders(preview: Derivable<ecs.Entity>): Holders
	local viewport = use_tag(preview, c.in_viewport)
	local widget = use_tag(preview, c.in_widget)

	return {
		viewport = viewport,
		widget = widget,
		active = function()
			return previews.active_holder(viewport(), widget())
		end,
	}
end

return use_holders
