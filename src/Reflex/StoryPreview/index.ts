import { combineProducers } from "@rbxts/reflex";
import { StoryMountProducer } from "./StoryMount";

export const StoryPreviewProducer = combineProducers({
	mount: StoryMountProducer,
});
