--!strict

--[[
	cross-plugin

	Communication between Roblox Studio plugins. Same idea as the internal
	`CrossPluginCommunication` util used by Roblox's built-in plugins:
	a namespaced Folder living in a hidden service, with one BindableFunction
	per remote call and one BindableEvent per broadcast. Simple state is
	exposed as attributes on the Folder.

	Why StudioService: it accepts children, is hidden from Find/Replace,
	is never saved into the place, and is not copied into the play-test
	DataModel (CoreGui contents are, leaving stale bindables behind).

	Layout:
		StudioService
			<namespace>          Folder, attribute "Version"
				Handshake        BindableFunction
				Functions        Folder of BindableFunction
				Events           Folder of BindableEvent
				Clients          Folder of accepted client Folders

	Provider (the plugin exposing an API):

		local channel = cross_plugin.provide("UILabs", {
			version = 1,
			plugin = plugin, -- optional, destroys the channel on Unloading
			functions = {
				-- `client` is the accepted caller, or nil when not handshaked
				open_story = function(client: Client?, module: ModuleScript) ... end,
			},
			events = { "story_opened" },
			-- may yield (show a popup); return true to accept
			on_client = function(client: Client) return ask_user(client.name) end,
			require_client = true, -- reject invokes from non-handshaked callers
		})
		channel:on_client_connected(function(client) ... end)
		channel:on_client_disconnected(function(client) ... end)
		channel:get_clients()
		channel:disconnect_client(client.id)
		channel:fire("story_opened", module)
		channel:set("current_story", module.Name)

	Consumer (any other plugin):

		cross_plugin.observe("UILabs", function(channel)
			local accepted, reason = channel:handshake { name = "My Plugin", version = 1 }
			if not accepted then return end
			local ok, result = channel:invoke("open_story", module)
			channel:connect("story_opened", function(module) ... end)
			channel:on_disconnected(function() ... end) -- kicked or provider unloaded
		end, { plugin = plugin }) -- optional, disconnects on Unloading

	Argument limits are those of bindables: tables are copied, metatables
	are lost, mixed array/dictionary tables are mangled. Pass plain data
	and Instances only.
]]

local HttpService = game:GetService "HttpService"
local StudioService = game:GetService "StudioService"

local VERSION_ATTRIBUTE = "Version"
local HANDSHAKE_FUNCTION = "Handshake"
local FUNCTIONS_FOLDER = "Functions"
local EVENTS_FOLDER = "Events"
local CLIENTS_FOLDER = "Clients"

local CLIENT_NAME_ATTRIBUTE = "Name"
local CLIENT_VERSION_ATTRIBUTE = "Version"

local cross_plugin = {}

export type State =
	string
	| number
	| boolean
	| Vector2
	| Vector3
	| Color3
	| UDim
	| UDim2
	| BrickColor
	| CFrame
	| Rect
	| NumberRange
	| NumberSequence
	| ColorSequence
	| Font
	| EnumItem
	| nil

--- An accepted (or requesting) consumer, as seen by the provider.
export type Client = {
	--- Unique per handshake.
	id: string,
	name: string,
	version: number,
	--- Owned by the consumer. Destroyed when the consumer disconnects or unloads.
	instance: Folder,
	--- `os.clock()` at acceptance. 0 while still requesting.
	connected_at: number,
}

export type ClientInfo = {
	name: string,
	version: number?,
}

export type ProviderConfig = {
	version: number?,
	plugin: Plugin?,
	--- Receive `(client: Client?, ...)`. `client` is nil when the caller never handshaked.
	functions: { [string]: (client: Client?, ...any) -> ...any }?,
	events: { string }?,
	--- Called for every handshake. May yield (e.g. wait for a popup).
	--- Return true to accept. Absent means accept everyone.
	on_client: ((client: Client) -> boolean)?,
	--- When true, `invoke` from a caller that is not an accepted client fails.
	require_client: boolean?,
	service: Instance?,
}

export type ConsumerConfig = {
	--- Seconds to wait for the provider. Defaults to 5.
	timeout: number?,
	--- Minimum provider version accepted.
	min_version: number?,
	--- Optional, disconnects on Unloading.
	plugin: Plugin?,
	service: Instance?,
}

export type Provider = {
	namespace: string,
	folder: Folder,
	--- Broadcasts to every listener of the event, including other plugins.
	fire: (self: Provider, event: string, ...any) -> (),
	--- Listens to an event. Consumers may fire events too.
	connect: (self: Provider, event: string, callback: (...any) -> ()) -> RBXScriptConnection,
	--- Exposes a value as an attribute. Only attribute-compatible values.
	set: (self: Provider, key: string, value: State) -> (),
	get: (self: Provider, key: string) -> State,
	--- Accepted clients, in connection order.
	get_clients: (self: Provider) -> { Client },
	get_client: (self: Provider, id: string) -> Client?,
	on_client_connected: (self: Provider, callback: (client: Client) -> ()) -> RBXScriptConnection,
	on_client_disconnected: (self: Provider, callback: (client: Client) -> ()) -> RBXScriptConnection,
	--- Kicks a client. It sees it through `on_disconnected`.
	disconnect_client: (self: Provider, id: string) -> (),
	--- Tears down the folder. Consumers see it through `on_destroy`.
	destroy: (self: Provider) -> (),
}

export type Consumer = {
	namespace: string,
	folder: Folder,
	version: number,
	--- Asks the provider to accept this consumer. Yields until it answers.
	--- Returns `false, reason` on rejection or when the provider is gone.
	handshake: (self: Consumer, info: ClientInfo) -> (boolean, string?),
	is_connected: (self: Consumer) -> boolean,
	--- Fires once when the provider kicks this consumer or unloads.
	on_disconnected: (self: Consumer, callback: () -> ()) -> RBXScriptConnection?,
	--- Withdraws from the provider's client list.
	disconnect: (self: Consumer) -> (),
	--- Calls a provider function. Yields. Returns `false, message` when the
	--- provider is gone, the function does not exist, or the callback errored.
	invoke: (self: Consumer, name: string, ...any) -> (boolean, ...any),
	fire: (self: Consumer, event: string, ...any) -> (),
	connect: (self: Consumer, event: string, callback: (...any) -> ()) -> RBXScriptConnection,
	get: (self: Consumer, key: string) -> State,
	on_change: (self: Consumer, key: string, callback: (value: State) -> ()) -> RBXScriptConnection,
	--- Fires once when the provider unloads. Fires immediately if already gone.
	on_destroy: (self: Consumer, callback: () -> ()) -> RBXScriptConnection?,
	is_alive: (self: Consumer) -> boolean,
	--- Disconnects from the provider and drops every connection made here.
	destroy: (self: Consumer) -> (),
}

local function is_alive(folder: Folder, service: Instance): boolean
	return folder.Parent == service
end

local function find_event(folder: Folder, event: string): BindableEvent?
	local events = folder:FindFirstChild(EVENTS_FOLDER)
	local bindable = events and events:FindFirstChild(event)
	if bindable and bindable:IsA "BindableEvent" then
		return bindable
	end
	return nil
end

local function find_function(folder: Folder, name: string): BindableFunction?
	local functions = folder:FindFirstChild(FUNCTIONS_FOLDER)
	local bindable = functions and functions:FindFirstChild(name)
	if bindable and bindable:IsA "BindableFunction" then
		return bindable
	end
	return nil
end

local function find_handshake(folder: Folder): BindableFunction?
	local bindable = folder:FindFirstChild(HANDSHAKE_FUNCTION)
	if bindable and bindable:IsA "BindableFunction" then
		return bindable
	end
	return nil
end

-- provider --------------------------------------------------------------------

function cross_plugin.provide(namespace: string, options: ProviderConfig?): Provider
	local config: ProviderConfig = options or {}
	local service = config.service or StudioService
	local function_callbacks: { [string]: (client: Client?, ...any) -> ...any } = config.functions or {}
	local event_names: { string } = config.events or {}

	-- a previous instance of this plugin that did not clean up
	local stale = service:FindFirstChild(namespace)
	if stale then
		stale:Destroy()
	end

	local folder = Instance.new "Folder"
	folder.Name = namespace
	folder:SetAttribute(VERSION_ATTRIBUTE, config.version or 1)

	local functions = Instance.new "Folder"
	functions.Name = FUNCTIONS_FOLDER
	functions.Parent = folder

	local events = Instance.new "Folder"
	events.Name = EVENTS_FOLDER
	events.Parent = folder

	local clients_folder = Instance.new "Folder"
	clients_folder.Name = CLIENTS_FOLDER
	clients_folder.Parent = folder

	local handshake = Instance.new "BindableFunction"
	handshake.Name = HANDSHAKE_FUNCTION
	handshake.Parent = folder

	-- client bookkeeping ---------------------------------------------------

	local clients: { [string]: Client } = {}
	local client_order: { Client } = {}
	local client_connected = Instance.new "BindableEvent"
	local client_disconnected = Instance.new "BindableEvent"

	local function remove_client(client: Client)
		if clients[client.id] ~= client then
			return
		end
		clients[client.id] = nil
		local index = table.find(client_order, client)
		if index then
			table.remove(client_order, index)
		end
		client_disconnected:Fire(client)
	end

	clients_folder.ChildRemoved:Connect(function(child)
		local client = clients[child.Name]
		if client and client.instance == child then
			remove_client(client)
		end
	end)

	local function read_client(instance: Instance): Client?
		if not instance:IsA "Folder" then
			return nil
		end
		local name = instance:GetAttribute(CLIENT_NAME_ATTRIBUTE)
		local version = instance:GetAttribute(CLIENT_VERSION_ATTRIBUTE)
		return {
			id = instance.Name,
			name = if type(name) == "string" then name else instance.Name,
			version = if type(version) == "number" then version else 1,
			instance = instance,
			connected_at = 0,
		}
	end

	-- invoked by consumers with their own client instance
	handshake.OnInvoke = function(instance: any): (boolean, string?)
		if typeof(instance) ~= "Instance" then
			return false, "cross-plugin: handshake expects a client instance"
		end
		local client = read_client(instance)
		if not client then
			return false, "cross-plugin: client instance must be a Folder"
		end
		if clients[client.id] then
			return false, `cross-plugin: client "{client.id}" already connected`
		end

		if config.on_client then
			local ok, accepted = pcall(config.on_client, client)
			if not ok then
				warn(`cross-plugin: on_client for "{namespace}" errored: {accepted}`)
				return false, "cross-plugin: provider errored while deciding"
			end
			if not accepted then
				return false, "cross-plugin: rejected by provider"
			end
		end

		if not is_alive(folder, service) then
			return false, `cross-plugin: provider "{namespace}" is gone`
		end

		-- fails if the consumer destroyed its instance while we were deciding
		local parented = pcall(function()
			instance.Parent = clients_folder
		end)
		if not parented or instance.Parent ~= clients_folder then
			return false, "cross-plugin: client went away during handshake"
		end

		client.connected_at = os.clock()
		clients[client.id] = client
		table.insert(client_order, client)
		client_connected:Fire(client)
		return true, nil
	end

	local function resolve_client(client_id: any): Client?
		if type(client_id) ~= "string" then
			return nil
		end
		local client = clients[client_id]
		if client and client.instance.Parent == clients_folder then
			return client
		end
		return nil
	end

	for name, callback in function_callbacks do
		local bindable = Instance.new "BindableFunction"
		bindable.Name = name
		bindable.OnInvoke = function(client_id: any, ...: any): ...any
			local client = resolve_client(client_id)
			if config.require_client and not client then
				error(`cross-plugin: "{name}" requires an accepted client`, 0)
			end
			return callback(client, ...)
		end
		bindable.Parent = functions
	end

	for _, name in event_names do
		local bindable = Instance.new "BindableEvent"
		bindable.Name = name
		bindable.Parent = events
	end

	-- public ---------------------------------------------------------------

	local provider = {} :: Provider
	provider.namespace = namespace
	provider.folder = folder

	function provider.fire(_, event: string, ...: any)
		local bindable = find_event(folder, event)
		if not bindable then
			error(`cross-plugin: event "{event}" was not declared on "{namespace}"`, 2)
		end
		bindable:Fire(...)
	end

	function provider.connect(_, event: string, callback: (...any) -> ())
		local bindable = find_event(folder, event)
		if not bindable then
			error(`cross-plugin: event "{event}" was not declared on "{namespace}"`, 2)
		end
		return bindable.Event:Connect(callback)
	end

	function provider.set(_, key: string, value: State)
		if key == VERSION_ATTRIBUTE then
			error(`cross-plugin: "{VERSION_ATTRIBUTE}" is reserved`, 2)
		end
		folder:SetAttribute(key, value)
	end

	function provider.get(_, key: string): State
		return folder:GetAttribute(key) :: any
	end

	function provider.get_clients(_): { Client }
		return table.clone(client_order)
	end

	function provider.get_client(_, id: string): Client?
		return clients[id]
	end

	function provider.on_client_connected(_, callback: (client: Client) -> ())
		return client_connected.Event:Connect(callback)
	end

	function provider.on_client_disconnected(_, callback: (client: Client) -> ())
		return client_disconnected.Event:Connect(callback)
	end

	function provider.disconnect_client(_, id: string)
		local client = clients[id]
		if not client then
			return
		end
		-- the consumer owns the instance; unparenting is enough to drop it
		-- and lets the consumer observe the kick through AncestryChanged
		client.instance.Parent = nil
		remove_client(client)
	end

	function provider.destroy(_)
		for _, client in table.clone(client_order) do
			remove_client(client)
		end
		folder:Destroy()
		client_connected:Destroy()
		client_disconnected:Destroy()
	end

	if config.plugin then
		config.plugin.Unloading:Once(function()
			provider:destroy()
		end)
	end

	-- parented last so consumers never see a half-built channel
	folder.Parent = service

	return provider
end

-- consumer --------------------------------------------------------------------

local function wrap_consumer(folder: Folder, service: Instance, config: ConsumerConfig): Consumer
	local namespace = folder.Name
	local connections: { RBXScriptConnection } = {}
	local clients_folder = folder:FindFirstChild(CLIENTS_FOLDER)

	local client_instance: Folder? = nil
	local client_id: string? = nil
	local disconnected = Instance.new "BindableEvent"

	local function track(connection: RBXScriptConnection): RBXScriptConnection
		table.insert(connections, connection)
		return connection
	end

	local consumer = {} :: Consumer
	consumer.namespace = namespace
	consumer.folder = folder

	local version = folder:GetAttribute(VERSION_ATTRIBUTE)
	consumer.version = if type(version) == "number" then version else 1

	function consumer.is_alive(_)
		return is_alive(folder, service)
	end

	function consumer.is_connected(_)
		return client_instance ~= nil and clients_folder ~= nil and client_instance.Parent == clients_folder
	end

	local function drop_client()
		local instance = client_instance
		if not instance then
			return
		end
		client_instance = nil
		client_id = nil
		instance:Destroy()
		disconnected:Fire()
	end

	function consumer.handshake(_, info: ClientInfo): (boolean, string?)
		if consumer:is_connected() then
			return true, nil
		end
		if not is_alive(folder, service) then
			return false, `cross-plugin: provider "{namespace}" is gone`
		end
		local bindable = find_handshake(folder)
		if not bindable then
			return false, `cross-plugin: "{namespace}" does not accept handshakes`
		end

		local instance = Instance.new "Folder"
		instance.Name = HttpService:GenerateGUID(false)
		instance:SetAttribute(CLIENT_NAME_ATTRIBUTE, info.name)
		instance:SetAttribute(CLIENT_VERSION_ATTRIBUTE, info.version or 1)

		local ok, accepted, reason = pcall(bindable.Invoke, bindable, instance)
		if not ok then
			instance:Destroy()
			return false, `cross-plugin: handshake failed: {accepted}`
		end
		if not accepted then
			instance:Destroy()
			return false, reason
		end

		client_instance = instance
		client_id = instance.Name

		-- kicked by the provider, or provider folder destroyed
		track(instance.AncestryChanged:Connect(function()
			if instance.Parent ~= clients_folder or not is_alive(folder, service) then
				drop_client()
			end
		end))

		return true, nil
	end

	function consumer.on_disconnected(_, callback: () -> ())
		return track(disconnected.Event:Connect(callback))
	end

	function consumer.disconnect(_)
		drop_client()
	end

	function consumer.invoke(_, name: string, ...: any): (boolean, ...any)
		if not is_alive(folder, service) then
			return false, `cross-plugin: provider "{namespace}" is gone`
		end
		local bindable = find_function(folder, name)
		if not bindable then
			return false, `cross-plugin: "{namespace}" has no function "{name}"`
		end
		return pcall(bindable.Invoke, bindable, client_id, ...)
	end

	function consumer.fire(_, event: string, ...: any)
		local bindable = find_event(folder, event)
		if bindable then
			bindable:Fire(...)
		end
	end

	function consumer.connect(_, event: string, callback: (...any) -> ())
		local bindable = find_event(folder, event)
		if not bindable then
			error(`cross-plugin: "{namespace}" has no event "{event}"`, 2)
		end
		return track(bindable.Event:Connect(callback))
	end

	function consumer.get(_, key: string): State
		return folder:GetAttribute(key) :: any
	end

	function consumer.on_change(_, key: string, callback: (value: State) -> ())
		return track(folder:GetAttributeChangedSignal(key):Connect(function()
			callback(folder:GetAttribute(key) :: any)
		end))
	end

	function consumer.on_destroy(_, callback: () -> ()): RBXScriptConnection?
		if not is_alive(folder, service) then
			task.spawn(callback)
			return nil
		end
		local connection: RBXScriptConnection
		connection = folder.AncestryChanged:Connect(function()
			if is_alive(folder, service) then
				return
			end
			connection:Disconnect()
			callback()
		end)
		return track(connection)
	end

	function consumer.destroy(_)
		drop_client()
		for _, connection in connections do
			connection:Disconnect()
		end
		table.clear(connections)
		disconnected:Destroy()
	end

	if config.plugin then
		config.plugin.Unloading:Once(function()
			consumer:destroy()
		end)
	end

	return consumer
end

local function accepts(folder: Instance, service: Instance, min_version: number?): boolean
	if not folder:IsA "Folder" or folder.Parent ~= service then
		return false
	end
	local version = folder:GetAttribute(VERSION_ATTRIBUTE)
	if type(version) ~= "number" then
		return false
	end
	return min_version == nil or version >= min_version
end

--- Yields until the provider is available or `timeout` elapses.
--- Returns nil when it never showed up or its version is too old.
function cross_plugin.consume(namespace: string, options: ConsumerConfig?): Consumer?
	local config: ConsumerConfig = options or {}
	local service = config.service or StudioService

	local folder = service:WaitForChild(namespace, config.timeout or 5)
	if not folder or not accepts(folder, service, config.min_version) then
		return nil
	end
	return wrap_consumer(folder :: Folder, service, config)
end

--- Does not yield. Calls `callback` with a fresh consumer every time the
--- provider appears, so load order and provider reloads are handled.
--- The returned connection stops observing.
function cross_plugin.observe(
	namespace: string,
	callback: (consumer: Consumer) -> (),
	options: ConsumerConfig?
): RBXScriptConnection
	local config: ConsumerConfig = options or {}
	local service = config.service or StudioService

	local function try(child: Instance)
		if child.Name ~= namespace or not accepts(child, service, config.min_version) then
			return
		end
		task.spawn(callback, wrap_consumer(child :: Folder, service, config))
	end

	local connection = service.ChildAdded:Connect(try)

	local existing = service:FindFirstChild(namespace)
	if existing then
		try(existing)
	end

	return connection
end

return cross_plugin
