local CONFIG = require "@constants/config"
local use_world = require "@contexts/world/use-world"
local use_component = require "@hooks/use-component"
local use_instance_name = require "@hooks/use-instance-name"
local use_tag = require "@hooks/use-tag"
local vide = require "@pkg/vide"
local c = require "@src/components"
local module_search = require "@src/systems/module-search"
local div = require "@ui/styles/div"
local ecs = require "@vendor/ecs"

local STORY_SUFFIX = CONFIG.file_extensions.story

type StoryHolderProps = {
	entity: ecs.Entity,
}

--- Owns the holder frame of one preview and publishes it as `preview_holder`.
--- The mounters system parents the story under it; only the selected preview is visible.
local function story_holder(props: StoryHolderProps)
	local world = use_world()
	local entity = props.entity

	local module = use_component(entity, c.module_script)
	local module_name = use_instance_name(module)
	local selected = use_tag(entity, c.selected_preview)

	local name = function()
		return module_search.remove_extension(module_name(), STORY_SUFFIX)
	end

	local holder = div {
		Name = name,
	}

	local outer = div {
		Name = "preview",
		Visible = selected,

		holder,
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
	-- vide.values only unparents removed children, the frame has to be destroyed here
	vide.cleanup(outer)

	return outer
end

return story_holder
