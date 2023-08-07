import { createProducer } from "@rbxts/reflex";

interface StorybookState {
	list: ModuleScript[];
}

const initialState = {
	list: [],
};

export const selectStorybook = (state: RootState) => state.modules.storybook;

export const StorybookProducer = createProducer(initialState, {});
