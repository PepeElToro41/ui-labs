import { createProducer, loggerMiddleware } from "@rbxts/reflex";

//Story nodes, these are what is displayed in the UI-Labs explorer

interface NodesState {
	nodes: RootNodes;
	nodemap: NodeMap;
}

const initialState: NodesState = {
	nodes: { storybooks: [], unknown: [] },
	nodemap: new Map(),
};

export const selectNodes = (state: RootState) => state.explorer.nodes;

export const selectNodeFromModule = (module: ModuleScript) => (state: RootState) => {
	const nodemap = selectNodes(state).nodemap;
	return nodemap.get(module);
};

/** This producer holds the nodes, which are displayed in the explorer */
export const NodesProducer = createProducer(initialState, {
	setNodeList: (state, storybooks: StorybookNode[], unknown: UnknownNode[], nodemap: NodeMap) => {
		const nodes = { storybooks, unknown };
		return { ...state, nodes, nodemap };
	},
	setNodes: (state, nodes: RootNodes, nodemap: NodeMap) => {
		return { ...state, nodes, nodemap };
	},
});
