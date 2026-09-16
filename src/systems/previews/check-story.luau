local c = require "@src/components"

export type StoryType = c.StoryType

--[[
	Decides which kind of story a module returned, by the presence of the library it hands over:

	- a function is a Functional story
	- a table is a library story, picked by its keys (roact / react + reactRoblox / fusion /
	  iris / vide / render)

	Detection is by field presence only, the optional `use` string is never read.
]]

type Story = Map<string, unknown>

type Library = {
	name: string,
	type: StoryType,
	keys: { string },
	-- "skip" when the library field is absent, an error message when it is present but wrong
	check: (story: Story) -> "valid" | "skip" | string,
}

local function optional(kind: string): (unknown) -> boolean
	return function(value)
		return value == nil or type(value) == kind
	end
end

-- keys every story table may carry, whatever the library
local COMMON_KEYS: Map<string, (unknown) -> boolean> = {
	name = optional "string",
	summary = optional "string",
	use = optional "string",
	controls = optional "table", -- TODO: validate the control shapes
	cleanup = optional "function",
}

local LIBRARIES: { Library } = {
	{
		name = "Roact",
		type = "Roact",
		keys = { "roact" },
		check = function(story)
			if story.roact == nil then
				return "skip"
			end
			if type(story.roact) ~= "table" then
				return "Roact library is not valid"
			end
			return "valid"
		end,
	},
	{
		name = "React",
		type = "React",
		keys = { "react", "reactRoblox", "renderer" },
		check = function(story)
			if story.react == nil or story.reactRoblox == nil then
				return "skip"
			end
			if type(story.react) ~= "table" then
				return "React library is not valid"
			end
			if type(story.reactRoblox) ~= "table" then
				return "ReactRoblox library is not valid"
			end
			local renderer = story.renderer
			if renderer ~= nil and renderer ~= "deferred" and renderer ~= "legacy" then
				return `Renderer key must be "deferred" or "legacy" for React, got {tostring(renderer)}`
			end
			return "valid"
		end,
	},
	{
		name = "Fusion",
		type = "Fusion",
		keys = { "fusion", "scoped" },
		check = function(story)
			if story.fusion == nil then
				return "skip"
			end
			if type(story.fusion) ~= "table" then
				return "Fusion library is not valid"
			end
			if story.scoped ~= nil and type(story.scoped) ~= "table" then
				return "Scoped key must be an array of scopable tables"
			end
			return "valid"
		end,
	},
	{
		name = "Iris",
		type = "Iris",
		keys = { "iris" },
		check = function(story)
			if story.iris == nil then
				return "skip"
			end
			if type(story.iris) ~= "table" then
				return "Iris library is not valid"
			end
			return "valid"
		end,
	},
	{
		name = "Vide",
		type = "Vide",
		keys = { "vide" },
		check = function(story)
			if story.vide == nil then
				return "skip"
			end
			if type(story.vide) ~= "table" then
				return "Vide library is not valid"
			end
			return "valid"
		end,
	},
	{
		name = "Generic",
		type = "Generic",
		keys = { "render" },
		check = function(story)
			if story.render == nil then
				return "skip"
			end
			if type(story.render) ~= "function" then
				return "Generic render must be a function"
			end
			if story.story ~= nil then
				return 'Generic story cannot have both "render" and "story" key'
			end
			return "valid"
		end,
	},
}

local function key_set(keys: { string }): Set<string>
	local set: Set<string> = {}
	for _, key in keys do
		set[key] = true
	end
	return set
end

local ALL_KEYS: Set<string> = {}
for _, library in LIBRARIES do
	for _, key in library.keys do
		ALL_KEYS[key] = true
	end
end

--- The first key of the story that is neither common, `story`, nor in `allowed`
local function find_extra_key(story: Story, allowed: Set<string>): string?
	for key in story do
		if COMMON_KEYS[key] ~= nil or key == "story" or allowed[key] then
			continue
		end
		return key
	end
	return nil
end

local function define_story_type(story: Story): (StoryType?, string?)
	-- step 1: common keys
	for key, check in COMMON_KEYS do
		if not check(story[key]) then
			return nil, `Story key {key} is not valid`
		end
	end

	-- step 2: keys no library knows about
	local extra = find_extra_key(story, ALL_KEYS)
	if extra then
		return nil, `Unknown key "{extra}" in story table`
	end

	-- step 3: first library whose field is present decides
	for _, library in LIBRARIES do
		local result = library.check(story)
		if result == "skip" then
			continue
		elseif result ~= "valid" then
			return nil, result
		end

		-- step 4: keys that belong to another library
		local library_extra = find_extra_key(story, key_set(library.keys))
		if library_extra then
			return nil, `Unknown key {library_extra} for {library.name}`
		end

		-- step 5: every library but Generic renders through `story`
		if library.type ~= "Generic" then
			local render = story.story
			if render == nil then
				return nil, `Key "story" was not provided for {library.name}`
			end
			if type(render) ~= "function" then
				return nil, `Key "story" must be a function for {library.name}`
			end
		end

		return library.type, nil
	end

	-- only `story` was given: most likely a generic story that should have used `render`
	local specific = 0
	local only_story = false
	for key in story do
		if COMMON_KEYS[key] ~= nil then
			continue
		end
		specific += 1
		only_story = key == "story"
	end
	if specific == 1 and only_story then
		return nil, 'Story key was found, but no library was given. Did you mean "render"?'
	end

	return nil, "Story table is not valid"
end

--- Returns the story type, or nil plus the reason the result is not a story
local function check_story(result: unknown): (StoryType?, string?)
	if type(result) == "function" then
		return "Functional", nil
	elseif type(result) == "table" then
		return define_story_type(result :: Story)
	end
	return nil, `Story return is an invalid type: {type(result)}`
end

return check_story
