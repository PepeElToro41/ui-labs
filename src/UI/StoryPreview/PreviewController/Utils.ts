import { Signal } from "@rbxts/lemon-signal";
import { useMemo } from "@rbxts/react";
import { StoryBase } from "@rbxts/ui-labs/src/Typing/Typing";

//This hook runs the cleanup function automatically, because I always forget to add it ;-;
export function useStoryUnmount(
	story: StoryBase,
	unmountSignal: Signal,
	unmounter: () => void
) {
	useMemo(() => {
		//using useMemo for running this instantly
		unmountSignal.Once(() => {
			unmounter();
			if (story.cleanup) {
				const [success, err] = pcall(story.cleanup);
				if (!success) {
					warn("UI Labs: Error while running cleanup function: ", err);
				}
			}
		});
	}, []);
}
