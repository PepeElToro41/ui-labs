import { combineProducers } from "@rbxts/reflex";
import { CanvasControlProducer } from "./CanvasControl";
import { StoryMountProducer } from "./StoryMount";

export const StoryPreviewProducer = combineProducers({
	mount: StoryMountProducer,
	canvas: CanvasControlProducer,
});
