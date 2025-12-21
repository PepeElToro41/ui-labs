import Signal from "@rbxts/lemon-signal";
import { Environment } from "./Environment";

export class HotReloader<T = unknown> {
	/**
	 * Requires the module and returns a promise that resolves when loaded, and the hot-reloader object
	 * @param module The module to reload
	 * @returns [Result: Promise<Result>, Reloader: HotReloader]
	 */

	readonly Module: ModuleScript;
	private _Environment?: Environment;
	private _ReloadPromise: Promise<T> | undefined;
	private _EnvironmentListener?: RBXScriptConnection;
	private _ChangeDefer?: RBXScriptConnection;

	readonly OnReloadStarted: Signal<[promise: Promise<T>]>;
	readonly OnDependencyChanged: Signal<[module: ModuleScript, environment: Environment]>;
	private _ReloadHooks: {
		Order: number;
		Callback: (environment: Environment) => void;
	}[] = [];

	AutoReload: boolean = true;

	constructor(module: ModuleScript) {
		this.Module = module;
		this.OnReloadStarted = new Signal();
		this.OnDependencyChanged = new Signal();
	}

	private _ClearReloader() {
		if (this._ReloadPromise) this._ReloadPromise.cancel();
		if (this._EnvironmentListener && this._EnvironmentListener.Connected) {
			this._EnvironmentListener.Disconnect();
			this._EnvironmentListener = undefined;
		}
		if (this._ChangeDefer && this._ChangeDefer.Connected) {
			this._ChangeDefer.Disconnect();
			this._ChangeDefer = undefined;
		}
		if (this._Environment) {
			this._Environment.Destroy();
			this._Environment = undefined;
		}
	}
	HookOnReload(bind: (environment: Environment) => void, order: number = 0) {
		this._ReloadHooks.push({ Order: order, Callback: bind });
		this._ReloadHooks.sort((a, b) => a.Order < b.Order);
	}

	private _RunHooks(environment: Environment) {
		for (const hook of this._ReloadHooks) {
			hook.Callback(environment);
		}
	}
	GetEnvironment(): Environment | undefined {
		return this._Environment;
	}
	ScheduleReload() {
		const isDefered = this._ChangeDefer && this._ChangeDefer.Connected;
		if (!isDefered) {
			this._ChangeDefer = game.GetService("RunService").Heartbeat.Once(() => {
				this.Reload();
			});
		}
	}
	Reload(): Promise<T> {
		this._ClearReloader();
		const environment = new Environment();
		this._Environment = environment;

		this._RunHooks(environment);

		const listener = environment.OnDependencyChanged.Connect((module) => {
			this.OnDependencyChanged.Fire(module, environment);
			if (!this.AutoReload) return;
			this.ScheduleReload();
		});
		this._EnvironmentListener = listener;

		const handler = environment.LoadDependency<T>(this.Module);
		this._ReloadPromise = handler;
		this.OnReloadStarted.Fire(handler);
		return handler;
	}

	Destroy() {
		this._ClearReloader();
	}
}
