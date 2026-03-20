import { useSelector } from "@rbxts/react-reflex";
import { selectStorybooks } from "Reflex/ModuleRequire/Storybook";

export function useStorybooks() {
	return useSelector(selectStorybooks).storybooks;
}
