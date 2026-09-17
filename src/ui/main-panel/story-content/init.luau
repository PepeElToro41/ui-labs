local use_world = require "@contexts/world/use-world"
local use_query = require "@hooks/use-query"
local vide = require "@pkg/vide"
local c = require "@src/components"
local div = require "@ui/styles/div"
local flex_fill = require "@ui/styles/flex-fill"
local story_holder = require "@self/story-holder"

--- Hosts one holder frame per preview, where the mounted stories render
local function story_content(props: {}?)
	local world = use_world()

	local entities = use_query(world.query():with(c.story_preview))

	return div {
		Name = "content",

		flex_fill(),
		vide.values(entities, function(entity)
			return story_holder { entity = entity }
		end),
	}
end

return story_content
