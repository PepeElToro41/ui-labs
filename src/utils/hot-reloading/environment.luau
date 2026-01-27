local signal = require "@pkg/signal"
local types = require "./types"
local utils = require "./utils"

export type Environment = types.Environment

local environment = {} :: types.Environment
environment.__index = environment

function environment.create()
	local env = {} :: types.Environment

	env.shared = {}
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

-- todo: handle require errors better
function environment:load_dependency(module: ModuleScript)
	local resolved = self.dependencies[module]
	if resolved then
		return resolved.result
	end

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

	if success then
		self.dependencies[module] = { result = result }
		for _, callback in callbacks do
			callback(result)
		end

		return result
	else
		self.dependencies[module] = { result = nil }
		for _, callback in callbacks do
			callback(nil)
		end
		error(result)
	end
end

return environment
