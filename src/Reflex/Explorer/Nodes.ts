import { createProducer, loggerMiddleware } from "@rbxts/reflex";

//Story nodes, these are what is displayed in the UI-Labs explorer

interface NodesState {
	nodes: RootNodes;
}

const initialState: NodesState = {
	nodes: { storybooks: [], unknown: [] },
};

export const selectNodes = (state: RootState) => state.explorer.nodes;

/** This producer holds the nodes, which are displayed in the explorer */
export const NodesProducer = createProducer(initialState, {
	setNodeList: (state, storybooks: StorybookNode[], unknown: UnknownNode[]) => {
		const nodes = { storybooks, unknown };
		return { ...state, nodes };
	},
	setNodes: (state, nodes: RootNodes) => {
		return { ...state, nodes };
	},
});
