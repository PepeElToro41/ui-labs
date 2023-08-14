import { createProducer } from "@rbxts/reflex";

interface StoryDisplayState {
	selected: StoryNode | undefined;
}

const initialState: StoryDisplayState = {
	selected: undefined,
};

export const selectStoryDisplay = (state: RootState) => state.storySelect.display;

export const StoryDisplayProducer = createProducer(initialState, {
	selectStory: (state, setSelected: StoryNode) => {
		const selected = state.selected && state.selected === setSelected ? undefined : setSelected;
		return { ...state, selected };
	},
});
