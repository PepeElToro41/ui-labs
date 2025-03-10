import { createProducer } from "@rbxts/reflex";

interface StorySelectionState {
	selected?: string;
}

const initialState: StorySelectionState = {
	selected: undefined
};

export const selectStorySelected = (state: RootState) =>
	state.storySelection.selected;

export const StorySelectionProducer = createProducer(initialState, {
	selectStory: (state, uid: string) => {
		return {
			...state,
			selected: uid
		};
	},
	deselectStory: (state) => {
		return {
			...state,
			selected: undefined
		};
	},
	selectHighestOrder: (state, previews: Map<string, PreviewEntry>) => {
		let highest: PreviewEntry;

		previews.forEach((entry) => {
			if (!highest) {
				highest = entry;
				return;
			}
			if (entry.Order >= highest.Order) {
				highest = entry;
			}
		});
		if (!highest!) return state;

		return {
			...state,
			selected: highest.Key
		};
	},
	toggleStory: (state, uid: string) => {
		const current = state.selected;
		return {
			...state,
			selected: uid === current ? undefined : uid
		};
	}
});
