import { HotReloader } from "@rbxts/hmr";
import { Signal } from "@rbxts/lemon-signal";

export class StorybookLoader {
	private StorybookResult?: unknown = undefined;
	Module: ModuleScript;
	OnStorybookUpdated: Signal;
	HotReloader?: HotReloader;
	ReloadPromise?: Promise<unknown>;
	HotReloaderConnection?: RBXScriptConnection;

	constructor(module: ModuleScript) {
		this.OnStorybookUpdated = new Signal();
		this.Module = module;
	}
	GetCurrentResult() {
		return this.StorybookResult;
	}
	Init() {
		const reloader = new HotReloader(this.Module);
		this.HotReloader = reloader;

		this.OnReloadPromise(reloader.Reload());

		this.HotReloaderConnection = reloader.OnReloadStarted.Connect((result) => {
			this.OnReloadPromise(result);
		});
	}
	OnReloadPromise(result: Promise<unknown>) {
		if (this.ReloadPromise) {
			this.ReloadPromise.cancel();
		}

		this.ReloadPromise = result.then((result) => {
			this.StorybookResult = result;
			this.OnStorybookUpdated.Fire();
		});
	}
	Destroy() {
		if (this.ReloadPromise) this.ReloadPromise.cancel();
		if (this.HotReloaderConnection) this.HotReloaderConnection.Disconnect();
		if (this.HotReloader) this.HotReloader.Destroy();
	}
}
