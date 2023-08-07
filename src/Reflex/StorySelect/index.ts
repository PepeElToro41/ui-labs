import { combineProducers, createProducer } from "@rbxts/reflex";
import { StoryDisplayProducer } from "./StoryDisplay";
import { StoryHandleProducer } from "./StoryHandle";

export const StorySelectProducer = combineProducers({
	display: StoryDisplayProducer,
	handle: StoryHandleProducer,
});
