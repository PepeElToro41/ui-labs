import Roact from "@rbxts/roact";

export const StoryContext = Roact.createContext({
	displayedNode: identity<StoryType | undefined>(undefined),
	displayNode: (newStory: StoryType) => {},
	updateDisplayNode: (nodes: MainNodes) => {},
});
