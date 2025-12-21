import { createProducer } from "@rbxts/reflex";

interface StorybookListState {
	list: ModuleScript[];
}

const initialState: StorybookListState = {
	list: []
};

export const selectStorybookList = (state: RootState) => state.moduleList.storybook;

/** This producer holds a list of Storybook modules */
export const StorybookListProducer = createProducer(initialState, {
	setStorybookList: (_, list: ModuleScript[]) => {
		return { list };
	}
});
