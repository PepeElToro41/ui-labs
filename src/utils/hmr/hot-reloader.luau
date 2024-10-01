local Promise = require "@pkg/promise"
local Signal = require "@pkg/signal"

type Promise<T = any> = Promise.TypedPromise<T>
type Signal<T...> = Signal.Signal<T...>
type Connection = Signal.Connection

local Environment = require "./environment"
local Common = require "./common"
type Environment = Common.Environment

export type HotReloader = Class & Private

type Class = {
	-- properties
	Module: ModuleScript,
	AutoReload: boolean,

	-- events
	OnReloadStarted: Signal<Promise>,
	OnDependencyChanged: Signal<ModuleScript, Environment>,

	-- methods
	BeforeReload: (self: HotReloader, bind: (environment: Environment) -> ()) -> (),
	GetEnvironment: (self: HotReloader) -> Environment,
	Reload: (self: HotReloader) -> Promise,
	Destroy: (self: HotReloader) -> (),
}

type Private = {
	_environment: Environment?,
	_reloadPromise: Promise,
	_environmentListener: Connection?,
	_reloadBinded: ((environment: Environment) -> ())?,

	-- methods
	_ClearReloader: (self: HotReloader) -> (),
	_RunBinded: (self: HotReloader, environment: Environment) -> (),
}

type Static = {
	new: (module: ModuleScript) -> HotReloader,
	__index: HotReloader,
}

local HotReloader = {} :: Static & HotReloader
HotReloader.__index = HotReloader

function HotReloader.new(module: ModuleScript): HotReloader
	assert(module:IsA "ModuleScript", "HMR can only load ModuleScripts")

	local self = {} :: HotReloader & Private
	self.Module = module
	self.AutoReload = true
	self.OnReloadStarted = Signal.new()
	self.OnDependencyChanged = Signal.new()

	return setmetatable(self, HotReloader)
end

function HotReloader:_ClearReloader()
	if self._reloadPromise then self._reloadPromise:cancel() end
	if self._environmentListener and self._environmentListener.Connected then
		self._environmentListener:Disconnect()
		self._environmentListener = nil
	end
	if self._environment then
		self._environment:Destroy()
		self._environment = nil
	end
end

function HotReloader:_RunBinded(environment: any)
	if self._reloadBinded then self._reloadBinded(environment) end
end

function HotReloader:BeforeReload(bind: (environment: any) -> ())
	self._reloadBinded = bind
end

function HotReloader:GetEnvironment(): any
	return self._environment
end

function HotReloader:Reload()
	self:_ClearReloader()
	local environment = Environment.new()
	self:_RunBinded(environment)

	local listener = environment.OnDependencyChanged:Once(function(module)
		self.OnDependencyChanged:Fire(module, environment)

		if self.AutoReload then self:Reload() end
	end)
	self._environmentListener = listener

	local handler = environment:LoadDependency(self.Module)

	self._reloadPromise = handler
	self.OnReloadStarted:Fire(handler)
	return handler
end

function HotReloader:Destroy()
	self:_ClearReloader()
end

return HotReloader :: Static
