import { createProducer } from "@rbxts/reflex";

interface InterfaceState {
	holder?: Frame;
	mousepos: Vector2;
}

const initialState: InterfaceState = {
	holder: undefined,
	mousepos: Vector2.zero,
};

export const selectInterface = (state: RootState) => state.interface;
export const selectHolder = (state: RootState) => state.interface.holder;

export const InterfaceProducer = createProducer(initialState, {
	setHolder: (state, holder: Frame) => {
		return {
			...state,
			holder,
		};
	},
	setMousePos: (state, position: Vector2) => {
		return {
			...state,
			mousepos: position,
		};
	},
});
