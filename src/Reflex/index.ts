import { InferState, combineProducers, loggerMiddleware } from "@rbxts/reflex";
import { ThemeProducer } from "./Theme";
import { ExplorerProducer } from "./Explorer";
import { ModuleListProducer } from "./ModuleList";
import { ModuleRequireProducer } from "./ModuleRequire";
import { StoryPreviewProducer } from "./StoryPreview";
import { OverlayProducer } from "./Overlay";
import { InterfaceProducer } from "./Interface";
import { StorySelectionProducer } from "./StorySelection";
import { PluginProducer } from "./Plugin";

declare global {
	type RootProducer = typeof RootProducer;
	type RootState = InferState<RootProducer>;
}

export const RootProducer = combineProducers({
	theme: ThemeProducer,
	explorer: ExplorerProducer,
	overlay: OverlayProducer,
	interface: InterfaceProducer,
	plugin: PluginProducer,

	moduleList: ModuleListProducer,
	moduleRequire: ModuleRequireProducer,

	storyPreview: StoryPreviewProducer,
	storySelection: StorySelectionProducer,
});
