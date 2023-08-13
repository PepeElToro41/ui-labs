import { createProducer } from "@rbxts/reflex";

interface StoryState {
	list: ModuleScript[];
}

const initialState: StoryState = {
	list: [],
};

export const selectStory = (state: RootState) => state.moduleList.story;

/** This producer holds a list of Story modules */
export const StoryListProducer = createProducer(initialState, {
	setStoryList: (_, list: ModuleScript[]) => {
		return { list, nothere: "" };
	},
});
