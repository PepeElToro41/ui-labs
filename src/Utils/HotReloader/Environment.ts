import Signal from "@rbxts/signal";
import { LoadVirtualModule } from "./Utils";
import { HttpService } from "@rbxts/services";

type Dependencies = Map<ModuleScript, { Result: unknown }>;
type Listeners = Map<ModuleScript, RBXScriptConnection>;

export class Environment {
	private ActiveConnections = true;
	private Dependencies: Dependencies = new Map();
	private Listeners: Listeners = new Map();

	readonly EnvironmentUID: string;
	GlobalInjection?: Record<keyof any, unknown>;

	Shared: {} = {};
	OnDependencyChanged = new Signal<(module: ModuleScript) => void>();
	private DestroyedHooked?: () => void;

	constructor() {
		const uid = HttpService.GenerateGUID(false);
		this.EnvironmentUID = uid;
	}

	InjectGlobal(key: keyof any, value: unknown) {
		if (!this.GlobalInjection) {
			this.GlobalInjection = {};
		}

		this.GlobalInjection[key] = value;
	}
	InjectEnvironmentUID() {
		this.InjectGlobal("EnvironmentUID", this.EnvironmentUID);
	}

	RegistryDependency(module: ModuleScript, result?: any) {
		this.Dependencies.set(module, { Result: result });
	}
	ListenDependency(module: ModuleScript) {
		if (!this.ActiveConnections) return;

		const listener = module.GetPropertyChangedSignal("Source").Connect(() => {
			if (!this.ActiveConnections) return;
			this.OnDependencyChanged.Fire(module);
		});
		this.Listeners.set(module, listener);
	}

	LoadDependency(dependency: ModuleScript) {
		const cached = this.Dependencies.get(dependency);
		if (cached) return cached.Result;
		this.ListenDependency(dependency);

		const [success, result] = LoadVirtualModule(dependency, this).await();
		this.RegistryDependency(dependency, success ? result : undefined);

		if (success) {
			return result;
		} else {
			throw result;
		}
	}

	HookOnDestroyed(callback: () => void) {
		this.DestroyedHooked = callback;
	}

	Destroy() {
		if (this.DestroyedHooked) {
			this.DestroyedHooked();
		}

		this.ActiveConnections = false;
		this.Listeners.forEach((connection) => {
			connection.Disconnect();
		});
		this.OnDependencyChanged.Destroy();
	}
}
