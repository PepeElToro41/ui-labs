import { createProducer, loggerMiddleware } from "@rbxts/reflex";

interface FilterState {
	search: string | undefined;
}

const initialState: FilterState = {
	search: undefined
};

export const selectFilter = (state: RootState) => state.explorer.filter;

export const FilterProducer = createProducer(initialState, {
	setFilter: (state, setSearch: string) => {
		const search = setSearch === "" ? undefined : setSearch;
		return { ...state, search };
	}
});
