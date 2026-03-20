import { RunService } from "@rbxts/services";

import { Environment } from "./Environment";

export class EnvironmentHolder {
	private Environment?: Environment;
	private ShouldReload = false;

	LoadEntries: string[] = [];

	constructor(target: string) {}

	ClearEnvironment() {}

	ScheduleStory(uid: string) {
		if (this.LoadEntries.includes(uid)) return;

		this.LoadEntries.push(uid);
	}

	private Reload() {
		// clear
		let promiseHandler;
	}

	QueueReload() {
		if (this.ShouldReload) return;
		this.ShouldReload = true;
		RunService.Stepped.Once(() => {
			this.ShouldReload = false;
			this.Reload();
		});
	}

	Destroy() {}
}
