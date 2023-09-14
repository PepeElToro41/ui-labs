import { useUpdateEffect } from "@rbxts/pretty-roact-hooks";
import Roact from "@rbxts/roact";
import { useCallback, useContext, useEffect, useState } from "@rbxts/roact-hooked";
import { ServerStorage } from "@rbxts/services";
import Configs from "Plugin/Configs";
import { PluginContext } from "UI/Contexts/PluginContext";
import { HotReloader } from "Utils/HotReloader";
import { ExtensionPredicator } from "Utils/NodeUtils";

import { CheckSettingsReturn, DefWarn } from "Utils/StoryUtils";
import useTreeSearch from "../useTreeSearch";

/** Library-Like, stores the types of Roact/React/ReactRoblox libraries */
declare global {
	interface UILabsSettings extends UILibsPartial {
		ServiceSearch?: (keyof Services)[];
		HotReloadIgnore?: Instance[];
		use?: UseLibType;
	}
}
export const DefUILabsSettings: UILabsSettings = {
	ServiceSearch: Configs.SearchServices,
	roact: Roact,
};
const SettingsPredicator = ExtensionPredicator(Configs.Extensions.Settings);

export const useSettings = () => {
	const [settingsList] = useTreeSearch("ModuleScript", SettingsPredicator, Configs.SearchServices);
	const warnFn = useContext(PluginContext).WarnOnOpen;
	const updateFileUsing = useCallback(() => {
		if (settingsList.size() <= 0) {
			const newSettings = new Instance("ModuleScript");
			newSettings.Name = `Settings${Configs.Extensions.Settings}`;
			newSettings.Source = "return {}";
			newSettings.Parent = ServerStorage;
			return undefined;
		}
		if (settingsList.size() > 1) {
			warnFn("Multiple settings found, using the first one");
		}
		const settings = settingsList[0];
		if (settings) {
			return settings;
		}
	}, [settingsList]);

	const [fileUsing, setFileUsing] = useState<ModuleScript | undefined>(updateFileUsing);
	const [settings, setSettings] = useState<UILabsSettings | undefined>(undefined);

	useEffect(() => {
		const newFile = updateFileUsing();
		if (newFile) setFileUsing(newFile);
	}, [settingsList]);
	useUpdateEffect(() => {
		if (!fileUsing) {
			setSettings(undefined);
			return;
		}
		const [sucess, result, reloader] = HotReloader.require<UILabsSettings>(fileUsing);
		const reloadConnection = reloader.onReloaded.Connect((newSettings) => {
			const [sucess, result, _] = newSettings;
			if (sucess) {
				const isSettingsReturn = CheckSettingsReturn(warnFn, fileUsing, result);
				if (!isSettingsReturn) {
					return;
				}
				warnFn(`Settings applied successfully`);
				setSettings(result);
			}
		});
		if (sucess) {
			const isSettingsReturn = CheckSettingsReturn(warnFn, fileUsing, result);
			if (!isSettingsReturn) {
				return;
			}
			warnFn(`Settings applied successfully`);
			setSettings(result);
		} else {
			warnFn(`\nFailed to load settings at ${fileUsing.GetFullName()} ${result as string} ${DefWarn}`);
			setSettings(undefined);
		}
		return () => {
			if (reloadConnection) {
				reloadConnection.Disconnect();
			}
			if (reloader) {
				reloader.Destroy();
			}
		};
	}, [fileUsing]);
	useUpdateEffect(() => {
		if (settings && settings.HotReloadIgnore) {
			HotReloader.IgnoreList = settings.HotReloadIgnore;
		} else {
			HotReloader.IgnoreList = undefined;
		}
	}, [settings]);
	return $tuple(settings, settingsList, fileUsing);
};
