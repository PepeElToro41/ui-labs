local HttpService = game:GetService "HttpService"
local Signal = require "@pkg/signal"
local Promise = require "@pkg/promise"
local Utils = require "./utils"
local Common = require "./common"

type Environment = Common.Environment
type Signal<T...> = Signal.Signal<T...>
type Promise<T = any> = Promise.TypedPromise<T>

type Static = {
	new: () -> Environment,
}

local Environment = {} :: Static & Environment;
(Environment :: any).__index = Environment

function Environment.new(): Environment
	local self = {} :: Environment
	self.EnvironmentUID = HttpService:GenerateGUID(false)

	self._dependencies = {}
	self._dependencyLoaders = {}
	self._listeners = {}

	self.Shared = {}
	self.OnDependencyChanged = Signal.new()

	return setmetatable(self, Environment)
end

function Environment:EnableGlobalInjection()
	if not self._globalInjection then self._globalInjection = {} end
end

function Environment:InjectGlobal(key: string, value: any)
	self:EnableGlobalInjection()
	self._globalInjection[key] = value
end

function Environment:GetGlobalInjection()
	return self._globalInjection
end

function Environment:_RegistryDependency(module: ModuleScript, result: any?)
	self._dependencies[module] = { Result = result }
end

function Environment:IsDependency(module: ModuleScript): boolean
	return self._dependencies[module] ~= nil
end

function Environment:GetDependencyResult(module: ModuleScript): any
	local dependency = self._dependencies[module]
	return dependency and dependency.Result
end

function Environment:ListenDependency(module: ModuleScript)
	if not self._active then return end
	if self._listeners[module] then return end

	local listener = module:GetPropertyChangedSignal("Source"):Connect(function()
		if not self._active then return end
		self.OnDependencyChanged:Fire(module)
	end)
	self._listeners[module] = listener
end

function Environment:LoadDependency(dependency: ModuleScript): Promise
	if not dependency:IsA "ModuleScript" then error "HMR can only load ModuleScripts" end

	-- is already required
	if self:IsDependency(dependency) then return Promise.resolve(self:GetDependencyResult(dependency)) end

	-- is already loading
	local loader = self._dependencyLoaders[dependency]
	if loader then return loader:tap(function() end) end

	-- load dependency
	self:ListenDependency(dependency)
	local promise = Utils.VirtualRequire(dependency, self):tap(function(result)
		self:_RegistryDependency(dependency, result)
		self._dependencyLoaders[dependency] = nil
	end)

	self._dependencyLoaders[dependency] = promise
	return promise
end

return Environment :: Static
