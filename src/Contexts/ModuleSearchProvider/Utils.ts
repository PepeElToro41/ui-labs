import { Array } from "@rbxts/sift";
import { ArrayDescendants } from "Utils/InstanceUtils";

export function ExtensionPredicator(extension: string) {
	return (instance: Instance) => {
		return instance.Name.match("%" + extension + "$")[0] !== undefined;
	};
}


export function SearchPredicatedInstances(searchIn: Instance[], predicator: (instance: Instance) => boolean) {
   const filtered = Array.filter(ArrayDescendants(searchIn), predicator)
   return filtered;
}

export function RemoveExtension(instanceName: string, extension: string) {
	return instanceName.gsub("%" + extension + "$", "")[0];
} 

export function ClassPredicator<T extends keyof Instances>(
	className: T,
	filterPredicator: (checkInstance: Instances[T]) => boolean,
) {
	return (instance: Instance): instance is Instances[T] => {
		const [sucess] = pcall(() => {
			return instance.Name;
		});
		if (!sucess) return false;
		if (!instance.IsA(className)) return false;
		return instance.Parent !== undefined && filterPredicator(instance);
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
