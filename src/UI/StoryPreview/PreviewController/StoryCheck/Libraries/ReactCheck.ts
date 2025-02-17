import { t } from "@rbxts/t";
import { LibCheckReturn } from "../LibraryDefine";

export const ReactKeys: string[] = ["react", "reactRoblox", "renderer"];

export function ReactChecker(value: Record<string, unknown>): LibCheckReturn {
	if (value["react"] === undefined) return "pass";
	if (value["reactRoblox"] === undefined) return "pass";

	if (!t.table(value["react"])) {
		return { Sucess: false, Error: "React library is not valid" };
	}
	if (!t.table(value["reactRoblox"])) {
		return { Sucess: false, Error: "ReactRoblox library is not valid" };
	}
	if (value["renderer"] !== undefined) {
		if (!t.literal("deferred", "legacy")(value["renderer"])) {
			return { Sucess: false, Error: `Key renderer must be "deferred" or "legacy" for React` };
		}
	}
	return "valid";
}
