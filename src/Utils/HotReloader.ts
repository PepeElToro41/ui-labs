import Signal from "./Signal";

export type HotReloaderResult<T> = LuaTuple<[boolean, T | string, HotReloader]>;

//SLIDER INSIDE LIGHT THEME 194, 231, 255

export class HotReloader {
	//Statics
	static LoadedModules = new Map<ModuleScript, HotReloader>();
	static IgnoreList: Instance[] | undefined = undefined;
	static ReloadModule<T>(module: ModuleScript) {
		const loadedModule = HotReloader.LoadedModules.get(module);
		if (!loadedModule) return;
		return loadedModule.Reload<T>();
	}
	static require<T>(module: ModuleScript) {
		const loadedModule = HotReloader.LoadedModules.get(module);
		if (loadedModule) {
			return $tuple(loadedModule.sucessed, loadedModule.result as T, loadedModule);
		} else {
			const newReloader = new HotReloader(module);
			HotReloader.LoadedModules.set(module, newReloader);
			return newReloader.Reload<T>();
		}
	}
	static requireAsync<T>(module: ModuleScript) {
		const loadedModule = HotReloader.LoadedModules.get(module);
		if (loadedModule) {
			return Promise.resolve([loadedModule.sucessed, loadedModule.result, loadedModule]);
		} else {
			const newReloader = new HotReloader(module);
			HotReloader.LoadedModules.set(module, newReloader);
			return Promise.try(() => newReloader.Reload<T>());
		}
	}
	static requireConnect<T>(module: ModuleScript, callback: (result: unknown) => void) {
		const loadedModule = HotReloader.LoadedModules.get(module);
		if (loadedModule) {
			const newFakeSignal = new Signal<(value: unknown) => void>();
			const connection = newFakeSignal.ConnectOnce(callback);
			newFakeSignal.Fire([loadedModule.sucessed, loadedModule.result as T, loadedModule]);
			return connection;
		} else {
			const newReloader = new HotReloader(module);
			HotReloader.LoadedModules.set(module, newReloader);
			const connection = newReloader.onReloaded.ConnectOnce(callback);
			task.spawn(() => newReloader.Reload<T>());
			return connection;
		}
	}
	//Properties
	module: ModuleScript;
	onReloaded: Signal<(value: [sucess: boolean, result: unknown, reloader: HotReloader]) => void>;
	reloadBind: RBXScriptConnection;
	dependencyGlobal = {};
	dependencies = new Map<ModuleScript, [moduleResult: unknown, Bind: RBXScriptConnection]>();
	result: unknown;
	sucessed = true;
	//Methods
	private constructor(module: ModuleScript) {
		this.module = module;
		const newReloaded = new Signal<(value: [sucess: boolean, result: unknown, reloader: HotReloader]) => void>();
		this.onReloaded = newReloaded;
		this.reloadBind = module.GetPropertyChangedSignal("Source").Connect(() => {
			this.Reload();
		});
	}
	Destroy() {
		this.dependencies.forEach((depdency) => {
			const bind = depdency[1];
			bind.Disconnect();
		});
		this.dependencies.clear();
		this.onReloaded.Destroy();
		if (this.reloadBind) {
			this.reloadBind.Disconnect();
		}
		if (HotReloader.LoadedModules.has(this.module)) {
			HotReloader.LoadedModules.delete(this.module);
		}
	}
	private _LoadDependency(dependency: ModuleScript, pushDependency: (listenModule: ModuleScript) => void) {
		//todo: this is almost a copy of the code below (just slightly different), maybe make it a function?
		const [dependencyRequire, err] = loadstring(dependency.Source, dependency.GetFullName());
		if (dependencyRequire === undefined) {
			//todo: add error handling
			this.sucessed = false;
			this.result = err;
			return;
		}
		const ReloadEnvMT = setmetatable(
			{
				require: (module2: ModuleScript) => {
					return pushDependency(module2);
				},
				script: dependency,
				_G: this.dependencyGlobal,
			},
			{
				__index: getfenv(),
			},
		);
		setfenv(dependencyRequire, ReloadEnvMT);
		const [sucess, result] = pcall(dependencyRequire);
		if (sucess) {
			return result;
		} else {
			//todo: add error handling
			this.sucessed = false;
			this.result = result;
		}
	}

	Reload<T>(): HotReloaderResult<T> {
		this.dependencies.forEach((dependency) => {
			const bind = dependency[1];
			bind.Disconnect();
		});
		this.dependencies.clear();
		this.dependencyGlobal = {};
		const pushDependency = (listenModule: ModuleScript) => {
			if (HotReloader.IgnoreList) {
				for (let index = 0; index < HotReloader.IgnoreList.size(); index++) {
					const ignoreInstance = HotReloader.IgnoreList[index];
					if (listenModule.IsDescendantOf(ignoreInstance)) {
						return require(listenModule);
					}
				}
			}
			const dependencyCache = this.dependencies.get(listenModule);
			if (dependencyCache) return dependencyCache[0];
			const bind = listenModule.GetPropertyChangedSignal("Source").Connect(() => {
				this.Reload();
			});
			const setReturn = this._LoadDependency(listenModule, pushDependency);
			this.dependencies.set(listenModule, [setReturn, bind]);
			return setReturn;
		};
		this.sucessed = true;
		const [sourceRequire, err] = loadstring(this.module.Source, this.module.GetFullName());
		if (sourceRequire === undefined) {
			this.result = err;
			this.sucessed = false;
			return $tuple(false, err!, this);
		}

		const envMT = setmetatable(
			{
				require: (module: ModuleScript) => {
					return pushDependency(module);
				},
				script: this.module,
				_G: this.dependencyGlobal,
			},
			{
				__index: getfenv(),
			},
		);
		setfenv(sourceRequire, envMT);
		const [sucess, result] = pcall<[], {}>(sourceRequire);
		if (this.sucessed) {
			this.result = result as T;
			this.sucessed = sucess;
		}
		this.onReloaded.Fire([this.sucessed, this.result as T, this]);
		return $tuple(sucess, result as T, this);
	}
}
