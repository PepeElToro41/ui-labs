import { Filter } from "@rbxts/ui-labs/src/ControlTypings/Primitives";

export function ApplyFilters(text: string, filters: Filter[]) {
	if (filters.size() <= 0) return text;
	let filtered = text;

	filters.forEach((filter) => {
		filtered = filter(filtered, text);
	});
	return filtered;
}
