local Selection = game:GetService "Selection"

local use_popup = require "@contexts/app-render/use-popup"
local use_world = require "@contexts/world/use-world"
local use_query = require "@hooks/use-query"
local c = require "@src/components"
local previews = require "@src/systems/previews"
local dropdown_divider = require "@ui/overlays/dropdown/divider"
local dropdown_item = require "@ui/overlays/dropdown/item"
local dropdown_popup = require "@ui/overlays/dropdown/popup"
local ecs = require "@vendor/ecs"

type StoryDropdownProps = {
	--- the story node the dropdown acts on
	node: ecs.Entity,
	--- absolute position the dropdown originates from
	position: Vector2,
	--- popup handle of the node, items close it before running
	popup: use_popup.Popup,
}

--- Right click menu of a story node
local function story_dropdown(props: StoryDropdownProps)
	local world = use_world()
	local node = props.node
	local popup = props.popup

	-- the quick preview already shows this story, mounting it again would only close it
	local quick_mounted = use_query(world.query():with(c.story_preview, c.quick_mounted, ecs.pair(ecs.ChildOf, node)))
	local is_quick = function()
		return #quick_mounted() > 0
	end

	-- the story module behind the node, selected in the explorer
	local function select_module()
		local story = world.target(node, c.r_module)
		local module = story and world.get(story, c.module_script)
		if module then
			Selection:Set({ module })
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
			dropdown_divider { order = 3 },
			dropdown_item {
				order = 4,
				text = "Select Module",
				activated = popup.action(select_module),
			},
		},
	}
end

return story_dropdown
