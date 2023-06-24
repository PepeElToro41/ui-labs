import { HttpService } from "@rbxts/services";
import Configs from "Plugin/Configs";

export function GetLabelName(module: ModuleScript) {
	return module.Name.gsub("%" + Configs.StoryExtension + "$", "")[0];
}

export function IsStory(instance: Instance) {
	if (!instance.IsA("ModuleScript")) return false;
	return instance.Name.match("%" + Configs.StoryExtension + "$")[0] !== undefined;
}

export function StoryPredicator(instance: Instance) {
	const [sucess] = pcall(() => {
		return instance.Name;
	});
	return sucess && instance.Parent !== undefined && IsStory(instance);
}

export function CheckPermission(instance: Instance) {
	const [sucess] = pcall(() => {
		return instance.Name;
	});
	return sucess;
}

export function DecodePath(referencePath: ReferencePath) {
	let currentParent: Instance = game.GetService(referencePath.Service);
	if (!currentParent) return undefined;
	for (let index = 0; index < referencePath.Path.size(); index++) {
		const name = referencePath.Path[index];
		const child = currentParent.FindFirstChild(name);
		if (child) {
			currentParent = child;
		} else {
			return undefined;
		}
	}
	return currentParent;
}

function IsService(instance: Instance) {
	const [sucess, instanceParent] = pcall(() => {
		return instance.Parent;
	});
	if (!sucess || !instanceParent) return;
	return instanceParent.IsA("DataModel");
}

export function IsValidUID(UID: unknown): UID is string {
	if (UID && typeIs(UID, "string") && UID.size() === 38 && UID.sub(1, 1) === "{" && UID.sub(38, 38) === "}") {
		return true;
	}
	return false;
}

export function GetUID(module: ModuleScript) {
	const UID = module.GetAttribute(Configs.UIDAttributeName);
	if (IsValidUID(UID)) {
		return UID;
	}
	module.SetAttribute(Configs.UIDAttributeName, HttpService.GenerateGUID(true));
	return module.GetAttribute(Configs.UIDAttributeName) as string;
}

export function EncodePath(module: ModuleScript): ReferencePath | undefined {
	const path: string[] = [];
	let currentParent = module.Parent;
	while (currentParent && !IsService(currentParent)) {
		path.insert(0, currentParent.Name);
		currentParent = currentParent.Parent;
	}
	if (!currentParent) return;
	return {
		Service: currentParent.Name as keyof Services,
		ModuleName: module.Name,
		Path: path,
	};
}

export function PropagateEvent<T extends Instance>(instance: T, ancestry: Instance, searchOn: T[]) {
	const allChanged: T[] = [instance];
	searchOn.forEach((children: T) => {
		if (children === instance) return;
		if (children.IsDescendantOf(ancestry)) {
			allChanged.push(children);
		}
	});
	return allChanged;
}
