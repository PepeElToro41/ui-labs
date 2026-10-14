local IMAGES = require "@constants/images"
local use_popup = require "@contexts/app-render/use-popup"
local use_plugin = require "@contexts/plugin/use-plugin"
local use_world = require "@contexts/world/use-world"
local use_holders = require "@hooks/use-holders"
local use_tag = require "@hooks/use-tag"
local use_target = require "@hooks/use-target"
local c = require "@src/components"
local previews = require "@src/systems/previews"
local dropdown_divider = require "@ui/overlays/dropdown/divider"
local dropdown_item = require "@ui/overlays/dropdown/item"
local dropdown_popup = require "@ui/overlays/dropdown/popup"
local ecs = require "@vendor/ecs"

-- the holders that can be opened next to the editor slot, in the order they are listed
local HOLDERS: { { kind: c.HolderType, text: string } } = {
	{ kind = "viewport", text = "Show in Viewport" },
	{ kind = "widget", text = "Show in Widget" },
}

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

	-- widgets belong to the plugin, the app rendered inside a story has none to give out
	local has_plugin = use_plugin().plugin ~= nil
	local holders = use_holders(entity)
	local hidden = use_tag(entity, c.hidden)

	-- a tab sharing an environment reloads with its owner: the owner holds the auto reload
	-- flag the toggle writes, so the mark has to follow that one
	local shared_with = use_target(entity, c.r_shared_environment)
	local auto_reload = use_tag(function(): ecs.Entity
		return shared_with() or entity
	end, c.auto_reload)

	--- One toggle per holder, marked while it is open. Several can be open at once, the story
	--- shows up in the first one of them and the others wait empty
	local function holder_items(order: number)
		local items = {}
		for index, entry in HOLDERS do
			local open = holders[entry.kind] :: Reactive<boolean>
			table.insert(
				items,
				dropdown_item {
					order = order + index,
					text = entry.text,
					icon = function(): string?
						return if open() then IMAGES.dot else nil
					end,
					disabled = function()
						return entry.kind == "widget" and not has_plugin
					end,
					activated = popup.action(function()
						previews.toggle_holder(world, entity, entry.kind)
					end),
				}
			)
		end
		return items
	end

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
			holder_items(1),
			dropdown_item {
				order = 4,
				text = function()
					return if hidden() then "Show" else "Hide"
				end,
				activated = popup.action(function()
					previews.toggle_hidden(world, entity)
				end),
			},
			dropdown_divider { order = 5 },
			dropdown_item {
				order = 6,
				text = "Reload",
				activated = popup.action(function()
					previews.reload(world, entity)
				end),
			},
			dropdown_item {
				order = 7,
				text = "Auto Reload",
				icon = function(): string?
					return if auto_reload() then IMAGES.dot else nil
				end,
				activated = popup.action(function()
					previews.toggle_auto_reload(world, entity)
				end),
			},
			dropdown_item {
				order = 8,
				text = "Create Snapshot",
				-- nothing to copy while the story is not mounted (loading or errored)
				disabled = function()
					return previews.story_root(world, entity) == nil
				end,
				activated = popup.action(function()
					previews.snapshot(world, entity)
				end),
			},
			dropdown_divider { order = 9 },
			dropdown_item {
				order = 10,
				text = "Reset Position",
				activated = popup.action(function()
					previews.reset_position(world, entity)
				end),
			},
			dropdown_item {
				order = 11,
				text = "Reset Zoom",
				activated = popup.action(function()
					previews.reset_zoom(world, entity)
				end),
			},
		},
	}
end

return tab_dropdown
