import Sift from "@rbxts/sift";
import { Datatype, Primitive } from "@rbxts/ui-labs";
import { StoryBase } from "@rbxts/ui-labs/src/Typing/Typing";
import { AllControlsMap } from "UI/StoryControls/ControlMap";
import { Cast } from "Utils/MiscUtils";

import { FusionChecker, FusionKeys } from "./Libraries/FusionCheck";
import { GenericChecker, GenericKeys } from "./Libraries/GenericCheck";
import { IrisChecker, IrisKeys } from "./Libraries/IrisCheck";
import { ReactChecker, ReactKeys } from "./Libraries/ReactCheck";
import { RoactChecker, RoactKeys } from "./Libraries/RoactCheck";
import { VideChecker, VideKeys } from "./Libraries/VideCheck";
import { StoryCheck, StoryError } from "./StoryCheck";

//TODO: Add control type

function CHECK_OBJECT_CONTROL(control: Record<string, unknown>): "valid" | StoryError {
	if (!("EntryType" in control)) return { Sucess: false, Error: "Malformed control object" };

	if (control.EntryType === "Control") {
		if (!("Type" in control)) return { Sucess: false, Error: "Malformed control object" };
		if (!("ControlValue" in control)) return { Sucess: false, Error: "Malformed control object" };
		if (!((control.Type as string) in AllControlsMap)) {
			return { Sucess: false, Error: `Unknown control kind "${control.Type}", you might need to update UI Labs"` };
		}
	} else if (control.EntryType === "ControlGroup") {
		if (!("Controls" in control)) return { Sucess: false, Error: "Malformed control group" };
	} else {
		return { Sucess: false, Error: "Malformed control object" };
	}

	return "valid";
}

function CHECK_CONTROL_TYPE(control: unknown): "valid" | StoryError {
	if (typeIs(control, "table")) {
		return CHECK_OBJECT_CONTROL(control as Record<string, unknown>);
	} else {
		const controlType = typeOf(control);
		if (controlType in Primitive) {
			return "valid";
		} else if (controlType in Datatype) {
			return "valid";
		}
		return { Sucess: false, Error: `"${controlType}" is not valid control type` };
	}
}

function CHECK_CONTROL_LIST(control: unknown): "valid" | StoryError {
	if (control === undefined) {
		return "valid";
	}
	if (!typeIs(control, "table")) {
		return { Sucess: false, Error: "table expected, got " + typeOf(control) };
	}

	for (const [key, value] of pairs(control as Record<string, unknown>)) {
		const result = CHECK_CONTROL_TYPE(value);
		if (result !== "valid") {
			return {
				Sucess: false,
				Error: `control "${key}" is not valid: ${result.Error}`
			};
		}
	}
	return "valid";
}

function CHECK_OPTIONAL_STRING(val: unknown): "valid" | StoryError {
	if (val === undefined) return "valid";
	if (typeIs(val, "string")) return "valid";
	return { Sucess: false, Error: "string expected, got " + typeOf(val) };
}

function CHECK_OPTIONAL_FUNCTION(val: unknown): "valid" | StoryError {
	if (val === undefined) return "valid";
	if (typeIs(val, "function")) return "valid";
	return { Sucess: false, Error: "function expected, got " + typeOf(val) };
}

type StoryTypeCheck<T> = Required<{
	[K in keyof T]: (val: unknown) => "valid" | StoryError;
}>;

const STORY_TYPE: StoryTypeCheck<StoryBase & { use?: string; controls?: {} }> = {
	use: CHECK_OPTIONAL_STRING,
	controls: CHECK_CONTROL_LIST,
	name: CHECK_OPTIONAL_STRING,
	summary: CHECK_OPTIONAL_STRING,
	cleanup: CHECK_OPTIONAL_FUNCTION
};

type LibraryType = keyof Omit<MountResults, "Functional">;

export type LibCheckReturn = "valid" | "pass" | StoryError;
type LibraryChecker = (lib: Record<string, unknown>) => LibCheckReturn;

const LibraryNames: Record<LibraryType, string> = {
	RoactLib: "Roact",
	ReactLib: "React",
	FusionLib: "Fusion",
	IrisLib: "Iris",
	VideLib: "Vide",
	Generic: "Generic"
};

const Checkers: Record<LibraryType, LibraryChecker> = {
	RoactLib: RoactChecker,
	ReactLib: ReactChecker,
	FusionLib: FusionChecker,
	IrisLib: IrisChecker,
	VideLib: VideChecker,
	Generic: GenericChecker
};
const LibraryKeys: Record<LibraryType, string[]> = {
	RoactLib: RoactKeys,
	ReactLib: ReactKeys,
	FusionLib: FusionKeys,
	IrisLib: IrisKeys,
	VideLib: VideKeys,
	Generic: GenericKeys
};
const AllKeys = Sift.Dictionary.values(LibraryKeys).reduce<string[]>((a, b) => [...a, ...b], []);

type ErrorFormat = (key: string) => string;
function CheckExtraKeys(storyReturn: Record<string, unknown>, keys: string[], err: ErrorFormat): "valid" | StoryError {
	for (const [key, check] of pairs(storyReturn)) {
		if (check === undefined) continue;
		if (key in STORY_TYPE) continue;
		if (key === "story") continue;
		if (keys.includes(key)) continue;

		return { Sucess: false, Error: err(key) };
	}
	return "valid";
}

export function DefineStoryLibrary(storyReturn: Record<string, unknown>): StoryCheck {
	// step one: check the base indexes
	for (const [key, check] of pairs(STORY_TYPE)) {
		const value = storyReturn[key];
		const valid = check(value);
		if (valid === "valid") {
			continue;
		}
		return { Sucess: false, Error: `Story key "${key}" is not correct: ${valid.Error}` };
	}
	// step two: check for extra keys
	const result = CheckExtraKeys(storyReturn, AllKeys, (key) => {
		return `Unknown key "${key}" in story table`;
	});
	if (result !== "valid") return result;

	// step three: check for libraries
	for (const [libraryType, checker] of pairs(Checkers)) {
		const result = checker(storyReturn);
		if (result === "valid") {
			// step four: check for extra keys for the specific library
			const result = CheckExtraKeys(storyReturn, LibraryKeys[libraryType], (key) => {
				return `Unknown key "${key}" for ${LibraryNames[libraryType]}`;
			});
			if (result !== "valid") return result;

			// step five: check for story function
			if (libraryType !== "Generic") {
				if (!("story" in storyReturn)) {
					return {
						Sucess: false,
						Error: `Key "story" is not present for ${LibraryNames[libraryType]}`
					};
				}
				if (!typeIs(storyReturn["story"], "function")) {
					return {
						Sucess: false,
						Error: `Key "story" must be a function for ${LibraryNames[libraryType]}`
					};
				}

				return {
					Sucess: true,
					Type: libraryType,
					Result: Cast<MountResults[MountType]>(storyReturn)
				};
			}

			return {
				Sucess: true,
				Type: libraryType,
				Result: Cast<MountResults[MountType]>(storyReturn)
			};
		} else if (result === "pass") {
			continue;
		}
		//result is an StoryError info here
		return result;
	}

	return { Sucess: false, Error: `Story table is not valid` };
}
