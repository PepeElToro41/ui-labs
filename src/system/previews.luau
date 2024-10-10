local Charm = require("@pkg/charm")

local CONFIGS = require("@constants/configs")

local StoryPreviews = require("@store/story-previews")
local PreviewDispatchers = require("@store/story-previews/dispatch")
local PreviewConsumers = require("@store/story-previews/consume")

function MountRootStory(module: ModuleScript)
	local root = PreviewConsumers.RootPreview()
	local order = root and root.Order

	local newEntry = PreviewDispatchers.CreateNewPreview(module, order)
	newEntry.Key = CONFIGS.RootPreviewKey

	-- TODO: Recover last "View In Viewport" state
	PreviewDispatchers.AddStoryPreview(newEntry)
end

function ToggleRootStory(module: ModuleScript)
	local rootPreview = PreviewConsumers.StoryPreview(CONFIGS.RootPreviewKey)

	if rootPreview and rootPreview.Module == module then
		PreviewDispatchers.RemoveStoryPreview(rootPreview.Key)
	else
		MountRootStory(module)
	end
end

function MountOnTop(module: ModuleScript)
	local newEntry = PreviewDispatchers.CreateNewPreview(module)
	PreviewDispatchers.AddStoryPreview(newEntry)
end

function MountInWidget()
	local newEntry = PreviewDispatchers.CreateNewPreview(script)
	newEntry.InWidget = true
	newEntry.InViewport = false

	PreviewDispatchers.AddStoryPreview(newEntry)
end

function UnmountAll(module: ModuleScript?)
	local previews = StoryPreviews()

	if not module then StoryPreviews({}) end
	Charm.batch(function()
		for _, preview in pairs(previews) do
			if preview.Module == module then PreviewDispatchers.RemoveStoryPreview(preview.Key) end
		end
	end)
end

function ShiftOrder(key: string, delta: number)
	local preview = PreviewConsumers.StoryPreview(key)
	if not preview then return end

	local ordered = PreviewConsumers.OrderedPreviewsList()
	local finalIndex = math.clamp(preview.Order + delta, 1, #ordered)
	if finalIndex == preview.Order then return end

	local shiftPreview = ordered[finalIndex]
	ordered[finalIndex] = ordered[preview.Order]
	ordered[preview.Order] = shiftPreview

	PreviewDispatchers.FromOrderedPreviewsList(ordered)
end

return table.freeze {
	MountRootStory = MountRootStory,
	ToggleRootStory = ToggleRootStory,
	MountOnTop = MountOnTop,
	MountInWidget = MountInWidget,
	UnmountAll = UnmountAll,
	ShiftOrder = ShiftOrder,
}
