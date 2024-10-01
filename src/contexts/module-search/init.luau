local Vide = require "@pkg/vide"
local useInstanceSearch = require "./search"
local Utils = require "./utils"
local CONFIGS = require "@constants/configs"

type ModuleSearchContext = {
	Stories: Vide.Source<{ ModuleScript }>,
	Storybooks: Vide.Source<{ ModuleScript }>,
}

local ModuleSearchContext: Vide.Context<ModuleSearchContext> = Vide.create_context()

-- This provider searches for modulescripts in the hierarchy and provides them in a list
function ModuleSearchProvider(props: ProviderChildren)
	local stories = useInstanceSearch("ModuleScript", Utils.ExtensionPredicator(CONFIGS.Extensions.Story))
	local storybooks = useInstanceSearch("ModuleScript", Utils.ExtensionPredicator(CONFIGS.Extensions.Storybook))

	local context = {
		Stories = stories,
		Storybooks = storybooks,
	}

	return ModuleSearchContext.provide(context, props.children)
end

function useModuleList()
	return ModuleSearchContext.consume()
end

function useStoryModules()
	return ModuleSearchContext.consume().Stories
end

function useStorybookModules()
	return ModuleSearchContext.consume().Storybooks
end

return table.freeze {
	ModuleSearchProvider = ModuleSearchProvider,
	useModuleList = useModuleList,
	useStoryModules = useStoryModules,
	useStorybookModules = useStorybookModules,
}
