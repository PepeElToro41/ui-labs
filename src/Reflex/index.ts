import { InferState, combineProducers, loggerMiddleware } from "@rbxts/reflex";
import { ThemeProducer } from "./Theme";
import { ExplorerProducer } from "./Explorer";
import { ModuleListProducer } from "./ModuleList";
import { StorySelectProducer } from "./StorySelect";
import { ModuleRequireProducer } from "./ModuleRequire";

declare global {
	type RootProducer = typeof RootProducer;
	type RootState = InferState<RootProducer>;
}

export const RootProducer = combineProducers({
	theme: ThemeProducer,
	explorer: ExplorerProducer,
	moduleList: ModuleListProducer,
	moduleRequire: ModuleRequireProducer,
	storySelect: StorySelectProducer,
});

//RootProducer.applyMiddleware(loggerMiddleware);
