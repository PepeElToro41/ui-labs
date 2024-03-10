import { Filter } from "@rbxts/ui-labs/src/ControlTypings/Primitives";

export function ApplyFilters(text: string, filters: Filter[]) {
	if (filters.size() <= 0) return text;
	let filtered = text;

	filters.forEach((filter) => {
		filtered = filter(filtered, text);
	});
	return filtered;
}

export function GetRoundedNumber(num: number) {
	const numString = tostring(num);
	const dotPosition = string.find(numString, "%.")[0];

	if (dotPosition !== undefined) {
		const truncatedString = string.sub(numString, 1, dotPosition + 3);
		return tonumber(truncatedString);
	} else {
		return num;
	}
}
