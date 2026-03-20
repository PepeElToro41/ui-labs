import { EnvironmentHolder } from "./Holder";

export class HotReloader {
	EnvironmentHolder: EnvironmentHolder;

	constructor(module: ModuleScript, holder: EnvironmentHolder) {
		this.EnvironmentHolder = holder;
	}
}
