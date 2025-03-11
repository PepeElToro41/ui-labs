local Vide = require "@pkg/vide"
local useInstanceSearch = require "./search"
local Utils = require "./utils"
local CONFIGS = require "@constants/configs"

type ModuleSearchContext = {
	Stories: Source<{ ModuleScript }>,
	Storybooks: Source<{ ModuleScript }>,
}

local ModuleSearchContext: Vide.Context<ModuleSearchContext> = Vide.context()

--- Searches for modulescripts in the game hierarchy and provides them in a list
function ModuleSearchProvider(props: ProviderChildren)
	local stories = useInstanceSearch("ModuleScript", Utils.ExtensionPredicator(CONFIGS.Extensions.Story))
	local storybooks = useInstanceSearch("ModuleScript", Utils.ExtensionPredicator(CONFIGS.Extensions.Storybook))

	local context = {
		Stories = stories,
		Storybooks = storybooks,
	}

	return ModuleSearchContext(context :: any, props.children)
end

function useModuleList()
	return ModuleSearchContext()
end

function useStoryModules()
	return ModuleSearchContext().Stories
end

function useStorybookModules()
	return ModuleSearchContext().Storybooks
end

return table.freeze {
	ModuleSearchProvider = ModuleSearchProvider,
	useModuleList = useModuleList,
	useStoryModules = useStoryModules,
	useStorybookModules = useStorybookModules,
}
