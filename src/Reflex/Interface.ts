import { createProducer } from "@rbxts/reflex";
import Sift from "@rbxts/sift";

interface InterfaceState {
	holder?: Frame;
	mousepos: Vector2;
	mouseIconActions: Set<string>;

	fullscreen: boolean;
	measureTool: boolean;
	selectTool: boolean;
	showOutlines: boolean;
	mouseRules: boolean;
	shortcutsEnabled: boolean;
	storyLock: Set<string>;
}

const initialState: InterfaceState = {
	holder: undefined,
	mousepos: Vector2.zero,
	mouseIconActions: new Set(),

	fullscreen: false,
	measureTool: false,
	selectTool: false,
	showOutlines: false,
	mouseRules: false,
	shortcutsEnabled: true,
	storyLock: new Set(),
};

export const selectInterface = (state: RootState) => state.interface;
export const selectHolder = (state: RootState) => state.interface.holder;
export const selectMouseIconActions = (state: RootState) => state.interface.mouseIconActions;

export const selectFullscreen = (state: RootState) => state.interface.fullscreen;
export const selectMeasureTool = (state: RootState) => state.interface.measureTool;
export const selectSelectTool = (state: RootState) => state.interface.selectTool;
export const selectShowOutlines = (state: RootState) => state.interface.showOutlines;
export const selectMouseRules = (state: RootState) => state.interface.mouseRules;
export const selectStoryLock = (state: RootState) => state.interface.storyLock;

export const InterfaceProducer = createProducer(initialState, {
	setHolder: (state, holder: Frame) => {
		return { ...state, holder };
	},
	setMousePos: (state, position: Vector2) => {
		return { ...state, mousepos: position };
	},
	addMouseIconAction: (state, action: string) => {
		return { ...state, mouseIconActions: Sift.Set.add(state.mouseIconActions, action) };
	},
	removeMouseIconAction: (state, action: string) => {
		return { ...state, mouseIconActions: Sift.Set.delete(state.mouseIconActions, action) };
	},

	setFullscreen: (state, fullscreen: boolean) => {
		return { ...state, fullscreen };
	},
	setMeasureTool: (state, active: boolean) => {
		return { ...state, measureTool: active };
	},
	setSelectTool: (state, active: boolean) => {
		return { ...state, selectTool: active };
	},
	setShowOutlines: (state, active: boolean) => {
		return { ...state, showOutlines: active };
	},
	setMouseRules: (state, active: boolean) => {
		return { ...state, mouseRules: active };
	},
	lockStoryFrame: (state, locker: string) => {
		if (state.storyLock.has(locker)) return state;
		return { ...state, storyLock: Sift.Set.add(state.storyLock, locker) };
	},
	unlockStoryFrame: (state, locker: string) => {
		return {
			...state,
			storyLock: Sift.Set.delete(state.storyLock, locker),
		};
	},
});
