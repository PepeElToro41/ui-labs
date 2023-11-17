import { useEffect, useState } from "@rbxts/roact-hooked";

type PropertiesTable<T extends Instance> = Partial<WritableInstanceProperties<T>>;

//Sometimes I hate typescript
function CreateInstance<T extends Instance>(instance: T, props?: PropertiesTable<T>) {
	for (const [name, value] of pairs(props as object)) {
		pcall(() => (instance[name as never] = value as never));
	}
}

export function useInstance<T extends keyof CreatableInstances>(
	className: T,
	parent?: Instance,
	props?: PropertiesTable<CreatableInstances[T]>,
) {
	const [instance] = useState<CreatableInstances[T]>(() => new Instance(className, parent));
	useEffect(() => {
		CreateInstance(instance, props);
		return () => {
			if (instance && instance.Parent !== undefined) instance.Destroy();
		};
	}, []);
	return instance;
}
