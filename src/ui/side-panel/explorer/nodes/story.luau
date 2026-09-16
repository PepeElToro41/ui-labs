local use_theme = require "@contexts/theme/use-theme"
local vide = require "@pkg/vide"

type StoryNodeProps = {}

function story_node(props: StoryNodeProps)
	local theme = use_theme()
	local hovered = vide.source(false)
	local name = vide.source "test"
end

return story_node
