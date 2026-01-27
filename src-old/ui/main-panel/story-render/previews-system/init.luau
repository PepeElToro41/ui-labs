local memo_indexes = require("@utils/vide").memo_indexes

local useAtom = require("@utils/charm").useAtom
local MappedPreviews = require("@store/story-previews/consume").MappedPreviews

local PreviewController = require "./preview-controller"

function PreviewsSystem()
	local previews = useAtom(MappedPreviews)

	-- using memo_indexes to avoid infinite loop, because PreviewController updates previews instantly
	return memo_indexes(previews, function(preview, uid)
		return PreviewController { Preview = preview }
	end)
end

return PreviewsSystem
