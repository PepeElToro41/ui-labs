import Signal from "@rbxts/signal";
import { LoadVirtualModule } from "./Utils";
import { Enviroment } from "./Enviroment";

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

type ReloadBinder = (enviroment: Enviroment) => void;

export class HotReloader {
	/**
	 * Requires the module and returns a promise that resolves when loaded, and the hot-reloader object
	 * @param module The module to reload
	 * @returns [Result: Promise<Result>, Reloader: HotReloader]
	 */

	readonly Module: ModuleScript;

	private Enviroment?: Enviroment;
	private ReloadPromise: Promise<unknown> | undefined;
	private EnviromentListener?: RBXScriptConnection;
	readonly OnReloadStarted: Signal<(promise: Promise<unknown>) => void>;
	private ReloadBinded?: ReloadBinder;

	AutoReload: boolean = true;

	constructor(module: ModuleScript) {
		this.Module = module;
		this.OnReloadStarted = new Signal();
	}

	private ClearReloader() {
		if (this.ReloadPromise) this.ReloadPromise.cancel();
		if (this.EnviromentListener && this.EnviromentListener.Connected) {
			this.EnviromentListener.Disconnect();
			this.EnviromentListener = undefined;
		}
		if (this.Enviroment) {
			this.Enviroment.Destroy();
			this.Enviroment = undefined;
		}
	}
	BindToReload(bind: ReloadBinder) {
		this.ReloadBinded = bind;
	}
	private RunBinded(enviroment: Enviroment) {
		if (this.ReloadBinded) {
			this.ReloadBinded(enviroment);
		}
	}

	Reload(): Promise<unknown> {
		this.ClearReloader();
		const enviroment = new Enviroment();
		this.Enviroment = enviroment;
		this.RunBinded(enviroment);

		const listener = enviroment.OnDependencyChanged.Once((module) => {
			if (!this.AutoReload) return;
			this.Reload();
		});
		this.EnviromentListener = listener;

		const handler = Promise.try(() => enviroment.LoadDependency(this.Module));
		this.ReloadPromise = handler;
		this.OnReloadStarted.Fire(handler);
		return handler;
	}

	Destroy() {
		this.ClearReloader();
	}
}
