import { useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { useProducer, useSelector } from "@rbxts/react-reflex";
import { PluginSettingsState, selectPluginSettings } from "Reflex/PluginSettings";
import { usePlugin } from "../Use/Plugin";
import { useMemo } from "@rbxts/react";
import Configs from "Plugin/Configs";

export function controlPluginSettings() {
	const plugin = usePlugin();
	const { setPluginSettings } = useProducer<RootProducer>();
	const pluginSettings = useSelector(selectPluginSettings);

	useMemo(() => {
		if (plugin === undefined) return;
		const settings = plugin.GetSetting(Configs.PluginSettingsKey);
		if (settings === undefined) return;
		setPluginSettings(settings as PluginSettingsState);
	}, [plugin]);

	useUpdateEffect(() => {
		if (plugin === undefined) return;
		plugin.SetSetting(Configs.PluginSettingsKey, pluginSettings);
	}, [pluginSettings, plugin]);
}
