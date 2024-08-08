import { useUnmountEffect } from "@rbxts/pretty-react-hooks";
import { StoryBase } from "@rbxts/ui-labs/src/Typing/Typing";

//This hook runs the cleanup function automatically, because I always forget to add it ;-;
export function useStoryUnmount(story: StoryBase, unmounter: () => void) {
	useUnmountEffect(() => {
		unmounter();
		if (story.cleanup) {
			const [success, err] = pcall(story.cleanup);
			if (!success) {
				warn("UI Labs: Error while running cleanup function: ", err);
			}
		}
	});
}
