local Vide = require "@pkg/vide"
local useStoryModules = require("@contexts/module-search").useStoryModules
local useStorybooks = require("@contexts/storybooks").useStorybooks
local GenerateNodes = require("./utils").GenerateNodes

type Soruce<T> = Vide.Source<T>

local derive = Vide.derive

type StoryNodesContext = Reactive<{
	Nodes: RootNodes,
	Lookup: ModuleLookup,
}>

local StoryNodesContext: Vide.Context<StoryNodesContext> = Vide.create_context(nil)

-- This provider generates the story nodes from the story modules and storybooks
function StoryNodesProvider(props: ProviderChildren)
	local storyModules = useStoryModules()
	local storybooks = useStorybooks()

	local context = derive(function()
		return GenerateNodes(storyModules(), storybooks())
	end)

	return StoryNodesContext.provide(context, props.children)
end

function useStoryNodes()
	local context = StoryNodesContext.consume()
	return function()
		return context().Nodes
	end
end
function useStoryLookup()
	local context = StoryNodesContext.consume()
	return function()
		return context().Lookup
	end
end

return table.freeze {
	StoryNodesProvider = StoryNodesProvider,
	useStoryNodes = useStoryNodes,
	useStoryLookup = useStoryLookup,
}
