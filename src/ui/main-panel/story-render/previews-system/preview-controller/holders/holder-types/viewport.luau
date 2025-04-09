local CoreGui = game:GetService "CoreGui"

local Vide = require "@pkg/vide"
local StoryPreviews = require "@store/story-previews"
local Div = require "@base/div"

type StoryPreview = StoryPreviews.StoryPreview

local create = Vide.create
local cleanup = Vide.cleanup

function ViewportHolder(preview: Reactive<StoryPreview>)
	local module = preview().Module

	local mountHolder = Div { Name = "Story" }

	local viewport = create "ScreenGui" {
		Name = module.Name,
		Parent = CoreGui,
		ZIndexBehavior = Enum.ZIndexBehavior.Sibling,
		mountHolder,
	}

	cleanup(function()
		task.defer(function() -- should give time for re-parenting
			viewport:Destroy()
		end)
	end)

	return mountHolder
end

return ViewportHolder
