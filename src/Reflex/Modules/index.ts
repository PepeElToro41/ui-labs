import { combineProducers } from "@rbxts/reflex";
import { StoryProducer } from "./Story";
import { StorybookProducer } from "./Storybook";

export const ModulesProducer = combineProducers({
	story: StoryProducer,
	storybook: StorybookProducer,
});
