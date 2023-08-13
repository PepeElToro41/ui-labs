import { createProducer, loggerMiddleware } from "@rbxts/reflex";

//Story nodes, these are what is displayed in the UI-Labs explorer

interface FilterState {
	search: string | undefined;
}

const initialState: FilterState = {
	search: undefined,
} as const;

export const selectFilter = (state: RootState) => state.explorer.filter;

/** This producer holds the nodes, which are displayed in the explorer */
export const FilterProducer = createProducer(initialState, {
	setFilter: (state, search: string) => {
		return { ...state, search };
	},
});
