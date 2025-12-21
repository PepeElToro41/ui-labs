import { createProducer } from "@rbxts/reflex";

interface PluginState {
	plugin?: Plugin;
	widget?: DockWidgetPluginGui;
}

const initialState: PluginState = {
	plugin: undefined,
	widget: undefined
};

export const selectPlugin = (state: RootState) => state.plugin.plugin;
export const selectPluginWidget = (state: RootState) => state.plugin.widget;

export const PluginProducer = createProducer(initialState, {
	setPlugin: (state, pluginObject: Plugin) => {
		return {
			...state,
			plugin: pluginObject
		};
	},
	setWidget: (state, widgetObject: DockWidgetPluginGui) => {
		return {
			...state,
			widget: widgetObject
		};
	}
});
