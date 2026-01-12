import { combineProducers } from "@rbxts/reflex";

import { StoryListProducer } from "./Story";
import { StorybookListProducer } from "./Storybook";

export const ModuleListProducer = combineProducers({
	story: StoryListProducer,
	storybook: StorybookListProducer
});
