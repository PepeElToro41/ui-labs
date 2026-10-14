local Selection = game:GetService "Selection"

local use_popup = require "@contexts/app-render/use-popup"
local use_plugin = require "@contexts/plugin/use-plugin"
local use_world = require "@contexts/world/use-world"
local use_query = require "@hooks/use-query"
local c = require "@src/components"
local previews = require "@src/systems/previews"
local dropdown_divider = require "@ui/overlays/dropdown/divider"
local dropdown_item = require "@ui/overlays/dropdown/item"
local dropdown_popup = require "@ui/overlays/dropdown/popup"
local ecs = require "@vendor/ecs"

type StoryDropdownProps = {
	node: ecs.Entity,
	position: Vector2,
	popup: use_popup.Popup,
}

--- Right click menu of a story node
local function story_dropdown(props: StoryDropdownProps)
	local world = use_world()
	local node = props.node
	local popup = props.popup

	-- widgets belong to the plugin, the app rendered inside a story has none to give out
	local has_plugin = use_plugin().plugin ~= nil

	local mounted_amount = use_query(world.query(c.story_preview):with(ecs.pair(ecs.ChildOf, props.node)))
	
	local quick_mounted = use_query(world.query():with(c.story_preview, c.quick_mounted, ecs.pair(ecs.ChildOf, node)))
	local is_quick = function()
		return #quick_mounted() > 0
	end

	-- the active tab lends its environment to "Mount In Environment", with no tab open there
	-- is nothing to share
	local selected = use_query(world.query():with(c.story_preview, c.selected_preview))
	local function selected_preview(): ecs.Entity?
		return selected()[1]
	end

	-- the story module behind the node, selected in the explorer
	local function select_module()
		local story = world.target(node, c.r_module)
		local module = story and world.get(story, c.module_script)
		if module then
			Selection:Set { module }
		end
	end

	return dropdown_popup {
		position = props.position,
		children = {
			dropdown_item {
				order = 1,
				text = "Mount Story",
				disabled = is_quick,
				activated = popup.action(function()
					previews.quick_mount(world, node)
				end),
			},
			dropdown_item {
				order = 2,
				text = "Mount On Top",
				activated = popup.action(function()
					previews.mount(world, node)
				end),
			},
			dropdown_item {
				order = 3,
				text = "Mount In Widget",
				disabled = function()
					return not has_plugin
				end,
				activated = popup.action(function()
					local preview = previews.mount(world, node)
					if preview then
						previews.show_in(world, preview, "widget")
					end
				end),
			},
			dropdown_item {
				order = 4,
				text = "Mount In Environment",
				disabled = function()
					return selected_preview() == nil
				end,
				activated = popup.action(function()
					local source = selected_preview()
					if source then
						previews.mount_shared(world, node, source)
					end
				end),
			},
			dropdown_divider { order = 5 },
			dropdown_item {
				order = 6,
				text = "Select Module",
				activated = popup.action(select_module),
			},
			dropdown_item {
				order = 7,
				text = "Unmount All",
				disabled = function()
					return #mounted_amount() <= 0
				end,	
				activated = popup.action(function()
					previews.unmount_node(world, node)
				end),
			},
		},
	}
end

return story_dropdown
