local Vide = require "@pkg/vide"
local Signal = require "@pkg/signal"

type Connection = Signal.Connection<any>

local StorybookLoader = require "./loader"
local useStorybookModules = require("@contexts/module-search").useStorybookModules

local source = Vide.source
local values = Vide.values
local cleanup = Vide.cleanup
local effect = Vide.effect
local untrack = Vide.untrack

export type Storybooks = { [ModuleScript]: any }

type StorybooksContext = Source<Storybooks>
local StorybooksContext: Vide.Context<StorybooksContext> = Vide.context()

--- Hot reloads storybooks from `module-search` and provides the results in a list
function StorybooksProvider(props: ProviderChildren)
	local storybooks: StorybooksContext = source {}
	local storybookModules = useStorybookModules()

	local loaders = values(storybookModules, function(module)
		local loader = StorybookLoader.new(module)
		loader:Init()

		cleanup(loader)
		return loader
	end)

	-- collapsing results
	local function CollapseStorybookResults()
		local results: Storybooks = {}

		for _, loader in ipairs(loaders()) do
			local result = loader:GetCurrentResult()
			if not result then continue end

			results[loader.Module] = result
		end
		storybooks(results)
		return nil
	end

	effect(function()
		for _, loader in ipairs(loaders()) do
			Vide.cleanup(loader.OnStorybookUpdated:Connect(function()
				untrack(CollapseStorybookResults)
			end))
		end

		untrack(CollapseStorybookResults)
	end)

	return StorybooksContext(storybooks, props.children)
end

function useStorybooks()
	return StorybooksContext()
end

return table.freeze {
	StorybooksProvider = StorybooksProvider,
	useStorybooks = useStorybooks,
}
