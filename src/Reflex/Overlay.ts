import { createProducer } from "@rbxts/reflex";
import React from "@rbxts/react";

interface OverlayEntry {
	Key: string;
	Element: React.Element;
}
interface HintEntry {
	Id: string;
	Description: string;
	Holder?: Frame;
}

interface OverlayState {
	overlay?: OverlayEntry;
	hint?: HintEntry;
}

const initialState: OverlayState = {
	overlay: undefined,
};

export const selectOverlay = (state: RootState) => state.overlay.overlay;

export const OverlayProducer = createProducer(initialState, {
	setOverlay: (state, key: string, element: React.Element) => {
		return {
			...state,
			overlay: {
				Key: key,
				Element: element,
			},
		};
	},
	resetOverlay: (state) => {
		return {
			...state,
			overlay: undefined,
		};
	},
});
