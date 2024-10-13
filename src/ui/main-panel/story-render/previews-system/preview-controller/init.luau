local Vide = require "@pkg/vide"
local StoryPreviews = require("@store/story-previews")
local PreviewsDispatchers = require("@store/story-previews/dispatch")
local HolderController = require("./holders")
local UILabs = require("@pkg/ui-labs")

local useStoryRequire = require("./story-require")
local single = require("@utils/vide").single

local create = Vide.create
local cleanup = Vide.cleanup
local effect = Vide.effect
local untrack = Vide.untrack

type StoryPreview = StoryPreviews.StoryPreview

type PreviewControllerProps = {
	Preview: Reactive<StoryPreview>,
}

function PreviewController(props: PreviewControllerProps)
	local key = props.Preview().Key
	local result, reloader = useStoryRequire(props.Preview)

	local mountFrame = create "Frame" {
		Size = UDim2.new(1, 0, 1, 0),
		BackgroundTransparency = 1,
	}

	effect(function()
		PreviewsDispatchers.PatchStoryPreview(key, {
			HotReloader = reloader,
			Holder = mountFrame,
		})
	end)

	HolderController(props.Preview, mountFrame)

	local renderedStory = single(result, function(result)
		if result == nil then return nil end
		if typeof(result) == "function" then
			local unmounter = (result :: UILabs.FunctionStory)(mountFrame)
			cleanup(unmounter)
		end
		return nil
	end)

	--

	cleanup(function()
		mountFrame:Destroy()
	end)

	return mountFrame
end

return PreviewController
