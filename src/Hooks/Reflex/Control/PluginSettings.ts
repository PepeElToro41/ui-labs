import { useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { useMemo } from "@rbxts/react";
import { useProducer, useSelector } from "@rbxts/react-reflex";
import Configs from "Plugin/Configs";
import {
	PluginSettingsState,
	selectPluginSettings
} from "Reflex/PluginSettings";
import { selectTheme } from "Reflex/Theme";
import { usePlugin } from "../Use/Plugin";

export function controlPluginSettings() {
	const plugin = usePlugin();
	const { setPluginSettings, setThemeIndex } = useProducer<RootProducer>();
	const pluginSettings = useSelector(selectPluginSettings);
	const theme = useSelector(selectTheme);

	useMemo(() => {
		if (plugin === undefined) return;
		const settings = plugin.GetSetting(
			Configs.PluginSettingsKey
		) as PluginSettingsState;

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
