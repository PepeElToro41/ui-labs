local use_world = require "@contexts/world/use-world"
local use_component = require "@hooks/use-component"
local use_query = require "@hooks/use-query"
local c = require "@src/components"
local ecs = require "@vendor/ecs"

export type StoryInfo = {
	--- the selected preview, the owner of the controls
	preview: Reactive<ecs.Entity?>,
	--- nil when the story has none, functional stories never have one
	summary: Reactive<string?>,
	has_controls: Reactive<boolean>,
	--- the story has something to show in the action panel
	available: Reactive<boolean>,
}

--- What the selected preview's story offers to the action panel
local function use_story_info(): StoryInfo
	local world = use_world()

	local selected = use_query(world.query():with(c.story_preview, c.selected_preview))
	local preview = function(): ecs.Entity?
		return selected()[1]
	end
	local result = use_component(preview :: Reactive<ecs.Entity>, c.module_result)

	local summary = function(): string?
		local story = result() :: any
		if type(story) ~= "table" or type(story.summary) ~= "string" or story.summary == "" then
			return nil
		end
		return story.summary
	end

	-- controls and control groups both carry a name, they only exist while the story is mounted
	local controls = use_query(function()
		local entity = preview()
		if not entity then
			return nil
		end
		return world.query():with(c.control_name, ecs.pair(ecs.ChildOf, entity))
	end)
	local has_controls = function()
		return #controls() > 0
	end

	return {
		preview = preview,
		summary = summary,
		has_controls = has_controls,
		available = function()
			return summary() ~= nil or has_controls()
		end,
	}
end

return use_story_info
