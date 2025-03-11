local Vide = require "@pkg/vide"
local UILabs = require("@pkg/ui-labs")
local WARNINGS = require("@constants/warnings")
local Types = require("./mounters/types")

local create = Vide.create
local cleanup = Vide.cleanup
local effect = Vide.effect
local untrack = Vide.untrack

local StoryPreviews = require("@store/story-previews")
local PreviewsDispatchers = require("@store/story-previews/dispatch")

local useStoryRequire = require("./story-require")
local single = require("@utils/vide").single
local MiscUtils = require("@utils/misc")
local CheckStory = require("./checking/checker")
local UILabsWarn = MiscUtils.UILabsWarn

local Functional = require("./mounters/functional")
local HolderController = require("./holders")
local Mounters = require("./mounters")

type StoryPreview = StoryPreviews.StoryPreview
type MounterProps<T> = Types.MounterProps<T>

type PreviewControllerProps = {
	Preview: Reactive<StoryPreview>,
}

function PreviewController(props: PreviewControllerProps)
	local key = props.Preview().Key
	local result, reloader, status = useStoryRequire(props.Preview)

	local target = create "Frame" {
		Size = UDim2.new(1, 0, 1, 0),
		BackgroundTransparency = 1,
	}

	effect(function()
		PreviewsDispatchers.PatchStoryPreview(key, { -- registrying the hot-reloader and holder
			HotReloader = reloader(),
			Holder = target,
		})
	end)

	local holder = HolderController(props.Preview, target)

	single(result, function(result)
		if untrack(status) == "Rejected" then return nil end
		if result == nil and untrack(status) ~= "Rejected" then
			UILabsWarn(WARNINGS.NoStory)
			return nil
		end

		local checkInfo = CheckStory(result)
		if not checkInfo.Success then
			UILabsWarn(checkInfo.Error)
			return nil
		end

		-- TODO: Clear output on reload

		local Mounter = Mounters[checkInfo.Type] :: (props: MounterProps<any>) -> nil

		untrack(function()
			return Mounter {
				Entry = props.Preview,
				Result = result,
				Target = target,
			}
		end)

		return nil
	end)

	--

	cleanup(function()
		target:Destroy()
	end)

	return holder
end

return PreviewController
