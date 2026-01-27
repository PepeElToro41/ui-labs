local Vide = require "@pkg/vide"
local StoryPreviews = require "@store/story-previews"
local HotReloader = require "@utils/hmr/hot-reloader"
local Promise = require "@pkg/promise"
local WARNINGS = require "@constants/warnings"
local UILabsWarn = require("@utils/misc").UILabsWarn

local single = require("@utils/vide").single
local useAsync = require("@hooks").useAsync

local cleanup = Vide.cleanup
local source = Vide.source
local effect = Vide.effect
local derive = Vide.derive

type StoryPreview = StoryPreviews.StoryPreview
type HotReloader = HotReloader.HotReloader
type Promise<T = any> = Promise.TypedPromise<T>
type Source<T> = Vide.Source<T>

function useStoryRequire(entry: Reactive<StoryPreview>)
	local module = function()
		return entry().Module
	end

	local reloader: Reactive<HotReloader> = single(module, function(module)
		local reloader = HotReloader.new(module)
		cleanup(reloader)
		return reloader
	end)

	local reloadAsync: Source<Promise> = source()

	effect(function()
		local reloader = reloader()

		reloadAsync(reloader:Reload())
		local connection = reloader.OnReloadStarted:Connect(function(promise)
			reloadAsync(promise)
		end)
		cleanup(function()
			connection:Disconnect()
		end)
	end)

	local result: Reactive<unknown>, status = useAsync(function()
		local reloadAsync = reloadAsync()
		if not reloadAsync then return Promise.resolve(nil) end
		return reloadAsync:catch(function(err)
			UILabsWarn(WARNINGS.RequireError, err)
			error(err)
		end)
	end)

	return result, reloader, status
end

return useStoryRequire
