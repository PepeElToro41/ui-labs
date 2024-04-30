import { Selection, StarterGui } from "@rbxts/services";
import { RemoveExtension } from "Hooks/Reflex/Control/ModuleList/Utils";
import Configs from "Plugin/Configs";

export function CreateEntrySnapshot(entry: PreviewEntry, name?: string) {
	const holder = entry.Holder;
	if (!holder || !holder.Parent) return;

	const module = entry.Module;

	const guiHolder = new Instance("ScreenGui");
	guiHolder.ZIndexBehavior = Enum.ZIndexBehavior.Sibling;
	guiHolder.Parent = StarterGui;
	guiHolder.Name = name ?? RemoveExtension(module.Name, Configs.Extensions.Story);

	holder.GetChildren().forEach((child) => {
		const newChild = child.Clone();
		newChild.Parent = guiHolder;
	});
	Selection.Set([guiHolder]);
}
export function ReloadEntry(entry: PreviewEntry) {
	const reloader = entry.HotReloader;
	if (reloader) {
		reloader.Reload();
	}
}
