import Roact from "@rbxts/roact";
import { IsStoryHandle } from "Declarations/Story";

export const StoryContext = Roact.createContext({
	displayedNode: identity<StoryNode | undefined>(undefined),
	displayNode: (newStory: StoryNode) => {},
	updateDisplayNode: (nodes: FolderNode[]) => {},
});
