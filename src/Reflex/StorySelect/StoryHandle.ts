import { createProducer } from "@rbxts/reflex";

interface StoryHandleState {}

const initialState = {};

export const selectStoryHandle = (state: RootState) => state.storySelect.handle;

export const StoryHandleProducer = createProducer(initialState, {});
