local Vide = require "@pkg/vide"
local CONFIGS = require "@constants/configs"
local RemoveExtension = require("@contexts/module-search/utils").RemoveExtension

local StoryPreviews = require "@store/story-previews"
local Div = require "@base/div"
local Padding = require "@base/padding"
local Shadow = require "@ui/elements/shadow"

type StoryPreview = StoryPreviews.StoryPreview

local create = Vide.create
local cleanup = Vide.cleanup

function EditorHolder(preview: Reactive<StoryPreview>)
	local module = preview().Module
	local scale = function()
		return preview().Zoom / 100
	end
	local position = function()
		local offset = preview().Offset
		return UDim2.fromOffset(offset.X, offset.Y)
	end

	local mountHolder = Div {
		Name = "Story",
	}

	local editor = Div {
		Name = RemoveExtension(module.Name, CONFIGS.Extensions.Story),
		Position = position,

		create "UIScale" { Scale = scale },
		Padding { Padding = 2 },

		mountHolder,
	}

	cleanup(function()
		task.defer(function() -- should give time for re-parenting
			editor:Destroy()
		end)
	end)

	return editor
end

return EditorHolder
