local Types = require("./types")
local DefineStoryType = require("./define")

type StoryCheck = Types.StoryCheck

function CheckFunctionalStory(story: unknown)
	return type(story) == "function"
end

function CheckObjectStory(story: unknown)
	return type(story) == "table"
end

function CheckStory(story: unknown): StoryCheck
	if CheckFunctionalStory(story) then
		return {
			Success = true,
			Type = "Functional",
		}
	elseif CheckObjectStory(story) then
		return DefineStoryType(story :: Map<string, unknown>)
	end
	return {
		Success = false,
		Error = `Story return is an invalid type: ${type(story)}`,
	}
end

return CheckStory
