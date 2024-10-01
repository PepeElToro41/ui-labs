local Signal = require "@pkg/signal"
local Promise = require "@pkg/promise"
local HotReloader = require "@utils/hmr/hot-reloader"

type HotReloader = HotReloader.HotReloader
type Signal = Signal.Signal<any>
type Connection = Signal.Connection
type Promise = Promise.TypedPromise<any>

export type StorybookLoader = Class & Private

type Class = {
	Module: ModuleScript,
	OnStorybookUpdated: Signal,
	HotReloader: HotReloader,

	Init: (self: StorybookLoader) -> (),
	GetCurrentResult: (self: StorybookLoader) -> unknown,
	Destroy: (self: StorybookLoader) -> (),
}

type Private = {
	_storybookResult: unknown?,
	_reloadPromise: Promise?,
	_hotReloaderConnection: Connection?,

	_OnReloadStarted: (self: StorybookLoader, promise: Promise) -> (),
}
type Static = {
	new: (module: ModuleScript) -> StorybookLoader,
	__index: StorybookLoader,
}

local StorybookLoader = {} :: Static & StorybookLoader
StorybookLoader.__index = StorybookLoader

function StorybookLoader.new(module: ModuleScript): StorybookLoader
	local self = {} :: StorybookLoader

	self.Module = module
	self.OnStorybookUpdated = Signal.new()

	return setmetatable(self, StorybookLoader)
end

function StorybookLoader:Init()
	local reloader = HotReloader.new(self.Module)
	self.HotReloader = reloader

	self:_OnReloadStarted(reloader:Reload())

	self._hotReloaderConnection = reloader.OnReloadStarted:Connect(function(promise)
		self:_OnReloadStarted(promise)
	end)
end

function StorybookLoader:GetCurrentResult()
	return self._storybookResult
end

function StorybookLoader:_OnReloadStarted(promise: Promise)
	if self._reloadPromise then self._reloadPromise:cancel() end

	self._reloadPromise = promise:andThen(function(result)
		self._storybookResult = result
		self.OnStorybookUpdated:Fire()
	end)
end

function StorybookLoader:Destroy()
	if self._reloadPromise then self._reloadPromise:cancel() end
	if self._hotReloaderConnection then self._hotReloaderConnection:Disconnect() end
	if self.HotReloader then self.HotReloader:Destroy() end
end

return StorybookLoader
