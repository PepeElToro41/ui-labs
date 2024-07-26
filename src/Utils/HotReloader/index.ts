import Signal from "@rbxts/signal";
import { LoadVirtualModule } from "./Utils";
import { Environment } from "./Environment";

declare global {
	type HotReloaderError = {
		Sucess: false;
		Error: string;
	};
	type HotReloaderSucess = {
		Sucess: true;
		Result: unknown;
	};
	type HotReloaderIntrinsic = {
		Reloader: HotReloader;
	};

	type HotReloaderResult = HotReloaderIntrinsic & (HotReloaderSucess | HotReloaderError);
}

type ReloadBinder = (environment: Environment) => void;

export class HotReloader {
	/**
	 * Requires the module and returns a promise that resolves when loaded, and the hot-reloader object
	 * @param module The module to reload
	 * @returns [Result: Promise<Result>, Reloader: HotReloader]
	 */

	readonly Module: ModuleScript;

	private Environment?: Environment;
	private ReloadPromise: Promise<unknown> | undefined;
	private EnvironmentListener?: RBXScriptConnection;
	readonly OnReloadStarted: Signal<(promise: Promise<unknown>) => void>;
	private ReloadBinded?: ReloadBinder;

	AutoReload: boolean = true;

	constructor(module: ModuleScript) {
		this.Module = module;
		this.OnReloadStarted = new Signal();
	}

	private ClearReloader() {
		if (this.ReloadPromise) this.ReloadPromise.cancel();
		if (this.EnvironmentListener && this.EnvironmentListener.Connected) {
			this.EnvironmentListener.Disconnect();
			this.EnvironmentListener = undefined;
		}
		if (this.Environment) {
			this.Environment.Destroy();
			this.Environment = undefined;
		}
	}
	BindToReload(bind: ReloadBinder) {
		this.ReloadBinded = bind;
	}
	private RunBinded(environment: Environment) {
		if (this.ReloadBinded) {
			this.ReloadBinded(environment);
		}
	}

	Reload(): Promise<unknown> {
		this.ClearReloader();
		const environment = new Environment();
		this.Environment = environment;
		this.RunBinded(environment);

		const listener = environment.OnDependencyChanged.Once((module) => {
			if (!this.AutoReload) return;
			this.Reload();
		});
		this.EnvironmentListener = listener;

		const handler = Promise.try(() => environment.LoadDependency(this.Module));
		this.ReloadPromise = handler;
		this.OnReloadStarted.Fire(handler);
		return handler;
	}

	Destroy() {
		this.ClearReloader();
	}
}
