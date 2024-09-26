export function ArrayDescendants(instanceArray: Instance[]) {
	const descendants: Instance[] = [];

	instanceArray.forEach((instance) => {
		instance.GetDescendants().forEach((descendant) => {
			descendants.push(descendant);
		});
	});
	return descendants;
}

export function FromServiceNames<T extends (keyof Services)[]>(serviceTable: T, iterator?: (service: Instance) => void) {
	const servicesFound: Services[T[number]][] = [];

	serviceTable.forEach((serviceName) => {
		const service = game.GetService(serviceName) as Services[T[number]];
		if (!service) return;
		servicesFound.push(service);
		if (iterator) iterator(service);
	});

	return servicesFound;
}

function IsService(instance: Instance) {
	const [sucess, instanceParent] = pcall(() => {
		return instance.Parent;
	});
	if (!sucess || !instanceParent) return;
	return instanceParent.IsA("DataModel");
}

export interface ReferencePath {
	Service: keyof Services;
	Instance: Instance;
	Path: Instance[];
}

export function CreateInstancePath(instance: Instance): ReferencePath | undefined {
	const path: Instance[] = [];
	let currentParent = instance.Parent;
	while (currentParent && !IsService(currentParent)) {
		path.insert(0, currentParent);
		currentParent = currentParent.Parent;
	}
	if (!currentParent) return;
	return {
		Service: currentParent.Name as keyof Services,
		Instance: instance,
		Path: path,
	};
}

export function EncodeInstancePath(referencePath: ReferencePath, separator: string = "\\") {
	let path = referencePath.Service + separator;

	referencePath.Path.forEach((parent) => {
		path += parent.Name + separator;
	});
	path += referencePath.Instance.Name;

	return path;
}
