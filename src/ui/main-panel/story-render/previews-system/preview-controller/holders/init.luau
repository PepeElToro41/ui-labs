local Vide = require "@pkg/vide"
local StoryPreviews = require "@store/story-previews"
local key = require("@utils/vide/derivers").key

local Widget = require "./holder-types/widget"
local Viewport = require "./holder-types/viewport"
local Editor = require "./holder-types/editor"

local show = Vide.show
local derive = Vide.derive

type StoryPreview = StoryPreviews.StoryPreview

function HolderController(preview: Reactive<StoryPreview>, holder: Frame)
	local function Use(holderType: (preview: Reactive<StoryPreview>) -> GuiBase2d)
		return function()
			return holderType(preview)
		end
	end

	local mainHolder = show(key(preview, "InWidget"), Use(Widget), Use(Editor))
	local viewportHolder = show(key(preview, "InViewport"), Use(Viewport), function()
		return nil
	end)

	local instance = derive(function(): GuiBase2d?
		local preview = preview()

		if preview.InViewport then
			holder.Parent = viewportHolder()
			return nil
		else
			holder.Parent = mainHolder()
			if preview.InWidget then return nil end

			return mainHolder()
		end
	end)

	return instance
end

return HolderController
