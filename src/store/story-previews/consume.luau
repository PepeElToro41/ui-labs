local Charm = require("@pkg/charm")
local StoryPreviews = require("./")
local CONFIGS = require("@constants/configs")

type StoryPreview = StoryPreviews.StoryPreview

--[[
   Returns the story preview with the given key. This matches both the key and the UID.
   @param key The key of the story preview.
]]
function StoryPreview(key: string): StoryPreview?
	local previews = StoryPreviews()

	for key, preview in pairs(previews) do
		if preview.Key == key then return preview end
		if preview.UID == key then return preview end
	end

	return nil
end

local MappedPreviews = Charm.computed(function()
	local map: Map<string, StoryPreview> = {}
	for _, preview in pairs(StoryPreviews()) do
		map[preview.UID] = preview
	end
	return map
end)

--[[
   Returns the root story preview.
]]
function RootPreview(): StoryPreview?
	return StoryPreview(CONFIGS.RootPreviewKey)
end

--[[
   Returns the amount of story previews.
   @param module If provided, only counts the story previews of the given module.
]]
function PreviewsAmount(module: ModuleScript?): number
	local previews = StoryPreviews()

	local amount = 0
	for _, preview in pairs(previews) do
		if module then
			if preview.Module == module then
				amount += 1
			end
		else
			amount += 1
		end
	end
	return amount
end

--[[
   Returns an array of the story previews that is ordered by their Order key.
]]
function OrderedPreviewsList()
	local previews = StoryPreviews()
	local list: Array<StoryPreview> = {}

	for _, preview in pairs(previews) do
		table.insert(list, preview)
	end

	table.sort(list, function(a, b)
		return a.Order < b.Order
	end)

	return list
end

return table.freeze {
	MappedPreviews = MappedPreviews,
	StoryPreview = StoryPreview,
	RootPreview = RootPreview,
	PreviewsAmount = PreviewsAmount,
	OrderedPreviewsList = OrderedPreviewsList,
}
