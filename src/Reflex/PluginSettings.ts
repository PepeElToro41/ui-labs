import { createProducer } from "@rbxts/reflex";

type ToolbarPosition = "Floating" | "Anchored";
export interface PluginSettingsState {
	toolbarPosition: "Floating" | "Anchored";
	clearOutputOnReload: boolean;
	shortcutsEnabled: boolean;
	keepViewOnViewport: boolean;
	actionsPinned: boolean;
}

const initialState: PluginSettingsState = {
	toolbarPosition: "Floating",
	clearOutputOnReload: false,
	shortcutsEnabled: true,
	keepViewOnViewport: true,
	actionsPinned: true,
};

export const selectPluginSettings = (state: RootState) => state.pluginSettings;
export const selectToolbarPosition = (state: RootState) => selectPluginSettings(state).toolbarPosition;
export const selectClearOutputOnReload = (state: RootState) => selectPluginSettings(state).clearOutputOnReload;
export const selectShortcutsEnabled = (state: RootState) => selectPluginSettings(state).shortcutsEnabled;
export const selectKeepViewOnViewport = (state: RootState) => selectPluginSettings(state).keepViewOnViewport;
export const selectActionsPinned = (state: RootState) => selectPluginSettings(state).actionsPinned;

export const PluginSettingsProducer = createProducer(initialState, {
	setPluginSettings: (state, newSettings: PluginSettingsState) => {
		return { ...state, ...newSettings };
	},

	setToolbarPosition: (state, position: ToolbarPosition) => {
		return {
			...state,
			toolbarPosition: position,
		};
	},
	toggleClearOutputOnReload: (state) => {
		return {
			...state,
			clearOutputOnReload: !state.clearOutputOnReload,
		};
	},
	toggleShortcutsEnabled: (state) => {
		return {
			...state,
			shortcutsEnabled: !state.shortcutsEnabled,
		};
	},
	toggleKeepViewOnViewport: (state) => {
		return {
			...state,
			keepViewOnViewport: !state.keepViewOnViewport,
		};
	},
	setActionsPinned: (state, pinned: boolean) => {
		return {
			...state,
			actionsPinned: pinned,
		};
	},
});
