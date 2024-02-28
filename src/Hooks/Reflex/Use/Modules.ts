import { useSelector } from "@rbxts/react-reflex";
import { selectStory } from "Reflex/ModuleList/Story";
import { selectStorybookList } from "Reflex/ModuleList/Storybook";

export function useStoryList() {
	return useSelector(selectStory).list;
}

export function useStorybookList() {
	return useSelector(selectStorybookList).list;
}
