local RunService = game:GetService "RunService"

local ui_labs = require "@pkg/ui-labs"
local vide = require "@pkg/vide"
local ecs = require "@vendor/ecs"
local jabby = require "@vendor/jabby"

vide.strict = false

--[[
	Jabby over the worlds of the apps running in the same environment as this story: their
	entities, components and pairs, live.

	Mount it with "Mount In Environment" on a preview of an app (stories/app.story): both
	stories then load in one environment, and the world that app creates is published in the
	`shared` table of it (see contexts/world/world-provider), which is the only thing a story
	can read it from. Mounted on its own the story has no app in its environment and says so:
	the world of the app it is running in is deliberately out of reach, every environment has
	its own `shared`.

	Jabby is loaded virtually too, registry included, so this copy of it belongs to the
	environment: the registrations live exactly as long as the environment that made them, and
	`unmount_all` only ever takes down the client apps spawned from here.
]]

-- the key world-provider publishes the worlds of an environment under. A story cannot require
-- the provider to read the name, it would only load a copy of its own
local WORLD_KEY = "uilabs_worlds"

local registered: { [ecs.World]: true } = {}
local count = 0

--- Hands the worlds of this environment to jabby, once each: an entry cannot be taken out of
--- the registry again, and the client lists everything that is in it. Returns how many worlds
--- the environment has right now
-- selene: allow(global_usage)
local function register_worlds(): number
	local worlds = shared[WORLD_KEY]
	if type(worlds) ~= "table" then
		return 0
	end

	for _, world in worlds do
		if registered[world] then
			continue
		end
		registered[world] = true
		count += 1

		jabby.register({
			applet = jabby.applets.world,
			name = if count > 1 then `World - UI Labs {count}` else "World - UI Labs",
			configuration = {
				world = world,
			},
		} :: any)
	end
	return #worlds
end

return ui_labs.CreateVideStory({ vide = vide }, function(props)
	local worlds = vide.source(register_worlds())

	-- the app of this environment can just as well be mounted after this story, and a reload
	-- of the environment remounts both in no particular order, so keep looking
	local connection = RunService.Heartbeat:Connect(function()
		worlds(register_worlds())
	end)

	local client = jabby.obtain_client()
	client.spawn_app(client.apps.home :: any, nil, nil, props.target :: any)

	vide.cleanup(function()
		connection:Disconnect()
		client.unmount_all()
	end)

	-- jabby's own empty state blames permissions, which is never what is missing here
	return vide.create "TextLabel" {
		Name = "no_world",
		Size = UDim2.fromScale(1, 1),
		BackgroundTransparency = 1,
		Visible = function()
			return worlds() <= 0
		end,
		FontFace = Font.fromName("GothamSSm", Enum.FontWeight.Medium),
		TextColor3 = Color3.fromRGB(225, 225, 225),
		TextSize = 14,
		TextWrapped = true,
		Text = 'No app in this environment. Mount this story with "Mount In Environment" on a preview of an app, stories/app for instance, and it shows the world of that app',
	}
end)
