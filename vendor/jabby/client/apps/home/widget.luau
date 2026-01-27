local pebble = require(script.Parent.Parent.Parent.Parent.Parent.pebble)
local app_holder = require "@vendor/pebble/components/display/app_holder"
local vide = require(script.Parent.Parent.Parent.Parent.Parent.vide)
local spawn_app = require(script.Parent.Parent.Parent.spawn_app)
local overview_scheduler = require(script.Parent.Parent.overview_scheduler)
local registry = require(script.Parent.Parent.registry)

local create = vide.create
local derive = vide.derive
local source = vide.source
local values = vide.values
local show = vide.show

type props = {

	servers: (
	) -> {
		{
			host: "server" | "edit" | Player,
			vm: number,

			schedulers: () -> { { id: number, name: string } },
			worlds: () -> { { id: number, name: string } },
		}
	},

	destroy: () -> (),
}

return function(props: props)
	local selected = source "all"
	local context = app_holder.context()

	local hosts = derive(function()
		local hosts = {}

		for _, server in props.servers() do
			local host = server.host
			hosts[host] = hosts[host] or {}
			table.insert(hosts[host], server)
		end

		hosts["all"] = props.servers()

		return hosts
	end)

	local options = derive(function()
		local options = {}

		for host, servers in hosts() do
			options[host] = if type(host) == "string" then host else `@{host.Name}`
		end

		options["all"] = "all"

		return options
	end)

	local function objects()
		return hosts()[selected()] or {} :: never
	end

	local function is_empty()
		local no_objects = next(objects()) == nil
		if no_objects then
			return "No objects found. You may not have permissions to use this."
		end
		-- for _, object in objects() do
		-- 	if #object.worlds() == 0 then return "No worlds found. Did you forget to set updated?" end
		-- 	if #object.schedulers() == 0 then return "No schedulers found. Did you forget to set updated?" end
		-- end
		return false
	end

	return pebble.widget {
		title = "Home",
		min_size = Vector2.new(230, 200),
		bind_to_close = props.destroy,

		pebble.container {

			create "UIListLayout" {
				Padding = UDim.new(0, 2),
				VerticalFlex = Enum.UIFlexAlignment.SpaceEvenly,
				HorizontalFlex = Enum.UIFlexAlignment.Fill,
			},

			pebble.select {
				size = UDim2.new(1, 0, 0, 32),
				options = options :: any,
				selected = selected :: any,
				update_selected = selected,
			},

			create "ScrollingFrame" {
				-- Size = UDim2.fromScale(1, 1),
				CanvasSize = UDim2.new(),
				AutomaticCanvasSize = Enum.AutomaticSize.Y,
				BackgroundTransparency = 1,
				ScrollBarThickness = 6,
				HorizontalScrollBarInset = Enum.ScrollBarInset.Always,

				create "UIFlexItem" {
					FlexMode = Enum.UIFlexMode.Fill,
				},

				pebble.padding {
					x = UDim.new(0, 1),
					right = UDim.new(0, 8),
				},

				create "UIListLayout" {
					FillDirection = Enum.FillDirection.Horizontal,
					HorizontalFlex = Enum.UIFlexAlignment.Fill,
					Padding = UDim.new(0, 8),
					Wraps = true,
				},

				show(is_empty, function()
					return pebble.typography {
						text = is_empty(),
						xalignment = Enum.TextXAlignment.Left,
						wrapped = true,
					}
				end),

				values(objects, function(value, key)
					return pebble.pane {
						name = "",
						size = UDim2.fromOffset(200, 0),
						automaticsize = Enum.AutomaticSize.Y,

						create "UIListLayout" {
							Padding = UDim.new(0, 8),
						},

						pebble.typography {
							text = `host: {value.host}\tvm id: {value.vm}`,
							wrapped = true,
						},

						values(value.worlds, function(world)
							return pebble.button {
								size = UDim2.new(1, 0, 0, 30),
								text = `World: {world.name}`,

								activated = function()
									spawn_app.spawn_app(registry, {
										host = value.host,
										vm = value.vm,
										id = world.id,
									}, context)
								end,
							}
						end),

						values(value.schedulers, function(scheduler)
							return pebble.button {
								size = UDim2.new(1, 0, 0, 30),
								text = `Scheduler: {scheduler.name}`,

								activated = function()
									spawn_app.spawn_app(overview_scheduler, {
										host = value.host,
										vm = value.vm,
										id = scheduler.id,
									}, context)
								end,
							}
						end),
					}
				end),
			},
		},
	}
end
