import Signal from "@rbxts/signal";
import { LoadVirtualModule } from "./Utils";

type Dependencies = Map<ModuleScript, { Result: unknown }>;
type Listeners = Map<ModuleScript, RBXScriptConnection>;

export class Enviroment {
	private ActiveConnections = true;
	Shared: {} = {};
	Dependencies: Dependencies = new Map();
	Listeners: Listeners = new Map();
	OnDependencyChanged = new Signal<(module: ModuleScript) => void>();

	constructor() {}

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

	Destroy() {
		this.ActiveConnections = false;
		this.Listeners.forEach((connection) => {
			connection.Disconnect();
		});
		this.OnDependencyChanged.Destroy();
	}
}
