import { combineProducers, createProducer, loggerMiddleware } from "@rbxts/reflex";
import { FilterProducer } from "./Filter";
import { NodesProducer } from "./Nodes";

//Story nodes, these are what is displayed in the UI-Labs explorer

/** This producer holds the nodes, which are displayed in the explorer */
export const ExplorerProducer = combineProducers({
	nodes: NodesProducer,
	filter: FilterProducer,
});
