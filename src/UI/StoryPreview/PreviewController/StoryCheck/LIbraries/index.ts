import { t } from "@rbxts/t";
import { RoactCheck } from "./RoactCheck";
import { ReactCheck } from "./ReactCheck";
import { StoryCheck } from "../StoryCheck";
import { FusionCheck } from "./FusionCheck";
import { GenericCheck } from "./GenericCheck";

//TODO: Add control type
const CONTROL_TYPE = t.any;

const STORY_TYPE = {
	story: t.function,
	use: t.optional(t.string),
	controls: t.optional(CONTROL_TYPE),
	summary: t.optional(t.string),
	useGlobalZIndex: t.optional(t.boolean),
};

type LibraryChecker = Record<string, t.check<any>>;
const Checkers: Record<keyof Omit<MountResults, "Functional">, LibraryChecker> = {
	RoactLib: RoactCheck,
	ReactLib: ReactCheck,
	FusionLib: FusionCheck,
	Generic: GenericCheck,
};

export function DefinedStoryLibrary(storyReturn: unknown): StoryCheck {
	for (const [mountType, checkInterface] of pairs(Checkers)) {
		const checker = t.strictInterface({
			...STORY_TYPE,
			...checkInterface,
		}) as t.check<any>;

		if (checker(storyReturn)) {
			return { Sucess: true, Type: mountType, Result: storyReturn as MountResults[MountType] };
		}
	}

	return { Sucess: false, Error: `Story does not have a valid library` };
}
