import { createProducer } from "@rbxts/reflex";

declare global {
	type Storybooks = Map<ModuleScript, StorybookResult>;
	interface StorybookResult {
		name: string;
		storyRoots: Instance[];
		icon: string;
		groupRoots?: boolean;
	}
}

interface StorybooksState {
	storybooks: Storybooks;
}

export const selectStorybooks = (state: RootState) => state.moduleRequire.storybooks;

const initialState: StorybooksState = {
	storybooks: new Map(),
};

export const StorybooksProducer = createProducer(initialState, {
	setStorybooks: (_, storybooks: Storybooks) => {
		return { storybooks };
	},
});
