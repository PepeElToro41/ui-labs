import { createProducer } from "@rbxts/reflex";

export type ToolbarPosition = "Floating" | "Anchored";
export type SortMode = "Order" | "Name" | "ControlType";

export interface PluginSettingsState {
	toolbarPosition: "Floating" | "Anchored";
	clearOutputOnReload: boolean;
	shortcutsEnabled: boolean;
	keepViewOnViewport: boolean;
	actionsPinned: boolean;
	studioMode: boolean;
	sortMode: SortMode;
	theme: ThemeName;
}

const initialState: PluginSettingsState = {
	toolbarPosition: "Floating",
	clearOutputOnReload: false,
	shortcutsEnabled: true,
	keepViewOnViewport: true,
	actionsPinned: true,
	studioMode: false,
	sortMode: "Order",
	theme: "Dark"
};

export const selectPluginSettings = (state: RootState) => state.pluginSettings;

export const selectToolbarPosition = (state: RootState) =>
	selectPluginSettings(state).toolbarPosition;

export const selectClearOutputOnReload = (state: RootState) =>
	selectPluginSettings(state).clearOutputOnReload;

export const selectShortcutsEnabled = (state: RootState) =>
	selectPluginSettings(state).shortcutsEnabled;

export const selectKeepViewOnViewport = (state: RootState) =>
	selectPluginSettings(state).keepViewOnViewport;

export const selectActionsPinned = (state: RootState) =>
	selectPluginSettings(state).actionsPinned;

export const selectStudioMode = (state: RootState) =>
	selectPluginSettings(state).studioMode;

export const selectSortMode = (state: RootState) =>
	selectPluginSettings(state).sortMode;

export const PluginSettingsProducer = createProducer(initialState, {
	setPluginSettings: (state, newSettings: Partial<PluginSettingsState>) => {
		return { ...state, ...newSettings };
	},

	setToolbarPosition: (state, position: ToolbarPosition) => {
		return {
			...state,
			toolbarPosition: position
		};
	},
	toggleClearOutputOnReload: (state) => {
		return {
			...state,
			clearOutputOnReload: !state.clearOutputOnReload
		};
	},
	toggleShortcutsEnabled: (state) => {
		return {
			...state,
			shortcutsEnabled: !state.shortcutsEnabled
		};
	},
	toggleKeepViewOnViewport: (state) => {
		return {
			...state,
			keepViewOnViewport: !state.keepViewOnViewport
		};
	},
	toggleStudioMode: (state) => {
		return {
			...state,
			studioMode: !state.studioMode
		};
	},
	setActionsPinned: (state, pinned: boolean) => {
		return {
			...state,
			actionsPinned: pinned
		};
	},
	setSortMode: (state, sortMode: SortMode) => {
		return {
			...state,
			sortMode: sortMode
		};
	}
});
