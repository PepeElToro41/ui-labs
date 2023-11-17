import { createProducer } from "@rbxts/reflex";

interface CanvasControlState {
	zoom: number;
	offset: Vector2;
}

const initialState: CanvasControlState = {
	zoom: 1,
	offset: new Vector2(),
};

export const selectCanvasControl = (state: RootState) => state.storyPreview.canvas;

export const CanvasControlProducer = createProducer(initialState, {
	setZoom: (state, zoom: number) => {
		return { ...state, zoom };
	},
	addZoom: (state, delta: number) => {
		return { ...state, zoom: state.zoom + delta };
	},
	setOffset: (state, offset: Vector2) => {
		return { ...state, offset };
	},
	addOffset: (state, delta: Vector2) => {
		return { ...state, offset: state.offset.add(delta) };
	},
});
