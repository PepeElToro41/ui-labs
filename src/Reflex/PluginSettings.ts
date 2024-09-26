import { createProducer } from "@rbxts/reflex";

type ToolbarPosition = "Floating" | "Anchored";
export interface PluginSettingsState {
	ToolbarPosition: "Floating" | "Anchored";
}

const initialState: PluginSettingsState = {
	ToolbarPosition: "Floating",
};

export const selectPluginSettings = (state: RootState) => state.pluginSettings;
export const selectToolbarPosition = (state: RootState) => selectPluginSettings(state).ToolbarPosition;

export const PluginSettingsProducer = createProducer(initialState, {
	setPluginSettings: (state, newSettings: PluginSettingsState) => {
		return { ...newSettings };
	},

	setToolbarPosition: (state, position: ToolbarPosition) => {
		return {
			...state,
			ToolbarPosition: position,
		};
	},
});
