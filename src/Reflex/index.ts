import { InferState, combineProducers } from "@rbxts/reflex";
import { ThemeProducer } from "./Theme";
import { NodesProducer } from "./Nodes";
import { ModulesProducer } from "./Modules";
import { StorySelectProducer } from "./StorySelect";

declare global {
	type RootProducer = typeof RootProducer;
	type RootState = InferState<RootProducer>;
}

export const RootProducer = combineProducers({
	theme: ThemeProducer,
	nodes: NodesProducer,
	modules: ModulesProducer,
	storySelect: StorySelectProducer,
});
