import { createProducer } from "@rbxts/reflex";
import Roact from "@rbxts/roact";

interface OverlayEntry {
	Key: string;
	Element: Roact.Element;
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
	setOverlay: (state, key: string, element: Roact.Element) => {
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
