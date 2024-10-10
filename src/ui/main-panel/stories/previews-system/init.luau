local Vide = require "@pkg/vide"
local memo_indexes = require("@utils/vide").memo_indexes

local derive = Vide.derive
local indexes = Vide.indexes

local useAtom = require("@utils/charm").useAtom
local StoryPreviews = require("@store/story-previews")
local Consumers = require("@store/story-previews/consume")

local PreviewController = require "./preview-controller"

type StoryPreview = StoryPreviews.StoryPreview

function PreviewsSystem()
	local previews = useAtom(StoryPreviews)

	local previewsList = derive(function()
		local list: Map<string, StoryPreview> = {}
		for _, preview in pairs(previews()) do
			list[preview.UID] = preview
		end
		return list
	end)

	-- using memo_indexes to avoid infinite loop, because PreviewController updates previewsList instantly
	return memo_indexes(previewsList, function(preview, uid)
		return PreviewController { Preview = preview }
	end)
end

return PreviewsSystem
