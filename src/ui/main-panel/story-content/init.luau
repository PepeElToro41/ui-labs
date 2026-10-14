local use_world = require "@contexts/world/use-world"
local use_query = require "@hooks/use-query"
local vide = require "@pkg/vide"
local c = require "@src/components"
local div = require "@ui/styles/div"
local ecs = require "@vendor/ecs"
local story_holder = require "@self/story-holder"
local view_listener = require "@self/view-listener"

type StoryContentProps = {
	--- the selected preview, ctrl + drag / scroll moves and zooms it
	preview: Reactive<ecs.Entity?>,
}

--- Hosts one holder frame per preview, where the mounted stories render. Every preview is
--- drawn, the holders stack by tab order inside a frame of their own so the draw order of
--- the stories never reaches what is laid over them
local function story_content(props: StoryContentProps)
	local world = use_world()

	local entities = use_query(world.query():with(c.story_preview))

	return div {
		Name = "content",

		div {
			Name = "previews",

			vide.values(entities, function(entity)
				return story_holder { entity = entity }
			end),
		},
		view_listener { preview = props.preview },
	}
end

return story_content
