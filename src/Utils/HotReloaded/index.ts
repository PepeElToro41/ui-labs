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

export class HotReloader {
	static LoadedModules = new Map<ModuleScript, HotReloader>();

	static require<T>(module: ModuleScript, forced = false): LuaTuple<[Promise<HotReloaderResult<T>>, HotReloader]> {
		const loadedModule = HotReloader.LoadedModules.get(module);

		if (loadedModule && !forced) {
			return $tuple(Promise.resolve(loadedModule.GetResults<T>()), loadedModule);
		} else {
			const newReloader = new HotReloader(module);
			HotReloader.LoadedModules.set(module, newReloader);
			return $tuple(newReloader.Reload<T>(), newReloader);
		}
	}

	GlobalEnv = {};
	Module: ModuleScript;
	OnReloaded: Signal<(result: HotReloaderResult) => void>;
	OnReloadStarted: Signal<(reloadProimse: Promise<HotReloaderResult>) => void>;
	Updater: RBXScriptConnection;
	ReloadPromise: Promise<HotReloaderResult> | undefined;
	Dependencies = new Map<ModuleScript, { Result: unknown; Listener: RBXScriptConnection }>();

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

	private _LoadDependency(dep: ModuleScript, requireHandler: (listenModule: ModuleScript) => void) {
		const [sucess, result] = LoadVirtualModule(dep, requireHandler, this.GlobalEnv);
		if (sucess) {
			return result;
		} else {
			this.Sucess = false;
			this.Error = result;
		}
	}

	private _RequireHandler(requiredModule: ModuleScript) {
		const cachedDependency = this.Dependencies.get(requiredModule);
		if (cachedDependency) return cachedDependency.Result;

		const sourceListen = requiredModule.GetPropertyChangedSignal("Source").Connect(() => {
			this.Reload();
		});

		const dependencyReturn = this._LoadDependency(requiredModule, (m: ModuleScript) => this._RequireHandler(m));
		this.Dependencies.set(requiredModule, { Result: dependencyReturn, Listener: sourceListen });
		return dependencyReturn;
	}
	private _ClearReloader() {
		if (this.ReloadPromise) this.ReloadPromise.cancel();
		this.Dependencies.forEach((dependency) => {
			dependency.Listener.Disconnect();
		});
		this.Dependencies.clear();
	}

	Reload<T = unknown>(globalEnv = {}): Promise<HotReloaderResult<T>> {
		this._ClearReloader();
		this.GlobalEnv = globalEnv;

		this.Sucess = true;
		const promiseHandler = new Promise<HotReloaderResult<T>>((resolve, reject) => {
			const [sucess, result] = LoadVirtualModule(this.Module, (m: ModuleScript) => this._RequireHandler(m), this.GlobalEnv);
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
		this._ClearReloader();
		this.OnReloadStarted.Destroy();
		this.OnReloaded.Destroy();
		this.Updater.Disconnect();
		if (HotReloader.LoadedModules.has(this.Module)) HotReloader.LoadedModules.delete(this.Module);
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
