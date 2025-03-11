local t = require "@pkg/t"
local Dictionary = require("@pkg/sift").Dictionary
local Array = require("@pkg/collections").Array

local Types = require "./types"

type StoryCheck = Types.StoryCheck
type StoryError = Types.StoryError
type StoryType = Types.StoryType
type LibCheckReturn = Types.LibCheckReturn
type LibraryChecker = Types.LibraryChecker

-- TODO: Check for control type
local CONTROL_TYPE = t.map(t.strict, t.any)

local STORY_TYPE = {
	name = t.optional(t.string),
	summary = t.optional(t.string),
	use = t.optional(t.string),
	controls = t.optional(CONTROL_TYPE),
	cleanup = t.optional(t.callback),
}
local LIB_NAMES: Map<string, string> = {
	React = "React",
	Roact = "Roact",
	Fusion = "Fusion",
	Iris = "Iris",
	Vide = "Vide",
	Generic = "Generic",
}

local LibraryCheckers: Map<string, LibraryChecker> = {
	React = require("./libraries/react").Checker,
	Roact = require("./libraries/roact").Checker,
	Fusion = require("./libraries/fusion").Checker,
	Iris = require("./libraries/iris").Checker,
	Vide = require("./libraries/vide").Checker,
	Generic = require("./libraries/generic").Checker,
}
local LibraryKeys: Map<string, { string }> = {
	React = require("./libraries/react").Keys,
	Roact = require("./libraries/roact").Keys,
	Fusion = require("./libraries/fusion").Keys,
	Iris = require("./libraries/iris").Keys,
	Vide = require("./libraries/vide").Keys,
	Generic = require("./libraries/generic").Keys,
}
local AllKeys: Array<string> = Array.concat(unpack(Dictionary.values(LibraryKeys)))

type ErrorFormatter = (key: string) -> string
function CheckExtraKeys(story: Map<string, unknown>, keys: Array<string>, err: ErrorFormatter): "valid" | StoryError
	for key, check in pairs(story) do
		if check == nil then continue end
		if STORY_TYPE[key] ~= nil then continue end
		if key == "story" then continue end
		if Array.includes(keys, key) then continue end

		return {
			Success = false,
			Error = err(key),
		}
	end

	return "valid"
end

function DefineStoryType(story: Map<string, unknown>): StoryCheck
	-- step 1: check the common indexes
	for key, check in pairs(STORY_TYPE) do
		local value = story[key]
		if not check(value) then return {
			Success = false,
			Error = `Story key {key} is not valid`,
		} end
	end

	-- step 2: check the extra keys
	local extraResult = CheckExtraKeys(story, AllKeys, function(key)
		return `Unknown key "{key}" in story table`
	end)
	if extraResult ~= "valid" then return extraResult :: StoryError end

	-- step 3: check the libraries
	for libraryType, checker in pairs(LibraryCheckers) do
		local result = checker(story)

		if result == "valid" then
			-- step 4: now that we defined our library, check for extra keys of that specific library
			local libExtraResult = CheckExtraKeys(story, LibraryKeys[libraryType], function(key)
				return `Unknown key {key} for {LIB_NAMES[libraryType]}`
			end)
			if libExtraResult ~= "valid" then return libExtraResult :: StoryError end

			-- step 5: check the story function
			if libraryType ~= "Generic" then
				if not story["story"] then
					return { Success = false, Error = `Key "story" was not provided for {LIB_NAMES[libraryType]}` }
				end
				if not t.callback(story["story"]) then
					return {
						Success = false,
						Error = `Key "story" must be a function for {LIB_NAMES[libraryType]}`,
					}
				end
			end

			-- step 6: no more steps, we are done :D
			return { Success = true, Type = libraryType :: StoryType }
		elseif result == "skip" then
			continue -- skip, this is not the library we are looking for
		end

		return result :: StoryError -- story checker error
	end

	-- Specific error case: check if only "story" was provided, this would catch people forgetting that should be "render" for generics
	local specificKeys: Array<string> = {}
	for key in pairs(story) do
		if STORY_TYPE[key] ~= nil then continue end
		table.insert(specificKeys, key)
	end

	if #specificKeys == 1 and specificKeys[1] == "story" then
		return { Success = false, Error = `Story key was found, but no library was given. Did you mean "render"?` }
	end

	-- nothing worked :(
	return { Success = false, Error = "Story table is not valid" }
end

return DefineStoryType
