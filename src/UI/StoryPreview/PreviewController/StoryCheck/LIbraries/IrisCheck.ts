import { t } from "@rbxts/t";
import { LibCheckReturn } from "../LibraryDefine";

export const RoactKeys: string[] = ["roact"];

export function RoactChecker(value: Record<string, unknown>): LibCheckReturn {
	if (value["roact"] === undefined) return "pass";
	if (!t.table(value["roact"])) {
		return { Sucess: false, Error: "Roact library is not valid" };
	}

	return "valid";
}
