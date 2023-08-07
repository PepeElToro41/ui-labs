import { createProducer } from "@rbxts/reflex";

interface StoryDisplayState {
	selected: StoryNode;
}

const initialState = {};

export const selectStoryDisplay = (state: RootState) => state.storySelect.display;

export const StoryDisplayProducer = createProducer(initialState, {});
