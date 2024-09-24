import { derive, indexes } from "@rbxts/vide";
import { Derived } from ".";

export function array_keys<T extends Record<string, any>, K extends keyof T, V>(
	input: Derived<T[]>,
	key: K,
	transform: (value: Derived<T>, key: T[K], index: Derived<number>) => V,
): Derived<V[]> {
	const indexedArray = derive(() => {
		const map = new Map<T[K], { Index: number; Value: T }>();

		input().forEach((item, index) => {
			map.set(item[key], { Index: index, Value: item });
		});
		return map;
	});

	return indexes(indexedArray, (item, key) => {
		const itemValue = () => item().Value;
		const itemIndex = () => item().Index;

		return transform(itemValue, key, itemIndex);
	});
}
