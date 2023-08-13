import { useSelector } from "@rbxts/roact-reflex";
import { selectStorybooks } from "Reflex/ModuleRequire/Storybook";

export function useStorybooks() {
	return useSelector(selectStorybooks).storybooks;
}
