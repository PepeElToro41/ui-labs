import { t } from "@rbxts/t";
import { StoryBase } from "@rbxts/ui-labs/src/Typing/Typing";
import { ReactChecker, ReactKeys } from "./LIbraries/ReactCheck";
import { Cast } from "Utils/MiscUtils";
import { StoryCheck, StoryError } from "./StoryCheck";
import { RoactChecker, RoactKeys } from "./LIbraries/RoactCheck";
import { FusionChecker, FusionKeys } from "./LIbraries/FusionCheck";
import { GenericChecker, GenericKeys } from "./LIbraries/GenericCheck";
import Sift from "@rbxts/sift";

//TODO: Add control type
const CONTROL_TYPE = t.intersection(t.keys(t.string), t.values(t.any));

type StoryTypeCheck<T> = Required<{
	[K in keyof T]: t.check<T[K]>;
}>;

const STORY_TYPE: StoryTypeCheck<StoryBase & { use?: string; controls?: {} }> = {
	use: t.optional(t.string),
	controls: t.optional(CONTROL_TYPE),
	name: t.optional(t.string),
	summary: t.optional(t.string),
	cleanup: t.optional(t.function),
};

type LibraryType = keyof Omit<MountResults, "Functional">;

export type LibCheckReturn = "valid" | "pass" | StoryError;
type LibraryChecker = (lib: Record<string, unknown>) => LibCheckReturn;

const LibraryNames: Record<LibraryType, string> = {
	RoactLib: "Roact",
	ReactLib: "React",
	FusionLib: "Fusion",
	Generic: "Generic",
};

const Checkers: Record<LibraryType, LibraryChecker> = {
	RoactLib: RoactChecker,
	ReactLib: ReactChecker,
	FusionLib: FusionChecker,
	Generic: GenericChecker,
};
const LibraryKeys: Record<LibraryType, string[]> = {
	RoactLib: RoactKeys,
	ReactLib: ReactKeys,
	FusionLib: FusionKeys,
	Generic: GenericKeys,
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
		if (!check(value)) {
			return { Sucess: false, Error: `Story key "${key}" is not correct` };
		}
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
					return { Sucess: false, Error: `Key "story" is not present for ${LibraryNames[libraryType]}` };
				}
				if (!typeIs(storyReturn["story"], "function")) {
					return { Sucess: false, Error: `Key "story" must be a function for ${LibraryNames[libraryType]}` };
				}

				return { Sucess: true, Type: libraryType, Result: Cast<MountResults[MountType]>(storyReturn) };
			}

			return { Sucess: true, Type: libraryType, Result: Cast<MountResults[MountType]>(storyReturn) };
		} else if (result === "pass") {
			continue;
		}
		//result is an StoryError info here
		return result;
	}

	return { Sucess: false, Error: `Story table is not valid` };
}
