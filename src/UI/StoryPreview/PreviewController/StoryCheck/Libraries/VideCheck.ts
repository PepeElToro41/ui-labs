import { t } from "@rbxts/t";
import { LibCheckReturn } from "../LibraryDefine";

export const VideKeys: string[] = ["vide"];

export function VideChecker(value: Record<string, unknown>): LibCheckReturn {
	if (value["vide"] === undefined) return "pass";
	if (!t.table(value["vide"])) {
		return { Sucess: false, Error: "Vide library is not valid" };
	}

	return "valid";
}
