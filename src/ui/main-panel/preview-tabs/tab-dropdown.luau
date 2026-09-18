local use_popup = require "@contexts/app-render/use-popup"
local use_world = require "@contexts/world/use-world"
local previews = require "@src/systems/previews"
local dropdown_divider = require "@ui/overlays/dropdown/divider"
local dropdown_item = require "@ui/overlays/dropdown/item"
local dropdown_popup = require "@ui/overlays/dropdown/popup"
local ecs = require "@vendor/ecs"

type TabDropdownProps = {
	--- the preview the tab represents, the dropdown acts on it
	entity: ecs.Entity,
	--- absolute position the dropdown originates from
	position: Vector2,
	--- popup handle of the tab, items close it before running
	popup: use_popup.Popup,
}

--- Right click menu of a preview tab
local function tab_dropdown(props: TabDropdownProps)
	local world = use_world()
	local entity = props.entity
	local popup = props.popup

	return dropdown_popup {
		position = props.position,
		children = {
			dropdown_item {
				order = 1,
				text = "Unmount",
				activated = popup.action(function()
					previews.unmount(world, entity)
				end),
			},
			dropdown_divider { order = 2 },
			dropdown_item {
				order = 3,
				text = "Reload",
				activated = popup.action(function()
					previews.reload(world, entity)
				end),
			},
		},
	}
end

return tab_dropdown
