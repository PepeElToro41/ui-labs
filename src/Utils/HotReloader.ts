import { CollectionService } from "@rbxts/services";
import Configs from "Plugin/Configs";
import Signal from "./Signal";

export type HotReloaderResult<T> = LuaTuple<[boolean, T | string, HotReloader]>;

export class HotReloader {
	//Statics
	static LoadedModules = new Map<ModuleScript, HotReloader>();

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
	//Properties
	module: ModuleScript;
	onReloaded: Signal<(value: unknown) => void>;
	reloadBind: RBXScriptConnection;
	dependencyGlobal = {};
	dependencies = new Map<ModuleScript, [moduleResult: unknown, Bind: RBXScriptConnection]>();
	result: unknown;
	sucessed = false;
	//Methods
	private constructor(module: ModuleScript) {
		this.module = module;
		const newReloaded = new Signal<(value: unknown, newModule: ModuleScript) => void>();
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
			error(err);
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
			error(result);
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
			const dependencyCache = this.dependencies.get(listenModule);
			if (dependencyCache) return dependencyCache[0];
			const bind = listenModule.GetPropertyChangedSignal("Source").Connect(() => {
				this.Reload();
			});
			const setReturn = this._LoadDependency(listenModule, pushDependency);
			this.dependencies.set(listenModule, [setReturn, bind]);
			return setReturn;
		};

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
		const [sucess, result] = pcall(sourceRequire);
		this.sucessed = sucess;
		this.result = result as T;
		this.onReloaded.Fire([sucess, result as T, this]);
		return $tuple(sucess, result as T, this);
	}
}
