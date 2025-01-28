import { useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { useProducer, useSelector } from "@rbxts/react-reflex";
import { PluginSettingsState, selectPluginSettings } from "Reflex/PluginSettings";
import { usePlugin } from "../Use/Plugin";
import { useMemo } from "@rbxts/react";
import Configs from "Plugin/Configs";
import { selectTheme } from "Reflex/Theme";

export function controlPluginSettings() {
	const plugin = usePlugin();
	const { setPluginSettings, setThemeIndex } = useProducer<RootProducer>();
	const pluginSettings = useSelector(selectPluginSettings);
	const theme = useSelector(selectTheme);

	useMemo(() => {
		if (plugin === undefined) return;
		const settings = plugin.GetSetting(Configs.PluginSettingsKey) as PluginSettingsState;
		if (settings === undefined) return;

		setPluginSettings(settings);
		setThemeIndex(settings.theme ?? "Dark");
	}, [plugin]);

	useUpdateEffect(() => {
		setPluginSettings({ theme: theme.themeIndex });
	}, [theme, plugin]);

	useUpdateEffect(() => {
		if (plugin === undefined) return;
		plugin.SetSetting(Configs.PluginSettingsKey, pluginSettings);
	}, [pluginSettings, plugin]);
}
