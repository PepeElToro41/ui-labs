local CONFIG = require "@constants/config"
local use_theme = require "@contexts/theme/use-theme"
local use_world = require "@contexts/world/use-world"
local use_component = require "@hooks/use-component"
local use_holders = require "@hooks/use-holders"
local use_instance_name = require "@hooks/use-instance-name"
local use_tag = require "@hooks/use-tag"
local vide = require "@pkg/vide"
local c = require "@src/components"
local module_search = require "@src/systems/module-search"
local themes = require "@themes"
local div = require "@ui/styles/div"
local text = require "@ui/styles/text"
local videx = require "@utils/vide/videx"
local ecs = require "@vendor/ecs"
local story_holders = require "./holders"

local STORY_SUFFIX = CONFIG.file_extensions.story

-- shown in the slot a preview leaves behind when its story is shown somewhere else
local AWAY_LABELS: { [c.HolderType]: string } = {
	viewport = "This story is rendering in the viewport",
	widget = "This story is rendering in its own widget",
}

type StoryHolderProps = {
	entity: ecs.Entity,
}

--- Owns the frame the story of one preview is mounted in and publishes it as
--- `preview_holder`. The mounters render the story under it, the holders decide where it is
--- shown (see `holders`) and the slot built here is the editor one of those places.
---
--- Every preview keeps its slot drawn, so all the open stories are shown at once, stacked in
--- the order of their tabs: `preview_order` is the `ZIndex` of the slot, so the last tab is
--- the one on top
local function story_holder(props: StoryHolderProps)
	local world = use_world()
	local theme = use_theme()
	local entity = props.entity

	local module = use_component(entity, c.module_script)
	local module_name = use_instance_name(module)
	local selected = use_tag(entity, c.selected_preview)
	local order = use_component(entity, c.preview_order)

	local name = function()
		return module_search.remove_extension(module_name(), STORY_SUFFIX)
	end

	local holders = use_holders(entity)
	local away = function()
		return holders.active() ~= "editor"
	end

	local hidden = use_tag(entity, c.hidden)

	-- parented by the holders, never here: moving it between them takes the running story
	-- along, which is the whole point of having more than one.
	-- Hiding the preview makes this frame invisible, so the story is hidden in whichever
	-- holder it ended up in and keeps running either way
	local holder = div {
		Name = name,
		Visible = function()
			return not hidden()
		end,
	}

	local slot = div {
		Name = "preview",
		-- the tab order is the draw order of the stories, previews keep their slot drawn
		ZIndex = function()
			return order() or 0
		end,

		-- only the selected tab says where its story went: the slot it leaves behind is
		-- transparent, and the stories of the other previews are drawn through it
		videx.show(function()
			return away() and selected()
		end, function()
			return text {
				Name = "away",
				Size = UDim2.fromScale(1, 1),
				Text = function()
					return AWAY_LABELS[holders.active()] or ""
				end,
				TextColor3 = theme(themes.text3),
				TextWrapped = true,
			}
		end),
	}

	story_holders {
		entity = entity,
		holder = holder,
		slot = slot,
		name = name,
		viewport = holders.viewport,
		widget = holders.widget,
		active = holders.active,
	}

	if world.exists(entity) then
		world.set(entity, c.preview_holder, holder)
	end

	-- removing the component first lets the mounters unmount while the frame is alive;
	-- on `world.delete` the removed hook already ran, so a dying entity is left alone
	vide.cleanup(function()
		if not world.exists(entity) or world.deleting(entity) then
			return
		end
		if world.get(entity, c.preview_holder) == holder then
			world.remove(entity, c.preview_holder)
		end
	end)
	-- vide.values only unparents removed children, both frames have to be destroyed here.
	-- The story frame goes wherever its holder took it, so it is destroyed on its own
	vide.cleanup(slot)
	vide.cleanup(holder)

	return slot
end

return story_holder
