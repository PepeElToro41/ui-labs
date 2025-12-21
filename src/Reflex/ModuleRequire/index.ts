import { combineProducers } from "@rbxts/reflex";
import { StorybooksProducer } from "./Storybook";

export const ModuleRequireProducer = combineProducers({
	storybooks: StorybooksProducer
});
