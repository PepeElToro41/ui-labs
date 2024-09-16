import { t } from "@rbxts/t";
import { LibCheckReturn } from "../LibraryDefine";

export const IrisKeys: string[] = ["iris"];

export function IrisChecker(value: Record<string, unknown>): LibCheckReturn {
	if (value["iris"] === undefined) return "pass";
	if (!t.table(value["iris"])) {
		return { Sucess: false, Error: "Iris library is not valid" };
	}

	return "valid";
}
