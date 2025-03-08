import { t } from "@rbxts/t";
import { LibCheckReturn } from "../LibraryDefine";

export const FusionKeys: string[] = ["fusion", "scoped"];

export function FusionChecker(value: Record<string, unknown>): LibCheckReturn {
	if (value["fusion"] === undefined) return "pass";
	if (!t.table(value["fusion"])) {
		return { Sucess: false, Error: "Fusion library is not valid" };
	}

	return "valid";
}
