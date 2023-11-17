import { FunctionalStory } from "@rbxts/ui-labs";
import { ReturnControls, StoryWithReact, StoryWithRoact, WithControlsBase } from "@rbxts/ui-labs/src/ControlTypings/Typing";

interface RoactElement {
	component: defined;
	props: defined;
	source?: string;
}

declare global {
	interface MountResults {
		Functional: FunctionalStory;
		RoactLib: WithControlsBase<ReturnControls> & StoryWithRoact;
		ReactLib: WithControlsBase<ReturnControls> & StoryWithReact;
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
		return { Sucess: false, Error: "Story table does not contain a story key, this is required to mount the story" };
	}
	//TODO: Check if the libraries are valid
	const hasRoact = "roact" in storyReturn;
	const hasReact = "react" in storyReturn && "reactRoblox" in storyReturn;
	if (hasRoact) {
		const check: StoryCheck<"RoactLib"> = { Sucess: true, Type: "RoactLib", Result: storyReturn as MountResults["RoactLib"] };
		return check;
	}
	if (hasReact) {
		const check: StoryCheck<"ReactLib"> = { Sucess: true, Type: "ReactLib", Result: storyReturn as MountResults["ReactLib"] };
		return check;
	}
	return {
		Sucess: false,
		Error: "Story table does not contain a library key, internal roact will be used instead (this is not recommended)",
	};
}
