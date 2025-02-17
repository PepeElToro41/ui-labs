import { LibCheckReturn } from "../LibraryDefine";

export const GenericKeys: string[] = ["render"];

export function GenericChecker(value: Record<string, unknown>): LibCheckReturn {
	if (value["render"] === undefined) return "pass";
	if (!typeIs(value["render"], "function")) {
		return { Sucess: false, Error: "Generic render must be a function" };
	}

	if ("render" in value && "story" in value) {
		return { Sucess: false, Error: "Render and Story keys were both given" };
	}

	return "valid";
}
