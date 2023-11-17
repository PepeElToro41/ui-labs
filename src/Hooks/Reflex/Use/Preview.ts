import { useSelector } from "@rbxts/roact-reflex";
import { selectCanvasControl } from "Reflex/StoryPreview/CanvasControl";
import { selectStoryMount } from "Reflex/StoryPreview/StoryMount";

export function useMountFrame() {
	return useSelector(selectStoryMount).mountFrame;
}

export function useCanvasControl() {
	return useSelector(selectCanvasControl);
}
