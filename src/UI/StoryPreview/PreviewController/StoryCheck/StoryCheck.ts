import { t } from "@rbxts/t";
import { FunctionStory, FusionStory, GenericStory, IrisStory, ReactStory, RoactStory, VideStory } from "@rbxts/ui-labs";
import { StoryInfo } from "@rbxts/ui-labs/src/Typing/Typing";
import { DefineStoryLibrary } from "./LibraryDefine";

declare global {
	interface MountResults {
		Functional: FunctionStory;
		RoactLib: RoactStory<StoryInfo>;
		ReactLib: ReactStory<StoryInfo>;
		FusionLib: FusionStory<StoryInfo>;
		IrisLib: IrisStory<StoryInfo>;
		VideLib: VideStory<StoryInfo>;
		Generic: GenericStory<StoryInfo>;
	}
	type MountType = keyof MountResults;
}

export type StoryError = {
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
		return {
			Sucess: true,
			Type: "Functional",
			Result: storyReturn as MountResults["Functional"]
		};
	} else if (CheckObjectStory(storyReturn)) {
		return DefineStoryLibrary(storyReturn);
	}
	return {
		Sucess: false,
		Error: `Story returned ${typeOf(storyReturn)}, this is not a valid type`
	};
}
const CheckFunctionStory = t.callback;
function CheckObjectStory(storyReturn: unknown): storyReturn is Record<string, unknown> {
	return t.interface({})(storyReturn);
}
