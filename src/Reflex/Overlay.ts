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
	popup?: OverlayEntry;
	hint?: HintEntry;
	overlays: Map<string, OverlayEntry>;
}

const initialState: OverlayState = {
	popup: undefined,
	overlays: new Map(),
};

export const selectPopup = (state: RootState) => state.overlay.popup;

export const OverlayProducer = createProducer(initialState, {
	setPopup: (state, key: string, element: React.Element, identifier?: unknown) => {
		return {
			...state,
			popup: {
				Key: key,
				Element: element,
				Identifier: identifier,
			},
		};
	},
	resetIdentifiedOverlay: (state, identifier: unknown) => {
		if (!state.popup) return state;
		if (state.popup.Identifier !== identifier) {
			return state;
		}
		return {
			...state,
			popup: undefined,
		};
	},
	resetPopup: (state) => {
		return {
			...state,
			popup: undefined,
		};
	},
});
