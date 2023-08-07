import { createProducer } from "@rbxts/reflex";

//Story nodes, these are what is displayed in the UI-Labs explorer

interface NodesState {
	nodes: RootNodes[];
}

const initialState = {};

export const selectNodes = (state: RootState) => state.nodes;

export const NodesProducer = createProducer(initialState, {});
