local Vide = require "@pkg/vide"
local StoryPreviews = require("@store/story-previews")
local key = require("@utils/vide/derivers").key

local Widget = require("./holder-types/widget")
local Viewport = require("./holder-types/viewport")
local Editor = require("./holder-types/editor")

local show = Vide.show
local effect = Vide.effect

type StoryPreview = StoryPreviews.StoryPreview
type HolderSetter = (holder: Frame) -> ()

function HolderController(preview: Reactive<StoryPreview>, holder: Frame)
	local function Use(holderType: (preview: Reactive<StoryPreview>) -> HolderSetter)
		return function(holder: Frame)
			return holderType(preview)
		end
	end

	local mainSetter: Reactive<HolderSetter> = show(key(preview, "InWidget"), Use(Widget), Use(Editor))
	local viewportSetter: Reactive<HolderSetter?> = show(key(preview, "InViewport"), Use(Viewport), nil)

	effect(function()
		if preview().InViewport then
			local viewportSetter = viewportSetter()
			if viewportSetter then viewportSetter(holder) end
		else
			mainSetter()(holder)
		end
	end)
end

return HolderController
