local HttpService = game:GetService("HttpService")
local Dictionary = require("@pkg/sift").Dictionary
local Immut = require("@pkg/immut")
local HotReloader = require("@utils/hmr/hot-reloader")
local Charm = require("@pkg/charm")

local StoryPreviews = require("./")
local Consumers = require("./consume")

type StoryPreview = StoryPreviews.StoryPreview
type HotReloader = HotReloader.HotReloader

--[[
   Creates a new story preview entry and returns it. This entry is not added to the store.
   @param module The module of the story preview.
   @param order The order of the story preview. If not provided, it will be set to the next available order.
]]
function CreateNewPreview(module: ModuleScript, order: number?)
	local uid = HttpService:GenerateGUID(false)

	local newEntry: StoryPreview = {
		Key = uid,
		UID = uid,
		Module = module,
		Order = order or (Consumers.PreviewsAmount() + 1),

		InWidget = false,
		InViewport = false,
		Hidden = true,
		AutoReload = false,

		Zoom = 100,
		Offset = Vector2.zero,

		ContextTabs = {},
	}

	return newEntry
end

--[[
   Adds a story preview to the store. It retrieves the key of the entry.
   @param entry The story preview entry to add.
]]
function AddStoryPreview(entry: StoryPreview)
	StoryPreviews(function(previews)
		return Dictionary.set(previews, entry.Key, entry)
	end)
end

--[[
   Removes a story preview from the store. This matches both the key and the UID.
   @param key The key of the story preview to remove.
]]
function RemoveStoryPreview(key: string)
	StoryPreviews(function(previews)
		return Dictionary.filter(previews, function(entry)
			return entry.Key ~= key and entry.UID ~= key
		end)
	end)
end

--[[
   Creates a previews map from an array of ordered previews.
   It re-assigns the `Order` key for each preview based on the array index.
]]
function FromOrderedPreviewsList(list: Array<StoryPreview>)
	local previews: Map<string, StoryPreview> = {}

	for index, preview in ipairs(list) do
		local mutable = table.clone(preview)
		mutable.Order = index
		previews[preview.Key] = mutable
	end

	return previews
end

--[[
   Binds a hot reloader to a story preview.
]]

function UpdateStoryPreview(key: string, updater: (preview: StoryPreview) -> StoryPreview)
	local preview = Consumers.StoryPreview(key)
	if not preview then return end

	local newPreview = updater(preview)
	AddStoryPreview(newPreview)
end

function PatchStoryPreview(key: string, patch: Map<string, any>)
	UpdateStoryPreview(key, function(preview)
		return Dictionary.merge(preview, patch)
	end)
end

function AddContextTab(key: string, tabId: any, tabDisplay: string, tabRender: () -> any)
	local entry = Consumers.StoryPreview(key)
	if not entry then return end

	StoryPreviews(function(previews)
		local newEntry = Immut.produce(entry, function(draft)
			draft.ContextTabs[tabId] = {
				Display = tabDisplay,
				Render = tabRender,
			}
			return draft
		end)

		return Dictionary.set(previews, entry.Key, newEntry)
	end)
end

return table.freeze {
	CreateNewPreview = CreateNewPreview,
	AddStoryPreview = AddStoryPreview,
	RemoveStoryPreview = RemoveStoryPreview,
	UpdateStoryPreview = UpdateStoryPreview,
	PatchStoryPreview = PatchStoryPreview,
	AddContextTab = AddContextTab,
	FromOrderedPreviewsList = FromOrderedPreviewsList,
}
