import { Environment } from "Utils/HotReloader/Environment";

export function CreateScheduler() {
	const environment = new Environment();
	environment.EnableGlobalInjection();
}

export function LoadStoryPreview(preview: PreviewEntry) {}

export function MountInSharedEnvironment(preview: PreviewEntry) {}
