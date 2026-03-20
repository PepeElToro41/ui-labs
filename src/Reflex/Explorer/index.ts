import { combineProducers, createProducer, loggerMiddleware } from "@rbxts/reflex";

import { FilterProducer } from "./Filter";
import { NodesProducer } from "./Nodes";

export const ExplorerProducer = combineProducers({
	nodes: NodesProducer,
	filter: FilterProducer
});
