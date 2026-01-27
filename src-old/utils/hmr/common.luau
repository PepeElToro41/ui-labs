local Signal = require "@pkg/signal"
local Promise = require "@pkg/promise"

type Signal<T...> = Signal.Signal<T...>
type Promise<T = any> = Promise.TypedPromise<T>

type Class = {
	EnvironmentUID: string,
	Shared: { [any]: any },

	-- events
	OnDependencyChanged: Signal<ModuleScript>,

	-- methods
	EnableGlobalInjection: (self: Environment) -> (),
	InjectGlobal: (self: Environment, key: string, value: any) -> (),
	GetGlobalInjection: (self: Environment) -> { [string]: any },
	IsDependency: (self: Environment, module: ModuleScript) -> boolean,
	GetDependencyResult: (self: Environment, module: ModuleScript) -> any,
	ListenDependency: (self: Environment, module: ModuleScript) -> (),
	LoadDependency: (self: Environment, module: ModuleScript) -> Promise,
	HookOnDestroy: (self: Environment, hook: () -> ()) -> (),
	Destroy: (self: Environment) -> (),
}

type Private = {
	_active: boolean,
	_dependencies: { [ModuleScript]: { Result: any } },
	_dependencyLoaders: { [ModuleScript]: Promise },
	_listeners: { [ModuleScript]: RBXScriptConnection },
	_globalInjection: { [string]: any? },
	_destroyHook: (() -> ())?,

	-- methods
	_RegistryDependency: (self: Environment, module: ModuleScript, result: any?) -> (),
}

export type Environment = Class & Private

return nil
