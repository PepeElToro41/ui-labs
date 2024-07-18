import { useUnmountEffect } from "@rbxts/pretty-react-hooks";
import { ReturnControls } from "@rbxts/ui-labs/src/ControlTypings/Typing";
import { LibLike } from "@rbxts/ui-labs/src/Libs";
import { StoryBase, FunctionStory, WithRoact, WithReact, StoryInfo, ReactStory, RoactStory } from "@rbxts/ui-labs/src/Typing";

interface RoactElement {
	component: defined;
	props: defined;
	source?: string;
}

declare global {
	interface MountResults {
		Functional: FunctionStory;
		RoactLib: RoactStory<StoryInfo, LibLike.Roact>;
		ReactLib: ReactStory<StoryInfo, LibLike.React, LibLike.ReactRoblox>;
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

export function CheckStoryReturn(storyReturn: unknown): StoryCheck {
	const storyType = typeOf(storyReturn);
	if (storyType === "function") {
		const check: StoryCheck<"Functional"> = { Sucess: true, Type: "Functional", Result: storyReturn as MountResults["Functional"] };
		return check;
	} else if (storyType === "table") {
		return CheckTableStory(storyReturn as object);
	}
	return { Sucess: false, Error: `Story returned ${storyType}, this is not a valid type` };
}

export function CheckTableStory(storyReturn: object): StoryCheck {
	if (!("story" in storyReturn)) {
		return { Sucess: false, Error: 'Story table does not contain a "story" key, this is required to mount the story' };
	}
	//TODO: Check if the libraries are valid
	const hasRoact = "roact" in storyReturn;
	const hasReact = "react" in storyReturn;
	if (hasRoact) {
		const check: StoryCheck<"RoactLib"> = { Sucess: true, Type: "RoactLib", Result: storyReturn as MountResults["RoactLib"] };
		return check;
	}
	if (hasReact) {
		if (!("reactRoblox" in storyReturn)) {
			return {
				Sucess: false,
				Error: "React-Roblox library is missing",
			};
		}
		const check: StoryCheck<"ReactLib"> = { Sucess: true, Type: "ReactLib", Result: storyReturn as MountResults["ReactLib"] };
		return check;
	}
	return {
		Sucess: false,
		Error: "Story table does not contain a library key, internal roact will be used instead (this is not recommended)",
	};
}

//This hook runs the cleanup function automatically, because I always forget to add it ;-;
export function useStoryUnmount(story: StoryBase, unmounter: () => void) {
	useUnmountEffect(() => {
		unmounter();
		if (story.cleanup) {
			const [success, err] = pcall(story.cleanup);
			if (!success) {
				warn("UI-Labs: Error while running cleanup function: ", err);
			}
		}
	});
}
