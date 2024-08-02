import { FunctionStory, FusionStory, GenericStory, ReactStory, RoactStory } from "@rbxts/ui-labs";
import { StoryInfo } from "@rbxts/ui-labs/src/Typing/Typing";
import { FusionCheck } from "./LIbraries/FusionCheck";
import { t } from "@rbxts/t";
import { DefinedStoryLibrary } from "./LIbraries";

declare global {
	interface MountResults {
		Functional: FunctionStory;
		RoactLib: RoactStory<StoryInfo>;
		ReactLib: ReactStory<StoryInfo>;
		FusionLib: FusionStory<StoryInfo>;
		Generic: GenericStory<StoryInfo>;
	}
	type MountType = keyof MountResults;
}

type StoryError = {
	Sucess: false;
	Error: string;
};
type StorySucess<T extends MountType> = {
	Sucess: true;
	Type: T;
	Result: MountResults[T];
};

export type StoryCheck<T extends MountType = MountType> = StorySucess<T> | StoryError;

export function CheckStory(storyReturn: unknown): StoryCheck {
	if (CheckFunctionStory(storyReturn)) {
		return { Sucess: true, Type: "Functional", Result: storyReturn as MountResults["Functional"] };
	} else if (CheckObjectStory(storyReturn)) {
		return DefinedStoryLibrary(storyReturn);
	}
	return { Sucess: false, Error: `Story returned ${typeOf(storyReturn)}, this is not a valid type` };
}
const CheckFunctionStory = t.callback;
const CheckObjectStory = t.table;
