local Vide = require "@pkg/vide"
local UILabs = require("@pkg/ui-labs")
local WARNINGS = require("@constants/warnings")

local create = Vide.create
local cleanup = Vide.cleanup
local effect = Vide.effect
local untrack = Vide.untrack

local StoryPreviews = require("@store/story-previews")
local PreviewsDispatchers = require("@store/story-previews/dispatch")

local useStoryRequire = require("./story-require")
local single = require("@utils/vide").single
local MiscUtils = require("@utils/misc")
local UILabsWarn = MiscUtils.UILabsWarn

local Functional = require("./mounters/functional")
local HolderController = require("./holders")

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

	single(result, function(result)
		if result == nil then return UILabsWarn(WARNINGS.NoStory) :: nil end

		if typeof(result) == "function" then
			Functional({
				Entry = props.Preview,
				Result = result :: any,
				MountFrame = mountFrame,
			})
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
