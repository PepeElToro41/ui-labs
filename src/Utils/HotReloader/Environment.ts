import Signal from "@rbxts/lemon-signal";

import { LoadVirtualModule } from "./Utils";

const HttpService = game.GetService("HttpService");

type Dependencies = Map<ModuleScript, { Result: unknown }>;
type DependencyLoaders = Map<ModuleScript, Promise<unknown>>;
type Listeners = Map<ModuleScript, RBXScriptConnection>;

export class Environment {
	private _ActiveConnections = true;
	private _Dependencies: Dependencies = new Map();
	private _DependencyLoaders: DependencyLoaders = new Map();
	private _Listeners: Listeners = new Map();

	readonly EnvironmentUID: string;
	private _GlobalInjection?: Record<keyof any, unknown>;

	readonly Shared: {} = {};
	OnDependencyChanged = new Signal<[module: ModuleScript]>();
	private _DestroyHooks: {
		Order: number;
		Callback: () => void;
	}[] = [];

	constructor() {
		const uid = HttpService.GenerateGUID(false);
		this.EnvironmentUID = uid;
	}
	EnableGlobalInjection() {
		if (!this._GlobalInjection) {
			this._GlobalInjection = {};
		}
	}
	InjectGlobal(key: keyof any, value: unknown) {
		this.EnableGlobalInjection();
		this._GlobalInjection![key] = value;
	}
	GetInjectedGlobal(key: keyof any) {
		return this._GlobalInjection![key];
	}
	GetGlobalInjection() {
		return this._GlobalInjection;
	}

	private _RegistryDependency(module: ModuleScript, result?: any) {
		this._Dependencies.set(module, { Result: result });
	}

	IsDependency(module: ModuleScript) {
		return this._Dependencies.has(module);
	}
	GetDependencyResult<T = unknown>(module: ModuleScript): T | undefined {
		return this._Dependencies.get(module)?.Result as T;
	}

	ListenDependency(module: ModuleScript) {
		if (!this._ActiveConnections) return;

		const listener = module.GetPropertyChangedSignal("Source").Connect(() => {
			if (!this._ActiveConnections) return;
			this.OnDependencyChanged.Fire(module);
		});
		this._Listeners.set(module, listener);
	}

	LoadDependency<T = unknown>(dependency: ModuleScript): Promise<T> {
		const cached = this.GetDependencyResult(dependency);
		if (cached !== undefined) {
			return Promise.resolve(cached as T);
		}
		const cachedLoader = this._DependencyLoaders.get(dependency) as Promise<T>;
		if (cachedLoader) {
			return cachedLoader.tap(() => {});
		}

		this.ListenDependency(dependency);

		const promise = LoadVirtualModule(dependency, this).tap((result) => {
			this._RegistryDependency(dependency, result);
		});
		this._DependencyLoaders.set(dependency, promise);

		return promise as Promise<T>;
	}

	HookOnDestroyed(callback: () => void, order: number = 0) {
		this._DestroyHooks.push({ Order: order, Callback: callback });
		this._DestroyHooks.sort((a, b) => a.Order < b.Order);
	}

	Destroy() {
		for (const hook of this._DestroyHooks) {
			hook.Callback();
		}

		this._ActiveConnections = false;
		this._Listeners.forEach((connection) => {
			connection.Disconnect();
		});
		this.OnDependencyChanged.Destroy();
	}
}
