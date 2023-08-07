import { createProducer } from "@rbxts/reflex";

interface StoryState {
	list: ModuleScript[];
}

const initialState = {
	list: [],
};

export const selectStory = (state: RootState) => state.modules.story;

export const StoryProducer = createProducer(initialState, {});
