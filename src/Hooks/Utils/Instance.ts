import { useEffect, useMemo, useState } from "@rbxts/roact";

type PropertiesTable<T extends Instance> = Partial<WritableInstanceProperties<T>>;

function PrepareInstance<T extends Instance>(instance: T, props?: PropertiesTable<T>) {
	for (const [name, value] of pairs(props as object)) {
		pcall(() => {
			instance[name as never] = value as never;
		});
	}
}

export function useInstance<T extends keyof CreatableInstances>(
	className: T,
	parent?: Instance,
	props?: PropertiesTable<CreatableInstances[T]>,
) {
	const instance = useMemo<CreatableInstances[T]>(() => {
		const newInstance = new Instance(className);
		if (props !== undefined) {
			PrepareInstance(newInstance, props);
		}
		if (parent) {
			newInstance.Parent = parent;
		}
		return newInstance;
	}, []);

	useEffect(() => {
		return () => {
			if (instance && instance.Parent !== undefined) {
				instance.Destroy();
			}
		};
	}, []);

	return instance;
}
