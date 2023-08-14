type ReferencePath = { Service: keyof Services; ModuleName: string; Path: string[] };

function IsService(instance: Instance) {
	const [sucess, instanceParent] = pcall(() => {
		return instance.Parent;
	});
	if (!sucess || !instanceParent) return;
	return instanceParent.IsA("DataModel");
}

export function GetStringPath(module: ModuleScript) {
	const path = EncodePath(module);
	if (!path) return undefined;
	const pathText = path.Service + "/" + path.Path.join("/") + "/" + path.ModuleName;
	return pathText;
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
