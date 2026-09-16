local HttpService = game:GetService "HttpService"

local signal = require "@pkg/signal"
local types = require "./types"
local utils = require "./utils"

export type Environment = types.Environment

local environment = {} :: types.Environment
environment.__index = environment

function environment.create()
	local env = {} :: types.Environment

	env.uuid = HttpService:GenerateGUID(false)
	env.shared = {}
	env.injection = nil
	env.dependencies = {}
	env.loading_dependencies = {}

	env.connected = true
	env.connected_dependencies = {}
	env.on_dependency_changed = signal.new()

	return setmetatable(env, environment) :: any
end

function environment:disconnect()
	if not self.connected then
		return
	end
	self.connected = false

	for _, connection in self.connected_dependencies do
		connection:Disconnect()
	end
	table.clear(self.connected_dependencies)
end

function environment:connect_dependency(dependency: ModuleScript)
	if not self.connected then
		return
	end

	local on_dependency_changed = self.on_dependency_changed
	local connection = dependency:GetPropertyChangedSignal("Source"):Connect(function()
		on_dependency_changed:Fire()
	end)
	table.insert(self.connected_dependencies, connection)
end

function environment:inject(key: string, value: any)
	local injection: { [any]: any } = self.injection or {}
	self.injection = injection
	injection[key] = value
end

function environment:get_injection()
	return self.injection
end

function environment:load_dependency(module: ModuleScript)
	local resolved = self.dependencies[module]
	if resolved then
		if resolved.error ~= nil then
			error(resolved.error, 0)
		end
		return resolved.result
	end

	-- only reachable when a module yields while loading (loads are synchronous
	-- on Heartbeat today), kept so concurrent requires resolve to one result
	local loading = self.loading_dependencies[module] :: { any }
	if loading then
		local co = coroutine.running()

		table.insert(loading, function(result)
			coroutine.resume(co, result)
		end)

		return coroutine.yield(co)
	end

	self:connect_dependency(module)

	local callbacks = {}
	self.loading_dependencies[module] = callbacks
	local success, result = utils.load_virtual_module(module, self)
	self.loading_dependencies[module] = nil

	if success then
		self.dependencies[module] = { result = result }
		for _, callback in callbacks do
			callback(result)
		end

		return result
	else
		self.dependencies[module] = { error = result }
		for _, callback in callbacks do
			callback(nil)
		end
		error(result, 0)
	end
end

return environment
