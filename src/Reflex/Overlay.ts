import { createProducer } from "@rbxts/reflex";
import React from "@rbxts/react";

interface OverlayEntry {
	Key: string;
	Element: React.Element;
	Identifier?: unknown;
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
	setOverlay: (state, key: string, element: React.Element, identifier?: unknown) => {
		return {
			...state,
			overlay: {
				Key: key,
				Element: element,
				Identifier: identifier,
			},
		};
	},
	resetIdentifiedOverlay: (state, identifier: unknown) => {
		if (!state.overlay) return state;
		if (state.overlay.Identifier !== identifier) {
			return state;
		}
		return {
			...state,
			overlay: undefined,
		};
	},
	resetOverlay: (state) => {
		return {
			...state,
			overlay: undefined,
		};
	},
});
