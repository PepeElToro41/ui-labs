import Signal from "@rbxts/signal";
import { LoadVirtualModule } from "./Utils";

declare global {
	type HotReloaderError = {
		Sucess: false;
		Error: string;
	};
	type HotReloaderSucess<T> = {
		Sucess: true;
		Result: T;
	};
	type HotReloaderIntrinsic = {
		Reloader: HotReloader;
	};

	type HotReloaderResult<T = unknown> = HotReloaderIntrinsic & (HotReloaderSucess<T> | HotReloaderError);
}

type Dependencies = Map<ModuleScript, { Result: unknown; Listener: RBXScriptConnection }>;

export class HotReloader {
	/**
	 * Requires the module and returns a promise that resolves when loaded, and the hot-reloader object
	 * @param module The module to reload
	 * @returns [Result: Promise<Result>, Reloader: HotReloader]
	 */
	static require<T = unknown>(module: ModuleScript) {
		const newReloader = new HotReloader(module);
		return { Result: newReloader.Reload<T>(), Reloader: newReloader };
	}

	private GlobalEnv = {};
	private Updater: RBXScriptConnection;
	private Dependencies: Dependencies = new Map();
	private ReloadPromise: Promise<HotReloaderResult> | undefined;

	readonly Module: ModuleScript;
	readonly OnReloaded: Signal<(result: HotReloaderResult) => void>;
	readonly OnReloadStarted: Signal<(reloadProimse: Promise<HotReloaderResult>) => void>;

	Sucess = false;
	Result: unknown;
	Error: string | undefined;

	private constructor(module: ModuleScript) {
		this.Module = module;

		this.OnReloaded = new Signal<(result: HotReloaderResult) => void>();
		this.OnReloadStarted = new Signal<(reloadProimse: Promise<HotReloaderResult>) => void>();

		const updater = module.GetPropertyChangedSignal("Source").Connect(() => {
			this.Reload();
		});

		this.Updater = updater;
	}

	/**
	 * Virtually requires a module in an isolated enviroment
	 * @param module module to load (require)
	 * @param requireHandler Function that will replace the "require" global
	 */
	private LoadDependency(module: ModuleScript, requireHandler: (listenModule: ModuleScript) => void, enviroment: {}) {
		const [sucess, result] = LoadVirtualModule(module, requireHandler, enviroment);
		if (sucess) {
			return result;
		} else {
			this.Sucess = false;
			this.Error = result;
		}
	}

	private DependencyLoader(requiredModule: ModuleScript, dependencies: Dependencies, enviroment: {}) {
		const cachedDependency = dependencies.get(requiredModule);
		if (cachedDependency) return cachedDependency.Result;

		const sourceListen = requiredModule.GetPropertyChangedSignal("Source").Connect(() => {
			this.Reload();
		});

		const dependencyReturn = this.LoadDependency(
			requiredModule,
			(m: ModuleScript) => this.DependencyLoader(m, dependencies, enviroment),
			enviroment,
		);
		dependencies.set(requiredModule, { Result: dependencyReturn, Listener: sourceListen });
		return dependencyReturn;
	}
	private ClearReloader() {
		if (this.ReloadPromise) this.ReloadPromise.cancel();
		this.Dependencies.forEach((dependency) => {
			dependency.Listener.Disconnect();
		});
		this.Dependencies = new Map();
	}

	Reload<T = unknown>(globalEnv?: object): Promise<HotReloaderResult<T>> {
		this.ClearReloader();
		this.GlobalEnv = globalEnv ?? {};
		this.Sucess = true;
		const dependencies = this.Dependencies; //cached to avoid race conditions
		const enviroment = this.GlobalEnv; //cached to avoid race conditions

		const promiseHandler = new Promise<HotReloaderResult<T>>((resolve, reject) => {
			const [sucess, result] = LoadVirtualModule(
				this.Module,
				(m: ModuleScript) => this.DependencyLoader(m, dependencies, enviroment),
				enviroment,
			);
			if (sucess) {
				if (!this.Sucess) return reject(this.Error);
				this.Sucess = true;
				this.Result = result;
				return resolve(this.GetResults<T>());
			} else {
				this.Sucess = false;
				this.Error = result;
				return reject(result);
			}
		}).tap((result) => {
			this.OnReloaded.Fire(result);
		});

		this.ReloadPromise = promiseHandler;
		this.OnReloadStarted.Fire(promiseHandler);
		return promiseHandler;
	}

	Destroy() {
		this.ClearReloader();
		this.OnReloadStarted.Destroy();
		this.OnReloaded.Destroy();
		this.Updater.Disconnect();
	}

	GetResults<T = unknown>(): HotReloaderResult<T> {
		if (this.Sucess) {
			return {
				Sucess: true,
				Result: this.Result as T,
				Reloader: this,
			};
		} else {
			return {
				Sucess: false,
				Error: this.Error!,
				Reloader: this,
			};
		}
	}
}
