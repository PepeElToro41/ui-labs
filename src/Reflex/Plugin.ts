import { createProducer } from "@rbxts/reflex";

interface PluginState {
	plugin?: Plugin;
}

const initialState: PluginState = {
	plugin: undefined,
};

export const selectPlugin = (state: RootState) => state.plugin.plugin;

export const PluginProducer = createProducer(initialState, {
	setPlugin: (state, pluginObject: Plugin) => {
		return {
			...state,
			plugin: pluginObject,
		};
	},
});
