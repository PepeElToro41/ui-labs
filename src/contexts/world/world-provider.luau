local vide = require "@pkg/vide"
local ecs = require "@vendor/ecs"

local WORLD_CONTEXT = require "./world-context"

--[[
	Creates the world of one app and publishes it in the `shared` table of the environment the
	app itself runs in, under `uilabs_worlds`.

	That table belongs to one hot reload environment: an app rendered by a story
	(stories/app.story) publishes into the environment that story was loaded in, so any other
	story mounted in the same environment ("Mount In Environment") reaches the world of that
	app. That is how stories/jabby.story finds the app it was mounted next to.

	The plugin app publishes into the real `shared` instead, where no story can see it: every
	story environment replaces `shared` with its own table (see utils/hot-reloading). A story
	therefore only ever reaches the worlds of the apps running in its own environment, never
	the world of the app that is running it.
]]
local WORLD_KEY = "uilabs_worlds"

--- The live worlds of this environment, in mount order
-- selene: allow(global_usage)
local function published(): { ecs.World }
	local worlds = shared[WORLD_KEY]
	if not worlds then
		worlds = {}
		shared[WORLD_KEY] = worlds
	end
	return worlds
end

local function world_provider(props: ProviderChildren)
	local world = ecs.world()

	local worlds = published()
	table.insert(worlds, world)

	vide.cleanup(function()
		local index = table.find(worlds, world)
		if index then
			table.remove(worlds, index)
		end
	end)

	return WORLD_CONTEXT(world, props.children)
end

return world_provider
